const fs = require('fs');

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

if (!code.includes('const [isSidebarOpen, setIsSidebarOpen] = useState(false);')) {
  code = code.replace(
    `const [activeTab, setActiveTab] = useState<`,
    `const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [activeTab, setActiveTab] = useState<`
  );
}

// Ensure the main container doesn't render sidebar directly in the flex flow, since sidebar is now absolutely positioned drawer
// Remove <GlobalSidebar ... /> from where it is and place it inside the root, and add hamburger to header
code = code.replace(
  `<GlobalSidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />`,
  `<GlobalSidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />`
);

// Add hamburger button to the header
code = code.replace(
  `{/* Page Title & Navigation Tabs row */}`,
  `{/* Page Title & Navigation Tabs row */}`
);

code = code.replace(
  `<h2 className="text-xl font-extrabold`,
  `<button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 ml-4 lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="hidden lg:flex p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 ml-4">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-extrabold`
);

// If not imported Menu
if (!code.includes('Menu,') && !code.includes('import { Menu')) {
  code = code.replace(`import { Plus, Edit2,`, `import { Menu, Plus, Edit2,`);
}

// The user requested KPI cards to be shown at the top. Currently they are rendered inside `activeTab === 'advanced_reports'` or something. Wait, where are the KPI cards?
// They are rendered globally, or inside a specific tab? Let's check where `id="dashboard-stats-grid"` is located.
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
