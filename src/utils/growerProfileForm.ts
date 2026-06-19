import type { GrowerProfile } from '@/utils/authToken';

/** Form shape aligned with agent onboarding fields. */
export type GrowerProfileFormState = {
    name: string;
    contact: string;
    email: string;
    language: string;
    gender: string;
    dob: string;
    region: string;
    district: string;
    community: string;
    yearsOfExperience: string;
    farmType: string;
    landOwnershipStatus: string;
    farmSize: string;
    cropList: string[];
    cropsGrownOther: string;
    fieldNotes: string;
    investmentInterest: string;
    estimatedCapitalNeed: string;
    preferredInvestmentType: string;
    hasPreviousInvestment: boolean;
};

export const emptyGrowerProfileForm = (): GrowerProfileFormState => ({
    name: '',
    contact: '',
    email: '',
    language: '',
    gender: '',
    dob: '',
    region: '',
    district: '',
    community: '',
    yearsOfExperience: '',
    farmType: '',
    landOwnershipStatus: '',
    farmSize: '',
    cropList: [],
    cropsGrownOther: '',
    fieldNotes: '',
    investmentInterest: 'no',
    estimatedCapitalNeed: '',
    preferredInvestmentType: '',
    hasPreviousInvestment: false,
});

export const growerToForm = (grower?: GrowerProfile | null): GrowerProfileFormState => ({
    name: grower?.name || '',
    contact: grower?.contact || '',
    email: grower?.email || '',
    language: grower?.language || '',
    gender: grower?.gender || '',
    dob: grower?.dob || '',
    region: grower?.region || '',
    district: grower?.district || '',
    community: grower?.community || '',
    yearsOfExperience: grower?.yearsOfExperience != null ? String(grower.yearsOfExperience) : '',
    farmType: grower?.farmType || '',
    landOwnershipStatus: grower?.landOwnershipStatus || '',
    farmSize: grower?.farmSize != null ? String(grower.farmSize) : '',
    cropList: grower?.cropList?.length ? [...grower.cropList] : [],
    cropsGrownOther: grower?.cropsGrownOther || '',
    fieldNotes: grower?.fieldNotes || '',
    investmentInterest: grower?.investmentInterest || 'no',
    estimatedCapitalNeed:
        grower?.estimatedCapitalNeed != null ? String(grower.estimatedCapitalNeed) : '',
    preferredInvestmentType: grower?.preferredInvestmentType || '',
    hasPreviousInvestment: Boolean(grower?.hasPreviousInvestment),
});

export const formToGrowerPayload = (form: GrowerProfileFormState) => ({
    name: form.name.trim(),
    contact: form.contact.trim(),
    email: form.email.trim(),
    language: form.language,
    gender: form.gender,
    dob: form.dob,
    district: form.district.trim(),
    community: form.community.trim(),
    yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
    farmType: form.farmType,
    landOwnershipStatus: form.landOwnershipStatus,
    farmSize: form.farmSize ? Number(form.farmSize) : undefined,
    cropList: form.cropList,
    cropsGrownOther: form.cropsGrownOther.trim(),
    fieldNotes: form.fieldNotes.trim(),
    investmentInterest: form.investmentInterest,
    estimatedCapitalNeed: form.estimatedCapitalNeed ? Number(form.estimatedCapitalNeed) : undefined,
    preferredInvestmentType:
        form.investmentInterest === 'yes' ? form.preferredInvestmentType : undefined,
    hasPreviousInvestment: form.hasPreviousInvestment,
});
