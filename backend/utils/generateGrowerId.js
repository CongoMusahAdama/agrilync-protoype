/** Canonical AgriLync grower system ID: LYG-######## (8 digits, not Ghana Card). */
const GROWER_ID_PATTERN = /^LYG-\d{8}$/;

const isValidGrowerSystemId = (id) => GROWER_ID_PATTERN.test(String(id || '').trim().toUpperCase());

const isGhanaCardDerivedGrowerId = (id, ghanaCardNumber) => {
    if (!id) return true;

    const idStr = String(id).trim().toUpperCase();
    if (/^LYG-GHA-/i.test(idStr)) return true;

    const card = ghanaCardNumber ? String(ghanaCardNumber).trim().toUpperCase() : '';
    if (card) {
        if (idStr === card || idStr === `LYG-${card}`) return true;
        const cardDigits = card.replace(/[^0-9]/g, '');
        if (cardDigits && idStr.replace(/[^0-9]/g, '').includes(cardDigits)) return true;
    }

    return !isValidGrowerSystemId(idStr);
};

const generateUniqueGrowerId = async (FarmerModel) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
        const num = Math.floor(10000000 + Math.random() * 90000000);
        const id = `LYG-${num}`;
        const exists = await FarmerModel.findOne({ id }).select('_id').lean();
        if (!exists) return id;
    }

    const tail = Date.now().toString().slice(-8);
    return `LYG-${tail}`;
};

module.exports = {
    GROWER_ID_PATTERN,
    isValidGrowerSystemId,
    isGhanaCardDerivedGrowerId,
    generateUniqueGrowerId,
};
