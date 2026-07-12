const fs = require('fs');
let code = fs.readFileSync('src/store/slices/financialReportSlice.ts', 'utf8');

const newInterface = `export interface FinancialReportSlice {
  trialBalance: TrialBalanceRow[];
  radarAlerts: JournalEntry[];
  incomeStatement: { revenues: number; cogs: number; expenses: number; netIncome: number };
  balanceSheet: { assets: number; liabilities: number; equity: number };
  isPeriodLocked: boolean;
  runInstantTrialBalance: (entries: JournalEntry[]) => void;
  aiRadarLocator: (entries: JournalEntry[]) => void;
  generateIncomeStatement: () => void;
  generateBalanceSheet: () => void;
  closeCurrentFiscalPeriod: () => void;
  checkPeriodLock: () => void;
}`;

code = code.replace(/export interface FinancialReportSlice \{[\s\S]*?aiRadarLocator: \(entries: JournalEntry\[\]\) => void;\n\}/, newInterface);

const initialStates = `  trialBalance: [],
  radarAlerts: [],`;

const newInitialStates = `  trialBalance: [],
  radarAlerts: [],
  incomeStatement: { revenues: 0, cogs: 0, expenses: 0, netIncome: 0 },
  balanceSheet: { assets: 0, liabilities: 0, equity: 0 },
  isPeriodLocked: false,`;

code = code.replace(initialStates, newInitialStates);

const imports = `import { StateCreator } from 'zustand';
import { JournalEntry } from '../../types';`;

const newImports = `import { StateCreator } from 'zustand';
import { JournalEntry, AccountingAccount } from '../../types';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase';`;

code = code.replace(imports, newImports);

const methods = `
  generateIncomeStatement: () => {
    const accounts = (get() as any).accounts as AccountingAccount[];
    
    let revenues = 0;
    let cogs = 0;
    let expenses = 0;

    accounts.forEach(acc => {
      const balance = Math.abs(acc.currentBalance);
      if (acc.category === 'revenues') revenues += balance;
      if (acc.category === 'cogs') cogs += balance;
      if (acc.category === 'expenses') expenses += balance;
    });

    const netIncome = revenues - cogs - expenses;
    set({ incomeStatement: { revenues, cogs, expenses, netIncome } });
  },

  generateBalanceSheet: () => {
    const accounts = (get() as any).accounts as AccountingAccount[];
    const { netIncome } = get().incomeStatement;
    
    let assets = 0;
    let liabilities = 0;
    let equity = 0;

    accounts.forEach(acc => {
      const balance = Math.abs(acc.currentBalance);
      if (acc.category === 'cash_boxes' || acc.category === 'customers') assets += balance;
      if (acc.category === 'suppliers') liabilities += balance;
      if (acc.category === 'shareholders') equity += balance;
    });

    // Add Retained Earnings (Net Income) to Equity
    equity += netIncome;

    set({ balanceSheet: { assets, liabilities, equity } });
  },

  closeCurrentFiscalPeriod: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const { incomeStatement } = get();
    
    // Automation closing entries: transferring balance from Revenue and Expenses into Retained Earnings
    const payload = {
      description: 'إقفال الفترة المالية (نقل الأرباح/الخسائر إلى الأرباح المحتجزة)',
      lines: [
        { accountId: 'SYS-REV', accountName: 'الإيرادات (إقفال)', debit: incomeStatement.revenues, credit: 0 },
        { accountId: 'SYS-EXP', accountName: 'المصروفات (إقفال)', debit: 0, credit: incomeStatement.expenses + incomeStatement.cogs },
        { accountId: 'SYS-RE', accountName: 'الأرباح المحتجزة', debit: incomeStatement.netIncome < 0 ? Math.abs(incomeStatement.netIncome) : 0, credit: incomeStatement.netIncome > 0 ? incomeStatement.netIncome : 0 }
      ]
    };
    
    const { createAutoJournalEntry } = get() as any;
    if (createAutoJournalEntry) {
      createAutoJournalEntry(payload);
    }
    
    // Lock the period
    set(ref(db, \`niche_\${activeNicheId}/accounting/config/is_period_locked\`), true)
      .then(() => {
        set({ isPeriodLocked: true });
        // Also update local storage tenant setting for fast access
        const tenantConfigStr = localStorage.getItem("store_is_period_locked");
        localStorage.setItem("store_is_period_locked", "true");
        const { setTenantConfig } = get() as any;
        if(setTenantConfig) setTenantConfig({ is_period_locked: true });
      })
      .catch((err: any) => console.error("Failed to lock fiscal period", err));
  },

  checkPeriodLock: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const lockRef = ref(db, \`niche_\${activeNicheId}/accounting/config/is_period_locked\`);
    onValue(lockRef, (snapshot) => {
      const isLocked = !!snapshot.val();
      set({ isPeriodLocked: isLocked });
      const { setTenantConfig } = get() as any;
      if(setTenantConfig) setTenantConfig({ is_period_locked: isLocked });
    });
  }
});
`;

code = code.replace(/export const createFinancialReportSlice: StateCreator<FinancialReportSlice> = \(set\) => \(\{/g, "export const createFinancialReportSlice: StateCreator<FinancialReportSlice> = (set, get) => ({");
code = code.replace(/  \}\n\}\);/g, "  }," + methods);
fs.writeFileSync('src/store/slices/financialReportSlice.ts', code);
