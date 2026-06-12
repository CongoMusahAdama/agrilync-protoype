/** Dedicated physical/digital card serial — separate from grower system ID (LYG-########). */
const CARD_NUMBER_PATTERN = /^AGL-C-\d{8}$/;

const isValidDigitalCardNumber = (value) =>
    CARD_NUMBER_PATTERN.test(String(value || '').trim().toUpperCase());

const generateUniqueDigitalCardNumber = async (FarmerModel) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
        const num = Math.floor(10000000 + Math.random() * 90000000);
        const cardNumber = `AGL-C-${num}`;
        const exists = await FarmerModel.findOne({ digitalCardNumber: cardNumber }).select('_id').lean();
        if (!exists) return cardNumber;
    }
    return `AGL-C-${Date.now().toString().slice(-8)}`;
};

const issueDigitalCardIfNeeded = async (farmerDoc) => {
    if (!farmerDoc || farmerDoc.status !== 'active') return farmerDoc;

    if (farmerDoc.digitalCardNumber && isValidDigitalCardNumber(farmerDoc.digitalCardNumber)) {
        if (!farmerDoc.digitalCardGenerated) {
            farmerDoc.digitalCardGenerated = true;
            if (!farmerDoc.digitalCardIssuedAt) farmerDoc.digitalCardIssuedAt = new Date();
        }
        return farmerDoc;
    }

    const FarmerModel = farmerDoc.constructor;
    farmerDoc.digitalCardNumber = await generateUniqueDigitalCardNumber(FarmerModel);
    farmerDoc.digitalCardIssuedAt = new Date();
    farmerDoc.digitalCardGenerated = true;
    return farmerDoc;
};

module.exports = {
    CARD_NUMBER_PATTERN,
    isValidDigitalCardNumber,
    generateUniqueDigitalCardNumber,
    issueDigitalCardIfNeeded,
};
