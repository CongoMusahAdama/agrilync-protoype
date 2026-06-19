/** Lync Grower brand — dark teal + lime (matches role badge) */

export const GROWER_BRAND = {

    navy: '#002f37',

    lime: '#7ede56',

    limeHover: '#6bcb4b',

} as const;



/** Grower dashboard tables — lime header bar, white column labels */

export const GROWER_TABLE = {

    header: 'bg-[#7ede56]',

    headRow: 'border-none hover:bg-transparent',

    headCell:

        'text-white font-black text-[10px] uppercase tracking-widest py-4 px-4 sm:px-6 bg-[#7ede56] border-r border-white/20 last:border-r-0',

    bodyRow: 'border-b border-gray-100 hover:bg-[#7ede56]/5',

    bodyCell: 'text-gray-800 font-medium text-sm py-4 px-4 sm:px-6',

} as const;



export const GROWER_TAB_ACTIVE =

    'border-[#7ede56] text-white bg-[#7ede56]';



export const GROWER_TAB_INACTIVE =

    'border-transparent text-gray-500 hover:text-[#002f37] hover:bg-[#7ede56]/10';



export function growerActionBtn(solid = false, size: 'sm' | 'md' | 'lg' = 'sm') {

    const heights = { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-12 px-5' };

    const base = `inline-flex items-center justify-center gap-2 rounded-lg font-black uppercase tracking-wide transition-colors ${heights[size]}`;

    if (solid) {

        return `${base} bg-[#7ede56] text-white hover:bg-[#6bcb4b] shadow-md shadow-[#7ede56]/20 border-0 text-[10px]`;

    }

    return `${base} bg-white text-[#002f37] hover:bg-[#7ede56]/10 border border-[#7ede56]/50 text-[10px]`;

}



export function growerActionBtnRow() {

    return 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#7ede56] text-white hover:bg-[#6bcb4b] px-4 py-3.5 text-xs font-black uppercase tracking-wide transition-colors min-h-[48px] border-0 shadow-md shadow-[#7ede56]/20';

}



export function growerActionBtnRowOutline() {

    return 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#7ede56] bg-white hover:bg-[#7ede56]/10 text-[#002f37] px-4 py-3.5 text-xs font-black uppercase tracking-wide transition-colors min-h-[48px]';

}



/** Sidebar — grower uses lime shell (distinct from agent dashboard) */
export const GROWER_SIDEBAR_BG = 'bg-[#7ede56]';

/** Sidebar nav item — grower only (lime sidebar) */
export function growerNavItemClass(isActive: boolean) {
    return isActive
        ? 'bg-[#002f37] text-white shadow-lg shadow-black/15'
        : 'text-white/90 hover:text-white hover:bg-white/15';
}

export function growerNavIconClass(isActive: boolean) {
    return isActive ? 'text-white' : 'text-white/80 group-hover:text-white';
}

export const GROWER_NAV_SECTION_LABEL = 'text-white/55';

