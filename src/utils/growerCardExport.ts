import html2canvas from "html2canvas";
import JSZip from "jszip";

/** Fixed capture size — CR80 ratio; printed at 85.6mm × 53.98mm */
export const CARD_CAPTURE_WIDTH = 680;
export const CARD_CAPTURE_HEIGHT = Math.round(CARD_CAPTURE_WIDTH / 1.586);

/** Wait for card images (photo, QR, barcode, logo) before capture or print */
export const preloadCardImages = (
  root: HTMLElement,
  timeoutMs = 5000,
): Promise<void> => {
  const imgs = Array.from(root.querySelectorAll("img"));
  if (!imgs.length) return Promise.resolve();

  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const finish = () => resolve();
          img.addEventListener("load", finish, { once: true });
          img.addEventListener("error", finish, { once: true });
          setTimeout(finish, timeoutMs);
        }),
    ),
  ).then(() => undefined);
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
  });

export const captureCardFace = async (faceEl: HTMLElement) => {
  faceEl.scrollIntoView({
    block: "center",
    inline: "nearest",
    behavior: "instant" as ScrollBehavior,
  });
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );

  return html2canvas(faceEl, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    width: faceEl.offsetWidth,
    height: faceEl.offsetHeight,
    scrollX: 0,
    scrollY: -window.scrollY,
  });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

export const downloadCanvas = async (
  canvas: HTMLCanvasElement,
  filename: string,
) => {
  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  downloadBlob(blob, filename);
};

const mergeCanvasesVertically = (
  canvases: HTMLCanvasElement[],
  gapPx = 48,
): HTMLCanvasElement => {
  const width = Math.max(...canvases.map((c) => c.width));
  const height = canvases.reduce(
    (sum, c, i) => sum + c.height + (i > 0 ? gapPx : 0),
    0,
  );
  const merged = document.createElement("canvas");
  merged.width = width;
  merged.height = height;
  const ctx = merged.getContext("2d");
  if (!ctx) return canvases[0];
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  let y = 0;
  for (const canvas of canvases) {
    const x = Math.round((width - canvas.width) / 2);
    ctx.drawImage(canvas, x, y);
    y += canvas.height + gapPx;
  }
  return merged;
};

export const triggerCardDownloads = async (
  root: HTMLElement,
  baseName: string,
): Promise<{ front: boolean; back: boolean }> => {
  await preloadCardImages(root);
  await new Promise((r) => setTimeout(r, 300));

  const faces = Array.from(
    root.querySelectorAll<HTMLElement>("[data-card-face]"),
  );
  if (!faces.length) return { front: false, back: false };

  const captures: { side: string; canvas: HTMLCanvasElement }[] = [];
  for (const face of faces) {
    captures.push({
      side: face.dataset.cardFace || "card",
      canvas: await captureCardFace(face),
    });
  }

  const result = { front: false, back: false };
  const zip = new JSZip();

  for (const { side, canvas } of captures) {
    const blob = await canvasToBlob(canvas);
    if (!blob) continue;
    zip.file(`${baseName}_${side}.png`, blob);
    if (side === "front") result.front = true;
    if (side === "back") result.back = true;
  }

  if (captures.length >= 2) {
    const merged = mergeCanvasesVertically(captures.map((c) => c.canvas));
    const mergedBlob = await canvasToBlob(merged);
    if (mergedBlob) {
      zip.file(`${baseName}_front_and_back.png`, mergedBlob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${baseName}_cards.zip`);

  return result;
};
