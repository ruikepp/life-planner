const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
const js = scripts.map(s=>s.replace(/<\/?script>/g,'')).join('\n');
const lines = js.split('\n');

// Search for const without value
for(let i=0;i<lines.length;i++){
  const line = lines[i];
  if(line.match(/const\s+\w+\s*$/)) {
    console.log('Line '+(i+1)+': CONST WITHOUT VALUE: '+line.substring(0,200));
  }
  if(line.match(/const\s+\w+\s*;/)) {
    console.log('Line '+(i+1)+': CONST WITH SEMICOLON: '+line.substring(0,200));
  }
}

// Look for the actual error - use acorn or just try to parse sections
// Let's check if the issue is in ${} template expressions inside PAGES
const pagesStart = js.indexOf('const PAGES');
const pagesEnd = js.indexOf('};', pagesStart);
const pagesCode = js.substring(pagesStart, pagesEnd+2);

// Find all ${} expressions inside template literals
const templateExprs = pagesCode.match(/\$\{[^}]+\}/g);
if(templateExprs) {
  console.log('\nTemplate expressions found in PAGES:');
  templateExprs.forEach(e => console.log('  ', e));
}

// Also look for any standalone 'const' that appears right before 'growth'
const growthLine = lines.findIndex(l => l.includes('growth:`'));
console.log('\ngrowth: is at JS line', growthLine+1);
console.log('Lines around it:');
for(let i=Math.max(0,growthLine-3);i<=growthLine+2;i++){
  console.log((i+1)+': '+lines[i].substring(0,300));
}
