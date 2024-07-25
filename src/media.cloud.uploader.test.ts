import {describe, expect, jest} from '@jest/globals';
import { MediaCloudUploader } from './index';
import axios from 'axios';
import fs from 'fs';

jest.mock('axios');
jest.mock('fs');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('MediaCloudUploader Test Suite', () => {
    let uploader: MediaCloudUploader;
    let mockAxiosInstance: jest.Mocked<typeof axios>;

    beforeEach(() => {
        mockAxiosInstance = {
            post: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
        } as any;
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        uploader = new MediaCloudUploader('test-api-key');
        jest.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should upload a single file successfully', async () => {
            const mockResponse = { data: { mediaUrls: ['https://example.com/media/image1.jpg'] } };
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockedFs.createReadStream.mockReturnValue('mock-file-stream' as any);

            const result = await uploader.uploadFile({ filePath: '/path/to/file.jpg' });
            expect(result).toBe('https://example.com/media/image1.jpg');
        });
    });

    describe('uploadMultipleFiles', () => {
        it('should upload multiple files successfully', async () => {
            const mockResponse = { data: { mediaUrls: ['https://example.com/media/image1.jpg', 'https://example.com/media/image2.jpg'] } };
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockedFs.createReadStream.mockReturnValue('mock-file-stream' as any);

            const result = await uploader.uploadMultipleFiles({ filePaths: ['/path/to/file1.jpg', '/path/to/file2.jpg'] });

            expect(result).toEqual(['https://example.com/media/image1.jpg', 'https://example.com/media/image2.jpg']);
        });
    });

    describe('getUploadedMedia', () => {
        it('should fetch uploaded media successfully', async () => {
            const mockResponse = {
                data: {
                    current_page: 1,
                    data: ['https://example.com/media/image1.jpg', 'https://example.com/media/image2.jpg'],
                    // ... other pagination fields
                }
            };
            mockAxiosInstance.get.mockResolvedValue(mockResponse);

            const page = 1;
            const result = await uploader.getMedias(page);

            expect(result).toEqual(mockResponse.data);
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/media?page='+page);
        });
    });

    describe('deleteMedia', () => {
        it('should delete media successfully', async () => {
            const mediaId = 'media-id.jpg';
            const formattedMediaId = 'media-id';
            mockAxiosInstance.delete.mockResolvedValue({});

            await expect(uploader.deleteMedia(mediaId)).resolves.not.toThrow();
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/media/${formattedMediaId}`);
        });
    });

    describe('softDeleteMedia', () => {

        it('should soft delete media successfully', async () => {
            const mediaId = 'media-id.jpg';
            const formattedMediaId = 'media-id';
            mockAxiosInstance.delete.mockResolvedValue({ data: {} });

            await uploader.softDeleteMedia(mediaId);

            expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/media/trash/${formattedMediaId}`);
        });

        it('should throw the original error if it\'s not an Axios error', async () => {
            const mediaId = 'media-id.jpg';
            const originalError = new Error('Network error');
            mockAxiosInstance.delete.mockRejectedValue(originalError);

            await expect(uploader.softDeleteMedia(mediaId)).rejects.toThrow('Network error');
        });
    });
});
