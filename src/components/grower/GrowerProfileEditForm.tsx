import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CreditCard, Loader2, Save } from 'lucide-react';
import { useGrower } from '@/contexts/GrowerContext';
import GrowerLyncCardModal from '@/components/grower/GrowerLyncCardModal';
import {
    GROWER_ONBOARDING_STEPS,
    GROWER_TRAINING_MODULE_LABELS,
    formatFarmType,
    formatInvestmentInterest,
    formatLivestockInventory,
} from '@/constants/growerOnboarding';
import {
    OnboardingFormCard,
    OnboardingMobileProgress,
    OnboardingSidebar,
    OnboardingStepSection,
    ONBOARDING_CONTENT_WIDTH,
} from '@/components/agent/onboarding/OnboardingFormUI';
import {
    GrowerCropChecklist,
    GrowerEditableField,
    GrowerEditableTextarea,
    GrowerIdCardPreview,
    GrowerProfilePhoto,
    GrowerReadOnlyField,
    GrowerSelectField,
} from '@/components/grower/GrowerProfileFields';
import { GHANA_CROPS } from '@/data/ghanaCrops';
import { GHANA_LANGUAGES, GHANA_REGIONS, getRegionKey } from '@/data/ghanaRegions';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
    formToGrowerPayload,
    growerToForm,
    type GrowerProfileFormState,
} from '@/utils/growerProfileForm';
import { persistGrowerSession, getGrowerToken } from '@/utils/authToken';

const statusLabel = (status?: string) => {
    if (status === 'active') return 'Verified & active';
    if (status === 'pending') return 'Pending agent review';
    if (status === 'inactive') return 'Inactive';
    return status || '—';
};

const GrowerProfileEditForm: React.FC = () => {
    const { grower, assignedAgent, refreshGrower } = useGrower();
    const [step, setStep] = useState(1);
    const [cardModalOpen, setCardModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<GrowerProfileFormState>(() => growerToForm(grower));

    useEffect(() => {
        if (grower) setForm(growerToForm(grower));
    }, [grower]);

    const regionKey = form.region ? getRegionKey(form.region) : '';
    const districtOptions = useMemo(
        () => (regionKey && GHANA_REGIONS[regionKey] ? GHANA_REGIONS[regionKey] : []),
        [regionKey]
    );
    const languageOptions = useMemo(() => {
        const langs = regionKey && GHANA_LANGUAGES[regionKey] ? GHANA_LANGUAGES[regionKey] : [];
        const unique = [...new Set([...(Array.isArray(langs) ? langs : []), form.language].filter(Boolean))];
        return unique.sort().map((l) => ({ value: l, label: l }));
    }, [regionKey, form.language]);

    const patch = (updates: Partial<GrowerProfileFormState>) =>
        setForm((prev) => ({ ...prev, ...updates }));

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await api.put('/grower/me', formToGrowerPayload(form));
            const updated = res.data?.grower;
            if (updated) {
                const token = getGrowerToken();
                if (token) persistGrowerSession(token, updated);
            }
            await refreshGrower();
            toast.success(
                res.data?.message ||
                    'Profile saved. Your field agent will review your changes if needed.'
            );
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
                'Could not save profile.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const livestockDisplay =
        formatLivestockInventory(grower?.livestockInventory) !== '—'
            ? formatLivestockInventory(grower?.livestockInventory)
            : grower?.livestockType || '—';

    const trainingDisplay =
        grower?.trainingModules?.length
            ? grower.trainingModules.map((id) => GROWER_TRAINING_MODULE_LABELS[id] || id).join(', ')
            : '—';

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <OnboardingStepSection
                            step={1}
                            icon={GROWER_ONBOARDING_STEPS[0].icon}
                            title="Identity"
                            description="Update your contact details — same fields as agent onboarding."
                        />
                        <GrowerProfilePhoto grower={grower} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                            <GrowerEditableField
                                label="Grower full name"
                                value={form.name}
                                onChange={(v) => patch({ name: v })}
                                placeholder="As on Ghana Card"
                            />
                            <GrowerEditableField
                                label="Phone number"
                                value={form.contact}
                                onChange={(v) => patch({ contact: v })}
                                placeholder="024 000 0000"
                            />
                            <GrowerEditableField
                                label="Email address"
                                value={form.email}
                                onChange={(v) => patch({ email: v })}
                                placeholder="farmer@email.com"
                                hint="Optional"
                            />
                            <GrowerSelectField
                                label="Preferred language"
                                value={form.language}
                                onChange={(v) => patch({ language: v })}
                                options={languageOptions}
                                placeholder="Choose language"
                            />
                            <GrowerSelectField
                                label="Gender"
                                value={form.gender}
                                onChange={(v) => patch({ gender: v })}
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                            <GrowerEditableField
                                label="Date of birth"
                                type="date"
                                value={form.dob}
                                onChange={(v) => patch({ dob: v })}
                            />
                            <GrowerReadOnlyField
                                label="Ghana Card number"
                                value={grower?.ghanaCardNumber}
                                mono
                            />
                            <GrowerReadOnlyField label="Lync ID" value={grower?.lyncId} mono />
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <OnboardingStepSection
                            step={2}
                            icon={GROWER_ONBOARDING_STEPS[1].icon}
                            title="Farm & location"
                            description="Your farm area, crops, and operational details."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                            <GrowerReadOnlyField label="Region" value={form.region} hint="Set at registration" />
                            <GrowerSelectField
                                label="District"
                                value={form.district}
                                onChange={(v) => patch({ district: v })}
                                options={districtOptions.map((d) => ({ value: d, label: d }))}
                                placeholder="Select district"
                            />
                            <GrowerEditableField
                                label="Community"
                                value={form.community}
                                onChange={(v) => patch({ community: v })}
                            />
                            <GrowerEditableField
                                label="Years of experience"
                                type="number"
                                value={form.yearsOfExperience}
                                onChange={(v) => patch({ yearsOfExperience: v })}
                                placeholder="Years of farming"
                            />
                            <GrowerSelectField
                                label="Primary farm type"
                                value={form.farmType}
                                onChange={(v) => patch({ farmType: v })}
                                options={[
                                    { value: 'crop', label: 'Crop' },
                                    { value: 'livestock', label: 'Livestock' },
                                    { value: 'mixed', label: 'Mixed' },
                                    { value: 'aquaculture', label: 'Aquaculture' },
                                ]}
                            />
                            <GrowerSelectField
                                label="Land ownership status"
                                value={form.landOwnershipStatus}
                                onChange={(v) => patch({ landOwnershipStatus: v })}
                                options={[
                                    { value: 'owned', label: 'Owned' },
                                    { value: 'leased', label: 'Leased' },
                                    { value: 'sharecropped', label: 'Sharecropped' },
                                    { value: 'communal', label: 'Communal' },
                                ]}
                            />
                            <GrowerEditableField
                                label="Estimated acreage"
                                type="number"
                                value={form.farmSize}
                                onChange={(v) => patch({ farmSize: v })}
                                placeholder="Acres"
                            />
                            <GrowerReadOnlyField label="Livestock inventory" value={livestockDisplay} />
                        </div>
                        {(form.farmType === 'crop' || form.farmType === 'mixed') && (
                            <div className="space-y-3">
                                <GrowerCropChecklist
                                    crops={GHANA_CROPS}
                                    selected={form.cropList}
                                    onChange={(cropList) => patch({ cropList })}
                                />
                                {form.cropList.includes('Other') && (
                                    <GrowerEditableField
                                        label="Other crop"
                                        value={form.cropsGrownOther}
                                        onChange={(v) => patch({ cropsGrownOther: v })}
                                    />
                                )}
                            </div>
                        )}
                        <GrowerEditableTextarea
                            label="Field notes"
                            value={form.fieldNotes}
                            onChange={(v) => patch({ fieldNotes: v })}
                            hint="Optional notes about your farm"
                        />
                    </>
                );
            case 3:
                return (
                    <>
                        <OnboardingStepSection
                            step={3}
                            icon={GROWER_ONBOARDING_STEPS[2].icon}
                            title="Investment profile"
                            description="Optional — partner funding is not live yet; you can still keep this on file."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                            <GrowerSelectField
                                label="Investment interest"
                                value={form.investmentInterest}
                                onChange={(v) => patch({ investmentInterest: v })}
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'maybe', label: 'Maybe' },
                                    { value: 'no', label: 'No' },
                                ]}
                            />
                            <GrowerEditableField
                                label="Capital requirement (GHS)"
                                type="number"
                                value={form.estimatedCapitalNeed}
                                onChange={(v) => patch({ estimatedCapitalNeed: v })}
                                placeholder="0.00"
                            />
                            <GrowerSelectField
                                label="Primary investment objective"
                                value={form.preferredInvestmentType}
                                onChange={(v) => patch({ preferredInvestmentType: v })}
                                options={[
                                    { value: 'inputs', label: 'Inputs' },
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'equipment', label: 'Equipment' },
                                    { value: 'mechanization', label: 'Mechanization' },
                                    { value: 'irrigation', label: 'Irrigation' },
                                    { value: 'infrastructure', label: 'Infrastructure' },
                                    { value: 'working_capital', label: 'Working capital' },
                                    { value: 'partnership', label: 'Partnership' },
                                ]}
                            />
                            <GrowerReadOnlyField
                                label="Market readiness index"
                                value={
                                    grower?.investmentReadinessScore != null
                                        ? `${grower.investmentReadinessScore}%`
                                        : undefined
                                }
                                hint="Set by your field agent"
                            />
                            <GrowerReadOnlyField label="Training modules (onboarding)" value={trainingDisplay} />
                        </div>
                    </>
                );
            case 4:
            default:
                return (
                    <>
                        <OnboardingStepSection
                            step={4}
                            icon={GROWER_ONBOARDING_STEPS[3].icon}
                            title="Verification"
                            description="Your Ghana Card and verification status — contact your agent to replace ID photos."
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                className={
                                    grower?.status === 'active'
                                        ? 'bg-[#7ede56] text-[#002f37]'
                                        : 'bg-amber-400 text-[#002f37]'
                                }
                            >
                                {statusLabel(grower?.status)}
                            </Badge>
                            {grower?.verificationConfirmed && grower.status === 'active' && (
                                <Badge variant="outline" className="border-[#065f46] text-[#065f46]">
                                    ID verified
                                </Badge>
                            )}
                            <Badge variant="outline">
                                Profile {grower?.profileCompleteness ?? 0}% complete
                            </Badge>
                        </div>
                        {grower?.status === 'pending' && (
                            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-inter">
                                Your profile is waiting for your field agent to review and approve.
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                            <GrowerReadOnlyField
                                label="Onboarding source"
                                value={grower?.onboardingSource === 'self' ? 'Self registration' : 'Agent led'}
                            />
                            <GrowerReadOnlyField
                                label="Onboarding agent ID"
                                value={grower?.onboardingAgentId}
                                mono
                            />
                            <GrowerReadOnlyField label="Primary farm type" value={formatFarmType(form.farmType)} />
                            <GrowerReadOnlyField label="Investment interest" value={formatInvestmentInterest(form.investmentInterest)} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <GrowerIdCardPreview label="Ghana Card — front" src={grower?.idCardFront} />
                            <GrowerIdCardPreview label="Ghana Card — back" src={grower?.idCardBack} />
                        </div>

                        {grower?.status === 'active' && (
                            <div className="rounded-xl border border-[#065f46]/20 bg-[#065f46]/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-[#002f37] font-inter">Lync Grower ID Card</p>
                                    <p className="text-xs text-gray-600 mt-1 font-inter">
                                        Your digital credential issued after onboarding — same card your agent generated.
                                        {grower.digitalCardNumber
                                            ? ` Card no. ${grower.digitalCardNumber}`
                                            : ''}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    className="bg-[#7ede56] hover:bg-[#6bcb4b] text-white font-inter gap-2 shrink-0 font-black"
                                    onClick={() => setCardModalOpen(true)}
                                >
                                    <CreditCard className="h-4 w-4" />
                                    View my card
                                </Button>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <>
            <div className={`${ONBOARDING_CONTENT_WIDTH} font-inter`}>
                <div className="mb-5 rounded-xl border border-[#7ede56]/30 bg-[#7ede56]/10 px-4 py-3">
                    <p className="text-sm text-[#002f37]">
                        Update your profile anytime and tap <strong>Save profile</strong>. If you were already
                        verified, your agent will review and approve your changes again.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <OnboardingSidebar steps={GROWER_ONBOARDING_STEPS} currentStep={step} onStepClick={setStep} />
                    <OnboardingMobileProgress
                        steps={GROWER_ONBOARDING_STEPS}
                        currentStep={step}
                        onStepClick={setStep}
                    />

                    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                        <OnboardingFormCard>{renderStep()}</OnboardingFormCard>

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="font-inter gap-1"
                                disabled={step <= 1}
                                onClick={() => setStep((s) => Math.max(1, s - 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Button>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    className="bg-[#7ede56] hover:bg-[#6bcb4b] text-white font-inter gap-2 font-black"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save profile
                                </Button>
                                {step < 4 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="font-inter gap-1"
                                        onClick={() => setStep((s) => Math.min(4, s + 1))}
                                    >
                                        Continue
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GrowerLyncCardModal
                open={cardModalOpen}
                onOpenChange={setCardModalOpen}
                grower={grower}
                assignedAgent={assignedAgent}
            />
        </>
    );
};

export default GrowerProfileEditForm;
