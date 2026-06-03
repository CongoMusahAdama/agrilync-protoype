import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  Download,
  Play,
  BookOpen,
  FileText,
  Video,
  BarChart3,
  Wrench,
  Search,
  Clock,
  Users,
  CheckCircle,
  Mail,
  ArrowUp,
  Layers,
  Calendar,
  MapPin,
  Loader2,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/utils/api';
import {
  registerResourceAccess,
  getSubscribeErrorMessage,
} from '@/services/subscriberService';
import { mapApiResourceToDisplay, type DisplayResource } from '@/lib/mapApiResource';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';
import { WEBINARS, type WebinarItem } from '@/data/webinars';

/** Shared Google Drive folder for PDFs/tools (set VITE_RESOURCES_DRIVE_URL in .env) */
const DEFAULT_RESOURCES_DRIVE =
  import.meta.env.VITE_RESOURCES_DRIVE_URL ||
  'https://drive.google.com/drive/folders/1placeholder';

const getResourceDriveUrl = (resource: DisplayResource): string => {
  const driveLink = (resource as { driveLink?: string }).driveLink;
  if (driveLink) return driveLink;
  const { link } = resource;
  if (link.includes('drive.google.com')) return link;
  if (link.startsWith('http') && !link.includes('beehiiv.com')) return link;
  if (link.startsWith('/')) return `${window.location.origin}${link}`;
  return DEFAULT_RESOURCES_DRIVE;
};

const webinars = WEBINARS;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// ─── Component ────────────────────────────────────────────────────────
const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [apiResources, setApiResources] = useState<DisplayResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesLoadError, setResourcesLoadError] = useState<string | null>(null);

  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<DisplayResource | null>(null);
  const [accessEmail, setAccessEmail] = useState('');
  const [accessPhone, setAccessPhone] = useState('');
  const [accessSubmitting, setAccessSubmitting] = useState(false);

  const [ctaRef, ctaVisible] = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setResourcesLoading(true);
    setResourcesLoadError(null);
    api
      .get('/resources', { timeout: 15000 })
      .then(res => {
        setApiResources(res.data.map(mapApiResourceToDisplay));
      })
      .catch(err => {
        console.error('Failed to load resources from API:', err);
        const msg =
          err instanceof Error ? err.message : 'Could not load resources. Please try again shortly.';
        setResourcesLoadError(msg);
      })
      .finally(() => setResourcesLoading(false));
  }, []);

  const allResources = useMemo<DisplayResource[]>(() => apiResources, [apiResources]);

  const categories = useMemo(
    () => [
      { id: 'all', label: 'All Resources', icon: Layers, count: allResources.length },
      { id: 'tools', label: 'Tools', icon: Wrench, count: allResources.filter(r => r.category === 'tools').length },
      { id: 'guides', label: 'Guides & eBooks', icon: BookOpen, count: allResources.filter(r => r.category === 'guides').length },
      { id: 'templates', label: 'Templates', icon: FileText, count: allResources.filter(r => r.category === 'templates').length },
      { id: 'videos', label: 'Video Recordings', icon: Video, count: allResources.filter(r => r.category === 'videos').length },
      { id: 'reports', label: 'Reports', icon: BarChart3, count: allResources.filter(r => r.category === 'reports').length },
      { id: 'webinars', label: 'Webinars', icon: Video, count: webinars.length },
    ],
    [allResources]
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filtered = allResources.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.type.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email.'); return; }
    setSubscribing(true);
    try {
      const { data } = await api.post<{ success: boolean; msg: string }>('/blogs/subscribe', {
        email: email.trim(),
        source: 'resources-page',
      });
      if (!data.success) {
        toast.error(data.msg || 'Could not subscribe. Please try again.');
        return;
      }
      toast.success(data.msg || 'You\'re on the list! We\'ll notify you when new resources drop.');
      setEmail('');
    } catch (err: unknown) {
      toast.error(getSubscribeErrorMessage(err));
    } finally {
      setSubscribing(false);
    }
  };

  const openAccessModal = (resource: DisplayResource) => {
    setSelectedResource(resource);
    setAccessEmail('');
    setAccessPhone('');
    setAccessModalOpen(true);
  };

  const handleAccessProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;
    if (!accessEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!accessPhone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }

    setAccessSubmitting(true);
    try {
      const result = await registerResourceAccess({
        email: accessEmail.trim(),
        phone: accessPhone.trim(),
        resourceTitle: selectedResource.title,
      });

      if (!result.success) {
        toast.error(result.msg || 'Could not save your details. Please try again.');
        return;
      }

      const downloadUrl = getResourceDriveUrl(selectedResource);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      toast.success(
        result.msg ||
          (result.smsSent
            ? 'Access granted! Check your phone for our welcome SMS.'
            : 'Access granted! Opening your resource…')
      );
      setAccessModalOpen(false);
      setSelectedResource(null);
      setAccessEmail('');
      setAccessPhone('');
    } catch (err: unknown) {
      toast.error(getSubscribeErrorMessage(err));
    } finally {
      setAccessSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-4 md:pt-28 md:pb-5 bg-[#002F37] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-[#7ede56] opacity-[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[340px] h-[340px] rounded-full bg-[#921573] opacity-[0.07] blur-[90px] pointer-events-none" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(126,222,86,1) 1px, transparent 1px), linear-gradient(90deg, rgba(126,222,86,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white font-montserrat tracking-tight text-center md:text-left md:flex-1 md:min-w-0">
              Tools &amp; Resources to{' '}
              <span className="text-[#7ede56]">Fast-Track</span>{' '}
              Your Growth
            </h1>

            {/* Search Bar */}
            <form
              onSubmit={e => { e.preventDefault(); }}
              className="relative w-full md:max-w-md md:flex-shrink-0"
            >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7ede56] z-10" />
              <Input
                type="text"
                placeholder="Search tools, guides, reports…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-28 py-2.5 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:border-[#7ede56] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('resource-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-black text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all"
              >
                Search
              </button>
            </div>
            </form>
          </div>
        </div>
      </section>




      {/* ── Category Tabs + Grid ───────────────────────────────────────── */}
      <section id="resource-grid" className="pt-4 pb-10 sm:pt-6 sm:pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-black text-[#002f37] font-montserrat text-center sm:text-left">
              Browse the <span className="text-[#7ede56]">Resource Library</span>
            </h2>
          </div>

          {/* Category filter tabs */}
          <div className="border-b border-gray-200 w-full mb-5 sm:mb-6">
            <div className="flex flex-wrap justify-center -mb-px gap-2 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide px-4">
              {categories.map(cat => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`tab-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 px-2 sm:px-3 ${
                      active
                        ? 'border-[#7ede56] text-[#002f37]'
                        : 'border-transparent text-gray-400 hover:text-[#002f37] hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${active ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                    <span>{cat.label}</span>
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-[#7ede56] text-[#002f37]' : 'bg-gray-100 text-gray-400'}`}>
                      {cat.count}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7ede56]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCategory !== 'webinars' && (<>
          {/* Search feedback */}
          {(searchTerm || activeCategory !== 'all') && (
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4 text-sm">
              <span className="text-gray-500">
                Showing <strong className="text-[#002f37]">{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'resource' : 'resources'}
                {activeCategory !== 'all' && (
                  <> in <span className="text-[#002f37] font-bold">{categories.find(c => c.id === activeCategory)?.label}</span></>
                )}
                {searchTerm && (
                  <> for "<span className="text-[#002f37] font-bold">{searchTerm}</span>"</>
                )}
              </span>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                className="text-[#002f37] hover:text-[#921573] font-black text-xs uppercase tracking-wider transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Resource Grid */}
          <AnimatePresence mode="popLayout">
            {resourcesLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#7ede56]" />
                <p className="text-sm text-gray-500 mt-4 font-medium">Loading resources…</p>
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {filtered.map((res, i) => {
                  const Icon = res.icon;
                  return (
                    <motion.div
                      key={res.id}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.32, delay: i * 0.03 }}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#7ede56]/40 transition-all duration-300 shadow-sm hover:shadow-xl h-full"
                    >
                      {/* Image Header area */}
                      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={res.bgImage}
                          alt={res.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" />

                        {/* Type badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-gray-100 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-[#002f37] flex items-center gap-1.5 shadow-sm">
                          <Icon className="w-3.5 h-3.5 text-[#7ede56]" />
                          <span>{res.type}</span>
                        </div>

                        {/* Status badge */}
                        <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm ${res.badgeColor}`}>
                          {res.badge}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-grow bg-white">
                        <h4 className="font-montserrat text-base font-bold text-[#002f37] mb-2 line-clamp-2 group-hover:text-[#7ede56] transition-colors">
                          {res.title}
                        </h4>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                          {res.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {res.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f4ffee] text-[#177209] border border-[#7ede56]/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats and metadata row */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-medium border-t border-gray-100 pt-3">
                          {res.stats ? (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#7ede56]" />
                            {res.stats}
                          </span>
                          ) : <span />}
                          <span className="text-gray-400">
                            {((res as any).pages && `${(res as any).pages}`) ||
                             ((res as any).duration && `${(res as any).duration}`) ||
                             ((res as any).format && `${(res as any).format}`) ||
                             'PDF'}
                          </span>
                        </div>

                        {/* CTA Button */}
                        <button
                          type="button"
                          onClick={() => openAccessModal(res)}
                          className="w-full bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-black text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 group/btn active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" />
                          <span>Get Free Access</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#002f37] mb-2">
                  {resourcesLoadError
                    ? 'Unable to load resources'
                    : allResources.length === 0 && !searchTerm && activeCategory === 'all'
                    ? 'No resources yet'
                    : 'No resources found'}
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  {resourcesLoadError
                    ? resourcesLoadError
                    : allResources.length === 0 && !searchTerm && activeCategory === 'all'
                    ? 'New tools, guides, and reports will appear here once published from the blog dashboard.'
                    : 'Try a different keyword or browse all categories.'}
                </p>
                {(searchTerm || activeCategory !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="bg-[#002f37] text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#7ede56] hover:text-[#002f37] transition-all"
                >
                  Show all resources
                </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </>)}
          {/* ── Webinars Section ─────────────────────────────────────────── */}
          {activeCategory === 'webinars' && (
            <div className="space-y-16">

              {/* Upcoming Webinars & Events */}
              <div>
                <div className="text-center mb-10">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002f37] font-montserrat mb-2">
                    Upcoming Webinars &amp; <span className="text-[#7ede56]">Events</span>
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#7ede56] to-[#002f37] rounded-full mx-auto mt-3" />
                  <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
                    Join our expert-led webinars and events to learn about the latest agricultural innovations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {webinars.filter(w => w.status === 'upcoming').length > 0 ? (
                    webinars.filter(w => w.status === 'upcoming').map((webinar) => (
                      <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#7ede56]/30 rounded-2xl">
                        <div className="relative overflow-hidden h-52">
                          <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-[#7ede56] to-[#66cc44] text-white border-0">{webinar.registered}/{webinar.spots} spots</Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl font-bold group-hover:text-[#7ede56] transition-colors">{webinar.title}</CardTitle>
                          <div className="space-y-2 text-sm text-gray-600 mt-4">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#7ede56]" /><span>{formatDate(webinar.date)}</span></div>
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#7ede56]" /><span>{webinar.time}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#7ede56]" /><span>{webinar.location}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#7ede56]" /><span>Speaker: {webinar.speaker}</span></div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{webinar.description}</p>
                          <Button
                            onClick={() => {
                              if ((webinar as any).registrationLink) window.open((webinar as any).registrationLink, '_blank');
                              else if (webinar.id === 3) window.open('https://is.gd/agrilyncwebinarnexus', '_blank');
                            }}
                            className="w-full bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white rounded-full transition-all duration-300"
                            disabled={webinar.registered >= webinar.spots}
                          >
                            {webinar.registered >= webinar.spots ? 'Fully Booked' : 'Register Now'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                      <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-[#002f37] mb-2">No Upcoming Webinars</h4>
                      <p className="text-gray-400 text-sm">Check back soon — completed recordings are available below.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Events */}
              <div>
                <div className="text-center mb-10">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002f37] font-montserrat mb-2">
                    Completed <span className="text-[#7ede56]">Events</span>
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#7ede56] to-[#002f37] rounded-full mx-auto mt-3" />
                  <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
                    Watch recordings of our previous webinars and learn from expert sessions.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {webinars.filter((w: WebinarItem) => w.status === 'completed').map((webinar: WebinarItem) => (
                    <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#7ede56]/30 rounded-2xl">
                      <div className="relative overflow-hidden h-64">
                        <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Play className="h-20 w-20 text-white" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#7ede56] text-[#002f37] flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Completed
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl font-bold group-hover:text-[#7ede56] transition-colors">{webinar.title}</CardTitle>
                        <div className="space-y-2 text-sm text-gray-600 mt-4">
                          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#7ede56]" /><span>{formatDate(webinar.date)}</span></div>
                          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#7ede56]" /><span>Speaker: {webinar.speaker}</span></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{webinar.description}</p>
                        <div className="flex flex-col gap-3">
                          <Button
                            variant="outline"
                            className="w-full border-2 border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white rounded-full transition-all duration-300"
                            onClick={() => (webinar as any).recordingLink && window.open((webinar as any).recordingLink, '_blank')}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            {(webinar as any).recordingLink ? 'Watch Recording' : 'Recording Coming Soon'}
                          </Button>
                          {(webinar as any).pdfLink && (
                            <Button
                              variant="default"
                              className="w-full bg-[#002F37] text-white hover:bg-[#004555] rounded-full transition-all duration-300"
                              onClick={() => window.open((webinar as any).pdfLink, '_blank')}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Webinar Source
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* ── Newsletter / Notify CTA ────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#f4ffee] via-white to-[#f4ffee]">
        <div className="absolute -top-10 right-0 w-80 h-80 rounded-full bg-[#7ede56] opacity-[0.08] blur-[100px]" />
        <div ref={ctaRef} className={`max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[#002f37] text-[#7ede56] text-xs font-black uppercase tracking-[0.12em] px-4 py-2 rounded-full mb-6">
            <Mail className="w-3.5 h-3.5" />
            Stay Updated
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002f37] mb-4 font-montserrat">
            Get New Resources <span className="text-[#7ede56]">First</span>
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            We drop new tools, guides, and reports regularly. Subscribe and be the first to know — no spam, ever.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-full border-2 border-gray-200 focus:border-[#7ede56] text-sm text-[#002f37] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="px-6 py-3.5 bg-[#002f37] hover:bg-[#7ede56] hover:text-[#002f37] text-white font-black text-xs uppercase tracking-wider rounded-full transition-all duration-300 disabled:opacity-60 whitespace-nowrap"
            >
              {subscribing ? 'Subscribing…' : 'Notify Me'}
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-4">
            Join 3,200+ farmers and investors already subscribed.
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            {[
              { icon: CheckCircle, label: 'No spam, ever' },
              { icon: Download, label: 'Free resources' },
              { icon: Users, label: '3,200+ subscribers' },
            ].map((b, i) => {
              const BIcon = b.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <BIcon className="w-4 h-4 text-[#7ede56]" />
                  <span>{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Resource Access Modal ─────────────────────────────────────── */}
      <Dialog open={accessModalOpen} onOpenChange={setAccessModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl border border-gray-100 p-0 overflow-hidden shadow-2xl gap-0">
          <div className="px-6 pt-7 pb-5 bg-[#f8faf9] border-b border-gray-100">
            <DialogHeader className="text-left space-y-3">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#7ede56]">
                <Sparkles className="w-3.5 h-3.5" />
                Free download
              </div>
              <DialogTitle className="text-2xl font-bold font-montserrat text-[#002f37] leading-tight pr-6">
                Get free access
              </DialogTitle>
              {selectedResource && (
                <p className="text-sm font-semibold text-[#002f37]/80 line-clamp-2">
                  {selectedResource.title}
                </p>
              )}
              <DialogDescription className="text-gray-500 text-sm leading-relaxed">
                Share your email and phone — we&apos;ll open your download and send a short welcome SMS.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleAccessProceed} className="px-6 py-5 space-y-4 bg-white">
            <div className="space-y-3">
              <div>
                <label htmlFor="access-email" className="block text-sm font-medium text-[#002f37] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="access-email"
                    type="email"
                    placeholder="you@example.com"
                    value={accessEmail}
                    onChange={e => setAccessEmail(e.target.value)}
                    required
                    className="h-11 pl-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="access-phone" className="block text-sm font-medium text-[#002f37] mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="access-phone"
                    type="tel"
                    placeholder="050 000 0000"
                    value={accessPhone}
                    onChange={e => setAccessPhone(e.target.value)}
                    required
                    className="h-11 pl-10 rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              You&apos;ll receive updates on new blogs and resources. No spam.
            </p>

            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-[#7ede56]/25 bg-[#f4ffee] px-4 py-3.5 transition-colors hover:bg-[#eafcd9] hover:border-[#7ede56]/40"
              onClick={e => e.stopPropagation()}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-bold text-[#002f37]">Join AgriLync Nexus on WhatsApp</span>
                <span className="block text-xs text-gray-500 mt-0.5 leading-snug">
                  Same community as our Contact page — tips, updates, and support.
                </span>
              </span>
            </a>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                type="submit"
                disabled={accessSubmitting}
                className="w-full h-12 rounded-xl bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-bold text-sm shadow-sm"
              >
                {accessSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening your resource…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Get free access
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAccessModalOpen(false)}
                className="w-full h-10 rounded-xl text-gray-500 hover:text-[#002f37] text-sm"
                disabled={accessSubmitting}
              >
                Not now
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Scroll To Top ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            id="scroll-to-top-resources"
            className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-[#002f37] hover:bg-[#7ede56] text-white hover:text-[#002f37] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-[#7ede56]"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Resources;
