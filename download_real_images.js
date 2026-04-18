const https = require('https');
const fs = require('fs');

const urls = {
  'onions.jpg': 'https://images.unsplash.com/photo-1518977822558-757A3DAF01B6?w=400&q=80',
  'tomatoes.jpg': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  'grapes.jpg': 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?w=400&q=80',
  'wheat.jpg': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  'rice.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&q=80'
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
          console.error(err);
      });
    };
    get(url);
  });
};

async function run() {
  console.log('Downloading real Unsplash images locally...');
  for (let file in urls) {
    await download(urls[file], 'public/uploads/' + file);
    console.log('Downloaded ' + file);
  }
  console.log('Done.');
}
run();
