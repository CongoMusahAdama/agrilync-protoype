import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    X, Camera, Video, Upload,
    CheckCircle2, ImageIcon, FileText,
    Cloud, RefreshCcw, Info, Plus, Trash2
} from 'lucide-react';
import api from '@/utils/api';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

interface MediaFile {
    id: string;
    file: File;
    preview: string | null;
    name: string;
    type: string;
    description: string;
    category: string;
}

interface MediaUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onSuccess?: () => void;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ open, onOpenChange, farmer, onSuccess }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [currentEditIndex, setCurrentEditIndex] = useState<number>(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((files: FileList) => {
        const newFiles: MediaFile[] = [];
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            let autoType = 'Photo';
            if (file.type.startsWith('video/')) autoType = 'Video';
            else if (file.type === 'application/pdf' || file.type.includes('document')) autoType = 'KYC Doc';

            const mediaFile: MediaFile = {
                id: Math.random().toString(36).substring(7),
                file,
                preview: null,
                name: file.name.split('.')[0],
                type: autoType,
                description: '',
                category: 'Field Evidence'
            };

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = e => {
                    setMediaFiles(prev => prev.map(f => f.id === mediaFile.id ? { ...f, preview: e.target?.result as string } : f));
                };
                reader.readAsDataURL(file);
            }
            newFiles.push(mediaFile);
        });

        setMediaFiles(prev => [...prev, ...newFiles]);
    }, []);

    const uploadMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/media', payload);
            return res.data;
        },
        onError: (err) => {
            console.error('Upload error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Sync Interrupted',
                text: 'One or more field reports failed to sync with the network.',
                confirmButtonColor: '#065f46'
            });
        }
    });

    const handleSubmit = async () => {
        if (mediaFiles.length === 0) { 
            Swal.fire({
                icon: 'warning',
                title: 'Queue Empty',
                text: 'Please select at least one field asset (Image/Video/PDF) to sync.',
                confirmButtonColor: '#065f46'
            });
            return; 
        }
        
        setLoading(true);
        try {
            for (const item of mediaFiles) {
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(item.file);
                });

                const sizeKB = item.file.size / 1024;
                const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;

                await uploadMutation.mutateAsync({
                    name: item.name || item.file.name.split('.')[0],
                    type: item.type,
                    url: base64,
                    thumbnail: item.file.type.startsWith('image/') ? base64 : undefined,
                    size: sizeStr,
                    format: item.file.name.split('.').pop()?.toUpperCase(),
                    farm: farmer?._id || farmer?.id,
                    album: item.name.startsWith('[Album] ') ? item.name.replace('[Album] ', '') : (item.category === 'Album' ? item.name : undefined),
                    category: item.category,
                    description: item.description,
                    community: farmer?.community || agent?.community,
                    district: farmer?.district || agent?.district,
                    region: farmer?.region || agent?.region,
                    status: 'Synced'
                });
            }

            queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
            queryClient.invalidateQueries({ queryKey: ['mediaStats'] });

            await Swal.fire({
                icon: 'success',
                title: 'Data Synced',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 0 0 15px 0; font-weight: 800;">
                            ${mediaFiles.length} Assets Logged
                        </p>
                        <p style="font-size: 13px; color: #6b7280;">Your field telemetry has been successfully synced to the Lync network.</p>
                    </div>
                `,
                confirmButtonText: 'Done',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });

            setStep(3);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Error',
                text: error.response?.data?.msg || 'An error occurred during report synchronization.',
                confirmButtonColor: '#065f46'
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setMediaFiles([]);
        setCurrentEditIndex(0);
        onOpenChange(false);
    };

    const removeFile = (id: string) => {
        setMediaFiles(prev => {
            const filtered = prev.filter(f => f.id !== id);
            if (currentEditIndex >= filtered.length) {
                setCurrentEditIndex(Math.max(0, filtered.length - 1));
            }
            return filtered;
        });
    };

    if (!farmer) return null;

    const categories = [
        'Field Evidence',
        'Crop Growth',
        'Pest/Disease',
        'Harvesting',
        'KYC Document',
        'Logistics'
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-2xl w-[95vw] p-0 overflow-hidden flex flex-col border-none shrink-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} rounded-[2rem] shadow-2xl transition-all duration-500`}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Upload Field Report</DialogTitle>
                    <DialogDescription>Upload images, videos, or documents to the farmer's gallery</DialogDescription>
                </DialogHeader>
                
                <div className={`px-8 py-6 border-b flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#0b2528]/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-[#065f46]/20' : 'bg-[#065f46]/10'}`}>
                            {step === 1 ? <ImageIcon className="h-6 w-6 text-[#065f46]" /> :
                                step === 2 ? <FileText className="h-6 w-6 text-[#065f46]" /> :
                                    <CheckCircle2 className="h-6 w-6 text-[#065f46]" />}
                        </div>
                        <div>
                            <h2 className="text-base font-black uppercase tracking-widest text-[#002f37] dark:text-white">Upload Field Report</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Farmer: {farmer.name}</p>
                        </div>
                    </div>
                    {step < 3 && (
                        <div className="flex items-center gap-3">
                            {[1, 2].map(i => (
                                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#065f46]' : 'bg-gray-200 dark:bg-gray-800'}`} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 px-8 py-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-4">
                                <h3 className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Report Files</h3>
                                <p className={`text-xs font-bold uppercase tracking-tight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You can select multiple photos, videos or PDF reports</p>
                            </div>

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`group min-h-[160px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${darkMode ? 'border-white/10 hover:border-[#065f46] hover:bg-white/5' : 'border-gray-200 hover:border-[#065f46] hover:bg-[#065f46]/5'}`}
                            >
                                <input 
                                    type="file" 
                                    multiple
                                    ref={fileInputRef} 
                                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)} 
                                    accept="image/*,video/*,application/pdf" 
                                    className="hidden" 
                                />
                                <div className="p-4 rounded-full bg-[#065f46]/10 mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="h-8 w-8 text-[#065f46]" />
                                </div>
                                <p className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                    {mediaFiles.length > 0 ? 'Add more documents' : 'Tap to upload report'}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter text-center px-6">
                                    Support for JPEG, PNG, MP4 and PDF
                                </p>
                            </div>

                            {mediaFiles.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                                    {mediaFiles.map((file) => (
                                        <div key={file.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 group shadow-lg border border-white/5">
                                            {file.preview ? (
                                                <img src={file.preview} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Preview" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 p-2 text-center">
                                                    {file.type === 'Video' ? <Video className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                                                    <p className="mt-2 text-[8px] font-black uppercase tracking-widest truncate w-full">{file.name}</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 rounded-full bg-rose-600 text-white hover:bg-rose-700 border-none"
                                                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {file.type === 'Video' && (
                                                <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-bold tracking-widest uppercase flex items-center gap-1">
                                                    <Video className="h-2 w-2" /> VIDEO
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && mediaFiles.length > 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Validate & Categorize</h3>
                                    <p className={`text-xs font-bold uppercase tracking-tight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Editing {currentEditIndex + 1} of {mediaFiles.length}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest border-none bg-gray-100 dark:bg-white/5"
                                        disabled={currentEditIndex === 0}
                                        onClick={() => setCurrentEditIndex(prev => prev - 1)}
                                    >
                                        Prev
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest border-none bg-gray-100 dark:bg-white/5"
                                        disabled={currentEditIndex === mediaFiles.length - 1}
                                        onClick={() => setCurrentEditIndex(prev => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="md:col-span-2">
                                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl relative">
                                        {mediaFiles[currentEditIndex].preview ? (
                                            <img src={mediaFiles[currentEditIndex].preview!} className="w-full h-full object-cover" alt="Current" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                                {mediaFiles[currentEditIndex].type === 'Video' ? <Video className="h-16 w-16" /> : <FileText className="h-16 w-16" />}
                                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest">{mediaFiles[currentEditIndex].file.name}</p>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-[#065f46] text-white border-none text-[9px] font-black uppercase px-2 py-1">
                                                {mediaFiles[currentEditIndex].type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-3 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asset Name</Label>
                                        <Input
                                            className={`h-11 border-none rounded-xl text-sm font-bold ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-50'}`}
                                            value={mediaFiles[currentEditIndex].name}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setMediaFiles(prev => prev.map((f, i) => i === currentEditIndex ? { ...f, name: val } : f));
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</Label>
                                        <Select 
                                            value={mediaFiles[currentEditIndex].category} 
                                            onValueChange={(v) => {
                                                setMediaFiles(prev => prev.map((f, i) => i === currentEditIndex ? { ...f, category: v } : f));
                                            }}
                                        >
                                            <SelectTrigger className={`h-11 border-none rounded-xl text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'bg-white/5 text-white' : 'bg-gray-50'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Work Note / Description</Label>
                                        <Textarea
                                            className={`min-h-[100px] border-none rounded-xl text-sm font-medium ${darkMode ? 'bg-white/5 text-white focus:ring-[#065f46]' : 'bg-gray-50'}`}
                                            placeholder="What does this evidence show? e.g. Healthy germination in plot B"
                                            value={mediaFiles[currentEditIndex].description}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setMediaFiles(prev => prev.map((f, i) => i === currentEditIndex ? { ...f, description: val } : f));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 rounded-3xl bg-[#065f46] flex items-center justify-center shadow-2xl rotate-12 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                                <CheckCircle2 className="h-12 w-12 text-white -rotate-12 relative z-10" />
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Report Synced!</h3>
                                <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm mx-auto">
                                    <Badge variant="outline" className="border-[#065f46]/20 bg-[#065f46]/5 text-[#065f46] font-black uppercase text-[9px] px-3">
                                        {mediaFiles.length} ASSETS UPLOADED
                                    </Badge>
                                </div>
                                <p className={`text-[11px] font-bold mt-4 uppercase tracking-wide px-10 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Your field telemetry has been successfully synced to the Lync core network and tagged to {farmer.name}.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`p-8 border-t flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#0b2528]/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    {step < 3 ? (
                        <>
                            <Button 
                                variant="ghost" 
                                className={`font-black text-[10px] uppercase tracking-widest h-12 px-6 rounded-xl transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500'}`} 
                                onClick={() => step > 1 ? setStep(1) : onOpenChange(false)}
                            >
                                {step === 1 ? 'Cancel' : 'Back to Selection'}
                            </Button>
                            <Button
                                className="bg-[#065f46] text-white h-12 px-10 rounded-xl hover:bg-[#065f46]/90 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#065f46]/20 border-none group transition-all"
                                disabled={loading || mediaFiles.length === 0}
                                onClick={() => step === 1 ? setStep(2) : handleSubmit()}
                            >
                                {step === 2 ? (loading ? 'Uploading...' : `Sync ${mediaFiles.length} Documents`) : 'Review Details'}
                                <RefreshCcw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            </Button>
                        </>
                    ) : (
                        <Button className="w-full bg-[#065f46] text-white hover:bg-[#065f46]/90 font-black h-14 rounded-2xl uppercase tracking-widest text-xs shadow-xl border-none transition-all hover:scale-[1.02]" onClick={resetForm}>
                            Return to Repository
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MediaUploadModal;

