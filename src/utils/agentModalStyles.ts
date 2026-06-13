import { cn } from '@/lib/utils';

/** Base DialogContent shell — full-screen on mobile, bounded on desktop */
export function agentModalShell(...extra: (string | undefined | false)[]) {
  return cn(
    'agent-modal-mobile w-full max-w-[100vw] max-md:h-full max-md:max-h-[100dvh]',
    'max-md:rounded-none overflow-x-hidden flex flex-col p-0',
    ...extra
  );
}

export const agentModalHeader = 'shrink-0 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b';
export const agentModalBody = 'flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 min-h-0';
export const agentModalFooter = cn(
  'agent-action-row shrink-0 border-t px-4 sm:px-6 py-4 gap-3',
  'pb-[max(1rem,env(safe-area-inset-bottom))]'
);
/** Reserve space for the default dialog close button */
export const agentModalCloseClear = 'pr-10 sm:pr-12';
