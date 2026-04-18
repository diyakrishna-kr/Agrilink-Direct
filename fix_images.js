const https = require('https');
const fs = require('fs');

const urls = {
  'onions.jpg': 'https://images.unsplash.com/photo-1621317765181-12502c38466e?w=400&q=80',
  'rice.jpg': 'https://images.unsplash.com/photo-1595982846931-f103b418deab?w=400&q=80'
};

const download = (url, dest) => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };
    
    const get = (urlToFetch) => {
      https.get(urlToFetch, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location);
          return;
        }
        res.pipe(file);
        file.on('finish', () => { 
            file.close(resolve); 
        });
      }).on('error', (err) => {
          fs.unlink(dest, () => resolve(false));
      });
    };
    get(url);
  });
};

async function run() {
  console.log('Fetching unambiguous raw ingredient photos...');
  for (let file in urls) {
    await download(urls[file], 'public/uploads/' + file);
    console.log('Downloaded literal ' + file);
  }
}
run();
