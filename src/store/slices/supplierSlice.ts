import { StateCreator } from 'zustand';
import { Supplier } from '../../core/types';
import { db } from '../../firebase';
import { ref, set as firebaseSet, onValue } from 'firebase/database';

export interface SupplierSlice {
  suppliers: Supplier[];
  fetchSuppliers: () => void;
  addSupplier: (supplierBase: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, updated: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  updateSupplierBalance: (id: string, amount: number) => void;
}

const cleanUndefined = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const createSupplierSlice: StateCreator<SupplierSlice> = (set, get) => ({
  suppliers: [],

  fetchSuppliers: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const suppliersRef = ref(db, `niche_${activeNicheId}/suppliers`);
    onValue(suppliersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedList = Object.values(data) as Supplier[];
        set({ suppliers: loadedList } as any);
        localStorage.setItem('store_suppliers', JSON.stringify(loadedList));
      } else {
        set({ suppliers: [] } as any);
        localStorage.setItem('store_suppliers', JSON.stringify([]));
      }
    });
  },

  addSupplier: (supplierBase) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة. لا يمكن إضافة مورد جديد.");
      return;
    }
    const { suppliers } = get() as any;
    const newSupplier: Supplier = {
      ...supplierBase,
      id: `SUP-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newSuppliers = [...suppliers, newSupplier];
    set({ suppliers: newSuppliers } as any);
    localStorage.setItem('store_suppliers', JSON.stringify(newSuppliers));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/suppliers/${newSupplier.id}`), cleanUndefined(newSupplier))
      .catch((err: any) => console.error("Failed to add supplier", err));
  },

  updateSupplier: (id, updated) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة. لا يمكن تعديل بيانات المورد.");
      return;
    }
    const { suppliers } = get() as any;
    const newSuppliers = suppliers.map((sup: Supplier) =>
      sup.id === id ? { ...sup, ...updated } : sup
    );
    set({ suppliers: newSuppliers } as any);
    localStorage.setItem('store_suppliers', JSON.stringify(newSuppliers));

    const updatedSupplier = newSuppliers.find((sup: Supplier) => sup.id === id);
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    if (updatedSupplier) {
      firebaseSet(ref(db, `niche_${activeNicheId}/suppliers/${id}`), cleanUndefined(updatedSupplier))
        .catch((err: any) => console.error("Failed to update supplier", err));
    }
  },

  deleteSupplier: (id) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة. لا يمكن حذف المورد.");
      return;
    }
    const { suppliers } = get() as any;
    const newSuppliers = suppliers.filter((sup: Supplier) => sup.id !== id);
    set({ suppliers: newSuppliers } as any);
    localStorage.setItem('store_suppliers', JSON.stringify(newSuppliers));

    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/suppliers/${id}`), null)
      .catch((err: any) => console.error("Failed to delete supplier", err));
  },

  updateSupplierBalance: (id, amount) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      alert("⚠️ الفترة المحاسبية مغلقة.");
      return;
    }
    const { suppliers } = get() as any;
    const supplier = suppliers.find((sup: Supplier) => sup.id === id);
    if (!supplier) return;

    const newBalance = (supplier.balance || 0) + amount;
    const newSuppliers = suppliers.map((sup: Supplier) =>
      sup.id === id ? { ...sup, balance: newBalance } : sup
    );
    
    set({ suppliers: newSuppliers } as any);
    localStorage.setItem('store_suppliers', JSON.stringify(newSuppliers));

    const updatedSupplier = newSuppliers.find((sup: Supplier) => sup.id === id);
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    if (updatedSupplier) {
      firebaseSet(ref(db, `niche_${activeNicheId}/suppliers/${id}`), cleanUndefined(updatedSupplier))
        .catch((err: any) => console.error("Failed to update supplier balance", err));
    }
  }
});
