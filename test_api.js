const https = require('https');

const url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCjd-0wO0XBmasy4yqrwyHRA&key=AIzaSyB6mMhAvL1cXYGOE1qQf81tG2Svn_uy61c';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(data);
  });
}).on('error', (err) => {
  console.error(err);
});
