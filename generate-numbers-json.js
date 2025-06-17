const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'project/public/images/numbers');
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.png'))
  .map(f => f);

fs.writeFileSync(
  path.join(dir, 'numbers.json'),
  JSON.stringify(files, null, 2)
);

console.log('numbers.json generated with', files.length, 'files.');