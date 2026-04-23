const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Remove Hero Import
appContent = appContent.replace('import heroImg from "./components/hero.jpg";\n', '');

// Remove bulk imports
const bulkImportsRegex = /import kaImg from "\.\/components\/ka\.png";\n(import [a-zA-Z0-9]+ from "\.\/components\/[a-zA-Z0-9]+\.(jpeg|jpg)";\n)+/g;
appContent = appContent.replace(bulkImportsRegex, '');

// Explicit replace of usages
appContent = appContent.replace('backgroundImage: `url(${heroImg})`', 'backgroundImage: `url(\'/media/hero.jpg\')`');
appContent = appContent.replace('src={kaImg}', 'src="/media/ka.png"');

appContent = appContent.replace(/\{ before: b([0-9]+), after: a([0-9]+) \}/g, '{ before: "/media/before$1.jpeg", after: "/media/after$2.jpeg" }');
appContent = appContent.replace('{ before: "/media/before3.jpeg",', '{ before: "/media/before3.jpg",'); // b3 is .jpg, I noticed it earlier!

// Fixed array replace
const arrReplace = `[
              "/media/img1.jpeg", "/media/img2.jpeg", "/media/img3.jpeg", "/media/img4.jpeg", "/media/img5.jpeg", "/media/img6.jpeg",
              "/media/img7.jpeg", "/media/img8.jpeg", "/media/img9.jpeg", "/media/img10.jpeg", "/media/img11.jpeg", "/media/img1.jpeg",
              "/media/img2.jpeg", "/media/img3.jpeg", "/media/img4.jpeg", "/media/img5.jpeg", "/media/img6.jpeg", "/media/img7.jpeg",
              "/media/img8.jpeg", "/media/img9.jpeg", "/media/img10.jpeg", "/media/img11.jpeg", "/media/img1.jpeg", "/media/img2.jpeg",
              "/media/img3.jpeg", "/media/img4.jpeg", "/media/img5.jpeg", "/media/img6.jpeg", "/media/img7.jpeg", "/media/img8.jpeg",
              "/media/img9.jpeg", "/media/img10.jpeg", "/media/img11.jpeg", "/media/img1.jpeg", "/media/img2.jpeg", "/media/img3.jpeg"
            ]`;

appContent = appContent.replace(/\{\[i1, i2[a-zA-Z0-9, ]+\]/g, '{' + arrReplace);
fs.writeFileSync(appPath, appContent);

const socialPath = path.join(__dirname, 'src', 'components', 'SocialMediaSection.tsx');
let socialContent = fs.readFileSync(socialPath, 'utf8');

const socialImportsRegex = /(import img[0-9]+ from '\.\/img[0-9]+\.jpeg';\n)+/g;
socialContent = socialContent.replace(socialImportsRegex, '');
const socialVidImportsRegex = /(import vid[0-9]+ from '\.\/vid[0-9]+\.mp4';\n)+/g;
socialContent = socialContent.replace(socialVidImportsRegex, '');

socialContent = socialContent.replace(/const BACKGROUND_IMAGES = \[[a-zA-Z0-9, \n]+\];/g, `const BACKGROUND_IMAGES = [
  '/media/img1.jpeg', '/media/img2.jpeg', '/media/img3.jpeg', '/media/img4.jpeg', '/media/img5.jpeg', '/media/img6.jpeg',
  '/media/img7.jpeg', '/media/img8.jpeg', '/media/img9.jpeg', '/media/img10.jpeg', '/media/img11.jpeg', '/media/img1.jpeg',
  '/media/img2.jpeg', '/media/img3.jpeg', '/media/img4.jpeg', '/media/img5.jpeg', '/media/img6.jpeg', '/media/img7.jpeg'
];`);

socialContent = socialContent.replace(/videoUrl: vid([0-9]+),/g, "videoUrl: '/media/vid$1.mp4',");
socialContent = socialContent.replace(/poster: img([0-9]+),/g, "poster: '/media/img$1.jpeg',");

fs.writeFileSync(socialPath, socialContent);
console.log('Update complete!');
