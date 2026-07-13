import { StateCreator } from 'zustand';
import { ref, set as firebaseSet, onValue } from 'firebase/database';
import { db } from '../../firebase';
import { AccountingAccount, AccountCategory, AccountingTransaction } from '../../core/types';

function cleanUndefined(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(item => cleanUndefined(item));
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) cleaned[key] = cleanUndefined(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

export interface AccountingSlice {
  accounts: AccountingAccount[];
  activeCategory: AccountCategory;
  categoryTotals: { totalDebit: number; totalCredit: number };
  setActiveCategory: (category: AccountCategory) => void;
  fetchAccountsByCategory: (category: AccountCategory) => void;
  syncAccountToFirebase: (accountId: string) => void;
  addAccount: (account: Omit<AccountingAccount, 'id' | 'transactions' | 'totalDebit' | 'totalCredit' | 'currentBalance'>) => void;
  addTransactionToAccount: (accountId: string, transaction: Omit<AccountingTransaction, 'id' | 'balance'>) => void;
  calculateCategoryTotals: (accounts: AccountingAccount[]) => void;
}

export const createAccountingSlice: StateCreator<AccountingSlice> = (set, get) => ({
  accounts: [],
  activeCategory: 'customers',
  categoryTotals: { totalDebit: 0, totalCredit: 0 },
  
  setActiveCategory: (category) => {
    set({ activeCategory: category });
    get().fetchAccountsByCategory(category);
  },
  
  calculateCategoryTotals: (accounts) => {
    let totalDebit = 0;
    let totalCredit = 0;
    accounts.forEach(acc => {
      totalDebit += acc.totalDebit || 0;
      totalCredit += acc.totalCredit || 0;
    });
    set({ categoryTotals: { totalDebit, totalCredit } });
  },
  
  fetchAccountsByCategory: (category) => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const accountsRef = ref(db, `niche_${activeNicheId}/accounting/accounts/${category}`);
    
    onValue(accountsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: AccountingAccount[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as AccountingAccount[];
        } else {
          loadedList = Object.values(val) as AccountingAccount[];
        }
        
        // Ensure transactions arrays exist
        loadedList = loadedList.map(acc => ({
          ...acc,
          transactions: acc.transactions ? Object.values(acc.transactions) : []
        }));
        
        set({ accounts: loadedList });
        get().calculateCategoryTotals(loadedList);
      } else {
        set({ accounts: [] });
        get().calculateCategoryTotals([]);
      }
    });
  },
  
  syncAccountToFirebase: (accountId) => {
    const { accounts, activeCategory } = get();
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    
    const targetAccount = accounts.find(a => a.id === accountId);
    if (targetAccount) {
      firebaseSet(ref(db, `niche_${activeNicheId}/accounting/accounts/${activeCategory}/${accountId}`), cleanUndefined(targetAccount))
        .catch((err: any) => console.error("Failed to sync account to Firebase", err));
    }
  },
  
  addAccount: (accountBase) => {
    const { activeCategory, accounts } = get();
    const newAccount: AccountingAccount = {
      ...accountBase,
      id: `ACC-${Date.now()}`,
      category: activeCategory,
      transactions: [],
      totalDebit: 0,
      totalCredit: 0,
      currentBalance: 0
    };
    
    const newAccounts = [...accounts, newAccount];
    set({ accounts: newAccounts });
    get().calculateCategoryTotals(newAccounts);
    
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/accounting/accounts/${activeCategory}/${newAccount.id}`), cleanUndefined(newAccount))
      .catch((err: any) => console.error("Failed to add account", err));
  },
  
  addTransactionToAccount: (accountId, transactionBase) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot add transaction.");
      return;
    }
    const { activeCategory, accounts } = get();
    
    const newAccounts = accounts.map(acc => {
      if (acc.id === accountId) {
        const newTotalDebit = (acc.totalDebit || 0) + transactionBase.debit;
        const newTotalCredit = (acc.totalCredit || 0) + transactionBase.credit;
        
        // Example balance calculation (debit - credit)
        const newBalance = newTotalDebit - newTotalCredit;
        
        const newTransaction: AccountingTransaction = {
          ...transactionBase,
          id: `TXN-${Date.now()}`,
          balance: newBalance
        };

        if (transactionBase.costCenterId && typeof (get() as any).updateCenterSpending === 'function') {
          (get() as any).updateCenterSpending(transactionBase.costCenterId, transactionBase.debit || transactionBase.credit);
        }
        
        return {
          ...acc,
          transactions: [...(acc.transactions || []), newTransaction],
          totalDebit: newTotalDebit,
          totalCredit: newTotalCredit,
          currentBalance: newBalance
        };
      }
      return acc;
    });
    
    set({ accounts: newAccounts });
    get().calculateCategoryTotals(newAccounts);
    
    // Sync just this account
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const updatedAcc = newAccounts.find(a => a.id === accountId);
    if (updatedAcc) {
      firebaseSet(ref(db, `niche_${activeNicheId}/accounting/accounts/${activeCategory}/${accountId}`), cleanUndefined(updatedAcc))
        .catch((err: any) => console.error("Failed to sync transaction", err));
    }
  }
});
