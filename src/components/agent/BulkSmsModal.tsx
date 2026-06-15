import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Users,
    Send,
    CheckCircle2,
    AlertCircle,
    Search,
    X,
    Megaphone,
    Smartphone,
    History,
    UserCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { showAutoSuccessAlert, showConfirmDialog, showValidationAlert } from '@/utils/validationAlert';
import { agentModalBody, agentModalFooter, agentModalShell } from '@/utils/agentModalStyles';
import api from '@/utils/api';
import { cn } from '@/lib/utils';

interface BulkSmsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmers: any[];
    agent?: any;
}

const TEMPLATES = [
    { id: 'training', label: 'Training', icon: Megaphone, content: 'Hello {farmer_name}, this is an official reminder from {agent_name} for your [Training Module] workshop on [Date] at [Location]. Please ensure you are prompt. - AgriLync' },
    { id: 'visit', label: 'Field visit', icon: Smartphone, content: 'Dear {farmer_name}, this is {agent_name}. I am scheduled to visit your farm on [Date] between [Time Window]. Please have your digital ID ready. - AgriLync' },
    { id: 'followup', label: 'Follow-up', icon: History, content: 'Hello {farmer_name}, this is {agent_name}. Following our previous session on [Topic], do you have any questions or require further assistance? - AgriLync' },
    { id: 'alert', label: 'Alert', icon: AlertCircle, content: 'URGENT {farmer_name}: This is Agent {agent_name}. We have received reports of [Alert Type] in your district. Please implement the safety protocols discussed in training. - AgriLync' },
];

type MobileTab = 'message' | 'recipients';

const BulkSmsModal: React.FC<BulkSmsModalProps> = ({ open, onOpenChange, farmers = [], agent }) => {
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedFarmerIds, setSelectedFarmerIds] = useState<string[]>([]);
    const [mobileTab, setMobileTab] = useState<MobileTab>('message');

    useEffect(() => {
        if (open && farmers.length > 0 && selectedFarmerIds.length === 0) {
            setSelectedFarmerIds(farmers.map(f => f.id || f._id));
        }
    }, [open, farmers, selectedFarmerIds.length]);

    useEffect(() => {
        if (open) setMobileTab('message');
    }, [open]);

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

        setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(start + tag.length, start + tag.length);
        }, 0);
    };

    const handleSendBulkSms = async () => {
        if (!message.trim()) {
            showValidationAlert('Message required', 'Please write a message before sending.', 'Please write a message before sending.', 'warning');
            return;
        }

        if (selectedFarmerIds.length === 0) {
            showValidationAlert('No recipients', 'Please select at least one grower to receive this message.', 'Please select at least one grower.', 'warning');
            return;
        }

        const confirm = await showConfirmDialog({
            title: 'Send bulk SMS?',
            html: `
              <div class="text-center space-y-3">
                <p class="text-gray-600 text-sm">Send this message to <strong style="color:#065f46">${selectedFarmerIds.length}</strong> grower(s)?</p>
                <div style="background:#f9fafb;padding:0.875rem;border-radius:0.75rem;border:1px solid #e5e7eb;font-size:0.875rem;color:#6b7280;text-align:left;word-break:break-word">
                  "${message.substring(0, 120).replace(/"/g, '&quot;')}${message.length > 120 ? '…' : ''}"
                </div>
              </div>
            `,
            confirmButtonText: 'Yes, send SMS',
            cancelButtonText: 'Cancel',
        });

        if (confirm.isConfirmed) {
            setSending(true);
            try {
                const res = await api.post('/farmers/bulk-sms', {
                    farmerIds: selectedFarmerIds,
                    message,
                });

                const { succeeded = 0, total = 0, failed = 0, simulated } = res.data?.data || {};

                await showAutoSuccessAlert(
                    simulated ? 'SMS simulated' : 'SMS sent',
                    `<p style="color:#4b5563;font-size:14px;margin:0">
                        ${simulated ? 'Simulated delivery' : 'mNotify is delivering'} your message to
                        <strong>${succeeded}</strong> of <strong>${total}</strong> grower(s).
                        ${failed > 0 ? `<br/><span style="color:#d97706">${failed} could not be sent.</span>` : ''}
                      </p>`,
                    4000
                );

                onOpenChange(false);
                setMessage('');
                setSelectedTemplate('');
                setSelectedFarmerIds(farmers.map((f) => f.id || f._id));
            } catch (err: unknown) {
                showValidationAlert(
                    'Could not send',
                    err,
                    'mNotify could not deliver this message. Check numbers and try again.'
                );
            } finally {
                setSending(false);
            }
        }
    };

    const previewMessage = message
        .replace(/{farmer_name}/g, filteredFarmers[0]?.name || 'Grower name')
        .replace(/{agent_name}/g, agent?.name || 'Your agent');

    const renderRecipientList = (compact?: boolean) => (
        <div className={cn('space-y-2', compact ? '' : 'pb-2')}>
            {filteredFarmers.map((f) => {
                const id = f.id || f._id;
                const isSelected = selectedFarmerIds.includes(id);
                return (
                    <button
                        type="button"
                        key={id}
                        onClick={() => handleToggleFarmer(id)}
                        className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors',
                            isSelected
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-white border-gray-100 hover:border-gray-200'
                        )}
                    >
                        <div
                            className={cn(
                                'h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center',
                                isSelected ? 'bg-[#065f46] border-[#065f46]' : 'border-gray-200 bg-white'
                            )}
                        >
                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <div className="h-9 w-9 shrink-0 rounded-full bg-[#065f46]/10 flex items-center justify-center text-[#065f46] font-semibold text-sm">
                            {f.name?.[0] || 'G'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className={cn('text-sm font-medium truncate', isSelected ? 'text-[#002f37]' : 'text-gray-600')}>
                                {f.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{f.contact}</p>
                        </div>
                    </button>
                );
            })}
            {filteredFarmers.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">
                    No growers match your search.
                </div>
            )}
        </div>
    );

    const renderMessageSection = () => (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick templates</Label>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
                    {TEMPLATES.map((t) => {
                        const Icon = t.icon;
                        const active = selectedTemplate === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => handleApplyTemplate(t.id)}
                                className={cn(
                                    'snap-start shrink-0 min-w-[7.5rem] flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-colors md:min-w-0',
                                    active
                                        ? 'bg-[#065f46] border-[#065f46] text-white'
                                        : 'bg-white border-gray-200 text-[#002f37] hover:border-emerald-300'
                                )}
                            >
                                <Icon className={cn('h-4 w-4', active ? 'text-emerald-200' : 'text-[#065f46]')} />
                                <span className="text-xs font-semibold leading-tight">{t.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="bulk-sms-textarea" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Your message
                    </Label>
                    <Badge variant="outline" className="text-[10px] font-medium shrink-0">
                        {message.length}/160
                    </Badge>
                </div>
                <Textarea
                    id="bulk-sms-textarea"
                    placeholder="Write your SMS here. Use {farmer_name} to personalise each message."
                    className="min-h-[140px] md:min-h-[180px] rounded-xl border-gray-200 bg-white p-4 text-base resize-none focus:border-[#065f46] focus:ring-[#065f46]/20"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertTag('{farmer_name}')}
                        className="h-9 rounded-lg text-xs font-medium"
                    >
                        + Grower name
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertTag('{agent_name}')}
                        className="h-9 rounded-lg text-xs font-medium"
                    >
                        + Agent name
                    </Button>
                </div>
            </div>

            {message.length > 0 && (
                <div className="rounded-xl bg-[#f4ffee] border border-emerald-100 p-4">
                    <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">Preview</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{previewMessage}</p>
                </div>
            )}
        </div>
    );

    const renderRecipientsHeader = () => (
        <div className="space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select growers</Label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleSelectAll}
                    className="h-8 px-2 text-xs font-semibold text-[#065f46] hover:bg-emerald-50"
                >
                    {selectedFarmerIds.length === farmers.length ? 'Clear all' : 'Select all'}
                </Button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name or phone…"
                    className="h-11 pl-10 rounded-xl border-gray-200 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                hideCloseButton
                className={agentModalShell(
                    'md:max-w-5xl md:h-[85vh] md:rounded-2xl border-0 bg-white shadow-2xl z-[200]'
                )}
            >
                {/* Header */}
                <div className="shrink-0 bg-[#065f46] text-white px-4 py-4 sm:px-6 sm:py-5 relative">
                    <div className="flex items-start justify-between gap-3 pr-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-emerald-200" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-lg sm:text-xl font-bold text-white leading-tight">
                                    Bulk SMS
                                </DialogTitle>
                                <DialogDescription className="text-emerald-100/90 text-xs sm:text-sm mt-0.5">
                                    Send updates to your registered growers
                                </DialogDescription>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="h-10 w-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Summary chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                            <Users className="h-3.5 w-3.5" />
                            {selectedFarmerIds.length} selected
                        </span>
                        {agent?.name && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100 max-w-full">
                                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{agent.name}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Mobile tabs */}
                <div className="md:hidden shrink-0 flex border-b border-gray-100 bg-gray-50/80 p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => setMobileTab('message')}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors min-h-[44px]',
                            mobileTab === 'message'
                                ? 'bg-white text-[#065f46] shadow-sm'
                                : 'text-gray-500'
                        )}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Message
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileTab('recipients')}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors min-h-[44px]',
                            mobileTab === 'recipients'
                                ? 'bg-white text-[#065f46] shadow-sm'
                                : 'text-gray-500'
                        )}
                    >
                        <Users className="h-4 w-4" />
                        Growers
                        <Badge className="h-5 min-w-5 px-1.5 bg-[#065f46] text-white text-[10px]">
                            {selectedFarmerIds.length}
                        </Badge>
                    </button>
                </div>

                {/* Mobile body — one tab at a time */}
                <div className="md:hidden flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4">
                    {mobileTab === 'message' ? (
                        renderMessageSection()
                    ) : (
                        <div className="flex flex-col gap-3 h-full">
                            {renderRecipientsHeader()}
                            {renderRecipientList(true)}
                        </div>
                    )}
                </div>

                {/* Desktop body — side by side */}
                <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
                    <div className={cn(agentModalBody, 'md:w-[58%] md:border-r border-gray-100 bg-white')}>
                        {renderMessageSection()}
                    </div>
                    <div className="md:w-[42%] flex flex-col min-h-0 bg-gray-50/60">
                        <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 py-4 gap-3 overflow-hidden">
                            {renderRecipientsHeader()}
                            <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
                                {renderRecipientList()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={cn(agentModalFooter, 'bg-white border-gray-100')}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="md:order-1 rounded-xl min-h-[44px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSendBulkSms}
                        disabled={sending}
                        className="md:order-2 rounded-xl min-h-[44px] font-semibold bg-[#065f46] hover:bg-[#054a38] text-white gap-2"
                    >
                        {sending ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending…
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send SMS to {selectedFarmerIds.length} grower{selectedFarmerIds.length === 1 ? '' : 's'}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkSmsModal;
