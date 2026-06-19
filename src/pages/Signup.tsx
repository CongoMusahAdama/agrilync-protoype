import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { guardPublicRoleSignup } from '@/utils/signupGate';
import FarmerMobileAppDialog from '@/components/auth/FarmerMobileAppDialog';
import type { FarmerMobileRole } from '@/constants/mobileAppLinks';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [roleSelectKey, setRoleSelectKey] = useState(0);
  const [mobileAppOpen, setMobileAppOpen] = useState(false);
  const [mobileAppRole, setMobileAppRole] = useState<FarmerMobileRole>('grower');

  useEffect(() => {
    const app = searchParams.get('app');
    if (app === 'grower' || app === 'solo') {
      setMobileAppRole(app);
      setMobileAppOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openFarmerAppDialog = (role: FarmerMobileRole) => {
    setMobileAppRole(role);
    setMobileAppOpen(true);
    setRoleSelectKey((k) => k + 1);
  };

  const handlePublicRoleSelect = async (val: string) => {
    if (val === 'grower') {
      openFarmerAppDialog('grower');
      return;
    }
    if (val === 'farmer') {
      openFarmerAppDialog('solo');
      return;
    }
    if (val === 'investor') {
      const allowed = await guardPublicRoleSignup();
      if (!allowed) return;
      navigate('/signup/investor');
    }
  };

  return (
    <div className="min-h-screen w-full flex font-manrope">
      <FarmerMobileAppDialog
        open={mobileAppOpen}
        onOpenChange={setMobileAppOpen}
        role={mobileAppRole}
      />

      {/* Left — brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002f37] relative overflow-hidden flex-col justify-between p-16 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#7ede56]/10 blur-3xl" />

        <div className="relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 p-0 mb-6 h-auto font-normal flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>

          <h1 className="text-5xl xl:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-white">
            Join our growing <br />
            <span className="text-[#7ede56]">ecosystem</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-md leading-relaxed mb-10">
            Investors can join on the web. Farmers use the AgriLync mobile app — field agents use the dedicated portal.
          </p>

          <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] max-w-2xl max-h-[380px]">
            <img
              src="/lovable-uploads/signup6.jpg"
              alt="AgriLync ecosystem"
              className="w-full h-full object-cover opacity-95 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-[#002f37]/10 to-transparent" />
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
              Partnering for Growth
            </div>
          </div>
        </div>
      </div>

      {/* Right — role selection */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 sm:p-12 lg:p-16 xl:p-20 items-center justify-center overflow-y-auto">
        <div className="lg:hidden w-full">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <div className="max-w-xl mx-auto w-full">
          <div className="lg:hidden mb-8">
            <h2 className="text-2xl font-extrabold text-[#002f37] mb-3 leading-tight">
              Join our growing <br />
              <span className="text-[#7ede56]">ecosystem</span>
            </h2>
            <p className="text-gray-600 mb-4 text-xs leading-relaxed max-w-sm">
              Lync Investors sign up on the web. Lync Growers and Solo Farmers continue in the mobile app.
            </p>
            <div className="rounded-[1.5rem] overflow-hidden shadow-lg mb-4 max-h-[160px]">
              <img
                src="/lovable-uploads/signup6.jpg"
                alt="AgriLync ecosystem"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-8 text-center w-full">
            <h2 className="text-4xl font-extrabold text-[#002f37] mb-2 tracking-tight">
              Choose your role
            </h2>
            <p className="text-gray-600">
              Lync Investors sign up here. Growers and Solo Farmers use the mobile app.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full text-center">
            <div className="relative w-full">
              <Select key={roleSelectKey} onValueChange={handlePublicRoleSelect}>
                <SelectTrigger className="w-full h-14 rounded-full bg-white border border-gray-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 px-8 text-[#002f37] font-semibold hover:border-[#7ede56]/50 focus:ring-0 focus:ring-offset-0 flex justify-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <SelectValue placeholder="Join us" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
                  <SelectItem value="farmer" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                    <div className="flex items-center gap-3">
                      <Leaf className="w-4 h-4 text-[#7ede56]" />
                      <div>
                        <p className="font-bold">Solo Farmer</p>
                        <p className="text-xs text-gray-500">Mobile app — sign up on your phone</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="grower" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-bold">Lync Grower</p>
                        <p className="text-xs text-gray-500">Mobile app — sign up on your phone</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="investor" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-bold">Lync Investor</p>
                        <p className="text-xs text-gray-500">Sign up on the web</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 text-center space-y-3">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#002f37] font-bold hover:underline opacity-80">
                  Log in
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                Field agent?{' '}
                <Link to="/agent/login" className="text-[#065f46] font-semibold hover:underline">
                  Go to the agent portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
