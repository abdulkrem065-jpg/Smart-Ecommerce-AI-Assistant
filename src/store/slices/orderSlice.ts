import { StateCreator } from 'zustand';
import { Order } from '../../core/types';
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

export interface OrderSlice {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addOrder: (order: Order) => void;
  listenToFirebaseOrders: () => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  orders: (() => {
    const saved = localStorage.getItem("store_orders");
    return saved ? JSON.parse(saved) : [];
  })(),
  setOrders: (orders) => set(() => {
    localStorage.setItem("store_orders", JSON.stringify(orders));
    return { orders };
  }),
  updateOrderStatus: (orderId, status) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update order.");
      return;
    }
    const { orders } = get();
    const newOrders = orders.map((o) => o.id === orderId ? { ...o, status } : o);
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
    
    // Write directly to Firebase
    const updatedOrder = newOrders.find(o => o.id === orderId);
    if (updatedOrder) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/orders/${orderId}`), cleanUndefined(updatedOrder))
        .catch((err: any) => console.error("Failed to update status on firebase: ", err));
    }
  },
  deleteOrder: (orderId) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot delete order.");
      return;
    }
    const { orders } = get();
    const newOrders = orders.filter((o) => o.id !== orderId);
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
    
    // Remove from Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/orders/${orderId}`))
      .catch((err: any) => console.error("Failed to remove order from firebase:", err));
  },
  addOrder: (order) => {
    const state = get() as any;
    
    // 1. Check Fiscal Period Lock
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot create new order.");
      return;
    }

    // 2. Deduct Stock automatically
    for (const item of order.items) {
      if (item.product.is_digital_service || item.product.isApiProduct) continue;
      const success = state.deductStock(item.product.id, item.quantity);
      if (!success) {
        console.warn(`Failed to deduct stock for product ${item.product.id}. Order aborted.`);
        return false;
      }
    }

    // 3. Create Auto Journal Entry
    if (state.createAutoJournalEntry) {
      const isCash = order.paymentMethod === 'كاش' || order.paymentMethod === 'نقدي' || order.paymentMethod === 'شبكة' || order.paymentMethod === 'حوالة';
      const debitAccountId = isCash ? 'ACC-CASH' : (order.customerId ? `CUST-${order.customerId}` : 'ACC-CUSTOMERS');
      const debitAccountName = isCash ? 'الصندوق / البنك' : (order.customerName ? `عميل: ${order.customerName}` : 'العملاء');

      const journalPayload = {
        description: `مبيعات فاتورة رقم ${order.id} للعميل ${order.customerName}`,
        referenceId: order.id,
        lines: [
          {
            accountId: debitAccountId,
            accountName: debitAccountName,
            debit: order.totalPrice,
            credit: 0
          },
          {
            accountId: 'ACC-SALES',
            accountName: 'المبيعات',
            debit: 0,
            credit: order.totalPrice
          }
        ]
      };
      state.createAutoJournalEntry(journalPayload);
    }

    // 4. Update Customer Balance
    if (order.customerId && !['كاش', 'نقدي', 'شبكة'].includes(order.paymentMethod) && state.updateCustomerBalance) {
      state.updateCustomerBalance(order.customerId, order.totalPrice);
    }

    const { orders } = get();
    const newOrders = [order, ...orders];
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
        
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/orders/${order.id}`), cleanUndefined(order))
      .catch((err: any) => console.error("Failed to add order to firebase: ", err));
  },
  listenToFirebaseOrders: () => {
    const { setOrders } = get();
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const ordersRef = ref(db, `niche_${activeNicheId}/orders`);
    
    onValue(ordersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: Order[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as Order[];
        } else {
          loadedList = Object.values(val) as Order[];
        }
        
        // Sort by date (newest first)
        loadedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (loadedList.length > 0) {
          setOrders(loadedList);
        }
      } else {
        setOrders([]);
      }
    });
  }
});
