/**
 * Import newsletter subscribers from a fixed batch (dedupe by email).
 * Usage: node backend/scripts/import-subscribers-batch.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Subscriber = require('../models/Subscriber');
const { normalizePhone } = require('../utils/smsService');

const RAW_SUBSCRIBERS = [
    { name: 'Bernard Tetteh Kabutey', email: 'bernardtettehkabutey@gmail.com', phone: '+233243536011' },
    { name: 'Matt Brown', email: 'matt@zerohrs.com', phone: '+16263944934' },
    { name: 'Ernestina Gyamfi', email: 'ernestinag215@gmail.com', phone: '+233553954091' },
    { name: 'Faustinus Sherif Donyong', email: 'fangbanye@gmail.com', phone: '+233593288153' },
    { name: 'Adu Evans Gyabaah', email: 'eadugyabaah@gmail.com', phone: '+233551310862' },
    { name: 'Francis Annan', email: 'francisannan196@gmail.com', phone: '+447872639982' },
    { name: 'C. Nartey', email: 'delma.farms@accra.org.gh', phone: '+233544077744' },
    { name: 'Bernard Sarbeng', email: 'sarbengbernard@gmail.com', phone: '+233249838000' },
    { name: 'Raphael Menyawovor', email: 'otherteddybare@gmail.com', phone: '+233206608842' },
    { name: 'Malik Owusu Antwi', email: 'pay4youth2001@gmail.com', phone: '+233244882298' },
    { name: 'Janette Sarfo', email: 'sarfojanet930@gmail.com', phone: '+233257404987' },
    { name: 'George', email: 'asareotibugeorge@gmail.com', phone: '+233544794820' },
    { name: 'Nyarkoa Boadua', email: 'opokupatricia2000@gmail.com', phone: '+233548580402' },
    { name: 'Akutsah Ebenezer', email: 'akutsahebenezer83@gmail.com', phone: '+233556653683' },
    { name: 'Agnes Boateng', email: 'boatengagnes940@gmail.com', phone: '+233248918012' },
    { name: 'Isaac Adjei', email: 'iadjei39@gmail.com', phone: '+233243642999' },
    { name: 'Isaac Adjei', email: 'ikness39@gmail.com', phone: '+233243642999' },
    { name: 'Ramadan', email: 'daudalaramadan@gmail.com', phone: '+233500796856' },
    { name: 'Eugene Micah', email: 'micaheugene3@gmail.com', phone: '+233592754359' },
    { name: 'Henry Klevor', email: 'iamhenryklevor@gmail.com', phone: '+233553424972' },
    { name: 'Selasi Dzeamesi', email: 'selasidzeamesi82@gmail.com', phone: '+233547601618' },
    { name: 'Workout _with PhiLL', email: 'mrcubex7@gmail.com', phone: '+233246065443' },
    { name: 'KOFI NYAME JUNIOR', email: 'juniornyamekofi@gmail.com', phone: '+233241071733' },
    { name: 'Lumbani Kalimamwendo', email: 'kalimamwendolumbani@gmail.com', phone: '+265880044272' },
    { name: 'Ibrahim Kachallah', email: 'iykachallah@gmail.com', phone: '+2347034727835' },
    { name: 'kekeli Avortri', email: 'opal.kelli@gmail.com', phone: '+233202646161' },
    { name: 'Desmond Boadu', email: 'antwiosei565@gmail.com', phone: '+233247550611' },
    { name: 'Opoku Prince Twum', email: 'opprtwum95@gmail.com', phone: '+233542026503' },
    { name: 'Emmanuel Lucky Ardey', email: 'emmanuelardey60@gmail.com', phone: '+233552870170' },
    { name: 'Cynthia Awewura Abavare', email: 'cwabavare@gmail.com', phone: '+233545557283' },
    { name: 'Prince Oduro', email: 'princeoduro.dev@gmail.com', phone: '+233558446017' },
    { name: 'Papa Kofi Boahen', email: 'humblepapa1234@gmail.com', phone: '+233538966851' },
    { name: 'Emmanuel Asante Somuah', email: 'emmanuelsomuah94@gmail.com', phone: '+233273505795' },
    { name: 'Congo Musah Adama', email: 'amusahcongo@gmail.com', phone: '' },
    { name: 'AgriLync Nexus', email: 'agrilync@gmail.com', phone: '' },
];

const cleanPhone = (phone) => {
    const raw = String(phone || '').trim();
    if (!raw || raw === '—' || raw === '-') return '';
    const normalized = normalizePhone(raw);
    return normalized.length >= 10 ? normalized : raw.replace(/\s/g, '');
};

const normalizeRow = (row) => ({
    name: String(row.name || '').trim(),
    email: String(row.email || '').trim().toLowerCase(),
    phone: cleanPhone(row.phone),
});

async function run() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const seenEmails = new Set();
    const seenPhones = new Map();
    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const raw of RAW_SUBSCRIBERS) {
        const row = normalizeRow(raw);
        if (!row.email) {
            console.log('Skipped (no email):', raw.name);
            skipped++;
            continue;
        }

        if (seenEmails.has(row.email)) {
            console.log(`Skipped duplicate in batch (email): ${row.email}`);
            skipped++;
            continue;
        }
        seenEmails.add(row.email);

        if (row.phone && seenPhones.has(row.phone)) {
            console.log(`Note: shared phone ${row.phone} — also used by ${seenPhones.get(row.phone)} (${row.email})`);
        }
        if (row.phone) seenPhones.set(row.phone, row.email);

        const existing = await Subscriber.findOne({ email: row.email });
        if (existing) {
            let changed = false;
            if (row.name && !existing.name) {
                existing.name = row.name;
                changed = true;
            }
            if (row.phone && (!existing.phone || existing.phone === 'null')) {
                existing.phone = row.phone;
                changed = true;
            }
            if (existing.source === 'website') {
                existing.source = 'import-batch';
            }
            if (changed) {
                await existing.save();
                updated++;
                console.log(`Updated: ${row.email}`);
            } else {
                console.log(`Already exists: ${row.email}`);
                skipped++;
            }
            continue;
        }

        await Subscriber.create({
            name: row.name,
            email: row.email,
            phone: row.phone,
            source: 'import-batch',
        });
        added++;
        console.log(`Added: ${row.name} <${row.email}>`);
    }

    const total = await Subscriber.countDocuments();
    const withPhone = await Subscriber.countDocuments({ phone: { $exists: true, $nin: [null, ''] } });

    console.log('\n--- Summary ---');
    console.log(`Added:   ${added}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total subscribers in DB: ${total} (${withPhone} with phone)`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
