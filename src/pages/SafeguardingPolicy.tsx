import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Mail,
  Phone,
  ArrowLeft,
  Camera,
  Heart,
  Users,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BRAND_TEAL = '#002F37';

const SAFEGUARDING_EMAIL = 'agrilync@gmail.com';
const SAFEGUARDING_PHONES = ['0506626068', '0247552111'];

type Commitment = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const commitments: Commitment[] = [
  {
    icon: Camera,
    title: 'Informed consent',
    text: "We never use a farmer's photo, video, or story without their informed consent, and they can withdraw that consent at any time.",
  },
  {
    icon: Heart,
    title: 'Child protection',
    text: 'We take extra precautions to protect children during any farm or community activity.',
  },
  {
    icon: Users,
    title: 'Dignity for all',
    text: 'Every farmer, agent, and partner is treated with equal respect and dignity, regardless of gender, age, or background.',
  },
  {
    icon: Lock,
    title: 'Confidential reporting',
    text: 'Anyone can report a concern confidentially, without it affecting their access to our training, advisory, or financial services.',
  },
];

const SafeguardingPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 md:pt-44 pb-8 sm:pb-10 bg-white">
        <div className="max-w-3xl mx-auto text-center px-5 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#7ede56]/15 mb-5 sm:mb-6">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: BRAND_TEAL }} />
          </div>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-3 leading-tight px-2"
            style={{ color: BRAND_TEAL }}
          >
            Safeguarding Policy
          </h1>
          <div className="w-14 sm:w-16 h-0.5 bg-[#7ede56] mb-5 sm:mb-6 mx-auto" />
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Agrilync Nexus is committed to the safety, dignity, and wellbeing of every farmer, family, and community we work with.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 sm:pb-24 md:pb-28 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 text-center sm:text-left">
            We take safeguarding seriously in everything we do, from farm visits to the stories we share.
          </p>

          {/* Commitments */}
          <div className="space-y-4 sm:space-y-5 mb-10 sm:mb-12">
            {commitments.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-4 sm:gap-5 bg-white rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,47,55,0.08)]"
              >
                <div
                  className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND_TEAL}` }}
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5 text-[#7ede56]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold font-montserrat mb-1.5 sm:mb-2" style={{ color: BRAND_TEAL }}>
                    {title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Report */}
          <div
            className="rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-[#7ede56]/20 shadow-[0_12px_40px_-12px_rgba(0,47,55,0.12)]"
            style={{ backgroundColor: BRAND_TEAL }}
          >
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#7ede56]/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#7ede56]" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-montserrat leading-tight">
                  Report a safeguarding concern
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                Contact us confidentially. Reporting will not affect your access to our services.
              </p>

              <div className="space-y-3">
                <a
                  href={`mailto:${SAFEGUARDING_EMAIL}`}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white/10 border border-white/10 active:bg-white/15 sm:hover:bg-white/15 transition-colors min-h-[56px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#7ede56] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#002f37]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white font-semibold text-sm sm:text-base break-all">{SAFEGUARDING_EMAIL}</p>
                  </div>
                </a>

                {SAFEGUARDING_PHONES.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white/10 border border-white/10 active:bg-white/15 sm:hover:bg-white/15 transition-colors min-h-[56px]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#7ede56] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#002f37]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-white font-semibold text-sm sm:text-base">{phone}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7ede56] transition-colors min-h-[44px] px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to homepage
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SafeguardingPolicy;
