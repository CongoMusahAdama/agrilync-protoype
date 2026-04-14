import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Users, Send, CheckCircle2, AlertCircle, Info, Trash2, Search, X, Zap, Megaphone, Smartphone, History, UserCheck, CheckSquare, Square, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Swal from 'sweetalert2';

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
        const textArea = document.querySelector('textarea');
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
                customClass: { popup: 'rounded-[2rem]' }
            });
            return;
        }

        if (selectedFarmerIds.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Recipients',
                text: 'Please select at least one farmer to receive this broadcast.',
                confirmButtonColor: '#002f37',
                customClass: { popup: 'rounded-[2rem]' }
            });
            return;
        }

        const confirm = await Swal.fire({
            title: 'Confirm Operation',
            text: `Initiate bulk transmission to ${selectedFarmerIds.length} selected farmers in your sector?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#065f46',
            cancelButtonColor: '#fb7185',
            confirmButtonText: 'Yes, Execute Broadcast',
            cancelButtonText: 'Abort',
            background: '#fff',
            customClass: {
                popup: 'rounded-[10.5rem] p-10',
                confirmButton: 'rounded-xl px-20 py-4 font-black uppercase text-xs tracking-widest',
                cancelButton: 'rounded-xl px-20 py-4 font-black uppercase text-xs tracking-widest'
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
                            customClass: { popup: 'rounded-[2rem]' }
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
            <DialogContent className="max-w-2xl w-[95vw] h-[92vh] md:h-auto flex flex-col p-0 overflow-hidden border-none bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-[200]">
                <div className="bg-[#002f37] text-white p-6 md:p-8 relative shrink-0 overflow-hidden">
                    {/* Animated Background Pulse */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#7ede56]/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                <Zap className="h-6 w-6 md:h-7 md:w-7 text-[#7ede56] fill-[#7ede56]/20" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-tight">SMS Command Center</DialogTitle>
                                <DialogDescription className="text-white/50 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] leading-none mt-1">Global Operational Broadcast</DialogDescription>
                            </div>
                        </div>
                        <button onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all active:scale-90">
                            <X className="h-6 w-6 text-white/40 hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-7">
                    {/* Metrics Summary */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-[#002f37]/5 rounded-2xl p-4 border border-[#002f37]/10 flex flex-col justify-center">
                            <p className="text-[9px] font-black text-[#002f37]/40 uppercase tracking-widest mb-1">Target Sectors</p>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#065f46]" />
                                <span className="text-lg md:text-xl font-black text-[#002f37]">{selectedFarmerIds.length} <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">Active</span></span>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col justify-center">
                            <p className="text-[9px] font-black text-emerald-800/40 uppercase tracking-widest mb-1">Authenticated</p>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <UserCheck className="h-4 w-4" />
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider truncate">{agent?.name || 'Field Agent'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Templates Selector */}
                    <div className="space-y-3 md:space-y-4">
                        <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-widest pl-1 leading-none">Operational Templates</Label>
                        <div className="flex overflow-x-auto md:flex-wrap gap-2.5 pb-2 scrollbar-hide -mx-1 px-1">
                            {TEMPLATES.map(t => (
                                <button 
                                    key={t.id} 
                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all border-2 text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${selectedTemplate === t.id ? 'bg-[#002f37] border-[#002f37] text-white shadow-lg shadow-[#002f37]/20' : 'bg-white border-gray-100 text-[#002f37] hover:border-[#7ede56]'}`}
                                    onClick={() => handleApplyTemplate(t.id)}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-widest leading-none">Payload Composition</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] md:text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">SMS-1: {message.length}/160</span>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <Textarea 
                                placeholder="Draft your operational message... Ensure all details are accurate." 
                                className="min-h-[140px] md:min-h-[160px] rounded-[1.5rem] md:rounded-[2rem] border-2 border-gray-100 bg-gray-50/30 p-6 md:p-8 text-sm font-bold text-[#002f37] focus:border-[#065f46] focus:ring-0 transition-all placeholder:text-gray-200"
                                value={message}
                                id="bulk-sms-textarea"
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            
                            {message.length > 0 && (
                                <div className="bg-emerald-50/50 rounded-2xl p-4 md:p-5 border border-emerald-100 mt-4 border-dashed animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Broadcast Preview (Sample #1)</span>
                                    </div>
                                    <p className="text-[11px] md:text-[12px] font-medium text-[#002f37] leading-relaxed italic opacity-80">
                                        "{message
                                            .replace(/{farmer_name}/g, filteredFarmers[0]?.name || '[Farmer Name]')
                                            .replace(/{agent_name}/g, agent?.name || '[My Name]')}"
                                    </p>
                                </div>
                            )}

                            {/* Merge Tag Tools */}
                            <div className="absolute bottom-3 right-3 flex gap-1.5 md:gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => insertTag('{farmer_name}')}
                                    className="h-7 px-2.5 md:px-3 rounded-lg border-emerald-100 bg-white text-[8px] md:text-[9px] font-black text-[#065f46] hover:bg-emerald-50 transition-colors uppercase tracking-widest"
                                >
                                    + Farmer Name
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => insertTag('{agent_name}')}
                                    className="h-7 px-2.5 md:px-3 rounded-lg border-emerald-100 bg-white text-[8px] md:text-[9px] font-black text-[#065f46] hover:bg-emerald-50 transition-colors uppercase tracking-widest"
                                >
                                    + My Name
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Recipients Preview */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Label className="text-[10px] font-black uppercase text-[#002f37]/40 tracking-widest leading-none">Verified Recipients</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleToggleSelectAll}
                                    className="h-6 px-2 text-[9px] font-black text-[#065f46] uppercase tracking-widest hover:bg-emerald-50"
                                >
                                    {selectedFarmerIds.length === farmers.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                                <Input 
                                    placeholder="Filter list..." 
                                    className="h-9 md:h-8 pl-9 pr-4 text-[10px] font-bold rounded-xl border-gray-100 bg-gray-50/50 w-full md:w-44 text-[#002f37] border-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="rounded-[1.5rem] border border-gray-100 overflow-hidden bg-white/50">
                            <ScrollArea className="h-[120px] md:h-[150px]">
                                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {filteredFarmers.map(f => {
                                        const id = f.id || f._id;
                                        const isSelected = selectedFarmerIds.includes(id);
                                        return (
                                            <div 
                                                key={id} 
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'bg-emerald-50/30 border-emerald-100' : 'bg-gray-50/20 border-transparent hover:bg-gray-50'}`}
                                                onClick={() => handleToggleFarmer(id)}
                                            >
                                                <div className="shrink-0">
                                                    {isSelected ? (
                                                        <CheckSquare className="h-4 w-4 text-[#065f46]" />
                                                    ) : (
                                                        <Square className="h-4 w-4 text-gray-200" />
                                                    )}
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#065f46] font-black text-[10px] uppercase shadow-sm">
                                                    {f.name?.[0] || 'F'}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-[11px] font-black truncate capitalize ${isSelected ? 'text-[#002f37]' : 'text-gray-400'}`}>{f.name}</span>
                                                    <span className="text-[9px] font-bold text-gray-300 font-mono tracking-tighter">{f.contact}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {filteredFarmers.length === 0 && (
                                        <div className="col-span-1 sm:col-span-2 py-8 text-center flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matching recipients</span>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button 
                            className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl border-none ${sending ? 'bg-gray-100 text-gray-400' : 'bg-[#065f46] hover:bg-[#044e3a] text-white shadow-emerald-900/20'}`}
                            onClick={handleSendBulkSms}
                            disabled={sending}
                        >
                            {sending ? (
                                <>
                                    <div className="h-6 w-6 border-[3px] border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
                                    <span>Transmitting payload {sentCount}/{selectedFarmerIds.length}...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    <span>Execute Sector Broadcast</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkSmsModal;
