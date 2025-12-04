import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Construction, Calendar } from 'lucide-react';

interface UnderDevelopmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UnderDevelopmentModal: React.FC<UnderDevelopmentModalProps> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Construction className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl">Feature Under Development</DialogTitle>
                    <DialogDescription className="text-center pt-4 space-y-4">
                        <p className="text-base text-gray-600">
                            Thank you for your interest in AgriLync! 🌾
                        </p>
                        <p className="text-sm text-gray-500">
                            We're currently putting the finishing touches on our user dashboards and authentication system.
                            This feature will be available very soon!
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                            <Calendar className="h-4 w-4" />
                            <span>Expected launch: Coming Soon</span>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 pt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-[#7ede56] hover:bg-[#6bc947] text-white"
                    >
                        Got it, Thanks!
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                        Stay tuned for updates on our platform
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UnderDevelopmentModal;
