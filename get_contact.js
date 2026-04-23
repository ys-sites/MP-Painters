import * as https from 'https';
https.get('https://raw.githubusercontent.com/ys-sites/KA-Peinture/main/src/App.tsx', (res) => {
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => console.log(data.split('<Card className=\"!p-6 md:!p-10')[1].substring(0, 3000)));
});
