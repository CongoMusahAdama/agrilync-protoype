import { getLanguagesForRegion } from '@/data/ghanaRegions';

const DIALECT_TO_LANG_CODE: Record<string, string> = {
    Twi: 'tw',
    Fante: 'tw',
    Bono: 'tw',
    Ewe: 'ee',
    Ga: 'ga',
    Dagbani: 'dag',
    Hausa: 'ha',
    Dangme: 'ee',
    Gonja: 'gon',
    Nzema: 'tw',
    Wassa: 'tw',
    Sefwi: 'tw',
    Dagaare: 'dga',
    Waala: 'dga',
    Krobo: 'tw',
};

export function getGrowerDialectLabel(region?: string, language?: string): string {
    if (language && language !== 'English') return language;
    const langs = getLanguagesForRegion(region || '');
    const local = langs.find((l) => l !== 'English' && l !== 'Hausa');
    return local || 'Twi';
}

export function getTranslationLangCode(dialect: string): string {
    return DIALECT_TO_LANG_CODE[dialect] || 'tw';
}

/** Translate English bio to farmer's local dialect (MyMemory free tier). */
export async function translateBioToDialect(text: string, dialect: string): Promise<string> {
    if (!text.trim()) return '';
    const lang = getTranslationLangCode(dialect);
    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
        );
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        return translated && translated !== text ? translated : text;
    } catch {
        return text;
    }
}
