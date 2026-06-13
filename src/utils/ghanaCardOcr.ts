export type GhanaCardExtracted = {
    idNumber?: string;
    name?: string;
    dob?: string;
};

export type GhanaCardFormFields = {
    name: string;
    dob: string;
    ghanaCardNumber: string;
};

export type GhanaCardValidationResult = {
    valid: boolean;
    extracted: GhanaCardExtracted;
    errors: string[];
};

const GHA_REGEX = /^GHA-\d{9}-\d$/;

export function normalizeGhanaCardNumber(value: string): string {
    const compact = value.toUpperCase().replace(/\s+/g, '');
    const match = compact.match(/GHA(\d{9})(\d)/);
    if (!match) return value.trim().toUpperCase();
    return `GHA-${match[1]}-${match[2]}`;
}

function normalizeName(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function nameTokens(value: string): string[] {
    return normalizeName(value)
        .split(' ')
        .filter((t) => t.length > 1);
}

/** Require surname + at least one other name part to appear on the card OCR text. */
export function namesMatch(extractedName: string, formName: string): boolean {
    const extractedTokens = nameTokens(extractedName);
    const formTokens = nameTokens(formName);
    if (formTokens.length === 0 || extractedTokens.length === 0) return false;

    const extractedJoined = normalizeName(extractedName);
    const formJoined = normalizeName(formName);
    if (extractedJoined.includes(formJoined) || formJoined.includes(extractedJoined)) {
        return true;
    }

    const matched = formTokens.filter((token) =>
        extractedTokens.some((et) => et === token || et.includes(token) || token.includes(et))
    );
    return matched.length >= Math.min(2, formTokens.length);
}

function parseFlexibleDate(value: string): Date | null {
    const trimmed = value.trim();
    const dmy = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
    if (dmy) {
        let [, d, m, y] = dmy;
        let year = Number(y);
        if (year < 100) year += year > 30 ? 1900 : 2000;
        const date = new Date(year, Number(m) - 1, Number(d));
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
        const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function datesMatch(extractedDob: string, formDob: string): boolean {
    const a = parseFlexibleDate(extractedDob);
    const b = parseFlexibleDate(formDob);
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function parseGhanaCardOcrText(text: string): GhanaCardExtracted {
    const upper = text.toUpperCase();

    const idRaw =
        upper.match(/GHA[\s-]?\d{9}[\s-]?\d/)?.[0] ||
        text.match(/GHA-\d{9}-\d/i)?.[0];
    const idNumber = idRaw ? normalizeGhanaCardNumber(idRaw) : undefined;

    const dobRaw =
        text.match(/(?:DATE\s*OF\s*BIRTH|DOB|BIRTH)[:\s]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i)?.[1] ||
        text.match(/(?:DATE\s*OF\s*BIRTH|DOB|BIRTH)[:\s]*(\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2})/i)?.[1];

    let name: string | undefined;

    const surname = text.match(/(?:SURNAME|Surname)[:\s]*([A-Za-z][A-Za-z\s'-]{1,60})/i)?.[1]?.trim();
    const firstNames = text.match(/(?:FIRST\s*NAMES?|Given\s*Names?|Forenames?)[:\s]*([A-Za-z][A-Za-z\s'-]{1,80})/i)?.[1]?.trim();
    if (surname || firstNames) {
        name = [firstNames, surname].filter(Boolean).join(' ').trim();
    }

    if (!name) {
        const legacyName = text.match(/(?:Name|NAME)[:\s]*([A-Za-z][A-Za-z\s'-]{2,80})/i)?.[1]?.trim();
        name = legacyName;
    }

    return {
        idNumber,
        name,
        dob: dobRaw?.trim(),
    };
}

export function validateGhanaCardOcr(
    ocrText: string,
    form: GhanaCardFormFields
): GhanaCardValidationResult {
    const extracted = parseGhanaCardOcrText(ocrText);
    const errors: string[] = [];
    const formId = normalizeGhanaCardNumber(form.ghanaCardNumber || '');

    if (!extracted.idNumber) {
        errors.push('Could not read a Ghana Card number from the front photo. Use a clear image of the front of the card.');
    } else if (!GHA_REGEX.test(extracted.idNumber)) {
        errors.push('The photo does not show a valid Ghana Card number (GHA-XXXXXXXXX-X).');
    } else if (!formId) {
        errors.push('Enter the Ghana Card number in step 1 before uploading the card photo.');
    } else if (extracted.idNumber !== formId) {
        errors.push(
            `Ghana Card number mismatch: photo shows ${extracted.idNumber}, but you entered ${formId}.`
        );
    }

    if (!extracted.name) {
        errors.push('Could not read the name from the Ghana Card photo.');
    } else if (!form.name?.trim()) {
        errors.push('Enter the grower name in step 1 before uploading the Ghana Card.');
    } else if (!namesMatch(extracted.name, form.name)) {
        errors.push(
            `Name mismatch: card shows "${extracted.name}" but you entered "${form.name}".`
        );
    }

    if (!extracted.dob) {
        errors.push('Could not read the date of birth from the Ghana Card photo.');
    } else if (!form.dob) {
        errors.push('Enter the date of birth in step 1 before uploading the Ghana Card.');
    } else if (!datesMatch(extracted.dob, form.dob)) {
        errors.push(
            `Date of birth mismatch: card shows "${extracted.dob}" but you entered "${form.dob}".`
        );
    }

    return {
        valid: errors.length === 0,
        extracted,
        errors,
    };
}
