import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file: File, bucket: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    throw new Error(uploadError.message);
  }

  // Generate public URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return data.publicUrl;
}
