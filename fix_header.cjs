const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
`        <div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 ml-4 lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="hidden lg:flex p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 ml-4">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 tracking-tight" id="dashboard-title">
            لوحة الإدارة الفنية والتحكم المتكاملة VIP 🛠️
          </h2>`,
`        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 tracking-tight" id="dashboard-title">
              لوحة الإدارة الفنية والتحكم المتكاملة VIP 🛠️
            </h2>
          </div>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
