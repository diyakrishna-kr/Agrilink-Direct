const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'public/uploads';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const products = [
    { name: 'onions.jpg', kw: 'onion' },
    { name: 'tomatoes.jpg', kw: 'tomato' },
    { name: 'grapes.jpg', kw: 'grapes' },
    { name: 'wheat_lokwan.jpg', kw: 'wheat' },
    { name: 'rice_basmati.jpg', kw: 'rice' },
    { name: 'potatoes_desi.jpg', kw: 'potato' },
    { name: 'cabbage_green.jpg', kw: 'cabbage' },
    { name: 'cauliflower.jpg', kw: 'cauliflower' },
    { name: 'carrots.jpg', kw: 'carrot' },
    { name: 'spinach.jpg', kw: 'spinach' },
    { name: 'eggplant.jpg', kw: 'eggplant' },
    { name: 'garlic.jpg', kw: 'garlic' },
    { name: 'green_chilies.jpg', kw: 'chili' },
    { name: 'capsicum.jpg', kw: 'capsicum' },
    { name: 'lady_finger.jpg', kw: 'okra' },
    { name: 'apple_kashmiri.jpg', kw: 'apple' },
    { name: 'apple_himachal.jpg', kw: 'red,apple' },
    { name: 'banana_robusta.jpg', kw: 'banana' },
    { name: 'banana_elaichi.jpg', kw: 'yellow,banana' },
    { name: 'mango_alphonso.jpg', kw: 'mango' },
    { name: 'mango_kesar.jpg', kw: 'ripe,mango' },
    { name: 'cherries.jpg', kw: 'cherry' },
    { name: 'peaches.jpg', kw: 'peach' },
    { name: 'papaya.jpg', kw: 'papaya' },
    { name: 'pomegranate.jpg', kw: 'pomegranate' },
    { name: 'wheat_sharbati.jpg', kw: 'grain,wheat' },
    { name: 'rice_sonamasoori.jpg', kw: 'grain,rice' },
    { name: 'bajra.jpg', kw: 'millet' },
    { name: 'jowar.jpg', kw: 'sorghum' },
    { name: 'groundnuts.jpg', kw: 'peanuts' },
    { name: 'yellow_dal.jpg', kw: 'pulses' },
    { name: 'red_lentils.jpg', kw: 'lentils' },
    { name: 'chickpeas.jpg', kw: 'chickpeas' },
    { name: 'black_gram.jpg', kw: 'beans' },
    { name: 'black_pepper.jpg', kw: 'pepper' },
    { name: 'cardamom.jpg', kw: 'cardamom' },
    { name: 'cloves.jpg', kw: 'cloves' },
    { name: 'cinnamon.jpg', kw: 'cinnamon' },
    { name: 'nutmeg.jpg', kw: 'nutmeg' },
    { name: 'milk_cow.jpg', kw: 'milk' },
    { name: 'milk_buffalo.jpg', kw: 'glass,milk' },
    { name: 'ghee.jpg', kw: 'oil' },
    { name: 'butter.jpg', kw: 'butter' },
    { name: 'paneer.jpg', kw: 'cheese' }
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error('Status: ' + res.statusCode));
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
}

async function run() {
    console.log('Fetching 44 UNIQUE images via LoremFlickr with locks...');
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const url = `https://loremflickr.com/400/300/${item.kw}?lock=${i+100}`;
        const dest = path.join(targetDir, item.name);
        try {
            await download(url, dest);
            console.log(`Downloaded: ${item.name} (lock ${i+100})`);
        } catch (err) {
            console.error(`Failed: ${item.name} - ${err.message}`);
        }
    }
    console.log('Finished downloading all assets.');
}

run();
