/** Load an image element from a data URL or remote URL */
export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Draw a cropped region to a square JPEG data URL (for profile avatars).
 */
export async function getCroppedImageDataUrl(
  imageSrc: string,
  crop: CropArea,
  outputSize = 512,
  quality = 0.92
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return canvas.toDataURL('image/jpeg', quality);
}

/** Compute centered square crop for a given zoom (1 = fit width/height min edge) */
export function computeCenterCrop(
  imgWidth: number,
  imgHeight: number,
  zoom: number
): CropArea {
  const minEdge = Math.min(imgWidth, imgHeight);
  const size = minEdge / zoom;
  return {
    x: (imgWidth - size) / 2,
    y: (imgHeight - size) / 2,
    width: size,
    height: size,
  };
}
