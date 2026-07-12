import { StateCreator } from 'zustand';
import { PurchaseInvoice, PurchaseReturn } from '../../core/types';
import { db } from '../../firebase';
import { ref, set as firebaseSet, onValue } from 'firebase/database';

export interface PurchaseSlice {
  purchaseInvoices: PurchaseInvoice[];
  purchaseReturns: PurchaseReturn[];
  fetchPurchaseInvoices: () => void;
  fetchPurchaseReturns: () => void;
  createPurchaseInvoice: (invoice: Omit<PurchaseInvoice, 'id' | 'date'>) => void;
  paySupplierInvoice: (invoiceId: string, paymentMethod: string) => void;
  createPurchaseReturn: (returnObj: Omit<PurchaseReturn, 'id' | 'date' | 'status'>) => void;
}

const cleanUndefined = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const createPurchaseSlice: StateCreator<PurchaseSlice> = (set, get) => ({
  purchaseInvoices: [],
  purchaseReturns: [],

  fetchPurchaseInvoices: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const invRef = ref(db, `niche_${activeNicheId}/purchase_invoices`);
    onValue(invRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as PurchaseInvoice[];
        set({ purchaseInvoices: loadedList } as any);
        localStorage.setItem('store_purchase_invoices', JSON.stringify(loadedList));
      } else {
        set({ purchaseInvoices: [] } as any);
        localStorage.setItem('store_purchase_invoices', JSON.stringify([]));
      }
    });
  },

  fetchPurchaseReturns: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const retRef = ref(db, `niche_${activeNicheId}/purchase_returns`);
    onValue(retRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as PurchaseReturn[];
        set({ purchaseReturns: loadedList } as any);
        localStorage.setItem('store_purchase_returns', JSON.stringify(loadedList));
      } else {
        set({ purchaseReturns: [] } as any);
        localStorage.setItem('store_purchase_returns', JSON.stringify([]));
      }
    });
  },

  createPurchaseInvoice: (invoiceBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }
    
    const newInvoice: PurchaseInvoice = {
      ...invoiceBase,
      id: `PINV-${Date.now()}`,
      date: new Date().toISOString()
    };
    
    invoiceBase.items.forEach(item => {
      if (state.increaseStock) state.increaseStock(item.productId, item.quantity);
    });

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newInvoice.date,
        description: `فاتورة مشتريات رقم ${newInvoice.id} من المورد ${newInvoice.supplierName}`,
        referenceId: newInvoice.id,
        lines: [
          { accountId: 'inv-1', accountName: 'المخزون', debit: newInvoice.totalAmount, credit: 0 },
          { accountId: `sup-${newInvoice.supplierId}`, accountName: newInvoice.supplierName, debit: 0, credit: newInvoice.totalAmount }
        ]
      });
    }

    if (state.updateSupplierBalance) {
      state.updateSupplierBalance(newInvoice.supplierId, newInvoice.totalAmount);
    }

    const { purchaseInvoices } = get() as any;
    const newInvoices = [...purchaseInvoices, newInvoice];
    set({ purchaseInvoices: newInvoices } as any);
    localStorage.setItem('store_purchase_invoices', JSON.stringify(newInvoices));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/purchase_invoices/${newInvoice.id}`), cleanUndefined(newInvoice))
      .catch((err: any) => console.error("Failed to add purchase invoice", err));
  },

  paySupplierInvoice: (invoiceId, paymentMethod) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }
    
    const { purchaseInvoices } = get() as any;
    const invoice = purchaseInvoices.find((i: PurchaseInvoice) => i.id === invoiceId);
    if (!invoice || invoice.status === 'مدفوعة') return;

    const newInvoices = purchaseInvoices.map((i: PurchaseInvoice) =>
      i.id === invoiceId ? { ...i, status: 'مدفوعة', paymentMethod } : i
    );
    
    set({ purchaseInvoices: newInvoices } as any);
    localStorage.setItem('store_purchase_invoices', JSON.stringify(newInvoices));

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: new Date().toISOString(),
        description: `سداد فاتورة مشتريات رقم ${invoice.id} للمورد ${invoice.supplierName}`,
        referenceId: invoice.id,
        lines: [
          { accountId: `sup-${invoice.supplierId}`, accountName: invoice.supplierName, debit: invoice.totalAmount, credit: 0 },
          { accountId: 'cash-1', accountName: 'الصندوق/البنك', debit: 0, credit: invoice.totalAmount }
        ]
      });
    }

    if (state.updateSupplierBalance) {
      state.updateSupplierBalance(invoice.supplierId, -invoice.totalAmount);
    }

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const updatedInvoice = newInvoices.find((i: PurchaseInvoice) => i.id === invoiceId);
    if (updatedInvoice) {
      firebaseSet(ref(db, `niche_${activeNicheId}/purchase_invoices/${invoiceId}`), cleanUndefined(updatedInvoice))
        .catch((err: any) => console.error("Failed to update purchase invoice", err));
    }
  },

  createPurchaseReturn: (returnBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }

    const newReturn: PurchaseReturn = {
      ...returnBase,
      id: `PRET-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'معتمد'
    };

    newReturn.items.forEach(item => {
      if (state.deductStock) state.deductStock(item.productId, item.quantity);
    });

    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry({
        date: newReturn.date,
        description: `مرتجع مشتريات للفاتورة ${newReturn.invoiceId} للمورد ${newReturn.supplierName}`,
        referenceId: newReturn.id,
        lines: [
          { accountId: `sup-${newReturn.supplierId}`, accountName: newReturn.supplierName, debit: newReturn.totalRefund, credit: 0 },
          { accountId: 'purchases-1', accountName: 'المشتريات', debit: 0, credit: newReturn.totalRefund }
        ]
      });
    }

    if (state.updateSupplierBalance) {
      state.updateSupplierBalance(newReturn.supplierId, -newReturn.totalRefund);
    }

    const { purchaseReturns } = get() as any;
    const newReturns = [...purchaseReturns, newReturn];
    set({ purchaseReturns: newReturns } as any);
    localStorage.setItem('store_purchase_returns', JSON.stringify(newReturns));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/purchase_returns/${newReturn.id}`), cleanUndefined(newReturn))
      .catch((err: any) => console.error("Failed to add purchase return", err));
  }
});
