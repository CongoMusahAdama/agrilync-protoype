import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    MessageSquare, 
    Users, 
    Send, 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    Trash2, 
    Search, 
    X, 
    Zap, 
    Megaphone, 
    Smartphone, 
    History, 
    UserCheck, 
    CheckSquare, 
    Square, 
    Eye,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Cpu,
    ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkSmsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmers: any[];
    agent?: any;
}

const TEMPLATES = [
    { id: 'training', label: 'Training Session', icon: <Megaphone className="h-3 w-3" />, content: 'Hello {farmer_name}, this is an official reminder from {agent_name} for your [Training Module] workshop on [Date] at [Location]. Please ensure you are prompt. - AgriLync Field Ops' },
    { id: 'visit', label: 'Field Visit', icon: <Smartphone className="h-3 w-3" />, content: 'Dear {farmer_name}, this is {agent_name}. I am scheduled to visit your farm on [Date] between [Time Window]. Please have your digital ID ready. - AgriLync' },
    { id: 'followup', label: 'Session Follow-up', icon: <History className="h-3 w-3" />, content: 'Hello {farmer_name}, this is {agent_name}. Following our previous session on [Topic], do you have any questions or require further assistance? Your productivity is our priority. - AgriLync' },
    { id: 'alert', label: 'Operational Alert', icon: <AlertCircle className="h-3 w-3" />, content: 'URGENT {farmer_name}: This is Agent {agent_name}. We have received reports of [Alert Type] in your district. Please implement the safety protocols discussed in training. - AgriLync Security' }
];

const BulkSmsModal: React.FC<BulkSmsModalProps> = ({ open, onOpenChange, farmers = [], agent }) => {
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sending, setSending] = useState(false);
    const [sentCount, setSentCount] = useState(0);
    const [selectedFarmerIds, setSelectedFarmerIds] = useState<string[]>([]);

    // Initialize all farmers as selected by default
    useEffect(() => {
        if (open && farmers.length > 0 && selectedFarmerIds.length === 0) {
            setSelectedFarmerIds(farmers.map(f => f.id || f._id));
        }
    }, [open, farmers]);

    const filteredFarmers = farmers.filter(f => 
        (f.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (f.contact || '').includes(searchTerm)
    );

    const handleToggleSelectAll = () => {
        if (selectedFarmerIds.length === farmers.length) {
            setSelectedFarmerIds([]);
        } else {
            setSelectedFarmerIds(farmers.map(f => f.id || f._id));
        }
    };

    const handleToggleFarmer = (id: string) => {
        setSelectedFarmerIds(prev => 
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const handleApplyTemplate = (templateId: string) => {
        const template = TEMPLATES.find(t => t.id === templateId);
        if (template) {
            let content = template.content;
            // Auto-replace agent name if available
            if (agent?.name) {
                content = content.replace(/{agent_name}/g, agent.name);
            }
            setMessage(content);
            setSelectedTemplate(templateId);
        }
    };

    const insertTag = (tag: string) => {
        const textArea = document.getElementById('bulk-sms-textarea') as HTMLTextAreaElement;
        if (!textArea) {
            setMessage(prev => prev + tag);
            return;
        }
        
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const text = message;
        const before = text.substring(0, start);
        const after = text.substring(end);
        
        setMessage(before + tag + after);
        
        // Focus back to textarea
        setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(start + tag.length, start + tag.length);
        }, 0);
    };

    const handleSendBulkSms = async () => {
        if (!message.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Transmission Blocked',
                text: 'Communication payload cannot be empty. Please enter a valid message.',
                confirmButtonColor: '#002f37',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
            return;
        }

        if (selectedFarmerIds.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Recipients',
                text: 'Please select at least one farmer to receive this broadcast.',
                confirmButtonColor: '#002f37',
                customClass: { popup: 'rounded-[2.5rem]' }
            });
            return;
        }

        const confirm = await Swal.fire({
            title: 'Confirm Operation',
            html: `
              <div class="text-center space-y-4">
                <p class="text-gray-500 font-medium">Initiate bulk transmission to <span class="text-[#065f46] font-black">${selectedFarmerIds.length}</span> selected farmers in your sector?</p>
                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-sm text-gray-400">
                  "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"
                </div>
              </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#065f46',
            cancelButtonColor: '#fb7185',
            confirmButtonText: 'Yes, Execute Broadcast',
            cancelButtonText: 'Abort',
            background: '#fff',
            customClass: {
                popup: 'rounded-none p-10',
                confirmButton: 'rounded-2xl px-10 py-4 font-black uppercase text-xs tracking-widest',
                cancelButton: 'rounded-2xl px-10 py-4 font-black uppercase text-xs tracking-widest'
            }
        });

        if (confirm.isConfirmed) {
            setSending(true);
            const total = selectedFarmerIds.length;
            let current = 0;
            
            const interval = setInterval(() => {
                current += Math.ceil(total / 5);
                if (current >= total) {
                    current = total;
                    clearInterval(interval);
                    setTimeout(() => {
                        setSending(false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Broadcast Finalized',
                            text: `Successfully reached ${total} farmers. Your operational records have been updated.`,
                            confirmButtonColor: '#065f46',
                            customClass: { popup: 'rounded-[2.5rem]' }
                        });
                        onOpenChange(false);
                        setMessage('');
                        setSelectedTemplate('');
                        setSelectedFarmerIds(farmers.map(f => f.id || f._id));
                    }, 500);
                }
                setSentCount(current);
            }, 400);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-[95vw] h-[95vh] md:h-[85vh] flex flex-col p-0 overflow-hidden border border-white/20 bg-[#FDFCFB]/80 backdrop-blur-3xl rounded-none shadow-[0_50px_100px_-20px_rgba(0,47,47,0.25)] z-[200] selection:bg-[#7ede56]/30">
                
                {/* Modern Header - High Contrast */}
                <div className="bg-[#002f37] text-white p-6 md:p-10 relative shrink-0 overflow-hidden">
                    {/* Visual Flare Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7ede56]/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-60 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#7ede56]/5 rounded-full -ml-32 -mb-32 blur-2xl opacity-40" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="h-14 w-14 md:h-16 md:w-16 rounded-none bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] backdrop-blur-md">
                                <Zap className="h-7 w-7 md:h-8 md:w-8 text-[#7ede56] fill-[#7ede56]/20 animate-pulse" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                   <Badge variant="outline" className="bg-[#7ede56]/20 text-[#7ede56] border-[#7ede56]/30 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                      Secure Node
                                   </Badge>
                                   <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Encrypted Relay</span>
                                </div>
                                <DialogTitle className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-none">SMS Command Center</DialogTitle>
                                <DialogDescription className="text-white/40 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] leading-none mt-2">Operational Broadcast Environment</DialogDescription>
                            </div>
                        </div>
                        <button 
                            onClick={() => onOpenChange(false)} 
                            className="h-12 w-12 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-90 group"
                        >
                            <X className="h-6 w-6 text-white/30 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Left Column - Message Composition (Wider) */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:border-r border-gray-100 bg-white/40">
                        
                        {/* Status Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-none p-5 border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-[#7ede56]/30 transition-all duration-300"
                            >
                                <div className="h-12 w-12 rounded-none bg-[#002f37]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-[#002f37]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-[#002f37]/30 uppercase tracking-[0.2em] mb-0.5">Selected Farmers</p>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-[#002f37]">{selectedFarmerIds.length}</span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase">Recipients</span>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-none p-5 border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-emerald-300 transition-all duration-300"
                            >
                                <div className="h-12 w-12 rounded-none bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-emerald-600/40 uppercase tracking-[0.2em] mb-0.5">Authorised By</p>
                                    <p className="text-xs font-black text-emerald-800 uppercase tracking-tight truncate">{agent?.name || 'Root Access'}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Templates */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pl-1">
                                <Cpu className="h-4 w-4 text-[#002f37]/20" />
                                <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-[0.3em] leading-none">Operational Templates</Label>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {TEMPLATES.map(t => (
                                    <button 
                                        key={t.id} 
                                        className={`flex flex-col items-start gap-3 p-4 rounded-none transition-all border-2 text-[10px] font-black uppercase tracking-wider relative overflow-hidden group ${selectedTemplate === t.id ? 'bg-[#002f37] border-[#002f37] text-white shadow-xl' : 'bg-white border-gray-100 text-[#002f37] hover:border-[#7ede56]'}`}
                                        onClick={() => handleApplyTemplate(t.id)}
                                    >
                                        <div className={`h-8 w-8 rounded-none flex items-center justify-center transition-all ${selectedTemplate === t.id ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-[#7ede56]/10 group-hover:text-[#065f46]'}`}>
                                            {t.icon}
                                        </div>
                                        <span className="leading-tight">{t.label}</span>
                                        {selectedTemplate === t.id && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle2 className="h-3 w-3 text-[#7ede56]" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compose */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="h-4 w-4 text-[#002f37]/20" />
                                    <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-[0.3em] leading-none">Payload Composition</Label>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">
                                   SMS UNIT 1: {message.length}/160
                                </Badge>
                            </div>
                            
                            <div className="relative">
                                <Textarea 
                                    placeholder="Enter operational payload text... Use merge tags for personalisation." 
                                    className="min-h-[220px] rounded-none border-2 border-gray-100 bg-white/80 p-8 text-base font-bold text-[#002f37] focus:border-[#065f46] focus:ring-0 transition-all placeholder:text-gray-300 shadow-inner resize-none"
                                    value={message}
                                    id="bulk-sms-textarea"
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                
                                {/* Floating Merge Tools */}
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => insertTag('{farmer_name}')}
                                        className="h-9 px-4 rounded-xl border-emerald-100 bg-white text-[9px] font-black text-[#065f46] hover:bg-emerald-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
                                    >
                                        + Farmer
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => insertTag('{agent_name}')}
                                        className="h-9 px-4 rounded-xl border-emerald-100 bg-white text-[9px] font-black text-[#065f46] hover:bg-emerald-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
                                    >
                                        + Agent
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {message.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#002f37] rounded-none p-6 md:p-8 border border-white/5 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Sparkles className="h-10 w-10 text-[#7ede56]" />
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-2 w-2 rounded-full bg-[#7ede56] animate-pulse" />
                                            <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.3em]">Neural Preview</span>
                                        </div>
                                        <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed italic pr-12">
                                            "{message
                                                .replace(/{farmer_name}/g, filteredFarmers[0]?.name || 'John Farmer')
                                                .replace(/{agent_name}/g, agent?.name || 'Agent Lync')}"
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Recipient Management (Narrower) */}
                    <div className="w-full md:w-[380px] bg-gray-50/50 flex flex-col overflow-hidden">
                        
                        <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col min-h-0">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="h-4 w-4 text-[#002f37]/20" />
                                        <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-[0.3em] leading-none">Recipient Queue</Label>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleToggleSelectAll}
                                        className="h-7 px-3 text-[9px] font-black text-[#065f46] uppercase tracking-widest hover:bg-emerald-50 rounded-full"
                                    >
                                        {selectedFarmerIds.length === farmers.length ? 'Reset All' : 'Select All'}
                                    </Button>
                                </div>

                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#065f46] transition-colors" />
                                    <Input 
                                        placeholder="Filter list..." 
                                        className="h-12 pl-12 pr-4 text-xs font-bold rounded-none border-none bg-white shadow-sm focus:ring-4 focus:ring-[#002f37]/5 transition-all text-[#002f37]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-h-0">
                                <ScrollArea className="h-full pr-4 -mr-4">
                                    <div className="space-y-2.5 pb-4">
                                        {filteredFarmers.map((f, idx) => {
                                            const id = f.id || f._id;
                                            const isSelected = selectedFarmerIds.includes(id);
                                            return (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    key={id} 
                                                    className={`flex items-center gap-4 p-4 rounded-none border-2 transition-all cursor-pointer group relative overflow-hidden ${isSelected ? 'bg-white border-[#7ede56] shadow-md' : 'bg-white border-transparent hover:border-gray-200'}`}
                                                    onClick={() => handleToggleFarmer(id)}
                                                >
                                                    <div className="shrink-0 relative z-10">
                                                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#065f46] border-[#065f46] shadow-lg shadow-emerald-900/20' : 'bg-gray-50 border-gray-100'}`}>
                                                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="h-10 w-10 rounded-full bg-[#002f37]/5 flex items-center justify-center text-[#002f37] font-black text-xs uppercase shadow-inner shrink-0 relative z-10">
                                                        {f.name?.[0] || 'F'}
                                                    </div>
                                                    
                                                    <div className="flex flex-col min-w-0 relative z-10">
                                                        <span className={`text-xs font-black truncate capitalize leading-none mb-1 ${isSelected ? 'text-[#002f37]' : 'text-gray-400'}`}>{f.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-300 font-mono tracking-tighter">{f.contact}</span>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#7ede56]" />
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                        {filteredFarmers.length === 0 && (
                                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                                <div className="h-16 w-16 rounded-none bg-gray-100 flex items-center justify-center text-gray-300 animate-pulse">
                                                    <Users className="h-8 w-8" />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Target Node Not Found</span>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className="pt-6">
                                <Button 
                                    className={`w-full h-18 rounded-none font-black uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(0,47,55,0.3)] border-none ${sending ? 'bg-gray-100 text-gray-400 shadow-none' : 'bg-gradient-to-r from-[#065f46] to-[#044e3a] hover:from-[#044e3a] hover:to-[#065f46] text-white'}`}
                                    onClick={handleSendBulkSms}
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <>
                                            <div className="h-7 w-7 border-[4px] border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
                                            <span className="animate-pulse">Broadcasting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Execute Transmission</span>
                                            <ArrowRight className="h-4 w-4 opacity-40" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkSmsModal;
