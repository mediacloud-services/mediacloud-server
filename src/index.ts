import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export interface UploadOptions {
    filePath: string;
    optimize?: boolean;
}

export type MediaItem = string;

export interface PaginatedMediaResponse {
    current_page: number;
    data: MediaItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export class MediaCloudUploader {

    private readonly apiKey: string;
    private readonly client: AxiosInstance;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: 'https://mediacloud.ng/api',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }

    formatMediaId(mediaId: string): string {
        if(mediaId.includes('.')){
            mediaId = mediaId.substring(0, mediaId.indexOf('.'));
        }
        return mediaId;
    }

    async uploadFile({ filePath, optimize }: UploadOptions): Promise<string> {
        const form = new FormData();
        const fileStream = fs.createReadStream(filePath);
        form.append('media[]', fileStream);
        if(optimize) {
            form.append('optimize', optimize.toString());
        }
        try {
            const response = await this.client.post('/media/upload', form, {
                headers: {
                    ...form.getHeaders()
                },
            });
            return response.data?.mediaUrls[0];
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || 'Upload failed');
            }
            throw error;
        }
    }

    async getMedias(): Promise<PaginatedMediaResponse> {
        try {
            const response = await this.client.get('/media');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || 'Failed to fetch uploaded media');
            }
            throw error;
        }
    }

    async deleteMedia(mediaId: string): Promise<void> {
        try {
            //check if there is . in the mediaId
            //if there is remove it and all other characters after it
            mediaId = this.formatMediaId(mediaId);
            const response = await this.client.delete(`/media/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || 'Failed to delete media');
            }
            throw error;
        }
    }

    async softDeleteMedia(mediaId: string): Promise<void> {
        try {
            //check if there is . in the mediaId
            //if there is remove it and all other characters after it
            mediaId = this.formatMediaId(mediaId);
            const response = await this.client.delete(`/media/trash/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || 'Failed to soft delete media');
            }
            throw error;
        }
    }

}
