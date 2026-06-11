import React, { useCallback, useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeCenterCrop, getCroppedImageDataUrl, loadImage } from '@/utils/imageCrop';

interface ProfileImageCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  title?: string;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (dataUrl: string) => void | Promise<void>;
}

const ProfileImageCropDialog: React.FC<ProfileImageCropDialogProps> = ({
  open,
  imageSrc,
  title = 'Crop profile photo',
  onOpenChange,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !imageSrc) return;
    setZoom(1);
    loadImage(imageSrc)
      .then((img) => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight }))
      .catch(() => setNaturalSize({ w: 0, h: 0 }));
  }, [open, imageSrc]);

  useEffect(() => {
    if (!imageSrc || !naturalSize.w) {
      setPreview(null);
      return;
    }
    const crop = computeCenterCrop(naturalSize.w, naturalSize.h, zoom);
    getCroppedImageDataUrl(imageSrc, crop, 512, 0.9)
      .then(setPreview)
      .catch(() => setPreview(null));
  }, [imageSrc, naturalSize, zoom]);

  const handleSave = useCallback(async () => {
    if (!imageSrc || !naturalSize.w) return;
    setSaving(true);
    try {
      const crop = computeCenterCrop(naturalSize.w, naturalSize.h, zoom);
      const dataUrl = await getCroppedImageDataUrl(imageSrc, crop, 512, 0.92);
      await onCropComplete(dataUrl);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }, [imageSrc, naturalSize, zoom, onCropComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[240] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-[250] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200',
            'rounded-3xl border-none shadow-2xl p-0 overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-[#002f37] font-black">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Adjust zoom so your face is centered. The preview matches how it will appear on your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 rounded-full border-4 border-[#7ede56] shadow-xl overflow-hidden bg-gray-100 ring-4 ring-[#002f37]/5">
            {preview ? (
              <img
                src={preview}
                alt="Crop preview"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>

          {imageSrc && naturalSize.w > 0 && (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <ZoomIn className="h-3.5 w-3.5" />
                Zoom
              </div>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 gap-2 sm:gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-[#002f37] hover:bg-[#002f37]/90 text-white font-bold"
            onClick={handleSave}
            disabled={saving || !preview}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Use photo
          </Button>
        </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default ProfileImageCropDialog;
