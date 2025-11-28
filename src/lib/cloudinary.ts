export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
  formData.append('folder', 'blog-posts');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload image');
  }

  return response.json();
}

//so we post our image data in formdata which cloudinary understand then it return in json format then we fetch response to upload the image successfully to our client side