import { put } from '@vercel/blob';
// import { getToken } from '@vercel/blob/client';

export async function uploadToBlob(file: File | Buffer, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    throw new Error('Failed to upload file to Blob storage');
  }
}

// export async function getBlobUploadToken() {
//   const token = await getToken({
//     allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
//     pathname: '/uploads',
//   });
  
//   return token;
// }