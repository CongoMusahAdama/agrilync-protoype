import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    OnboardingFieldLabel,
    ONBOARDING_INPUT,
    ONBOARDING_SELECT,
    ONBOARDING_TEXTAREA,
} from '@/components/agent/onboarding/OnboardingFormUI';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import type { GrowerProfile } from '@/utils/authToken';

type FieldProps = {
    label: string;
    value?: string | number | null;
    hint?: string;
    mono?: boolean;
};

export const GrowerReadOnlyField: React.FC<FieldProps> = ({ label, value, hint, mono }) => (
    <div className="space-y-2">
        <OnboardingFieldLabel hint={hint}>{label}</OnboardingFieldLabel>
        <Input
            readOnly
            disabled
            value={value != null && value !== '' ? String(value) : '—'}
            className={`${ONBOARDING_INPUT} bg-gray-50/80 opacity-100 cursor-default ${mono ? 'font-mono' : ''}`}
        />
    </div>
);

export const GrowerEditableField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
    type?: string;
    placeholder?: string;
    mono?: boolean;
}> = ({ label, value, onChange, hint, type = 'text', placeholder, mono }) => (
    <div className="space-y-2">
        <OnboardingFieldLabel hint={hint}>{label}</OnboardingFieldLabel>
        <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${ONBOARDING_INPUT} font-inter ${mono ? 'font-mono' : ''}`}
        />
    </div>
);

export const GrowerEditableTextarea: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
}> = ({ label, value, onChange, hint }) => (
    <div className="space-y-2">
        <OnboardingFieldLabel hint={hint}>{label}</OnboardingFieldLabel>
        <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${ONBOARDING_TEXTAREA} font-inter min-h-[88px]`}
        />
    </div>
);

export const GrowerSelectField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    hint?: string;
}> = ({ label, value, onChange, options, placeholder = 'Select', hint }) => (
    <div className="space-y-2">
        <OnboardingFieldLabel hint={hint}>{label}</OnboardingFieldLabel>
        <Select value={value || undefined} onValueChange={onChange}>
            <SelectTrigger className={`${ONBOARDING_SELECT} font-inter`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[280px]">
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="py-2.5 font-medium">
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export const GrowerCropChecklist: React.FC<{
    crops: string[];
    selected: string[];
    onChange: (next: string[]) => void;
}> = ({ crops, selected, onChange }) => (
    <div className="space-y-2">
        <OnboardingFieldLabel>Crops under production</OnboardingFieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-100 rounded-xl bg-gray-50/50">
            {crops.map((crop) => {
                const checked = selected.includes(crop);
                return (
                    <label
                        key={crop}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer font-inter"
                    >
                        <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                                if (v) onChange([...selected, crop]);
                                else onChange(selected.filter((c) => c !== crop));
                            }}
                        />
                        <span className="truncate">{crop}</span>
                    </label>
                );
            })}
        </div>
    </div>
);

export const GrowerProfilePhoto: React.FC<{ grower?: GrowerProfile | null }> = ({ grower }) => {
    const src = grower?.profilePicture ? resolvePublicAssetUrl(grower.profilePicture) : undefined;
    const initials = grower?.name
        ? grower.name
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
        : 'LG';

    return (
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-[#7ede56]/30 shadow-md">
                <AvatarImage src={src} className="object-cover" />
                <AvatarFallback className="bg-[#065f46] text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-bold text-[#002f37] font-inter">Profile photo</p>
                <p className="text-xs text-gray-500 font-inter">From your onboarding record</p>
            </div>
        </div>
    );
};

export const GrowerIdCardPreview: React.FC<{ label: string; src?: string }> = ({ label, src }) => {
    const resolved = src ? resolvePublicAssetUrl(src) : '';
    return (
        <div className="space-y-2">
            <OnboardingFieldLabel>{label}</OnboardingFieldLabel>
            <div className="aspect-[1.6/1] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                {resolved ? (
                    <img src={resolved} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-400 font-inter">Not uploaded</span>
                )}
            </div>
        </div>
    );
};
