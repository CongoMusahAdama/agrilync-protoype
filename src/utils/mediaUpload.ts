import { prepareUploadFile } from '@/utils/compressImage';

export type MediaUploadFields = {
  name: string;
  type: string;
  farmName?: string;
  album?: string;
  farmerId?: string;
  community?: string;
  district?: string;
  region?: string;
  category?: string;
  description?: string;
  status?: string;
};

const formatFileSize = (bytes: number): string => {
  const sizeKB = bytes / 1024;
  return sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
};

/** Build multipart form data for reliable mobile media uploads. */
export async function buildMediaUploadFormData(
  file: File,
  fields: MediaUploadFields
): Promise<FormData> {
  const prepared = await prepareUploadFile(file);
  const formData = new FormData();

  formData.append('file', prepared);
  formData.append('name', fields.name);
  formData.append('type', fields.type);
  formData.append('size', formatFileSize(prepared.size));
  formData.append('format', prepared.name.split('.').pop()?.toUpperCase() || 'JPG');
  formData.append('status', fields.status || 'Synced');

  if (fields.farmName) formData.append('farmName', fields.farmName);
  if (fields.album) formData.append('album', fields.album);
  if (fields.farmerId) formData.append('farmerId', fields.farmerId);
  if (fields.community) formData.append('community', fields.community);
  if (fields.district) formData.append('district', fields.district);
  if (fields.region) formData.append('region', fields.region);
  if (fields.category) formData.append('category', fields.category);
  if (fields.description) formData.append('description', fields.description);

  return formData;
}
