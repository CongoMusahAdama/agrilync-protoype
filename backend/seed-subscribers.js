const mongoose = require('mongoose');
const Subscriber = require('./models/Subscriber');
const dotenv = require('dotenv');

dotenv.config();

const emails = [
  "izinatu7@gmail.com",
  "abubakargariba80@gmail.com",
  "kwakuasihene@gmail.com",
  "mopaitry60@gmail.com",
  "bwfn2000@gmail.com",
  "alexanderdagadu@gmail.com",
  "agrilync@gmail.com",
  "hannahq855@gmail.com",
  "opatae65@gmail.com",
  "adubeaquai@gmail.com",
  "gabrielwontumi@gmail.com",
  "sb83321@gmail.com",
  "gyebievansk@gmail.com",
  "naaodofley94@gmail.com",
  "mrprincekofiasante.123@gmail.com",
  "isabella@aims.edu.gh",
  "adamsdauda749@gmail.com",
  "kevgregsouza@gmail.com",
  "raphaelnewton8@gmail.com",
  "evangelistbible049@icloud.com",
  "cbkwarteng6798@gmail.com",
  "johnsondadzie9@gmail.com",
  "enochtakyidade@gmail.com",
  "dakyagaprosper@gmail.com",
  "oduratemeng07@gmail.com",
  "fridayampomah@gmail.com"
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync');
        console.log('Connected to DB');

        let added = 0;
        for (const email of emails) {
            const exists = await Subscriber.findOne({ email });
            if (!exists) {
                await new Subscriber({ email }).save();
                added++;
                console.log(`Added: ${email}`);
            } else {
                console.log(`Skipped (already exists): ${email}`);
            }
        }
        
        console.log(`\nFinished! Successfully added ${added} new subscribers to the mailing list.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
