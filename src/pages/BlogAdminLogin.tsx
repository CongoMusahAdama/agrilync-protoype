import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/utils/api';

const BlogAdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('blogAdminToken');
    const userJson = localStorage.getItem('blogAdminUser');
    if (token && userJson) {
      const user = JSON.parse(userJson);
      if (!user.requiresPasswordChange) {
        navigate('/blog/admin/dashboard');
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/blogs/auth/login', { email, password });
      
      const { token, admin } = res.data;
      localStorage.setItem('blogAdminToken', token);
      localStorage.setItem('blogAdminUser', JSON.stringify(admin));
      
      if (admin.requiresPasswordChange) {
        setRequirePasswordReset(true);
        toast.info('First-time login: Please update your temporary password.');
      } else {
        toast.success(`Welcome back, ${admin.username || 'Admin'}!`);
        navigate('/blog/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.msg || 'Invalid email or password.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/blogs/auth/change-password', { newPassword });
      
      const { admin } = res.data;
      localStorage.setItem('blogAdminUser', JSON.stringify(admin));
      
      toast.success('Password updated successfully! Welcome to your dashboard.');
      navigate('/blog/admin/dashboard');
    } catch (err: any) {
      console.error('Password update error:', err);
      const errMsg = err.response?.data?.msg || 'Failed to update password.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002f37] flex flex-col justify-center items-center relative px-4 overflow-hidden">
      {/* Background Visual Enhancers */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#7ede56]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#7ede56]/5 blur-[120px] pointer-events-none"></div>

      <Link 
        to="/blog" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#7ede56]/10 border border-[#7ede56]/20 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-[#7ede56]" />
          </div>
          <h1 className="text-3xl font-montserrat font-bold text-white tracking-tight">AgriLync Publisher</h1>
          <p className="text-white/60 text-sm mt-2">Dedicated Publisher & Blog Administration Portal</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white overflow-hidden rounded-3xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-montserrat font-bold text-white flex items-center gap-2">
              Sign In <Sparkles className="w-5 h-5 text-[#7ede56]" />
            </CardTitle>
            <CardDescription className="text-white/60">
              Provide your publisher credentials to access the blog dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!requirePasswordReset ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="email"
                      placeholder="admin@agrilync.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-white/5 border-white/15 text-white placeholder:text-white/35 rounded-xl h-12 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">Secret Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 bg-white/5 border-white/15 text-white placeholder:text-white/35 rounded-xl h-12 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-bold h-12 rounded-xl mt-4 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authenticating Portal...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">Create New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 bg-white/5 border-white/15 text-white placeholder:text-white/35 rounded-xl h-12 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 bg-white/5 border-white/15 text-white placeholder:text-white/35 rounded-xl h-12 focus-visible:ring-[#7ede56] focus-visible:border-[#7ede56]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-bold h-12 rounded-xl mt-4 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving New Password...
                    </>
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/40 mt-8">
          Authorized personnel only. Sessions are encrypted and subject to system audit logging.
        </p>
      </div>
    </div>
  );
};

export default BlogAdminLogin;
