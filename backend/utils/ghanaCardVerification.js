const GHA_REGEX = /^GHA-\d{9}-\d$/;

function normalizeGhanaCardNumber(value) {
    if (!value) return '';
    const compact = String(value).toUpperCase().replace(/\s+/g, '');
    const match = compact.match(/GHA(\d{9})(\d)/);
    if (!match) return String(value).trim().toUpperCase();
    return `GHA-${match[1]}-${match[2]}`;
}

function normalizeName(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function nameTokens(value) {
    return normalizeName(value)
        .split(' ')
        .filter((t) => t.length > 1);
}

function namesMatch(extractedName, formName) {
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

function parseFlexibleDate(value) {
    const trimmed = String(value || '').trim();
    const dmy = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
    if (dmy) {
        let year = Number(dmy[3]);
        if (year < 100) year += year > 30 ? 1900 : 2000;
        const date = new Date(year, Number(dmy[2]) - 1, Number(dmy[1]));
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

function datesMatch(extractedDob, formDob) {
    const a = parseFlexibleDate(extractedDob);
    const b = parseFlexibleDate(formDob);
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * Server-side check that OCR proof matches submitted grower identity fields.
 * Prevents bypassing client validation via direct API calls.
 */
exports.validateGhanaCardOcrProof = (body = {}) => {
    if (!body.verificationConfirmed) {
        return { ok: false, msg: 'Ghana Card verification is required before onboarding.' };
    }

    const ocr = body.ghanaCardOcr;
    if (!ocr || typeof ocr !== 'object') {
        return { ok: false, msg: 'Ghana Card OCR verification proof is missing.' };
    }

    const formId = normalizeGhanaCardNumber(body.ghanaCardNumber);
    const ocrId = normalizeGhanaCardNumber(ocr.idNumber);

    if (!ocrId || !GHA_REGEX.test(ocrId)) {
        return { ok: false, msg: 'Invalid Ghana Card number in verification proof.' };
    }
    if (!formId || !GHA_REGEX.test(formId)) {
        return { ok: false, msg: 'Invalid Ghana Card number on registration form.' };
    }
    if (ocrId !== formId) {
        return { ok: false, msg: 'Ghana Card number does not match the verified card photo.' };
    }

    if (!ocr.name || !body.name || !namesMatch(ocr.name, body.name)) {
        return { ok: false, msg: 'Grower name does not match the verified Ghana Card photo.' };
    }

    if (!ocr.dob || !body.dob || !datesMatch(ocr.dob, body.dob)) {
        return { ok: false, msg: 'Date of birth does not match the verified Ghana Card photo.' };
    }

    return { ok: true };
};

exports.normalizeGhanaCardNumber = normalizeGhanaCardNumber;
