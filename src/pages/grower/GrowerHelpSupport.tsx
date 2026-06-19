import GrowerPageScaffold from '@/components/grower/GrowerPageScaffold';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { useNavigate } from 'react-router-dom';

const GrowerHelpSupport: React.FC = () => {
    const navigate = useNavigate();

    return (
        <GrowerPageScaffold
            activeSection="help"
            title="Help & Support"
            subtitle="Get help, FAQs, and request a field visit"
        >
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#7ede56]" />
                            Call
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">AgriLync support line</p>
                        <Button variant="link" className="px-0 text-[#7ede56]" asChild>
                            <a href="tel:+233000000000">+233 00 000 0000</a>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-[#7ede56]" />
                            WhatsApp
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://wa.me/" target="_blank" rel="noreferrer">
                                Open WhatsApp
                            </a>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#7ede56]" />
                            Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="link" className="px-0 text-[#7ede56]" asChild>
                            <a href="mailto:support@agrilync.com">support@agrilync.com</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Button
                className="mt-6 bg-[#7ede56] hover:bg-[#6bcb4b] text-white font-black"
                onClick={() => navigate(GROWER_ROUTES.settings)}
            >
                Request agent visit / raise issue
            </Button>
        </GrowerPageScaffold>
    );
};

export default GrowerHelpSupport;
