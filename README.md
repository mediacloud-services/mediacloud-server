# Media Cloud Uploader

A TypeScript package for uploading single or multiple files to the Media Cloud API, fetching uploaded media, soft delete and permanent delete.

## Supported Formats
- jpeg
- png
- jpg
- gif
- svg
- mp4
- mp3
- pdf
- doc
- docx
- xls
- xlsx
- ppt

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
    // Upload a single file
    const imageUrl = await uploader.uploadFile({
      filePath: '/path/to/your/file1.jpg',
      optimize: true //optional and it only works for image files, other file type will not be optimized
    });
    console.log('Uploaded image URL:', imageUrl);

    // Upload multiple files
    const multipleImageUrls = await uploader.uploadMultipleFiles({
      filePaths: ['/path/to/your/file1.jpg', '/path/to/your/file2.png', '/path/to/your/file3.gif'],
      optimize: true //optional and it will only optmized image files, other file type will not be optimized
    });
    console.log('Uploaded image URLs:', multipleImageUrls);

    // Fetch uploaded media
    const page = 1
    const uploadedMedia = await uploader.getMedias(page);
    console.log('Uploaded media:', uploadedMedia);

    // Soft Delete a media item
    const mediaId = 'bWVkaWEvaW1hZ2VzL29yaWdpbmFsL3JqMExYTUlPOUtLSDc2UXRwZkRIeEJ6NGwzN1VIb01aVWdUbnR0cVcucG5n';
    await uploader.softDeleteMedia(mediaIdToDelete);
    console.log('Media deleted successfully');

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

## Running Tests

To run the tests for this package, make sure you have Jest installed:

```bash
npm test
```

#### Constructor

```typescript
new MediaCloudUploader(apiKey: string)
```

- `apiKey` (string): Your Media Cloud API key.

#### Methods

##### `uploadFile(options: UploadOptions): Promise<string>`

Uploads a single file to the Media Cloud API.

###### Options

- `filePath` (string): The path to the file you want to upload.
- `optimize` (boolean, optional): Whether to optimize the uploaded media. Defaults to `true`.

###### Returns

A promise that resolves to the URL of the uploaded media.

##### `uploadMultipleFiles(options: MultipleUploadOptions): Promise<string[]>`

Uploads multiple files to the Media Cloud API.

###### Options

- `filePaths` (string[]): An array of file paths to upload.
- `optimize` (boolean, optional): Whether to optimize the uploaded media. Defaults to `true`.

###### Returns

A promise that resolves to an array of URLs of the uploaded media.

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
