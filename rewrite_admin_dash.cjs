const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace the navigation wrapper up to the end of the tabs
const startNav = `        {/* Dynamic Navigation Controllers with strict RBAC */}`;
const endNav = `        </div>\n      </div>`;
const startIndex = code.indexOf(startNav);
const endIndex = code.indexOf(endNav) + endNav.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + `      </div>` + code.substring(endIndex);
}

// Replace the top div wrapper
const oldRoot = `<div className="space-y-8" dir="rtl" id="admin-dashboard-root">`;
const newRoot = `<div className="flex bg-[#030712] min-h-screen text-white" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <GlobalSidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />
      <div className="flex-1 overflow-x-hidden p-6 md:p-8 space-y-8" id="admin-dashboard-root">`;
code = code.replace(oldRoot, newRoot);

// And we need to add an extra closing div at the end of the component
// Let's find the end of the return statement
const endReturn = `    </div>\n  );\n}`;
const newEndReturn = `      </div>\n    </div>\n  );\n}`;
code = code.replace(endReturn, newEndReturn);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
