# Media Cloud Uploader

A TypeScript package for uploading files to the Media Cloud API, fetching uploaded media, and deleting media.

## Installation

```bash
npm install mediacloud-server-client
```

## Usage

```typescript
import { MediaCloudUploader } from 'mediacloud-server-client';

async function main() {
  const uploader = new MediaCloudUploader('your-api-key');

  try {
    // Upload a file
    const imageUrl = await uploader.uploadFile({
      filePath: '/path/to/your/file.jpg',
      optimize: true
    });
    console.log('Uploaded image URL:', imageUrl);

    // Fetch uploaded media
    const uploadedMedia = await uploader.getUploadedMedia();
    console.log('Uploaded media:', uploadedMedia);

    // Delete a media item
    const mediaIdToDelete = 'bWVkaWEvaW1hZ2VzL29yaWdpbmFsL3JqMExYTUlPOUtLSDc2UXRwZkRIeEJ6NGwzN1VIb01aVWdUbnR0cVcucG5n';
    await uploader.deleteMedia(mediaIdToDelete);
    console.log('Media deleted successfully');
  } catch (error) {
    console.error('Operation failed:', error);
  }
}

main();
```

## API

### `MediaCloudUploader`

A class that handles file uploads to the Media Cloud API, fetches uploaded media, and deletes media.

#### Constructor

```typescript
new MediaCloudUploader(apiKey: string)
```

- `apiKey` (string): Your Media Cloud API key.

#### Methods

##### `uploadFile(options: UploadOptions): Promise<string>`

Uploads a file to the Media Cloud API.

###### Options

- `filePath` (string): The path to the file you want to upload.
- `optimize` (boolean, optional): Whether to optimize the uploaded media. Defaults to `true`.

###### Returns

A promise that resolves to the URL of the uploaded media.

##### `getUploadedMedia(page?: number): Promise<PaginatedMediaResponse>`

Fetches the list of uploaded media from the Media Cloud API.

###### Parameters

- `page` (number, optional): The page number of results to fetch. Defaults to 1.

###### Returns

A promise that resolves to a `PaginatedMediaResponse` object containing the list of media URLs and pagination information.

##### `deleteMedia(mediaId: string): Promise<void>`

Deletes a specific media item from the Media Cloud API.

###### Parameters

- `mediaId` (string): The ID of the media item to delete. This is the last part of the media URL after `/media/`.

###### Returns

A promise that resolves when the media item is successfully deleted.

## Types

### `MediaItem`

A string representing the URL of an uploaded media item.

### `PaginatedMediaResponse`

An object containing the paginated list of media items and related pagination information.

## License

MIT
# mediacloud-server-client
