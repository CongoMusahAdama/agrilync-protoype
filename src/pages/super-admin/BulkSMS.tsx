import React, { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { upcomingWebinars } from '@/data/webinars';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';
import {
    Send,
    Users,
    Search,
    CheckSquare,
    Square,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
    Copy,
    Plus,
    X,
} from 'lucide-react';

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
    all: 0, farmers: 0, agents: 0, investors: 0, growers: 0, webinar: 0,
};

const GROUP_OPTIONS: { id: RecipientGroup; label: string }[] = [
    { id: 'webinar', label: 'Webinar registrants' },
    { id: 'all', label: 'All platform users' },
    { id: 'farmers', label: 'Registered farmers' },
    { id: 'agents', label: 'Field agents' },
    { id: 'growers', label: 'Lync growers' },
    { id: 'investors', label: 'Newsletter subscribers only' },
];

const MAX_SMS_CHARS = 160;
const VARS = ['{name}', '{date}', '{link}', '{event}'];

const UPCOMING_WEBINAR = upcomingWebinars[0];
const WHATSAPP_LINK =
    WHATSAPP_COMMUNITY_URL || 'https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe';
const DEFAULT_WEBINAR_TITLE = 'Farmer Talk – AI in Agriculture Reminder';
const DEFAULT_WEBINAR_MESSAGE =
    `Hi {name}, reminder: AgriLync Farmer Talk "{event}" is on {date} at 7 PM GMT. Register free: {link}. Join our WhatsApp community: ${WHATSAPP_LINK} — AgriLync Nexus`;

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
}

const BulkSMS: React.FC = () => {
    const { darkMode } = useDarkMode();

    const [campaignTitle, setCampaignTitle] = useState(DEFAULT_WEBINAR_TITLE);
    const [message, setMessage] = useState(DEFAULT_WEBINAR_MESSAGE);
    const [selectedGroup, setSelectedGroup] = useState<RecipientGroup>('webinar');
    const [customNumbers, setCustomNumbers] = useState('');
    const [addCustom, setAddCustom] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState<null | { success: boolean; message: string }>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    const [showRecipients, setShowRecipients] = useState(false);
    const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
    const [groupCounts, setGroupCounts] = useState<Record<string, number>>(DEFAULT_GROUP_COUNTS);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        (async () => {
            try {
                const [countsRes, campaignsRes] = await Promise.all([
                    api.get('/sms/group-counts'),
                    api.get('/sms/campaigns'),
                ]);
                if (countsRes.data) {
                    setGroupCounts({ ...DEFAULT_GROUP_COUNTS, ...countsRes.data });
                    setSubscriberCount(Number(countsRes.data.subscribers) || 0);
                }
                if (Array.isArray(campaignsRes.data)) setCampaigns(campaignsRes.data);
            } catch { /* keep defaults */ }
        })();
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
            const raw: any[] = Array.isArray(res.data) ? res.data : [];
            setRecipients(
                raw.slice(0, 200).map((u: any) => ({
                    id: u.id || u._id || String(Math.random()),
                    name: u.name || 'Unknown',
                    phone: u.phone || u.contact || '—',
                    type: 'webinar',
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

    const customCount = customNumbers.split(/[\n,;]+/).filter(n => n.trim()).length;
    const totalRecipients = selectedCount + customCount;
    const charCount = message.length;
    const smsPages = Math.ceil(charCount / MAX_SMS_CHARS) || 1;

    const insertVariable = (variable: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        setMessage(message.slice(0, start) + variable + message.slice(end));
        setTimeout(() => { el.selectionStart = el.selectionEnd = start + variable.length; el.focus(); }, 0);
    };

    const handleSend = async () => {
        if (!message.trim()) return setSendResult({ success: false, message: 'Write a message first.' });
        if (!campaignTitle.trim()) return setSendResult({ success: false, message: 'Add a campaign title.' });

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
                event: UPCOMING_WEBINAR?.title,
                date: UPCOMING_WEBINAR?.date,
                link: UPCOMING_WEBINAR?.registrationLink,
            });
            if (res.data?.campaign) setCampaigns(prev => [res.data.campaign, ...prev]);
            setSendResult({ success: true, message: res.data?.message || 'Sent.' });
            setCampaignTitle('');
            setMessage('');
            setCustomNumbers('');
            const countsRes = await api.get('/sms/group-counts');
            if (countsRes.data) {
                setGroupCounts({ ...DEFAULT_GROUP_COUNTS, ...countsRes.data });
                setSubscriberCount(Number(countsRes.data.subscribers) || 0);
            }
        } catch (err: any) {
            setSendResult({ success: false, message: err?.response?.data?.message || 'Send failed.' });
        } finally {
            setIsSending(false);
        }
    };

    const card = darkMode ? 'bg-[#0f3035] border-white/10' : 'bg-white border-gray-200';
    const input = darkMode
        ? 'bg-[#002f37] border-white/10 text-white placeholder-white/40'
        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const text = darkMode ? 'text-white' : 'text-gray-900';

    const preview = message
        ? message
            .replace('{name}', 'Kwame')
            .replace('{date}', UPCOMING_WEBINAR?.date ? new Date(UPCOMING_WEBINAR.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Aug 2026')
            .replace('{event}', UPCOMING_WEBINAR?.title || 'Webinar')
            .replace('{link}', UPCOMING_WEBINAR?.registrationLink || 'https://luma.com/llzyrz4i')
        : '';

    return (
        <div className="max-w-2xl mx-auto space-y-4 p-1">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className={`text-sm ${muted}`}>
                        mNotify · {groupCounts[selectedGroup] ?? 0} will receive this SMS
                    </p>
                    {subscriberCount > 0 && selectedGroup !== 'investors' && (
                        <p className={`text-xs ${muted}`}>
                            Includes {subscriberCount} newsletter subscriber{subscriberCount === 1 ? '' : 's'} automatically
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setShowHistory(v => !v)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0 ${card}`}
                >
                    {showHistory ? 'Compose' : `History (${campaigns.length})`}
                </button>
            </div>

            {!showHistory ? (
                <div className={`rounded-2xl border p-5 space-y-4 shadow-sm ${card}`}>
                    <div>
                        <label className={`text-xs font-medium ${muted}`}>Audience</label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => {
                                setSelectedGroup(e.target.value as RecipientGroup);
                                if (showRecipients) fetchRecipients(e.target.value as RecipientGroup);
                            }}
                            className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#065f46] ${input}`}
                        >
                            {GROUP_OPTIONS.map(g => (
                                <option key={g.id} value={g.id}>
                                    {g.label} ({groupCounts[g.id] ?? 0})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`text-xs font-medium ${muted}`}>Title</label>
                        <input
                            type="text"
                            value={campaignTitle}
                            onChange={e => setCampaignTitle(e.target.value)}
                            placeholder="Webinar reminder – 5 Aug"
                            className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#065f46] ${input}`}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className={`text-xs font-medium ${muted}`}>Message</label>
                            <span className={`text-[10px] font-medium ${charCount > MAX_SMS_CHARS ? 'text-red-500' : muted}`}>
                                {charCount}/{MAX_SMS_CHARS} · {smsPages} SMS
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {VARS.map(v => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => insertVariable(v)}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#7ede56]/40 text-[#065f46] hover:bg-[#7ede56]/10"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Hi {name}, reminder: {event} on {date}. Register: {link}"
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none resize-none focus:border-[#065f46] ${input}`}
                        />
                        {preview && (
                            <p className={`mt-2 text-xs rounded-lg px-3 py-2 bg-[#dcf8c6] text-gray-800`}>
                                Preview: {preview}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => { setShowRecipients(v => !v); if (!showRecipients) fetchRecipients(selectedGroup); }}
                        className={`flex items-center gap-2 text-xs font-medium ${muted} hover:text-[#065f46]`}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        {showRecipients ? 'Hide recipient list' : 'Pick individual recipients'}
                    </button>

                    {showRecipients && (
                        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                            <div className="p-2 border-b flex gap-2 items-center">
                                <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search…"
                                    className={`flex-1 text-xs bg-transparent outline-none ${text}`}
                                />
                                <button type="button" onClick={() => setRecipients(p => p.map(r => ({ ...r, selected: !p.every(x => x.selected) })))}>
                                    {recipients.every(r => r.selected) ? <CheckSquare className="h-4 w-4 text-[#065f46]" /> : <Square className="h-4 w-4 text-gray-400" />}
                                </button>
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                {loadingRecipients ? (
                                    <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-[#7ede56]" /></div>
                                ) : recipients.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.phone.includes(searchQuery)).map(r => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRecipients(p => p.map(x => x.id === r.id ? { ...x, selected: !x.selected } : x))}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs border-b last:border-0 ${r.selected ? 'bg-emerald-50/80' : ''}`}
                                    >
                                        {r.selected ? <CheckSquare className="h-3.5 w-3.5 text-[#065f46]" /> : <Square className="h-3.5 w-3.5 text-gray-300" />}
                                        <span className={`font-medium truncate ${text}`}>{r.name}</span>
                                        <span className={`truncate ${muted}`}>{r.phone}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setAddCustom(v => !v)}
                        className={`flex items-center gap-1.5 text-xs font-medium ${muted}`}
                    >
                        {addCustom ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {addCustom ? 'Remove extra numbers' : 'Add extra phone numbers'}
                    </button>
                    {addCustom && (
                        <textarea
                            value={customNumbers}
                            onChange={e => setCustomNumbers(e.target.value)}
                            rows={2}
                            placeholder="+233240000001, +233240000002"
                            className={`w-full rounded-xl border px-3 py-2 text-xs outline-none resize-none ${input}`}
                        />
                    )}

                    {sendResult && (
                        <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${sendResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                            {sendResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                            <span className="flex-1">{sendResult.message}</span>
                            <button type="button" onClick={() => setSendResult(null)}><X className="h-4 w-4" /></button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={isSending || !message.trim() || !campaignTitle.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#065f46] hover:bg-[#047857] disabled:opacity-50"
                    >
                        {isSending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send to {totalRecipients} people</>}
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {campaigns.length === 0 ? (
                        <p className={`text-sm text-center py-12 ${muted}`}>No campaigns sent yet.</p>
                    ) : campaigns.map(c => (
                        <div key={c.id} className={`rounded-xl border p-4 ${card}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${text}`}>{c.title}</p>
                                    <p className={`text-xs ${muted}`}>{c.group} · {formatDate(c.createdAt)}</p>
                                    <p className={`text-xs mt-1 line-clamp-2 ${muted}`}>{c.message}</p>
                                </div>
                                <span className={`text-[10px] font-bold uppercase shrink-0 ${c.status === 'sent' ? 'text-emerald-600' : c.status === 'failed' ? 'text-red-500' : 'text-amber-600'}`}>
                                    {c.sent}/{c.recipients}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setCampaignTitle(c.title); setMessage(c.message); setShowHistory(false); }}
                                className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#065f46]"
                            >
                                <Copy className="h-3 w-3" /> Reuse
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BulkSMS;
