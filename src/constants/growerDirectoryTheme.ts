import { growerActionBtn } from '@/constants/growerTheme';

/** Agent Grower Directory — reuses Lync Grower brand tokens */
export {
    GROWER_TABLE,
    growerActionBtn,
    GROWER_BRAND,
} from '@/constants/growerTheme';

export const GROWER_DIRECTORY_HEADER = 'bg-[#7ede56] shadow-md';

export const GROWER_DIRECTORY_HEAD_CELL =
    'text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 bg-[#7ede56] border-r border-white/20 last:border-r-0';

export function growerDirectoryActionBtn(_darkMode: boolean, solid = false) {
    return growerActionBtn(solid, 'sm');
}

export function growerDirectoryMobileActionBtn(_darkMode: boolean) {
    return 'bg-[#7ede56]/12 text-[#002f37] border border-[#7ede56]/30';
}

export const GROWER_DIRECTORY_ADD_BTN =
    'h-11 flex-1 sm:flex-none px-6 bg-[#7ede56] hover:bg-[#6bcb4b] text-white shadow-lg shadow-[#7ede56]/25 border-none font-black';

export const GROWER_DIRECTORY_LEGEND_ICON = (_darkMode: boolean) =>
    'bg-[#7ede56]/12 text-[#002f37]';
