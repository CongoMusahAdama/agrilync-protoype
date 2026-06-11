import React from 'react';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Leaf, LucideIcon } from 'lucide-react';

export const ONBOARDING_FIELD_LABEL = 'text-sm font-semibold text-[#002f37]';
export const ONBOARDING_INPUT =
  'h-12 bg-white border border-gray-200/90 rounded-xl font-medium text-[15px] text-gray-900 placeholder:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-[#7ede56]/50 focus-visible:border-[#7ede56]/50 transition-shadow';
export const ONBOARDING_SELECT = `${ONBOARDING_INPUT} font-medium`;
export const ONBOARDING_TEXTAREA =
  'min-h-[110px] bg-white border border-gray-200/90 rounded-xl p-4 font-medium text-[15px] placeholder:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-[#7ede56]/50';

/** Form uses full width of the main panel on desktop (sidebar + wide modal). */
export const ONBOARDING_CONTENT_WIDTH = 'w-full max-w-none';

export const OnboardingFieldLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({
  children,
  hint,
}) => (
  <div className="space-y-0.5">
    <Label className={ONBOARDING_FIELD_LABEL}>{children}</Label>
    {hint && <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>}
  </div>
);

export const OnboardingFormCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_24px_-4px_rgba(0,47,55,0.08)] p-5 sm:p-7 lg:p-8 xl:p-10 space-y-6 lg:space-y-7 ${className}`}
  >
    {children}
  </div>
);

interface StepSectionProps {
  step: number;
  total?: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const OnboardingStepSection: React.FC<StepSectionProps> = ({
  step,
  total = 4,
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start gap-4 pb-2">
    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#065f46]/15 to-[#7ede56]/10 flex items-center justify-center ring-1 ring-[#065f46]/10">
      <Icon className="h-5 w-5 text-[#065f46]" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-[#065f46] tracking-wide">
        Step {step} of {total}
      </p>
      <h3 className="text-xl lg:text-2xl font-bold text-[#002f37] tracking-tight mt-0.5">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-2xl">{description}</p>
    </div>
  </div>
);

export interface OnboardingStep {
  id: number;
  label: string;
  sub: string;
  icon: LucideIcon;
}

interface MobileStepProgressProps {
  steps: OnboardingStep[];
  currentStep: number;
  onStepClick: (id: number) => void;
}

export const OnboardingMobileProgress: React.FC<MobileStepProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => (
  <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 shrink-0">
    <div className="flex items-center justify-between gap-2 mb-3">
      {steps.map((s) => {
        const done = currentStep > s.id;
        const active = currentStep === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepClick(s.id)}
            className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
          >
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                active
                  ? 'bg-[#065f46] text-white shadow-md ring-4 ring-[#065f46]/15'
                  : done
                    ? 'bg-[#7ede56] text-[#002f37]'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : s.id}
            </div>
            <span
              className={`text-[10px] font-semibold truncate w-full text-center ${
                active ? 'text-[#002f37]' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#065f46] to-[#7ede56] rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / steps.length) * 100}%` }}
      />
    </div>
  </div>
);

interface SidebarProps {
  steps: OnboardingStep[];
  currentStep: number;
  onStepClick: (id: number) => void;
}

export const OnboardingSidebar: React.FC<SidebarProps> = ({ steps, currentStep, onStepClick }) => (
  <div className="hidden lg:flex w-[280px] xl:w-[300px] shrink-0 bg-white border-r border-gray-100 flex-col">
    <div className="px-6 pt-8 pb-6 border-b border-gray-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-[#065f46] flex items-center justify-center shadow-sm">
          <Leaf className="h-5 w-5 text-[#7ede56]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#002f37]">Farmer onboarding</p>
          <p className="text-xs text-gray-500">4 simple steps</p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#065f46] to-[#7ede56] rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
    <nav className="flex-1 px-4 py-5 space-y-1.5">
      {steps.map((s) => {
        const active = currentStep === s.id;
        const done = currentStep > s.id;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepClick(s.id)}
            className={`w-full flex items-center gap-3 py-3.5 px-4 rounded-xl text-left transition-all ${
              active
                ? 'bg-[#065f46]/8 text-[#002f37] ring-1 ring-[#065f46]/15 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div
              className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                active
                  ? 'bg-[#065f46] text-white shadow-sm'
                  : done
                    ? 'bg-[#7ede56]/25 text-[#065f46]'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${active ? 'text-[#002f37]' : ''}`}>{s.label}</p>
              <p className="text-xs text-gray-400 truncate">{s.sub}</p>
            </div>
          </button>
        );
      })}
    </nav>
  </div>
);
