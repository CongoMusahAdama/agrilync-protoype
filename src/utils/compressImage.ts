/** Resize and compress a base64 image for faster mobile uploads. */
export function compressImageDataUrl(
  base64Str: string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Could not process the image.'));
    img.src = base64Str;
  });
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

/** Compress photos before upload; pass through videos and documents unchanged. */
export async function prepareUploadFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const dataUrl = await readFileAsDataUrl(file);
  const compressed = await compressImageDataUrl(dataUrl);
  const response = await fetch(compressed);
  const blob = await response.blob();
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'upload';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}
