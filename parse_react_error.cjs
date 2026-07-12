const fs = require('fs');
const code = fs.readFileSync('src/components/MasterDeveloperControl.tsx', 'utf8');

// I'll just check if there's any bare call to set... or addToast
let lines = code.split('\n');
let insideComponent = false;
let depth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('export const MasterDeveloperControl')) {
    insideComponent = true;
  }
  if (!insideComponent) continue;

  if (line.includes('return (') || line.includes('return (')) {
     // inside JSX
  }
}
