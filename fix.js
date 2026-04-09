const fs = require('fs');
let ts = fs.readFileSync('src/main.ts', 'utf-8');
ts = ts.replace(/\\` x\$\{earned\}\\`/g, '` x${earned}`');
fs.writeFileSync('src/main.ts', ts);
