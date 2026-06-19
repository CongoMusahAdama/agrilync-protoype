import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Construction } from 'lucide-react';
import GrowerLayout from '@/components/grower/GrowerLayout';
import { getGrowerNavItem } from '@/utils/growerNav';

type GrowerPageScaffoldProps = {
    activeSection: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
};

/**
 * Redesign shell — shows planned features until each page is fully built.
 */
const GrowerPageScaffold: React.FC<GrowerPageScaffoldProps> = ({
    activeSection,
    title,
    subtitle,
    children,
}) => {
    const navItem = getGrowerNavItem(activeSection);
    const features = navItem?.features ?? [];

    return (
        <GrowerLayout activeSection={activeSection} title={title} subtitle={subtitle}>
            <Card className="mb-6 border-dashed border-[#7ede56]/40 bg-[#7ede56]/5">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Construction className="h-5 w-5 text-[#065f46]" />
                        <CardTitle className="text-base text-[#002f37]">Page redesign in progress</CardTitle>
                    </div>
                    <CardDescription>
                        This section follows the final Lync Grower IA. Full UI coming in the next pass.
                    </CardDescription>
                </CardHeader>
                {features.length > 0 && (
                    <CardContent className="pt-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                            Planned features
                        </p>
                        <ul className="space-y-2">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                                    <Badge
                                        variant="outline"
                                        className="mt-0.5 shrink-0 border-[#7ede56]/50 text-[#065f46] text-[10px]"
                                    >
                                        FF
                                    </Badge>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                )}
            </Card>
            {children}
        </GrowerLayout>
    );
};

export default GrowerPageScaffold;
