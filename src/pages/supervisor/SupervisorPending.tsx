import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Construction, LogOut, Phone, Mail, Shield } from 'lucide-react';

const SupervisorPending: React.FC = () => {
    const { agent, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/agent/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#002f37] px-8 py-10 text-center text-white">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-[#7ede56]/15 flex items-center justify-center mb-5">
                        <Construction className="w-8 h-8 text-[#7ede56]" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7ede56]">Supervisor Access</p>
                    <h1 className="text-2xl font-black mt-2">Dashboard Under Construction</h1>
                    <p className="text-sm text-white/70 mt-3 leading-relaxed">
                        Hello{agent?.name ? `, ${agent.name.split(' ')[0]}` : ''}. The supervisor workspace is not available yet.
                    </p>
                </div>

                <div className="px-8 py-8 space-y-6">
                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                        <p className="text-sm text-amber-900 leading-relaxed">
                            Your account is active, but there is no supervisor dashboard at this time.
                            Please contact your <strong>AgriLync administrator</strong> for support or next steps.
                        </p>
                    </div>

                    {(agent?.region || agent?.agentId) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {agent?.agentId && (
                                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-xs text-gray-500 font-medium">Supervisor ID</p>
                                    <p className="font-semibold text-[#002f37] mt-0.5">{agent.agentId}</p>
                                </div>
                            )}
                            {agent?.region && (
                                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-xs text-gray-500 font-medium">Region</p>
                                    <p className="font-semibold text-[#002f37] mt-0.5">{agent.region}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#065f46] shrink-0" />
                            Reach your regional admin or platform support team.
                        </p>
                        {agent?.contact && (
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#065f46] shrink-0" />
                                Your registered phone: {agent.contact}
                            </p>
                        )}
                        {agent?.email && (
                            <p className="flex items-center gap-2 break-all">
                                <Mail className="w-4 h-4 text-[#065f46] shrink-0" />
                                {agent.email}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={handleLogout}
                        className="w-full h-12 bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] font-semibold rounded-xl"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SupervisorPending;
