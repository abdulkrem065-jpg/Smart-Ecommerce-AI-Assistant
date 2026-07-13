import { StateCreator } from 'zustand';
import { Customer } from '../../core/types';
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

export interface CustomerSlice {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'balance' | 'totalPurchases'>) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  fetchCustomers: () => void;
  updateCustomerBalance: (id: string, amount: number) => void;
}

export const createCustomerSlice: StateCreator<CustomerSlice> = (set, get) => ({
  customers: (() => {
    const saved = localStorage.getItem("store_customers");
    return saved ? JSON.parse(saved) : [];
  })(),
  setCustomers: (customers) => set(() => {
    localStorage.setItem("store_customers", JSON.stringify(customers));
    return { customers };
  }),
  addCustomer: (customer) => {
    if ((get() as any).isPeriodLocked) {
      console.warn('Fiscal period is locked.');
      return;
    }
    const newCustomer: Customer = { 
      ...customer, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      balance: 0,
      totalPurchases: 0
    };
    const { customers } = get();
    const newCustomers = [...customers, newCustomer];
    set({ customers: newCustomers });
    localStorage.setItem("store_customers", JSON.stringify(newCustomers));
    
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/customers/${newCustomer.id}`), cleanUndefined(newCustomer))
      .catch((err: any) => console.error("Failed to add customer to firebase:", err));
  },
  updateCustomer: (id, updated) => {
    if ((get() as any).isPeriodLocked) {
      console.warn('Fiscal period is locked.');
      return;
    }
    const { customers } = get();
    const newCustomers = customers.map((c) => c.id === id ? { ...c, ...updated } : c);
    set({ customers: newCustomers });
    localStorage.setItem("store_customers", JSON.stringify(newCustomers));
    
    // Write directly to Firebase
    const updatedCustomer = newCustomers.find(c => c.id === id);
    if (updatedCustomer) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/customers/${id}`), cleanUndefined(updatedCustomer))
        .catch((err: any) => console.error("Failed to edit customer on firebase:", err));
    }
  },
  deleteCustomer: (id) => {
    if ((get() as any).isPeriodLocked) {
      console.warn('Fiscal period is locked.');
      return;
    }
    const { customers } = get();
    const newCustomers = customers.filter((c) => c.id !== id);
    set({ customers: newCustomers });
    localStorage.setItem("store_customers", JSON.stringify(newCustomers));
    
    // Remove from Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/customers/${id}`))
      .catch((err: any) => console.error("Failed to delete customer from firebase:", err));
  },
  fetchCustomers: () => {
    const { setCustomers } = get();
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    
    const customersRef = ref(db, `niche_${activeNicheId}/customers`);
    onValue(customersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: Customer[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as Customer[];
        } else {
          loadedList = Object.values(val) as Customer[];
        }
        if (loadedList.length > 0) {
          setCustomers(loadedList);
        }
      } else {
        setCustomers([]);
      }
    });
  },
  updateCustomerBalance: (id, amount) => {
    if ((get() as any).isPeriodLocked) {
      console.warn('Fiscal period is locked.');
      return;
    }
    const { customers } = get();
    const customer = customers.find(c => c.id === id);
    if (customer) {
      const newBalance = (customer.balance || 0) + amount;
      const { updateCustomer } = get();
      updateCustomer(id, { balance: newBalance });
    }
  }
});
