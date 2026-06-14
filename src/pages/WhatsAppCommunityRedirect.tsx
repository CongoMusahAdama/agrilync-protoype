import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';

type Props = {
  title?: string;
  message?: string;
};

const WhatsAppCommunityRedirect = ({
  title = 'Opening WhatsApp…',
  message = 'Redirecting you to the AgriLync WhatsApp community to complete your registration.',
}: Props) => {
  useEffect(() => {
    if (!WHATSAPP_COMMUNITY_URL) return;
    window.location.replace(WHATSAPP_COMMUNITY_URL);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4ffee] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-white shadow-xl border border-[#7ede56]/20 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white">
          <MessageCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-[#002f37] mb-2">{title}</h1>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {WHATSAPP_COMMUNITY_URL ? (
          <>
            <p className="text-xs text-gray-500 mb-4">If you are not redirected automatically, tap the button below.</p>
            <a
              href={WHATSAPP_COMMUNITY_URL}
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-colors"
            >
              Join WhatsApp Community
            </a>
          </>
        ) : (
          <>
            <p className="text-sm text-amber-700 mb-4">
              WhatsApp community link is not configured yet. Please contact AgriLync support.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#065f46] px-6 py-3 text-sm font-semibold text-white hover:bg-[#054a38] transition-colors"
            >
              Contact Us
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppCommunityRedirect;
