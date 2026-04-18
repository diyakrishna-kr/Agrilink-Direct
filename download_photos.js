const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'public/uploads';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const images = {
    'carrots.jpg': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    'banana.jpg': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80',
    'apple.jpg': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
    'mango.jpg': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
    'milk.jpg': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    'ghee.jpg': 'https://images.unsplash.com/photo-1626202341490-5712c98a39f6?w=400&q=80',
    'spices.jpg': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    'pulses.jpg': 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=400&q=80',
    'paneer.jpg': 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=400&q=80',
    'pomegranate.jpg': 'https://images.unsplash.com/photo-1615485240384-552e40fe6ec8?w=400&q=80',
    'garlic.jpg': 'https://images.unsplash.com/photo-1589927951187-282c063c1f97?w=400&q=80',
    'chilies.jpg': 'https://images.unsplash.com/photo-1588253584673-c0022a1d39f6?w=400&q=80',
    'capsicum.jpg': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80'
};

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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
    console.log('Downloading high-quality product photos...');
    for (const [name, url] of Object.entries(images)) {
        try {
            await download(url, path.join(targetDir, name));
            console.log(`Downloaded: ${name}`);
        } catch (err) {
            console.error(`Failed: ${name} - ${err.message}`);
        }
    }
    console.log('Download complete.');
}

run();
