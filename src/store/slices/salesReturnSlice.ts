import { StateCreator } from 'zustand';
import { SalesReturn } from '../../core/types';
import { ref, set as firebaseSet, onValue, remove } from 'firebase/database';
import { db } from '../../firebase';

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

export interface SalesReturnSlice {
  salesReturns: SalesReturn[];
  setSalesReturns: (salesReturns: SalesReturn[]) => void;
  createSalesReturn: (salesReturn: Omit<SalesReturn, 'id' | 'date' | 'status'>) => boolean;
  fetchSalesReturns: () => void;
}

export const createSalesReturnSlice: StateCreator<SalesReturnSlice> = (set, get) => ({
  salesReturns: (() => {
    const saved = localStorage.getItem("store_sales_returns");
    return saved ? JSON.parse(saved) : [];
  })(),
  setSalesReturns: (salesReturns) => set(() => {
    localStorage.setItem("store_sales_returns", JSON.stringify(salesReturns));
    return { salesReturns };
  }),
  createSalesReturn: (salesReturnData) => {
    const state = get() as any;
    
    // 1. Check if period is locked
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot process sales return.");
      return false;
    }

    const newSalesReturn: SalesReturn = {
      ...salesReturnData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'معتمد'
    };

    // 2. Add returned items back to inventory
    let allStockIncreased = true;
    for (const item of newSalesReturn.items) {
      const success = state.increaseStock(item.productId, item.quantity);
      if (!success) {
        console.warn(`Failed to increase stock for product ${item.productId}`);
        allStockIncreased = false;
      }
    }

    if (!allStockIncreased) {
      // In a real app we might want to rollback, but let's proceed or return based on requirements.
      // Usually returning items should always be possible.
    }

    // 3. Reverse Journal Entry
    // Debit: Sales (net)
    // Debit: Tax (if applicable, assuming a simplified version here, or combined into sales for simplicity if not split)
    // Credit: Customer / Cash
    const journalPayload = {
      description: `مرتجع مبيعات لطلب #${newSalesReturn.orderId}`,
      referenceId: newSalesReturn.id,
      lines: [
        {
          accountId: 'ACC-SALES',
          accountName: 'المبيعات',
          debit: newSalesReturn.totalRefund,
          credit: 0
        },
        {
          accountId: newSalesReturn.customerId ? `CUST-${newSalesReturn.customerId}` : 'ACC-CASH',
          accountName: newSalesReturn.customerId ? `عميل: ${newSalesReturn.customerName}` : 'الصندوق / البنك',
          debit: 0,
          credit: newSalesReturn.totalRefund
        }
      ]
    };
    
    if (state.createAutoJournalEntry) {
      state.createAutoJournalEntry(journalPayload);
    }

    // 4. Update Customer Balance (reduce debt / credit)
    if (newSalesReturn.customerId && state.updateCustomerBalance) {
      // If customer owed us money (positive balance), this reduces it. (Refund reduces debt)
      state.updateCustomerBalance(newSalesReturn.customerId, -newSalesReturn.totalRefund);
    }

    // 5. Update Original Order Status
    if (state.updateOrderStatus) {
      state.updateOrderStatus(newSalesReturn.orderId, 'مرتجع');
    }

    // Add to state and save
    const { salesReturns } = get() as any;
    const newSalesReturns = [newSalesReturn, ...salesReturns];
    set({ salesReturns: newSalesReturns } as any);
    localStorage.setItem("store_sales_returns", JSON.stringify(newSalesReturns));
    
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/salesReturns/${newSalesReturn.id}`), cleanUndefined(newSalesReturn))
      .catch((err: any) => console.error("Failed to add sales return to firebase:", err));

    return true;
  },
  fetchSalesReturns: () => {
    const { setSalesReturns } = get() as any;
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    
    const returnsRef = ref(db, `niche_${activeNicheId}/salesReturns`);
    onValue(returnsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: SalesReturn[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as SalesReturn[];
        } else {
          loadedList = Object.values(val) as SalesReturn[];
        }
        loadedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (loadedList.length > 0) {
          setSalesReturns(loadedList);
        }
      } else {
        setSalesReturns([]);
      }
    });
  }
});
