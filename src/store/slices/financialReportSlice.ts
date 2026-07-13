import { StateCreator } from 'zustand';
import { JournalEntry, AccountingAccount } from '../../core/types';
import { ref, set as firebaseSet, onValue } from 'firebase/database';
import { db } from '../../firebase';

export interface TrialBalanceRow {
  accountId: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface FinancialReportSlice {
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
}

export const createFinancialReportSlice: StateCreator<FinancialReportSlice> = (set, get) => ({
  trialBalance: [],
  radarAlerts: [],
  incomeStatement: { revenues: 0, cogs: 0, expenses: 0, netIncome: 0 },
  balanceSheet: { assets: 0, liabilities: 0, equity: 0 },
  isPeriodLocked: false,

  runInstantTrialBalance: (entries) => {
    const balanceMap: Record<string, TrialBalanceRow> = {};
    
    entries.forEach(entry => {
      entry.lines.forEach(line => {
        if (!balanceMap[line.accountId]) {
          balanceMap[line.accountId] = {
            accountId: line.accountId,
            accountName: line.accountName,
            totalDebit: 0,
            totalCredit: 0,
            balance: 0
          };
        }
        balanceMap[line.accountId].totalDebit += line.debit;
        balanceMap[line.accountId].totalCredit += line.credit;
      });
    });

    const trialBalance = Object.values(balanceMap).map(row => ({
      ...row,
      balance: row.totalDebit - row.totalCredit
    }));

    set({ trialBalance });
  },

  aiRadarLocator: (entries) => {
    const brokenEntries = entries.filter(entry => {
      const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);
      return totalDebit !== totalCredit || entry.is_broken;
    });

    set({ radarAlerts: brokenEntries });
  },
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
    firebaseSet(ref(db, `niche_${activeNicheId}/accounting/config/is_period_locked`), true)
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
    const lockRef = ref(db, `niche_${activeNicheId}/accounting/config/is_period_locked`);
    onValue(lockRef, (snapshot) => {
      const isLocked = !!snapshot.val();
      set({ isPeriodLocked: isLocked });
      const { setTenantConfig } = get() as any;
      if(setTenantConfig) setTenantConfig({ is_period_locked: isLocked });
    });
  }
});

