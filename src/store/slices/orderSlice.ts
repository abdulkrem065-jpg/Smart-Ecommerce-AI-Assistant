import { StateCreator } from 'zustand';
import { Order } from '../../types';
import { ref, set, onValue, remove } from 'firebase/database';
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
    const { orders } = get();
    const newOrders = orders.map((o) => o.id === orderId ? { ...o, status } : o);
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
    
    // Write directly to Firebase
    const updatedOrder = newOrders.find(o => o.id === orderId);
    if (updatedOrder) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      set(ref(db, `niche_${activeNicheId}/orders/${orderId}`), cleanUndefined(updatedOrder))
        .catch((err: any) => console.error("Failed to update status on firebase: ", err));
    }
  },
  deleteOrder: (orderId) => {
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
    const { orders } = get();
    const newOrders = [order, ...orders];
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
    
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    set(ref(db, `niche_${activeNicheId}/orders/${order.id}`), cleanUndefined(order))
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
