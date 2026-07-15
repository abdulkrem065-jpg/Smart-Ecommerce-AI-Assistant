const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Update the activeTab type
const tabTypeRegex = /useState\<'products'(.*?)\>\(\(\) \=\> \{/;
if (tabTypeRegex.test(code)) {
  code = code.replace(tabTypeRegex, `useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance' | 'financial_statements' | 'fiscal_closing' | 'sales_invoices' | 'purchase_invoices' | 'cash_accounts' | 'employees' | 'advanced_reports' | 'cost_centers' | 'fixed_assets' | 'customers' | 'suppliers' | 'sales_returns' | 'purchase_returns' | 'roles_permissions' | 'inventory'>(() => {
    return 'stats'; // Always default to stats for dashboard`);
}

// 2. Hide the KPI metrics under `activeTab === 'stats'`
const statsGridStart = `{/* METRICS & OVERVIEWS */}`;
const productsTabStart = `{/* PRODUCTS MANAGING TAB */}`;

const startIndex = code.indexOf(statsGridStart);
const endIndex = code.indexOf(productsTabStart);

if (startIndex !== -1 && endIndex !== -1) {
  const originalStatsContent = code.substring(startIndex, endIndex);
  
  const replacementStatsContent = `{activeTab === 'stats' && (
      <div className="space-y-6">
        ${originalStatsContent}
        
        {/* Recent Activities / Orders Table */}
        <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40">
          <h3 className="text-lg font-bold text-white mb-4">آخر النشاطات والطلبات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-3">رقم الطلب</th>
                  <th className="px-6 py-3">العميل</th>
                  <th className="px-6 py-3">المبلغ</th>
                  <th className="px-6 py-3">الحالة</th>
                  <th className="px-6 py-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-blue-900/20 hover:bg-[#1e293b]/50">
                    <td className="px-6 py-4 font-medium text-white">{o.id}</td>
                    <td className="px-6 py-4 text-white">{o.customerName || 'غير مسجل'}</td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{formatPrice ? formatPrice(o.totalPrice) : o.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded-full text-[10px] font-bold \${
                        o.status.includes('ملغي') ? 'bg-red-500/20 text-red-400' :
                        o.status.includes('مكتمل') || o.status.includes('تسليم') ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-amber-500/20 text-amber-400'
                      }\`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">لا توجد طلبات حديثة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
      `;
      
  code = code.substring(0, startIndex) + replacementStatsContent + code.substring(endIndex);
}

// 3. Rename the `activeTab === 'stats'` (which is actually advanced_reports) to `advanced_reports`
code = code.replace(`{activeTab === 'stats' && hasFinancePermission && (() => {`, `{activeTab === 'advanced_reports' && hasFinancePermission && (() => {`);

// 4. Add rendering for missing tabs like inventory, fixed_assets, cost_centers, customers, suppliers, sales_returns, purchase_returns, roles_permissions
// We will insert them right before advanced_reports

const advancedReportsStart = `{activeTab === 'advanced_reports' && hasFinancePermission && (() => {`;
const missingTabs = `
      {activeTab === 'inventory' && hasInventoryPermission && (
        <InventoryTab formatPrice={formatPrice || ((p) => p.toLocaleString())} />
      )}
      {activeTab === 'fixed_assets' && hasFinancePermission && (
        <FixedAssetsTab />
      )}
      {activeTab === 'cost_centers' && hasFinancePermission && (
        <CostCentersTab />
      )}
      {activeTab === 'customers' && hasFinancePermission && (
        <CustomersTab />
      )}
      {activeTab === 'suppliers' && hasFinancePermission && (
        <SuppliersTab />
      )}
      {activeTab === 'sales_returns' && hasFinancePermission && (
        <SalesReturnsTab />
      )}
      {activeTab === 'purchase_returns' && hasFinancePermission && (
        <PurchaseReturnsTab />
      )}
      {activeTab === 'roles_permissions' && isSuperUser && (
        <RolesTab />
      )}
`;

code = code.replace(advancedReportsStart, missingTabs + advancedReportsStart);


fs.writeFileSync('src/components/AdminDashboard.tsx', code);
