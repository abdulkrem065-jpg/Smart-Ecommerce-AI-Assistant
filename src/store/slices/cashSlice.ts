import { StateCreator } from 'zustand';
import { 
  CashAccount, 
  ReceiptVoucher, 
  PaymentVoucher, 
  Custody, 
  CashTransfer 
} from '../../core/types';
import { db } from '../../firebase';
import { ref, set as firebaseSet, onValue } from 'firebase/database';

export interface CashSlice {
  cashAccounts: CashAccount[];
  receiptVouchers: ReceiptVoucher[];
  paymentVouchers: PaymentVoucher[];
  custodies: Custody[];
  cashTransfers: CashTransfer[];

  fetchCashAccounts: () => void;
  addCashAccount: (accountBase: Omit<CashAccount, 'id' | 'createdAt' | 'balance'>, initialBalance: number) => void;
  updateCashAccountBalance: (id: string, amount: number) => void;
  createReceiptVoucher: (voucherBase: Omit<ReceiptVoucher, 'id' | 'date'>) => void;
  createPaymentVoucher: (voucherBase: Omit<PaymentVoucher, 'id' | 'date'>) => void;
  createCustody: (custodyBase: Omit<Custody, 'id' | 'date' | 'status'>) => void;
  settleCustody: (custodyId: string, settlementItems: any[]) => void;
  createCashTransfer: (transferBase: Omit<CashTransfer, 'id' | 'date'>) => void;
}

const cleanUndefined = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const createCashSlice: StateCreator<CashSlice> = (set, get) => ({
  cashAccounts: [],
  receiptVouchers: [],
  paymentVouchers: [],
  custodies: [],
  cashTransfers: [],

  fetchCashAccounts: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    
    // Fetch Cash Accounts
    const accRef = ref(db, `niche_${activeNicheId}/cash_accounts`);
    onValue(accRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as CashAccount[];
        set({ cashAccounts: loadedList } as any);
        localStorage.setItem('store_cash_accounts', JSON.stringify(loadedList));
      } else {
        set({ cashAccounts: [] } as any);
        localStorage.setItem('store_cash_accounts', JSON.stringify([]));
      }
    });

    // Fetch Receipt Vouchers
    const rvRef = ref(db, `niche_${activeNicheId}/receipt_vouchers`);
    onValue(rvRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as ReceiptVoucher[];
        set({ receiptVouchers: loadedList } as any);
        localStorage.setItem('store_receipt_vouchers', JSON.stringify(loadedList));
      } else {
        set({ receiptVouchers: [] } as any);
      }
    });

    // Fetch Payment Vouchers
    const pvRef = ref(db, `niche_${activeNicheId}/payment_vouchers`);
    onValue(pvRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as PaymentVoucher[];
        set({ paymentVouchers: loadedList } as any);
        localStorage.setItem('store_payment_vouchers', JSON.stringify(loadedList));
      } else {
        set({ paymentVouchers: [] } as any);
      }
    });

    // Fetch Custodies
    const custRef = ref(db, `niche_${activeNicheId}/custodies`);
    onValue(custRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as Custody[];
        set({ custodies: loadedList } as any);
        localStorage.setItem('store_custodies', JSON.stringify(loadedList));
      } else {
        set({ custodies: [] } as any);
      }
    });

    // Fetch Cash Transfers
    const transRef = ref(db, `niche_${activeNicheId}/cash_transfers`);
    onValue(transRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as CashTransfer[];
        set({ cashTransfers: loadedList } as any);
        localStorage.setItem('store_cash_transfers', JSON.stringify(loadedList));
      } else {
        set({ cashTransfers: [] } as any);
      }
    });
  },

  addCashAccount: (accountBase, initialBalance) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }
    
    const newAccount: CashAccount = {
      ...accountBase,
      id: `CASH-${Date.now()}`,
      balance: initialBalance,
      createdAt: new Date().toISOString()
    };
    
    const { cashAccounts } = get() as any;
    const newAccounts = [...cashAccounts, newAccount];
    set({ cashAccounts: newAccounts } as any);
    localStorage.setItem('store_cash_accounts', JSON.stringify(newAccounts));

    // Optional: Auto Journal Entry for initial balance
    if (initialBalance > 0 && state.createAutoJournalEntry) {
        state.createAutoJournalEntry({
            date: newAccount.createdAt,
            description: `رصيد افتتاحي لحساب الخزينة ${newAccount.name}`,
            referenceId: newAccount.id,
            lines: [
              { accountId: `cash-${newAccount.id}`, accountName: newAccount.name, debit: initialBalance, credit: 0 },
              { accountId: 'equity-1', accountName: 'رأس المال', debit: 0, credit: initialBalance }
            ]
        });
    }

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/cash_accounts/${newAccount.id}`), cleanUndefined(newAccount))
      .catch((err: any) => console.error("Failed to add cash account", err));
  },

  updateCashAccountBalance: (id, amount) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }
    const { cashAccounts } = get() as any;
    const account = cashAccounts.find((a: CashAccount) => a.id === id);
    if (!account) return;

    const newBalance = account.balance + amount;
    const newAccounts = cashAccounts.map((a: CashAccount) =>
      a.id === id ? { ...a, balance: newBalance } : a
    );
    
    set({ cashAccounts: newAccounts } as any);
    localStorage.setItem('store_cash_accounts', JSON.stringify(newAccounts));

    const updatedAccount = newAccounts.find((a: CashAccount) => a.id === id);
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    if (updatedAccount) {
      firebaseSet(ref(db, `niche_${activeNicheId}/cash_accounts/${id}`), cleanUndefined(updatedAccount))
        .catch((err: any) => console.error("Failed to update cash account balance", err));
    }
  },

  createReceiptVoucher: (voucherBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const newVoucher: ReceiptVoucher = {
      ...voucherBase,
      id: `RV-${Date.now()}`,
      date: new Date().toISOString()
    };

    if (state.updateCashAccountBalance) {
      state.updateCashAccountBalance(newVoucher.cashAccountId, newVoucher.amount);
    }

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newVoucher.date,
        description: `سند قبض رقم ${newVoucher.id} من ${newVoucher.fromParty}`,
        referenceId: newVoucher.id,
        lines: [
          { accountId: `cash-${newVoucher.cashAccountId}`, accountName: newVoucher.cashAccountName, debit: newVoucher.amount, credit: 0 },
          { accountId: `party-${newVoucher.fromPartyId || 'other'}`, accountName: newVoucher.fromParty, debit: 0, credit: newVoucher.amount }
        ]
      });
    }

    const { receiptVouchers } = get() as any;
    const newVouchers = [...receiptVouchers, newVoucher];
    set({ receiptVouchers: newVouchers } as any);
    localStorage.setItem('store_receipt_vouchers', JSON.stringify(newVouchers));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/receipt_vouchers/${newVoucher.id}`), cleanUndefined(newVoucher))
      .catch((err: any) => console.error("Failed to add receipt voucher", err));
  },

  createPaymentVoucher: (voucherBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const newVoucher: PaymentVoucher = {
      ...voucherBase,
      id: `PV-${Date.now()}`,
      date: new Date().toISOString()
    };

    if (state.updateCashAccountBalance) {
      state.updateCashAccountBalance(newVoucher.cashAccountId, -newVoucher.amount);
    }

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newVoucher.date,
        description: `سند صرف رقم ${newVoucher.id} إلى ${newVoucher.toParty}`,
        referenceId: newVoucher.id,
        lines: [
          { accountId: `party-${newVoucher.toPartyId || 'other'}`, accountName: newVoucher.toParty, debit: newVoucher.amount, credit: 0 },
          { accountId: `cash-${newVoucher.cashAccountId}`, accountName: newVoucher.cashAccountName, debit: 0, credit: newVoucher.amount }
        ]
      });
    }

    const { paymentVouchers } = get() as any;
    const newVouchers = [...paymentVouchers, newVoucher];
    set({ paymentVouchers: newVouchers } as any);
    localStorage.setItem('store_payment_vouchers', JSON.stringify(newVouchers));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/payment_vouchers/${newVoucher.id}`), cleanUndefined(newVoucher))
      .catch((err: any) => console.error("Failed to add payment voucher", err));
  },

  createCustody: (custodyBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const newCustody: Custody = {
      ...custodyBase,
      id: `CUST-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'مفتوحة'
    };

    // Assuming we deduct from the primary cash account when creating a custody
    // We should probably pass the cashAccountId, but for now we'll assume a generic treasury account decrease 
    // or the UI will pair it with a payment voucher. 
    // To be precise, let's just log the custody itself.

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newCustody.date,
        description: `صرف عهدة للموظف ${newCustody.employeeName} لغرض: ${newCustody.purpose}`,
        referenceId: newCustody.id,
        lines: [
          { accountId: `emp-custody-${newCustody.employeeId || 'general'}`, accountName: `عهد الموظفين - ${newCustody.employeeName}`, debit: newCustody.amount, credit: 0 },
          { accountId: 'cash-main', accountName: 'الخزينة الرئيسية', debit: 0, credit: newCustody.amount } // Need to make generic
        ]
      });
    }

    const { custodies } = get() as any;
    const newCustodies = [...custodies, newCustody];
    set({ custodies: newCustodies } as any);
    localStorage.setItem('store_custodies', JSON.stringify(newCustodies));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/custodies/${newCustody.id}`), cleanUndefined(newCustody))
      .catch((err: any) => console.error("Failed to add custody", err));
  },

  settleCustody: (custodyId, settlementItems) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const { custodies } = get() as any;
    const custody = custodies.find((c: Custody) => c.id === custodyId);
    if (!custody || custody.status === 'مسددة') return;

    const totalSpent = settlementItems.reduce((sum: number, item: any) => sum + item.amount, 0);
    const remaining = custody.amount - totalSpent;

    const newCustodies = custodies.map((c: Custody) =>
      c.id === custodyId ? { ...c, status: 'مسددة', settledDate: new Date().toISOString(), settlementItems } : c
    );

    set({ custodies: newCustodies } as any);
    localStorage.setItem('store_custodies', JSON.stringify(newCustodies));

    if (state.createAutoJournalEntry) {
      const lines = settlementItems.map((item: any, idx: number) => ({
        accountId: `exp-${Date.now()}-${idx}`,
        accountName: item.accountName,
        debit: item.amount,
        credit: 0
      }));

      if (remaining > 0) {
        lines.push({
          accountId: 'cash-main',
          accountName: 'الخزينة الرئيسية (مرتجع عهدة)',
          debit: remaining,
          credit: 0
        });
      } else if (remaining < 0) {
         lines.push({
          accountId: 'cash-main',
          accountName: 'الخزينة الرئيسية (صرف تجاوز عهدة)',
          debit: 0,
          credit: Math.abs(remaining)
        });
      }

      lines.push({
        accountId: `emp-custody-${custody.employeeId || 'general'}`,
        accountName: `عهد الموظفين - ${custody.employeeName}`,
        debit: 0,
        credit: custody.amount
      });

      state.createAutoJournalEntry({
        date: new Date().toISOString(),
        description: `تسوية عهدة رقم ${custody.id} للموظف ${custody.employeeName}`,
        referenceId: custody.id,
        lines
      });
    }

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const updatedCustody = newCustodies.find((c: Custody) => c.id === custodyId);
    if (updatedCustody) {
      firebaseSet(ref(db, `niche_${activeNicheId}/custodies/${custodyId}`), cleanUndefined(updatedCustody))
        .catch((err: any) => console.error("Failed to update custody", err));
    }
  },

  createCashTransfer: (transferBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const newTransfer: CashTransfer = {
      ...transferBase,
      id: `CTRANS-${Date.now()}`,
      date: new Date().toISOString()
    };

    if (state.updateCashAccountBalance) {
      state.updateCashAccountBalance(newTransfer.fromAccountId, -newTransfer.amount);
      state.updateCashAccountBalance(newTransfer.toAccountId, newTransfer.amount);
    }

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newTransfer.date,
        description: `تحويل نقدي من ${newTransfer.fromAccountName} إلى ${newTransfer.toAccountName}: ${newTransfer.description}`,
        referenceId: newTransfer.id,
        lines: [
          { accountId: `cash-${newTransfer.toAccountId}`, accountName: newTransfer.toAccountName, debit: newTransfer.amount, credit: 0 },
          { accountId: `cash-${newTransfer.fromAccountId}`, accountName: newTransfer.fromAccountName, debit: 0, credit: newTransfer.amount }
        ]
      });
    }

    const { cashTransfers } = get() as any;
    const newTransfers = [...cashTransfers, newTransfer];
    set({ cashTransfers: newTransfers } as any);
    localStorage.setItem('store_cash_transfers', JSON.stringify(newTransfers));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/cash_transfers/${newTransfer.id}`), cleanUndefined(newTransfer))
      .catch((err: any) => console.error("Failed to add cash transfer", err));
  }
});
