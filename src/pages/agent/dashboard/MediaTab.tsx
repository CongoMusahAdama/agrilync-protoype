import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Folder, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface MediaTabProps {
  mediaItems: any[];
}

const MediaTab: React.FC<MediaTabProps> = ({
  mediaItems = []
}) => {
  const handleOpenMedia = (item: any) => {
    const url = item.url;
    if (!url || url === 'album-placeholder') return;

    if (url.startsWith('data:')) {
      try {
        // Convert base64 to Blob to avoid browser URL length limits
        const parts = url.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        
        // Open the blob URL
        const win = window.open(blobUrl, '_blank');
        if (win) {
          win.focus();
          // Clean up the URL after a short delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } else {
          toast.error('Pop-up blocked. Please allow pop-ups.');
        }
      } catch (err) {
        console.error('Error opening base64 media:', err);
        toast.error('Failed to open document.');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50">
        <div>
          <CardTitle className="text-lg font-black text-[#002f37]">Media Archive</CardTitle>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visual evidence and field logs</p>
        </div>
        <Button className="bg-[#002f37] hover:bg-[#003c47] text-white font-black text-[10px] tracking-widest px-6 rounded-xl">
          <ImageIcon className="h-4 w-4 mr-2" /> UPLOAD BATCH
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
          {['All Assets', 'Field Growth', 'Crop Issues', 'Harvesting'].map((tag, idx) => (
            <Badge key={tag} variant="outline" className={`cursor-pointer px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 ${idx === 0 ? 'bg-[#065f46] text-white border-transparent' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border-transparent'}`}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaItems.length > 0 ? (
            mediaItems.slice(0, 10).map((item: any, i: number) => {
              const itemType = (item.type || 'Photo').toLowerCase();
              const itemName = (item.name || '').toLowerCase();
              const isAlbum = item.url === 'album-placeholder' || itemName.startsWith('[album]') || itemType === 'album';
              
              // Document detection
              const isPdf = itemName.endsWith('.pdf') || item.format === 'PDF';
              const isExcel = itemName.endsWith('.xlsx') || itemName.endsWith('.xls') || itemName.endsWith('.csv') || item.format?.includes('XLS');
              const isWord = itemName.endsWith('.docx') || itemName.endsWith('.doc') || item.format?.includes('DOC');
              const isDocument = isPdf || isExcel || isWord || itemType === 'kyc doc' || itemType === 'document' || item.format === 'PDF';
              
              const hasValidImage = item.thumbnail || (item.url && item.url !== 'album-placeholder' && !isDocument);

              // Nice coloring for specific types
              let bgColorClass = "bg-gray-50";
              let iconColorClass = "text-gray-400";
              let labelColorClass = "text-[#95f0a1]";
              let displayType = item.type || 'PHOTO';
              
              if (isAlbum) {
                bgColorClass = "bg-emerald-50";
                iconColorClass = "text-[#065f46]/40";
                labelColorClass = "text-emerald-400";
                displayType = 'ALBUM';
              } else if (isPdf) {
                bgColorClass = "bg-rose-50";
                iconColorClass = "text-rose-500/50";
                labelColorClass = "text-rose-400";
                displayType = 'PDF DOCUMENT';
              } else if (isExcel) {
                bgColorClass = "bg-emerald-50";
                iconColorClass = "text-emerald-600/50";
                labelColorClass = "text-emerald-400";
                displayType = 'EXCEL SHEET';
              } else if (isWord) {
                bgColorClass = "bg-blue-50";
                iconColorClass = "text-blue-600/50";
                labelColorClass = "text-blue-400";
                displayType = 'WORD DOC';
              } else if (isDocument) {
                bgColorClass = "bg-blue-50";
                iconColorClass = "text-blue-400/50";
                labelColorClass = "text-blue-300";
                displayType = 'DOCUMENT';
              }

              return (
                <div 
                  key={item._id || i} 
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenMedia(item)}
                >
                  {hasValidImage ? (
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${bgColorClass} transition-colors p-4 text-center`}>
                      {isAlbum ? (
                        <Folder className={`h-12 w-12 mb-2 ${iconColorClass} group-hover:scale-110 transition-transform`} />
                      ) : isDocument ? (
                        <FileText className={`h-12 w-12 mb-2 ${iconColorClass} group-hover:scale-110 transition-transform`} />
                      ) : (
                        <ImageIcon className={`h-10 w-10 mb-2 ${iconColorClass}`} />
                      )}
                      <p className={`text-[9px] font-black uppercase tracking-tighter line-clamp-2 px-2 ${iconColorClass.replace('/40', '').replace('/50', '')}`}>
                        {item.name}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002f37]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 flex flex-col justify-end">
                    <p className="text-white text-[11px] font-black leading-tight line-clamp-1">
                      {typeof item.farm === 'object' ? item.farm?.name : (item.farm || 'General')}
                    </p>
                    <p className={`${labelColorClass} text-[9px] font-bold uppercase tracking-widest mt-1`}>
                      {displayType}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-10 w-10 text-gray-200" />
              </div>
              <h4 className="text-sm font-black text-[#002f37] uppercase tracking-widest">No Media Discovered</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tight">Captured field photos and evidence will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaTab;
