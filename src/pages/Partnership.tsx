import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Handshake,
  TrendingUp,
  ShieldCheck,
  Leaf,
  BarChart3,
  Users,
  Send,
  ArrowRight,
  Loader2,
  Mail,
  CheckCircle2,
  Phone,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CONTACT_EMAIL, CONTACT_WHATSAPP, whatsappMeUrl, formatGhanaPhone } from '@/lib/communityLinks';
import api from '@/utils/api';
import { isAxiosError } from 'axios';

const PARTNERSHIP_EMAIL = CONTACT_EMAIL || 'agrilync@gmail.com';

type Desk = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  contactLabel: string;
  contactHref: string;
};

const DeskCard: React.FC<{ desk: Desk; index: number }> = ({ desk, index }) => {
  const [cardRef, cardVisible] = useScrollReveal({ threshold: 0.2, once: false });
  const isGreen = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={
        'transition-all duration-700 ease-out ' +
        (index % 2 === 1 ? 'md:mt-10 ' : '') +
        (cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')
      }
      style={{ transitionDelay: cardVisible ? `${(index % 2) * 100}ms` : '0ms' }}
    >
      <div className="flex gap-5 items-start bg-white rounded-2xl shadow-xl p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div
          className={
            'shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold ' +
            (isGreen ? 'bg-[#7ede56] text-[#002F37]' : 'bg-[#002F37] text-white')
          }
        >
          {index + 1}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#002F37] mb-1.5 flex items-center gap-2">
            <desk.icon className="w-4 h-4 text-[#3d8c1c] shrink-0" />
            {desk.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-3">{desk.description}</p>
          <a
            href={desk.contactHref}
            target={desk.contactHref.startsWith('http') ? '_blank' : undefined}
            rel={desk.contactHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-sm font-semibold text-[#3d8c1c] hover:text-[#2c6a14] underline underline-offset-2 break-all"
          >
            {desk.contactLabel}
          </a>
        </div>
      </div>
    </div>
  );
};

const Partnership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [heroRef, heroVisible] = useScrollReveal();
  const [helpRef, helpVisible] = useScrollReveal({ threshold: 0.1 });
  const [formRef, formVisible] = useScrollReveal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/partnership/submit', formData);
      toast.success(
        res.data?.message ||
          "Thanks — we've received your message and will get back to you within one business day."
      );
      setFormData({ name: '', email: '', organization: '', role: '', message: '' });
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message || 'Could not send your message. Please try again.'
        : 'Could not send your message. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const helpDesks = [
    {
      icon: Handshake,
      title: 'Institutional Partnerships',
      description:
        'Financial institutions, insurance companies, and development partners looking to co-invest or collaborate.',
      contactLabel: PARTNERSHIP_EMAIL,
      contactHref: `mailto:${PARTNERSHIP_EMAIL}`,
    },
    {
      icon: Users,
      title: 'Farmer & Grower Support',
      description:
        'Help with registration, discounts, app usage, and services for growers already on the platform.',
      contactLabel: `WhatsApp: ${formatGhanaPhone(CONTACT_WHATSAPP)}`,
      contactHref: whatsappMeUrl('Hello Agrilync Nexus, I need help as a grower.'),
    },
    {
      icon: TrendingUp,
      title: 'Investor Relations',
      description:
        'Fund performance, ESG reporting, and investment opportunities for individual and institutional investors.',
      contactLabel: PARTNERSHIP_EMAIL,
      contactHref: `mailto:${PARTNERSHIP_EMAIL}`,
    },
    {
      icon: BarChart3,
      title: 'Media & Press',
      description:
        'Press inquiries, interviews, and brand partnership requests from journalists and media houses.',
      contactLabel: PARTNERSHIP_EMAIL,
      contactHref: `mailto:${PARTNERSHIP_EMAIL}`,
    },
    {
      icon: Leaf,
      title: 'Agent & Field Network',
      description:
        'Onboarding as a field agent or extension officer, or coordinating farm visits and due diligence on the ground.',
      contactLabel: `WhatsApp: ${formatGhanaPhone(CONTACT_WHATSAPP)}`,
      contactHref: whatsappMeUrl('Hello Agrilync Nexus, I would like to join the agent network.'),
    },
    {
      icon: ShieldCheck,
      title: 'General Enquiries',
      description:
        "Not sure which desk fits your question? Send it our way and we'll route it to the right team.",
      contactLabel: PARTNERSHIP_EMAIL,
      contactHref: `mailto:${PARTNERSHIP_EMAIL}`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ───────── Hero Section ───────── */}
      <section
        ref={heroRef}
        className={
          'relative pt-28 sm:pt-36 md:pt-44 pb-20 sm:pb-28 min-h-[560px] md:min-h-[620px] flex items-center overflow-hidden transition-all duration-700 ' +
          (heroVisible ? 'animate-fade-in-up' : 'opacity-0')
        }
        style={{
          background:
            'linear-gradient(135deg, #f0fbe4 0%, #e8f8d4 30%, #d4f5a0 60%, #edfccf 100%)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — Text */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold leading-tight text-[#002F37]">
              Every letter{' '}
              <br className="hidden sm:block" />
              finds its{' '}
              <span className="text-[#3d8c1c] italic">desk.</span>
            </h1>
            <p className="mt-6 text-gray-600 text-lg sm:text-xl max-w-md leading-relaxed">
              Drop us a line. Pick the desk that fits your question and we will
              route it to humans on the other end. Replies inside one business
              day.
            </p>
          </div>

          {/* Right — Mail Graphic */}
          <div className="flex justify-center md:justify-end items-center relative py-8 md:py-10">
            <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px]">
              {/* Ground shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 rounded-full bg-[#002f37]/15 blur-md" />

              {/* Green backing card, peeking behind */}
              <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-6 rounded-[2.5rem] bg-gradient-to-br from-[#a3e878] to-[#6ec73f]" />

              {/* Main tile */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#0a4a56] to-[#00232a] shadow-2xl transition-transform duration-500 ease-out hover:-rotate-2 hover:scale-[1.02] flex items-center justify-center overflow-hidden">
                {/* soft glow behind icon */}
                <div className="absolute w-2/3 h-2/3 rounded-full bg-[#7ede56]/20 blur-3xl" />
                <Mail
                  className="relative w-[42%] h-[42%] text-white drop-shadow-lg"
                  strokeWidth={1.5}
                />
              </div>

              {/* Delivered badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#7ede56] shadow-lg flex items-center justify-center ring-4 ring-white">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#002f37]" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── How Can We Help ───────── */}
      <section
        ref={helpRef}
        className="relative py-16 sm:py-24 overflow-hidden bg-[#04211f]"
        style={{
          backgroundImage: "url('/lovable-uploads/partner.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark brand-tinted overlay for legibility over the photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(4,33,31,0.62) 0%, rgba(11,61,46,0.5) 55%, rgba(18,58,31,0.58) 100%)',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={
              'mb-12 sm:mb-16 transition-all duration-700 ' +
              (helpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              How Can We Help?
            </h2>
            <div className="w-16 h-1 bg-[#7ede56] rounded-full mb-4" />
            <p className="text-white/60 max-w-2xl text-base sm:text-lg">
              Pick the desk that fits your question — each one reaches a
              real person, not a queue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {helpDesks.map((desk, i) => (
              <DeskCard key={desk.title} desk={desk} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Send a Message ───────── */}
      <section
        ref={formRef}
        className={
          'py-16 sm:py-24 transition-all duration-700 ' +
          (formVisible ? 'animate-fade-in-up' : 'opacity-0')
        }
        style={{
          background: 'linear-gradient(180deg, #f8fdf4 0%, #ffffff 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] rounded-3xl shadow-2xl overflow-hidden">
            {/* Left — context panel */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0a4a56] to-[#00232a] p-6 sm:p-8 md:p-10 flex flex-col gap-6 md:gap-0 md:justify-between">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#7ede56]/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-[#7ede56]/10 blur-3xl pointer-events-none" />

              <div className="relative">
                <span className="text-[#7ede56] text-xs font-bold uppercase tracking-[0.2em]">
                  Get in Touch
                </span>
                <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  Send Us a Message
                </h2>
                <p className="mt-2 sm:mt-4 text-white/65 text-sm sm:text-base leading-relaxed">
                  Tell us about your organisation and what you're looking for.
                  We'll get back to you within one business day.
                </p>
              </div>

              <div className="relative flex flex-wrap items-center gap-2 sm:gap-2.5 md:mt-10">
                <a
                  href={`mailto:${PARTNERSHIP_EMAIL}`}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/90 hover:text-[#7ede56] transition-colors text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-full max-w-full"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{PARTNERSHIP_EMAIL}</span>
                </a>
                <a
                  href={whatsappMeUrl('Hello Agrilync Nexus, I have a partnership question.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/90 hover:text-[#7ede56] transition-colors text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-full max-w-full"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{formatGhanaPhone(CONTACT_WHATSAPP) || 'WhatsApp us'}</span>
                </a>
                <div className="w-full flex items-center gap-1.5 text-white/50 text-xs mt-0.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Replies within one business day
                </div>
              </div>
            </div>

            {/* Right — form panel */}
            <div className="bg-white p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="partner-name" className="text-[#002F37] font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="partner-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="mt-1.5 rounded-xl border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-email" className="text-[#002F37] font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="partner-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@organisation.com"
                      className="mt-1.5 rounded-xl border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="partner-org" className="text-[#002F37] font-semibold">
                      Organisation / Company
                    </Label>
                    <Input
                      id="partner-org"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Organisation name"
                      className="mt-1.5 rounded-xl border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-role" className="text-[#002F37] font-semibold">
                      Your Role *
                    </Label>
                    <select
                      id="partner-role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#7ede56] focus:ring-[#7ede56]/30 focus:outline-none"
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="Institution">Institution</option>
                      <option value="Development Partner">Development Partner</option>
                      <option value="Individual Investor">Individual Investor</option>
                      <option value="NGO / Foundation">NGO / Foundation</option>
                      <option value="Government Agency">Government Agency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="partner-message" className="text-[#002F37] font-semibold">
                    Message *
                  </Label>
                  <Textarea
                    id="partner-message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your goals and how you'd like to partner..."
                    rows={5}
                    className="mt-1.5 rounded-xl border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/30"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#002F37] hover:bg-[#004555] text-white py-4 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSubmitting ? 'Sending…' : 'Send Partnership Inquiry'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnership;
