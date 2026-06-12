import html2canvas from 'html2canvas';

/** Wait for card images (photo, QR, barcode, logo) before capture or print */
export const preloadCardImages = (root: HTMLElement, timeoutMs = 5000): Promise<void> => {
    const imgs = Array.from(root.querySelectorAll('img'));
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
                    img.addEventListener('load', finish, { once: true });
                    img.addEventListener('error', finish, { once: true });
                    setTimeout(finish, timeoutMs);
                })
        )
    ).then(() => undefined);
};

export const captureCardFace = async (faceEl: HTMLElement) =>
    html2canvas(faceEl, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: faceEl.offsetWidth,
        height: faceEl.offsetHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
    });

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};

export const triggerCardDownloads = async (
    root: HTMLElement,
    baseName: string
): Promise<void> => {
    await preloadCardImages(root);
    await new Promise((r) => setTimeout(r, 200));

    const faces = Array.from(root.querySelectorAll<HTMLElement>('[data-card-face]'));
    if (!faces.length) return;

    for (const face of faces) {
        const side = face.dataset.cardFace || 'card';
        const canvas = await captureCardFace(face);
        downloadCanvas(canvas, `${baseName}_${side}.png`);
        await new Promise((r) => setTimeout(r, 350));
    }
};
