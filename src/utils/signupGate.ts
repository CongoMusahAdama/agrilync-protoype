import Swal from 'sweetalert2';
import { isLocalhost } from '@/utils/env';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';

/**
 * Public role signup (Solo Farmer, Lync Grower, Lync Investor) is enabled on localhost
 * and when VITE_ENABLE_PUBLIC_SIGNUP=true is set at build time (e.g. staging).
 * Production .com / Netlify builds stay "Under Development" unless that flag is set.
 */
export const isPublicRoleSignupEnabled = (): boolean => {
    if (isLocalhost()) return true;
    return import.meta.env.VITE_ENABLE_PUBLIC_SIGNUP === 'true';
};

export const showSignupUnderDevelopment = async () => {
    const whatsappBlock = WHATSAPP_COMMUNITY_URL
        ? `<p style="margin-top:12px;font-size:14px;color:#4b5563;">Join our WhatsApp community for launch updates.</p>
           <a href="${WHATSAPP_COMMUNITY_URL}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;margin-top:12px;background:#25D366;color:white;padding:10px 18px;border-radius:999px;font-weight:600;text-decoration:none;font-size:14px;">
             Join WhatsApp Community
           </a>`
        : '';

    await Swal.fire({
        title: 'Signup Under Development',
        html: `🌾 Thank you for your interest in AgriLync!<br><br>
            Registration for farmers, growers, and investors is being finalized and will open soon on our live site.<br><br>
            <i>Field agents and admins can still sign in.</i>
            ${whatsappBlock}`,
        icon: 'info',
        confirmButtonColor: '#7ede56',
        confirmButtonText: 'Got it',
    });
};

/** Returns true when signup may proceed; otherwise shows the under-development message. */
export const guardPublicRoleSignup = async (): Promise<boolean> => {
    if (isPublicRoleSignupEnabled()) return true;
    await showSignupUnderDevelopment();
    return false;
};
