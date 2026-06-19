import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, UserCheck } from 'lucide-react';
import type { GrowerAssignedAgent } from '@/contexts/GrowerContext';
import {
    GD_BTN,
    GD_CAPTION,
    GD_FONT,
    GD_H2,
    GD_LABEL,
} from '@/constants/growerDashboardTypography';

type GrowerAgentDetailsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: GrowerAssignedAgent | null;
};

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
            <span className={`${GD_LABEL} shrink-0`}>{label}</span>
            <span className={`text-sm font-semibold text-[#002f37] ${GD_FONT} text-right break-all`}>{value}</span>
        </div>
    );
};

const GrowerAgentDetailsDialog: React.FC<GrowerAgentDetailsDialogProps> = ({
    open,
    onOpenChange,
    agent,
}) => {
    if (!agent) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-sm rounded-2xl ${GD_FONT} p-0 overflow-hidden`}>
                <DialogHeader className="px-5 pt-5 pb-3 bg-[#7ede56]/10 border-b border-[#7ede56]/20">
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-[#7ede56]" />
                        <DialogTitle className={`${GD_H2} text-base`}>Your field agent</DialogTitle>
                    </div>
                    <p className={`${GD_CAPTION} text-left pt-1`}>
                        Contact your agent for visits, verification, and farm support.
                    </p>
                </DialogHeader>

                <div className="px-5 py-3">
                    <DetailRow label="Name" value={agent.name} />
                    <DetailRow label="Agent ID" value={agent.agentId} />
                    <DetailRow label="Region" value={agent.region} />
                    <DetailRow label="District" value={agent.district} />
                    <DetailRow label="Phone" value={agent.contact} />
                    <DetailRow label="Email" value={agent.email} />
                </div>

                <div className="px-5 pb-5 flex flex-col gap-2">
                    {agent.contact && (
                        <Button className={`w-full bg-[#7ede56] hover:bg-[#6bcb4b] text-white ${GD_BTN} gap-2`} asChild>
                            <a href={`tel:${agent.contact}`}>
                                <Phone className="h-4 w-4" />
                                Call agent
                            </a>
                        </Button>
                    )}
                    {agent.email && (
                        <Button variant="outline" className={`w-full ${GD_BTN} gap-2`} asChild>
                            <a href={`mailto:${agent.email}`}>
                                <Mail className="h-4 w-4" />
                                Send email
                            </a>
                        </Button>
                    )}
                    {(agent.region || agent.district) && (
                        <p className={`${GD_CAPTION} text-gray-400 flex items-center justify-center gap-1 pt-1`}>
                            <MapPin className="h-3 w-3" />
                            {[agent.district, agent.region].filter(Boolean).join(', ')}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GrowerAgentDetailsDialog;
