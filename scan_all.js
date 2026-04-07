const fs = require('fs');
const path = require('path');

function safeEncode(str) {
  return encodeURIComponent(str).replace(/'/g, '%27');
}

function scanCategory(folderName, tagName) {
  const absBase = path.resolve('image/' + folderName);
  if (!fs.existsSync(absBase)) { console.log('SKIP: ' + folderName); return null; }
  const dirs = fs.readdirSync(absBase, {withFileTypes: true})
    .filter(d => d.isDirectory() && d.name !== '素材').map(d => d.name).sort();
  const entries = [];
  dirs.forEach(dirName => {
    const dirPath = path.join(absBase, dirName);
    const subDirs = fs.readdirSync(dirPath, {withFileTypes: true})
      .filter(d => d.isDirectory() && d.name !== '素材');
    const directImages = fs.readdirSync(dirPath)
      .filter(f => /\.(jpg|png|gif|mp4|webp)$/i.test(f) && fs.statSync(path.join(dirPath, f)).isFile()).sort();
    if (directImages.length > 0) {
      entries.push({ images: directImages.map(f => 'image/' + safeEncode(folderName) + '/' + safeEncode(dirName) + '/' + safeEncode(f)), title: dirName.replace(/^\d+_/, ''), tags: [tagName], desc: '' });
    } else if (subDirs.length === 0) {
      /* Empty folder — still create entry (may have YouTube link added manually) */
      entries.push({ images: [], title: dirName.replace(/^\d+_/, ''), tags: [tagName], desc: '' });
    }
    subDirs.forEach(sub => {
      const subPath = path.join(dirPath, sub.name);
      const subImages = fs.readdirSync(subPath)
        .filter(f => /\.(jpg|png|gif|mp4|webp)$/i.test(f) && fs.statSync(path.join(subPath, f)).isFile()).sort();
      if (subImages.length > 0) {
        entries.push({ images: subImages.map(f => 'image/' + safeEncode(folderName) + '/' + safeEncode(dirName) + '/' + safeEncode(sub.name) + '/' + safeEncode(f)), title: dirName.replace(/^\d+_/, '') + '\u2014' + sub.name, tags: [tagName], desc: '' });
      }
    });
  });
  return entries;
}

function buildArrayStr(entries, tagName) {
  let js = '[\n';
  entries.forEach((e, i) => {
    js += '    {\n      images: [\n';
    e.images.forEach((img, j) => { js += "        '" + img + "'" + (j < e.images.length - 1 ? ',' : '') + '\n'; });
    js += '      ],\n';
    js += "      title: '" + e.title.split("'").join("\\'") + "',\n";
    js += "      tags: ['" + tagName + "'],\n      desc: ''\n    }" + (i < entries.length - 1 ? ',' : '') + '\n';
  });
  js += '  ]';
  return js;
}

function findMatchingBracket(str, start) {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function replaceArray(data, key, newArrayStr) {
  const searchKey = key + ': [';
  const start = data.indexOf(searchKey);
  if (start === -1) { console.log('Key not found: ' + key); return data; }
  const bracketStart = data.indexOf('[', start);
  const bracketEnd = findMatchingBracket(data, bracketStart);
  return data.substring(0, start + key.length + 2) + newArrayStr + data.substring(bracketEnd + 1);
}

// Categories mapping — folder names updated to match actual filesystem
const categories = [
  { folder: '01_GRAPHIC DESIGN', tag: '\u5e73\u9762\u8a2d\u8a08', key: 'art' },
  { folder: '02_Gaming Creatives', tag: '\u904a\u6232\u8996\u89ba', key: 'marketing' },
  { folder: '03_EVENT PLANNING', tag: '\u6d3b\u52d5\u7b56\u5283', key: 'video' },
  { folder: '04_MOTION GRAPHICS', tag: '\u52d5\u614b\u5f71\u50cf', key: 'ecommerce' },
  { folder: '05_WEB DESIGN', tag: '\u7db2\u9801\u8a2d\u8a08', key: 'temple' },
  { folder: '06_BRAND MERCHANDISE', tag: '\u5468\u908a\u88fd\u4f5c', key: 'digital' }
];

let data = fs.readFileSync('js/data.js', 'utf8');

// For art category, preserve existing descriptions
const artStart = data.indexOf('art: [');
const mktStart = data.indexOf('marketing: [');
const existingArtSection = data.substring(artStart, mktStart);
const existingDescs = {};
const lines = existingArtSection.split('\n');
let curTitle = '', curDesc = '';
for (let line of lines) {
  const tm = line.match(/title: '(.+?)'/);
  if (tm) curTitle = tm[1];
  const dm = line.match(/desc: '(.+)'/);
  if (dm) curDesc = dm[1];
  if (line.trim() === '},' || line.trim() === '}') {
    if (curTitle && curDesc) existingDescs[curTitle] = curDesc;
    curTitle = ''; curDesc = '';
  }
}

// Also preserve marketing descriptions
const vidStart = data.indexOf('video: [');
const existingMktSection = data.substring(mktStart, vidStart);
const existingMktDescs = {};
const mktLines = existingMktSection.split('\n');
curTitle = ''; curDesc = '';
for (let line of mktLines) {
  const tm = line.match(/title: '(.+?)'/);
  if (tm) curTitle = tm[1];
  const dm = line.match(/desc: '(.+)'/);
  if (dm) curDesc = dm[1];
  if (line.trim() === '},' || line.trim() === '}') {
    if (curTitle && curDesc) existingMktDescs[curTitle] = curDesc;
    curTitle = ''; curDesc = '';
  }
}

categories.forEach(c => {
  const entries = scanCategory(c.folder, c.tag);
  if (!entries) return;
  
  // Restore existing descriptions
  const descMap = c.key === 'art' ? existingDescs : c.key === 'marketing' ? existingMktDescs : {};
  entries.forEach(e => {
    if (descMap[e.title]) e.desc = descMap[e.title];
  });
  
  // Build and replace
  let js = '[\n';
  entries.forEach((e, i) => {
    js += '    {\n      images: [\n';
    e.images.forEach((img, j) => { js += "        '" + img + "'" + (j < e.images.length - 1 ? ',' : '') + '\n'; });
    js += '      ],\n';
    js += "      title: '" + e.title.split("'").join("\\'") + "',\n";
    js += "      tags: ['" + c.tag + "'],\n";
    js += "      desc: '" + (e.desc || '').replace(/'/g, "\'") + "'\n";
    js += '    }' + (i < entries.length - 1 ? ',' : '') + '\n';
  });
  js += '  ]';
  
  data = replaceArray(data, c.key, js);
  console.log(c.key + ' (' + c.folder + '): ' + entries.length + ' entries');
});

fs.writeFileSync('js/data.js', data, 'utf8');
console.log('All categories updated!');
