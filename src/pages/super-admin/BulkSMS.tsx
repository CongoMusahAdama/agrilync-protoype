import React, { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import {
    MessageSquare,
    Send,
    Users,
    Search,
    CheckSquare,
    Square,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    BarChart3,
    Calendar,
    Eye,
    Copy,
    Plus,
    X,
    AlertCircle,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Recipient {
    id: string;
    name: string;
    phone: string;
    type: 'farmer' | 'agent' | 'investor' | 'grower' | 'webinar';
    selected: boolean;
}

interface SMSCampaign {
    id: string;
    title: string;
    message: string;
    recipients: number;
    sent: number;
    failed: number;
    status: 'sent' | 'failed' | 'partial' | 'pending';
    createdAt: string;
    group: string;
}

type RecipientGroup = 'all' | 'farmers' | 'agents' | 'investors' | 'growers' | 'webinar';

const DEFAULT_GROUP_COUNTS: Record<RecipientGroup, number> = {
    all: 0,
    farmers: 0,
    agents: 0,
    investors: 0,
    growers: 0,
    webinar: 0,
};

const MOCK_CAMPAIGNS: SMSCampaign[] = [];

const GROUP_META: { id: RecipientGroup; label: string; color: string }[] = [
    { id: 'all',       label: 'All Platform Users',   color: '#7ede56' },
    { id: 'farmers',   label: 'Registered Farmers',   color: '#3b82f6' },
    { id: 'agents',    label: 'Field Agents',          color: '#f59e0b' },
    { id: 'investors', label: 'Investors',             color: '#a855f7' },
    { id: 'growers',   label: 'Lync Growers',         color: '#06b6d4' },
    { id: 'webinar',   label: 'Webinar Registrants',  color: '#ef4444' },
];

const MAX_SMS_CHARS = 160;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig = {
    sent:    { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', Icon: CheckCircle2 },
    partial: { label: 'Partial',   bg: 'bg-amber-50',   text: 'text-amber-700',   Icon: AlertCircle  },
    failed:  { label: 'Failed',    bg: 'bg-red-50',     text: 'text-red-700',     Icon: XCircle      },
    pending: { label: 'Pending',   bg: 'bg-slate-50',   text: 'text-slate-600',   Icon: Clock        },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

const BulkSMS: React.FC = () => {
    const { darkMode } = useDarkMode();

    const [campaignTitle, setCampaignTitle]           = useState('');
    const [message, setMessage]                       = useState('');
    const [selectedGroup, setSelectedGroup]           = useState<RecipientGroup>('webinar');
    const [customNumbers, setCustomNumbers]           = useState('');
    const [addCustom, setAddCustom]                   = useState(false);
    const [isSending, setIsSending]                   = useState(false);
    const [sendResult, setSendResult]                 = useState<null | { success: boolean; message: string }>(null);
    const [searchQuery, setSearchQuery]               = useState('');
    const [recipients, setRecipients]                 = useState<Recipient[]>([]);
    const [loadingRecipients, setLoadingRecipients]   = useState(false);
    const [showRecipients, setShowRecipients]         = useState(false);
    const [campaigns, setCampaigns]                   = useState<SMSCampaign[]>(MOCK_CAMPAIGNS);
    const [groupCounts, setGroupCounts]               = useState<Record<RecipientGroup, number>>(DEFAULT_GROUP_COUNTS);
    const [activeTab, setActiveTab]                   = useState<'compose' | 'history'>('compose');
    const [previewCampaign, setPreviewCampaign]       = useState<SMSCampaign | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [countsRes, campaignsRes] = await Promise.all([
                    api.get('/sms/group-counts'),
                    api.get('/sms/campaigns'),
                ]);
                if (countsRes.data) setGroupCounts({ ...DEFAULT_GROUP_COUNTS, ...countsRes.data });
                if (Array.isArray(campaignsRes.data)) setCampaigns(campaignsRes.data);
            } catch {
                // Keep defaults when API is unavailable
            }
        };
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (!showRecipients) return;
        fetchRecipients(selectedGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroup, showRecipients]);

    const fetchRecipients = async (group: RecipientGroup) => {
        setLoadingRecipients(true);
        try {
            const res = await api.get('/sms/recipients', { params: { group } });
            const raw: any[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);

            const typeMap: Record<RecipientGroup, Recipient['type']> = {
                all: 'farmer', farmers: 'farmer', agents: 'agent',
                investors: 'investor', growers: 'grower', webinar: 'webinar',
            };

            setRecipients(
                raw.slice(0, 200).map((u: any) => ({
                    id:       u.id || u._id || String(Math.random()),
                    name:     u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
                    phone:    u.phone || u.phoneNumber || u.contact || '—',
                    type:     typeMap[group],
                    selected: true,
                }))
            );
        } catch {
            setRecipients([]);
        } finally {
            setLoadingRecipients(false);
        }
    };

    const selectedCount = showRecipients
        ? recipients.filter(r => r.selected).length
        : groupCounts[selectedGroup] || 0;

    const toggleRecipient = (id: string) =>
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));

    const toggleAll = () => {
        const allSelected = recipients.every(r => r.selected);
        setRecipients(prev => prev.map(r => ({ ...r, selected: !allSelected })));
    };

    const filteredRecipients = recipients.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)
    );

    const charCount = message.length;
    const smsPages  = Math.ceil(charCount / MAX_SMS_CHARS) || 1;

    const insertVariable = (variable: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end   = el.selectionEnd;
        const next  = message.slice(0, start) + variable + message.slice(end);
        setMessage(next);
        setTimeout(() => { el.selectionStart = el.selectionEnd = start + variable.length; el.focus(); }, 0);
    };

    const handleSend = async () => {
        if (!message.trim())        return setSendResult({ success: false, message: 'Please write a message.' });
        if (!campaignTitle.trim())  return setSendResult({ success: false, message: 'Please enter a campaign title.' });

        const phones = showRecipients ? recipients.filter(r => r.selected).map(r => r.phone) : [];
        const customList = customNumbers.split(/[\n,;]+/).map(n => n.trim()).filter(Boolean);

        setIsSending(true);
        setSendResult(null);

        try {
            const res = await api.post('/sms/bulk', {
                title: campaignTitle,
                message,
                group: selectedGroup,
                phones: [...phones, ...customList],
            });
            const campaign = res.data?.campaign;
            if (campaign) {
                setCampaigns(prev => [campaign, ...prev]);
            }
            setSendResult({
                success: true,
                message: res.data?.message || `Campaign sent to ${selectedCount + customList.length} recipient(s)!`,
            });
            setCampaignTitle(''); setMessage(''); setCustomNumbers('');
            const countsRes = await api.get('/sms/group-counts');
            if (countsRes.data) setGroupCounts({ ...DEFAULT_GROUP_COUNTS, ...countsRes.data });
        } catch (err: any) {
            const groupLabel = GROUP_META.find(g => g.id === selectedGroup)?.label || selectedGroup;
            setCampaigns(prev => [{
                id: `c${Date.now()}`, title: campaignTitle, message,
                recipients: selectedCount, sent: 0, failed: selectedCount,
                status: 'failed', createdAt: new Date().toISOString(), group: groupLabel,
            }, ...prev]);
            setSendResult({ success: false, message: err?.response?.data?.message || 'Failed to send. Please try again.' });
        } finally {
            setIsSending(false);
        }
    };

    // ── Styles
    const card    = darkMode ? 'bg-[#0f3035] border-white/5'     : 'bg-white border-gray-100';
    const subCard = darkMode ? 'bg-[#002f37]/60 border-white/5'  : 'bg-gray-50 border-gray-100';
    const inputCls = darkMode
        ? 'bg-[#002f37] border-white/10 text-white placeholder-white/30 focus:border-[#7ede56]/40'
        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#065f46]/40';
    const labelCls = darkMode ? 'text-gray-300'  : 'text-gray-600';
    const headCls  = darkMode ? 'text-white'     : 'text-gray-900';
    const mutedCls = darkMode ? 'text-gray-400'  : 'text-gray-500';

    return (
        <div className="space-y-6 p-2 md:p-0 max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#7ede56 0%,#065f46 100%)' }}>
                            <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <h1 className={`text-2xl font-black uppercase tracking-tight ${headCls}`}>Bulk SMS</h1>
                    </div>
                    <p className={`text-sm ml-[52px] ${mutedCls}`}>Send targeted SMS campaigns via mNotify</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {[
                        { icon: Send,      label: 'Campaigns',  value: String(campaigns.length) },
                        { icon: Users,     label: 'SMS Reach', value: String(groupCounts.all ?? 0) },
                        { icon: BarChart3, label: 'Channel',    value: 'mNotify' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${card}`}>
                            <Icon className="h-4 w-4 text-[#7ede56]" />
                            <div>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>{label}</p>
                                <p className={`text-base font-black ${headCls}`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 p-1 rounded-2xl border w-fit"
                style={{ background: darkMode ? '#002f37' : '#f8fafc', borderColor: darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }}>
                {[
                    { id: 'compose', label: 'Compose Campaign', icon: MessageSquare },
                    { id: 'history', label: 'Campaign History',  icon: Clock },
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as 'compose' | 'history')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                            activeTab === id
                                ? 'bg-[#065f46] text-white shadow-lg'
                                : `${mutedCls} hover:text-[#7ede56]`
                        }`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ══ COMPOSE TAB ══ */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Campaign Title */}
                        <div className={`rounded-[1.5rem] border p-6 ${card}`}>
                            <label className={`block text-[11px] font-black uppercase tracking-widest mb-2 ${labelCls}`}>
                                Campaign Title
                            </label>
                            <input
                                type="text"
                                value={campaignTitle}
                                onChange={e => setCampaignTitle(e.target.value)}
                                placeholder="e.g. AgriLync Webinar Reminder – Aug 5th"
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors ${inputCls}`}
                            />
                        </div>

                        {/* Message Composer */}
                        <div className={`rounded-[1.5rem] border p-6 space-y-4 ${card}`}>
                            <div className="flex items-center justify-between">
                                <label className={`text-[11px] font-black uppercase tracking-widest ${labelCls}`}>
                                    Message
                                </label>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                    charCount > MAX_SMS_CHARS ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                    {charCount}/{MAX_SMS_CHARS} · {smsPages} SMS
                                </span>
                            </div>

                            {/* Template variables */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>Insert:</span>
                                {['{name}', '{date}', '{link}', '{event}'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => insertVariable(v)}
                                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-dashed border-[#7ede56]/50 text-[#065f46] hover:bg-[#7ede56]/10 transition-colors"
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                                placeholder="Dear {name}, you are invited to our upcoming AgriLync webinar on Smart Farm Planning…"
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors resize-none leading-relaxed ${inputCls}`}
                            />
                            <p className={`text-[10px] ${mutedCls}`}>
                                Use <code className="px-1 rounded bg-gray-100 text-[#065f46] text-[10px]">{'{name}'}</code> to personalise each SMS.
                                Messages over 160 chars count as multiple SMS units.
                            </p>
                        </div>

                        {/* Custom Numbers */}
                        <div className={`rounded-[1.5rem] border p-6 space-y-4 ${card}`}>
                            <button
                                onClick={() => setAddCustom(v => !v)}
                                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#065f46] hover:text-[#7ede56] transition-colors"
                            >
                                {addCustom ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {addCustom ? 'Remove Custom Numbers' : 'Add Custom Phone Numbers'}
                            </button>
                            {addCustom && (
                                <div className="space-y-2">
                                    <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>
                                        Enter numbers separated by comma, semicolon or new line
                                    </label>
                                    <textarea
                                        value={customNumbers}
                                        onChange={e => setCustomNumbers(e.target.value)}
                                        rows={4}
                                        placeholder={"+233240000001, +233240000002"}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors resize-none ${inputCls}`}
                                    />
                                    <p className={`text-[10px] ${mutedCls}`}>
                                        {customNumbers.split(/[\n,;]+/).filter(n => n.trim()).length} custom number(s) added
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Result Banner */}
                        {sendResult && (
                            <div className={`flex items-start gap-3 p-4 rounded-2xl border ${
                                sendResult.success
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                                {sendResult.success
                                    ? <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
                                    : <XCircle      className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
                                }
                                <p className="text-sm font-semibold flex-1">{sendResult.message}</p>
                                <button onClick={() => setSendResult(null)}>
                                    <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                                </button>
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message.trim() || !campaignTitle.trim()}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: isSending ? '#94a3b8' : 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}
                        >
                            {isSending ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Sending Campaign…</>
                            ) : (
                                <><Send className="h-5 w-5" /> Send to {selectedCount.toLocaleString()} Recipients</>
                            )}
                        </button>
                    </div>

                    {/* Right: Group Selector + Preview */}
                    <div className="space-y-5">

                        {/* Group Picker */}
                        <div className={`rounded-[1.5rem] border p-6 space-y-4 ${card}`}>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${labelCls}`}>Target Group</h3>
                            <div className="space-y-2">
                                {GROUP_META.map(group => (
                                    <button
                                        key={group.id}
                                        onClick={() => {
                                            setSelectedGroup(group.id);
                                            if (showRecipients) fetchRecipients(group.id);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                                            selectedGroup === group.id
                                                ? 'border-[#065f46] bg-[#065f46]/5 shadow-sm'
                                                : `border-transparent ${subCard} hover:border-gray-200`
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                                            <span className={`text-[12px] font-semibold ${headCls}`}>{group.label}</span>
                                        </div>
                                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${
                                            selectedGroup === group.id ? 'bg-[#065f46] text-white' : mutedCls
                                        }`}>
                                            {groupCounts[group.id] ?? 0}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Browse toggle */}
                            <button
                                onClick={() => { setShowRecipients(v => !v); if (!showRecipients) fetchRecipients(selectedGroup); }}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${
                                    showRecipients
                                        ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                        : `border-dashed ${darkMode ? 'border-white/20 text-white/50' : 'border-gray-300 text-gray-500'} hover:border-[#065f46] hover:text-[#065f46]`
                                }`}
                            >
                                <Eye className="h-3.5 w-3.5" />
                                {showRecipients ? 'Hide Recipients' : 'Browse & Filter Recipients'}
                            </button>
                        </div>

                        {/* Recipient List */}
                        {showRecipients && (
                            <div className={`rounded-[1.5rem] border overflow-hidden ${card}`}>
                                <div className="p-4 border-b flex items-center justify-between gap-2"
                                    style={{ borderColor: darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9' }}>
                                    <div className="flex items-center gap-2">
                                        <button onClick={toggleAll} className="shrink-0 text-[#065f46]">
                                            {recipients.length > 0 && recipients.every(r => r.selected)
                                                ? <CheckSquare className="h-4 w-4" />
                                                : <Square className="h-4 w-4 text-gray-400" />}
                                        </button>
                                        <span className={`text-[11px] font-bold ${mutedCls}`}>
                                            {recipients.filter(r => r.selected).length}/{recipients.length} selected
                                        </span>
                                    </div>
                                    {loadingRecipients && <Loader2 className="h-4 w-4 animate-spin text-[#7ede56]" />}
                                </div>

                                <div className="px-4 py-3 border-b"
                                    style={{ borderColor: darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9' }}>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Search name or phone…"
                                            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-[12px] outline-none ${inputCls}`}
                                        />
                                    </div>
                                </div>

                                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                    {loadingRecipients ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="h-6 w-6 animate-spin text-[#7ede56]" />
                                        </div>
                                    ) : filteredRecipients.length === 0 ? (
                                        <div className="text-center py-10">
                                            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            <p className={`text-[11px] font-bold uppercase tracking-widest ${mutedCls}`}>No results</p>
                                        </div>
                                    ) : filteredRecipients.map(r => (
                                        <div
                                            key={r.id}
                                            onClick={() => toggleRecipient(r.id)}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-0 ${
                                                r.selected
                                                    ? darkMode ? 'bg-[#065f46]/20' : 'bg-emerald-50/50'
                                                    : darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                            }`}
                                            style={{ borderColor: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}
                                        >
                                            <div className={`shrink-0 ${r.selected ? 'text-[#065f46]' : 'text-gray-300'}`}>
                                                {r.selected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                            </div>
                                            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-white text-[11px] font-black"
                                                style={{ background: 'linear-gradient(135deg,#065f46,#7ede56)' }}>
                                                {r.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[12px] font-bold truncate ${headCls}`}>{r.name}</p>
                                                <p className={`text-[10px] truncate ${mutedCls}`}>{r.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SMS Preview */}
                        <div className={`rounded-[1.5rem] border p-5 space-y-3 ${card}`}>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${labelCls}`}>SMS Preview</h3>
                            <div className="rounded-2xl p-4 bg-[#dcf8c6] relative">
                                <p className="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words min-h-[40px]">
                                    {message
                                        ? message.replace('{name}', 'Kwame Asante').replace('{date}', 'Aug 5th').replace('{event}', 'Webinar')
                                        : <span className="text-gray-400 italic text-[11px]">Your message will appear here…</span>
                                    }
                                </p>
                                <p className="text-[9px] text-gray-500 text-right mt-2">
                                    {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>
                                <span>{charCount} chars</span>
                                <span>{smsPages} SMS unit{smsPages > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ HISTORY TAB ══ */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    {campaigns.length === 0 ? (
                        <div className={`rounded-[2rem] border p-20 text-center ${card}`}>
                            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                            <p className={`text-[11px] font-black uppercase tracking-widest ${mutedCls}`}>No campaigns yet</p>
                        </div>
                    ) : campaigns.map(c => {
                        const sc = statusConfig[c.status];
                        const deliveryRate = c.recipients > 0 ? Math.round((c.sent / c.recipients) * 100) : 0;
                        return (
                            <div key={c.id} className={`rounded-[1.5rem] border p-6 transition-all hover:shadow-md ${card}`}>
                                <div className="flex flex-wrap items-start gap-4 justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className={`text-base font-black uppercase tracking-tight truncate ${headCls}`}>{c.title}</h3>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                                                <sc.Icon className="h-3 w-3" /> {sc.label}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] font-semibold mb-3 ${mutedCls}`}>Group: {c.group}</p>
                                        <p className={`text-sm leading-relaxed line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{c.message}</p>
                                    </div>
                                    <div className="flex gap-3 shrink-0 flex-wrap">
                                        {[
                                            { label: 'Total',  value: c.recipients, cls: headCls },
                                            { label: 'Sent',   value: c.sent,        cls: 'text-emerald-600' },
                                            { label: 'Failed', value: c.failed,       cls: c.failed > 0 ? 'text-red-500' : mutedCls },
                                        ].map(s => (
                                            <div key={s.label} className={`text-center px-4 py-2 rounded-xl ${subCard} border`}>
                                                <p className={`text-xl font-black ${s.cls}`}>{s.value}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest ${mutedCls}`}>{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>Delivery rate</span>
                                        <span className={`text-[10px] font-black ${deliveryRate === 100 ? 'text-emerald-600' : deliveryRate > 90 ? 'text-amber-600' : 'text-red-500'}`}>
                                            {deliveryRate}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{
                                            width: `${deliveryRate}%`,
                                            background: deliveryRate === 100 ? '#7ede56' : deliveryRate > 90 ? '#f59e0b' : '#ef4444',
                                        }} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${mutedCls}`}>
                                        <Calendar className="h-3.5 w-3.5" /> {formatDate(c.createdAt)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setCampaignTitle(c.title + ' (Copy)'); setMessage(c.message); setActiveTab('compose'); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed border-[#065f46]/40 text-[#065f46] hover:bg-[#065f46]/5 transition-colors"
                                        >
                                            <Copy className="h-3 w-3" /> Resend
                                        </button>
                                        <button
                                            onClick={() => setPreviewCampaign(c)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                                darkMode ? 'border-white/10 text-white/60 hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            <Eye className="h-3 w-3" /> View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Preview Modal */}
            {previewCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setPreviewCampaign(null)}>
                    <div onClick={e => e.stopPropagation()}
                        className={`w-full max-w-md rounded-[2rem] border p-8 space-y-6 shadow-2xl ${card}`}>
                        <div className="flex items-start justify-between">
                            <h2 className={`text-lg font-black uppercase tracking-tight ${headCls}`}>Campaign Details</h2>
                            <button onClick={() => setPreviewCampaign(null)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Title',  value: previewCampaign.title },
                                { label: 'Group',  value: previewCampaign.group },
                                { label: 'Date',   value: formatDate(previewCampaign.createdAt) },
                                { label: 'Status', value: statusConfig[previewCampaign.status].label },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${mutedCls}`}>{label}</p>
                                    <p className={`text-sm font-semibold ${headCls}`}>{value}</p>
                                </div>
                            ))}
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mutedCls}`}>Message</p>
                                <div className="rounded-2xl p-4 bg-[#dcf8c6]">
                                    <p className="text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap">{previewCampaign.message}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => { setCampaignTitle(previewCampaign.title + ' (Copy)'); setMessage(previewCampaign.message); setPreviewCampaign(null); setActiveTab('compose'); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white"
                            style={{ background: 'linear-gradient(135deg,#065f46,#047857)' }}>
                            <Copy className="h-4 w-4" /> Use as Template
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkSMS;
