const fs = require('fs');
const code = fs.readFileSync('src/components/MasterDeveloperControl.tsx', 'utf8');

const regex = /on(?:Click|Change|Submit|KeyDown|KeyUp|MouseEnter|MouseLeave)=\s*\{([^}]*)\}/g;
let match;
while ((match = regex.exec(code)) !== null) {
  let content = match[1].trim();
  // if content doesn't start with '() =>' or 'e =>' or '(e) =>' or isn't a single word identifier
  if (!content.startsWith('(') && !content.startsWith('e =>') && !content.includes('=>') && !/^[a-zA-Z0-9_]+$/.test(content)) {
     console.log("SUSPICIOUS: " + content);
  }
}
