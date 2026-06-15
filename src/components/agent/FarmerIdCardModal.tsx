import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import GrowerIdCardVisual from "@/components/agent/GrowerIdCardVisual";
import { getGrowerDisplayId } from "@/utils/growerId";
import {
  preloadCardImages,
  triggerCardDownloads,
  captureCardFace,
} from "@/utils/growerCardExport";
import api from "@/utils/api";
import { getRecordId } from "@/utils/recordIds";

interface FarmerIdCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmer: any;
  fetchSavedCard?: boolean;
}

const PRINT_STYLES = `
    @page { size: A4 portrait; margin: 12mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body {
        margin: 0;
        padding: 8mm 0;
        background: #fff;
        font-family: Inter, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10mm;
    }
    .card-print-img {
        width: 85.6mm;
        height: 53.98mm;
        object-fit: contain;
        display: block;
        page-break-inside: avoid;
        break-inside: avoid;
    }
`;

const FarmerIdCardModal: React.FC<FarmerIdCardModalProps> = ({
  open,
  onOpenChange,
  farmer,
  fetchSavedCard = false,
}) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [cardFarmer, setCardFarmer] = useState<any>(farmer);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      return;
    }

    setCardFarmer(farmer);

    if (!fetchSavedCard || !getRecordId(farmer)) return;

    const loadCard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/farmers/${getRecordId(farmer)}/id-card`);
        setCardFarmer(res.data?.farmer || farmer);
      } catch (err: any) {
        const status = err?.response?.status;
        const msg = String(err?.response?.data?.message || "");
        const routeMissing =
          status === 404 || msg.includes("API route not found");
        if (routeMissing && farmer?.name) {
          setCardFarmer(farmer);
          setError("");
        } else {
          setError(msg || "Could not load saved ID card.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [open, farmer, fetchSavedCard]);

  if (!farmer) return null;

  const growerId = getGrowerDisplayId(cardFarmer || farmer);
  const displayFarmer = cardFarmer || farmer;
  const cardNo = displayFarmer.digitalCardNumber || growerId;
  const exportBaseName = `AgriLync_ID_${cardNo}`.replace(/[^\w.-]+/g, "_");

  const handlePrint = async () => {
    const content = captureRef.current;
    if (!content) return;

    await preloadCardImages(content);

    const faces = Array.from(
      content.querySelectorAll<HTMLElement>("[data-card-face]"),
    );
    const images: string[] = [];
    for (const face of faces) {
      const canvas = await captureCardFace(face);
      images.push(canvas.toDataURL("image/png", 1.0));
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cardsHtml = images
      .map(
        (src) =>
          `<img src="${src}" class="card-print-img" alt="AgriLync Grower ID Card" />`,
      )
      .join("");

    printWindow.document.write(`
            <html>
                <head>
                    <title>AgriLync ID - ${displayFarmer.name}</title>
                    <style>${PRINT_STYLES}</style>
                </head>
                <body>${cardsHtml}</body>
                <script>
                    window.onload = function () {
                        setTimeout(function () { window.print(); window.close(); }, 450);
                    };
                </script>
            </html>
        `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    const content = captureRef.current;
    if (!content) return;
    setExporting(true);
    try {
      const result = await triggerCardDownloads(content, exportBaseName);
      if (!result.front || !result.back) {
        console.warn("ID card download: missing face capture", result);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agent-modal-mobile w-full max-w-4xl max-md:max-w-full max-md:h-full max-md:max-h-[100dvh] md:max-h-[95vh] p-0 overflow-y-auto overflow-x-hidden bg-transparent border-none shadow-none flex flex-col items-center z-[250] max-md:rounded-none">
        <DialogTitle className="sr-only">
          Official Grower ID Card — Front & Back
        </DialogTitle>

        {loading && (
          <div className="flex items-center gap-2 text-white py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#7ede56]" />
            <span className="text-sm font-bold uppercase tracking-widest">
              Loading saved card…
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-100 rounded-xl px-6 py-4 mb-4 text-sm font-medium max-w-md text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div ref={captureRef} className="py-2">
              <GrowerIdCardVisual farmer={displayFarmer} hideFaceLabels />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 text-center px-4">
              Print and download match the preview · ZIP includes front, back,
              and combined PNG
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 mb-4 w-full px-4">
              <Button
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                Print Front & Back
              </Button>
              <Button
                onClick={handleDownload}
                disabled={exporting}
                className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_-5px_rgba(126,222,86,0.5)] transition-all active:scale-95 disabled:opacity-60"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {exporting ? "Preparing…" : "Download ZIP (Front & Back)"}
              </Button>
            </div>
          </>
        )}

        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="mt-2 mb-4 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest"
        >
          Close Preview
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FarmerIdCardModal;
