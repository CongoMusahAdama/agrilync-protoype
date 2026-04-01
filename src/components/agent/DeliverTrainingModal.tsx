import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
  GraduationCap, Calendar, Clock, Users, Leaf, Coins,
  Sprout, Bot, MapPin, X, ChevronRight, Check, Search,
  ArrowRight, ArrowLeft, BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GHANA_REGIONS, GHANA_COMMUNITIES } from '@/data/ghanaRegions';

// ─── Module data ──────────────────────────────────────────────
const MODULES = [
  {
    id: 'mod-1',
    num: '01',
    title: 'Financial Literacy',
    color: '#065f46',
    lightBg: '#ecfdf5',
    icon: Coins,
    tag: 'Required',
    duration: '2–3 hrs',
    topics: ['Farm investment fundamentals', 'Profit vs. loss calculation', 'Record-keeping & documentation', 'Investor-farmer partnerships', 'Savings & input budgeting'],
    desc: 'Understanding farm investment, profit vs. loss, record-keeping and investor-farmer partnership mechanics.',
  },
  {
    id: 'mod-2',
    num: '02',
    title: 'Farm Planning & GAP',
    color: '#047857',
    lightBg: '#f0fdf4',
    icon: Sprout,
    tag: 'Required',
    duration: '2–3 hrs',
    topics: ['Seasonal planning & crop calendars', 'Crop selection by region & soil type', 'Input management & sourcing', 'Yield estimation techniques', 'Post-harvest documentation'],
    desc: 'Seasonal planning, crop selection, input management, yield estimation and Good Agricultural Practices.',
  },
  {
    id: 'mod-3',
    num: '03',
    title: 'AI Advisory & Platform',
    color: '#0369a1',
    lightBg: '#eff6ff',
    icon: Bot,
    tag: 'Required',
    duration: '1–2 hrs',
    topics: ['Platform navigation & profile overview', 'Understanding AI crop advisories', 'GPS farm mapping walkthrough', 'Reading seasonal advisories', 'Data privacy'],
    desc: 'How to use the AgriLync platform, understand AI advisory alerts, and read your farm profile.',
  },
  {
    id: 'mod-4',
    num: '04',
    title: 'Climate-Smart Agriculture',
    color: '#166534',
    lightBg: '#f0fdf4',
    icon: Leaf,
    tag: 'Required',
    duration: '2–3 hrs',
    topics: ['Climate risk for smallholder farmers', 'Drought-tolerant crop varieties', 'Soil health & conservation tillage', 'Water harvesting & irrigation', 'Agroforestry & intercropping'],
    desc: "Adapting farming to Ghana's changing climate — drought-resistant varieties, soil health, water conservation and agroforestry.",
  },
  {
    id: 'mod-5',
    num: '05',
    title: 'Market Access',
    color: '#6d28d9',
    lightBg: '#f5f3ff',
    icon: MapPin,
    tag: 'Upcoming',
    duration: '1–2 hrs',
    topics: ['Marketplace overview & verified buyers', 'Pricing transparency tools', 'Negotiation basics', 'Investor-linked buyers', 'Post-harvest value chain'],
    desc: 'How the AgriLync Marketplace works — verified buyers, pricing transparency and fair negotiation.',
  },
];

const MODES = ['In-Person Farm Visit', 'Community Group Session', 'Farmer Group Hall', 'Demo Session', 'WhatsApp Voice/Video'];
const VENUES = ['Village Common Area', 'Farmer Group Hall', 'Community Centre', 'School Compound', 'Under Community Tree', 'Agricultural Office', 'Input Dealer Premises'];
const LANGUAGES = ['English', 'Twi', 'Fante', 'Ewe', 'Ga', 'Dagbani', 'Dagaare', 'Hausa', 'Other Local Language'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editItem?: any | null;
}

export default function DeliverTrainingModal({ open, onOpenChange, onSuccess, editItem }: Props) {
  const { agent } = useAuth();
  const agentRegion = agent?.region || 'Ashanti Region'; // Fallback

  const qc = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [mod, setMod] = useState<string>('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    date: '', time: '09:00', mode: '', venue: '', region: agentRegion, district: '', community: '', customCommunity: '', language: '', farmerIds: [] as string[], notes: ''
  });

  const { data: farmers = [], isLoading: loadFarmers } = useQuery<any[]>({
    queryKey: ['agentFarmersDir'],
    queryFn: async () => { const r = await api.get('/farmers?limit=1000'); return r.data.data || []; },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const filtered = useMemo(() =>
    farmers.filter(f => !search || [f.name, f.id, f.community].some(v => v?.toLowerCase().includes(search.toLowerCase())))
  , [farmers, search]);

  const allSel = filtered.length > 0 && filtered.every(f => form.farmerIds.includes(f._id));
  const toggleAll = () => {
    const ids = filtered.map(f => f._id);
    setForm(p => ({ ...p, farmerIds: allSel ? p.farmerIds.filter(id => !ids.includes(id)) : [...new Set([...p.farmerIds, ...ids])] }));
  };

  useEffect(() => {
    if (open) {
      if (editItem) {
        setMod(editItem.moduleId);
        setStep(2);
        const d = editItem.deliveryDate ? new Date(editItem.deliveryDate).toISOString().split('T')[0] : '';
        
        let initialRegion = agentRegion;
        let initialDistrict = '';
        let initialCommunity = editItem.community || '';
        let initialCustomCommunity = '';
        
        // Very basic reverse lookup for edit mode
        if (initialCommunity) {
            // First check if it's a known community
            let found = false;
            for (const r of Object.keys(GHANA_REGIONS)) {
                for (const d of GHANA_REGIONS[r]) {
                    if (GHANA_COMMUNITIES[d]?.includes(initialCommunity)) {
                        initialRegion = r; initialDistrict = d; found = true; break;
                    }
                }
                if (found) break;
            }
            if (!found) {
                // Not found, treat as "Other"
                initialCustomCommunity = initialCommunity;
                initialCommunity = 'Other (Specify)';
            }
        }

        setForm({
          date: d,
          time: editItem.deliveryTime || '09:00',
          mode: editItem.mode || '',
          venue: editItem.venue || '',
          region: initialRegion,
          district: initialDistrict,
          community: initialCommunity,
          customCommunity: initialCustomCommunity,
          language: editItem.language || '',
          farmerIds: editItem.farmers?.map((f: any) => typeof f === 'object' ? f._id : f) || [],
          notes: editItem.notes || ''
        });
      } else {
        const d = new Date(); d.setDate(d.getDate() + 1);
        setForm({ date: d.toISOString().split('T')[0], time: '09:00', mode: '', venue: '', region: agentRegion, district: '', community: '', customCommunity: '', language: '', farmerIds: [], notes: '' });
        setMod(''); setStep(1); setSearch('');
      }
    }
  }, [open, editItem, agentRegion]);

  const chosen = MODULES.find(m => m.id === mod);

  const submit = async () => {
    if (!mod) { toast.error('Select a training module'); return; }
    if (!form.date || !form.mode) { toast.error('Fill in date and delivery mode'); return; }
    if (form.farmerIds.length === 0) { toast.error('Select at least one farmer'); return; }
    setSaving(true);
    try {
      const payload = {
        moduleId: chosen?.id,
        moduleTitle: chosen?.title,
        moduleSubtitle: `Module ${chosen?.num}`,
        deliveryDate: form.date,
        deliveryTime: form.time,
        mode: form.mode,
        venue: form.venue,
        community: form.community === 'Other (Specify)' ? form.customCommunity : form.community,
        language: form.language,
        farmerIds: form.farmerIds,
        notes: form.notes,
      };

      if (editItem) {
        await api.patch(`/training-deliveries/${editItem._id}`, payload);
      } else {
        await api.post('/training-deliveries', payload);
      }
      
      onOpenChange(false);
      await Swal.fire({
        icon: 'success',
        title: editItem ? 'Training Updated!' : 'Training Scheduled!',
        html: `<p style="color:#065f46;font-weight:700;font-size:16px;margin:8px 0 4px">${chosen?.title}</p><p style="color:#6b7280;font-size:13px;margin:0">${new Date(form.date).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})} · ${form.farmerIds.length} farmer(s)</p>`,
        confirmButtonColor: '#065f46', confirmButtonText: 'Done', timer: 3500, timerProgressBar: true,
      });
      qc.invalidateQueries({ queryKey: ['trainingDeliveries'] });
      qc.invalidateQueries({ queryKey: ['scheduledVisits'] });
      onSuccess?.();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed to schedule'); }
    finally { setSaving(false); }
  };

  // Shared input class
  const inp = 'w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 font-medium outline-none focus:border-[#065f46] focus:ring-2 focus:ring-[#065f46]/15 placeholder:text-gray-400 placeholder:font-normal transition-all';
  const selTrig = 'h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 focus:border-[#065f46] focus:ring-2 focus:ring-[#065f46]/15 px-3';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-3xl p-0 gap-0 border border-gray-200 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col [&>button:first-of-type]:hidden"
        style={{ maxHeight: '92vh' }}>

        {/* ── Header ── */}
        <div className="shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#065f46] flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight">{editItem ? 'Edit Training' : 'Deliver Training'}</h2>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Schedule a training session for your farmers</p>
              </div>
            </div>
            <button onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-gray-100 rounded-xl">
            {[{ n: 1, label: 'Choose Module' }, { n: 2, label: 'Schedule & Farmers' }].map(s => (
              <button
                key={s.n}
                onClick={() => { if (s.n < step) setStep(s.n as any); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                  step === s.n ? 'bg-white text-[#065f46] shadow-sm' : step > s.n ? 'text-[#065f46]/60 cursor-pointer hover:bg-white/60' : 'text-gray-400 cursor-default'
                }`}
              >
                <span className={`h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center shrink-0 ${step > s.n ? 'bg-[#065f46] text-white' : step === s.n ? 'bg-[#065f46] text-white' : 'bg-gray-300 text-white'}`}>
                  {step > s.n ? <Check className="h-2.5 w-2.5" /> : s.n}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.n === 1 ? 'Module' : 'Schedule'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Module *</p>
              {MODULES.map(m => {
                const Icon = m.icon;
                const sel = mod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMod(m.id)}
                    className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border transition-all group ${
                      sel ? 'border-[#065f46] bg-[#065f46]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* radio */}
                    <div className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? 'border-[#065f46] bg-[#065f46]' : 'border-gray-300 group-hover:border-gray-400'}`}
                      style={{ minWidth: 18, minHeight: 18 }}>
                      {sel && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>

                    {/* icon */}
                    <div className="h-9 w-9 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: m.lightBg }}>
                      <Icon className="h-4.5 w-4.5" style={{ color: m.color }} />
                    </div>

                    {/* text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Mod {m.num}</span>
                        <span className="text-sm font-extrabold text-gray-900 truncate">{m.title}</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${m.tag === 'Required' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {m.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{m.duration}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{m.topics.length} topics</span>
                      </div>
                    </div>

                    <ChevronRight className={`h-4 w-4 shrink-0 transition-all ${sel ? 'text-[#065f46]' : 'text-gray-300 group-hover:text-gray-400'}`} />
                  </button>
                );
              })}
              {chosen && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Topics in this module</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chosen.topics.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                        <div className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: chosen.color }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* Module pill */}
              {chosen && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#065f46]/6 border border-[#065f46]/15">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: chosen.lightBg }}>
                    <BookOpen className="h-3.5 w-3.5" style={{ color: chosen.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-[#065f46] uppercase tracking-wider">Module {chosen.num}</p>
                    <p className="text-sm font-extrabold text-gray-900 truncate">{chosen.title}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-400 hover:text-[#065f46] underline shrink-0 transition-colors">Change</button>
                </div>
              )}

              {/* When */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">When</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                      <input type="date" className={`${inp} pl-8`} min={new Date().toISOString().split('T')[0]}
                        value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                      <input type="time" className={`${inp} pl-8`}
                        value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* How */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Mode *</label>
                    <Select value={form.mode} onValueChange={v => setForm(p => ({ ...p, mode: v }))}>
                      <SelectTrigger className={selTrig}><SelectValue placeholder="Select mode" /></SelectTrigger>
                      <SelectContent className="rounded-xl shadow-xl z-[9999]">
                        {MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Venue</label>
                    <Select value={form.venue} onValueChange={v => setForm(p => ({ ...p, venue: v }))}>
                      <SelectTrigger className={selTrig}><SelectValue placeholder="Select venue" /></SelectTrigger>
                      <SelectContent className="rounded-xl shadow-xl z-[9999]">
                        {VENUES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">District <span className="text-gray-400 font-normal">({agentRegion})</span></label>
                      <Select value={form.district} onValueChange={v => setForm(p => ({ ...p, district: v, community: '', customCommunity: '' }))}>
                        <SelectTrigger className={selTrig}><SelectValue placeholder="Select district" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl z-[9999] max-h-56">
                          {GHANA_REGIONS[agentRegion]?.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Community Focus</label>
                      <Select value={form.community} onValueChange={v => setForm(p => ({ ...p, community: v, customCommunity: '' }))} disabled={!form.district}>
                        <SelectTrigger className={selTrig}><SelectValue placeholder="Select community" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl z-[9999] max-h-56">
                          {form.district && GHANA_COMMUNITIES[form.district]?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          {form.district && !GHANA_COMMUNITIES[form.district] && <SelectItem value="Other (Specify)">Other (Specify)</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {form.community === 'Other (Specify)' && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Specific Community</label>
                        <input 
                          type="text" 
                          placeholder="Type community name"
                          className={inp}
                          value={form.customCommunity}
                          onChange={e => setForm(p => ({ ...p, customCommunity: e.target.value }))}
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Language of Delivery</label>
                      <Select value={form.language} onValueChange={v => setForm(p => ({ ...p, language: v }))}>
                        <SelectTrigger className={selTrig}><SelectValue placeholder="Select language" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl z-[9999]">
                          {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Farmers to Train *</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${form.farmerIds.length > 0 ? 'bg-[#065f46]/10 text-[#065f46]' : 'bg-gray-100 text-gray-400'}`}>
                    {form.farmerIds.length} selected
                  </span>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                  {/* toolbar */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                      <input type="text" placeholder="Search name, ID or community…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full h-8 pl-7 pr-2 text-[11px] font-medium rounded-lg border border-gray-200 bg-white outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46]/15 placeholder:text-gray-400 placeholder:font-normal transition-all" />
                    </div>
                    <button
                      onClick={toggleAll}
                      className={`whitespace-nowrap flex items-center gap-1 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-lg border transition-all ${
                        allSel ? 'bg-[#065f46] text-white border-[#065f46]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#065f46]/40 hover:text-[#065f46]'
                      }`}
                    >
                      {allSel ? <><Check className="h-2.5 w-2.5" /> Deselect All</> : 'Select All'}
                    </button>
                  </div>

                  {/* list */}
                  <div className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                    {loadFarmers ? (
                      <div className="py-6 text-center text-xs text-gray-400">Loading…</div>
                    ) : filtered.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-400">{search ? 'No results' : 'No registered farmers'}</div>
                    ) : filtered.map((f: any) => {
                      const sel = form.farmerIds.includes(f._id);
                      return (
                        <div key={f._id}
                          onClick={() => setForm(p => ({ ...p, farmerIds: sel ? p.farmerIds.filter(id => id !== f._id) : [...p.farmerIds, f._id] }))}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${sel ? 'bg-[#065f46]/5' : 'hover:bg-gray-50/80'}`}
                        >
                          <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${sel ? 'bg-[#065f46] border-[#065f46]' : 'border-gray-300'}`}>
                            {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{f.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{f.id || '—'} · {f.community}, {f.region}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {filtered.length > 0 && (
                    <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50/50">
                      <p className="text-[10px] text-gray-400">{filtered.length} farmer{filtered.length !== 1 ? 's' : ''} shown</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Session Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <Textarea placeholder="Materials to bring, topics to emphasise, challenges to address…"
                  className="min-h-[70px] rounded-xl border-gray-200 text-sm resize-none placeholder:text-gray-400 placeholder:font-normal focus:border-[#065f46] focus-visible:ring-[#065f46]/15"
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-white gap-3">
          {step === 2 ? (
            <Button variant="ghost" onClick={() => setStep(1)} className="h-10 px-4 text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-gray-800 gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          ) : (
            <button onClick={() => onOpenChange(false)} className="text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors">
              Cancel
            </button>
          )}

          {step === 1 ? (
            <Button disabled={!mod} onClick={() => setStep(2)}
              className="h-10 px-6 bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[11px] uppercase tracking-wider rounded-xl border-none shadow-md gap-2 disabled:opacity-40">
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button disabled={saving} onClick={submit}
              className="h-10 px-6 bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[11px] uppercase tracking-wider rounded-xl border-none shadow-md gap-2 disabled:opacity-60">
              {saving
                ? <><div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Calendar className="h-3.5 w-3.5" /> Schedule</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
