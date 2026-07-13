import { StateCreator } from 'zustand';
import { Product, StoreCategory } from '../../core/types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../../core/defaults';
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

export interface InventorySlice {
  products: Product[];
  categories: StoreCategory[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: StoreCategory[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<StoreCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  fetchFirebaseProducts: () => void;
  deductStock: (productId: string, quantity: number) => boolean;
  increaseStock: (productId: string, quantity: number) => boolean;
}

export const createInventorySlice: StateCreator<InventorySlice> = (set, get) => ({
  products: (() => {
    const saved = localStorage.getItem("store_products");
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  })(),
  categories: (() => {
    const saved = localStorage.getItem("store_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  })(),
  setProducts: (products) => set(() => {
    localStorage.setItem("store_products", JSON.stringify(products));
    return { products };
  }),
  setCategories: (categories) => set(() => {
    localStorage.setItem("store_categories", JSON.stringify(categories));
    return { categories };
  }),
  addProduct: (product) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot add product.");
      return;
    }
    const newProduct = { ...product, id: Date.now().toString() };
    const { products } = get();
    const newProducts = [...products, newProduct as Product];
    set({ products: newProducts });
    localStorage.setItem("store_products", JSON.stringify(newProducts));
    
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/products/${newProduct.id}`), cleanUndefined(newProduct))
      .catch((err: any) => console.error("Failed to write newly added product to firebase:", err));
  },
  updateProduct: (id, updated) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot update product.");
      return;
    }
    const { products } = get();
    const newProducts = products.map((p) => p.id === id ? { ...p, ...updated } : p);
    set({ products: newProducts });
    localStorage.setItem("store_products", JSON.stringify(newProducts));
    
    // Write directly to Firebase
    const updatedProduct = newProducts.find(p => p.id === id);
    if (updatedProduct) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/products/${id}`), cleanUndefined(updatedProduct))
        .catch((err: any) => console.error("Failed to edit product on firebase:", err));
    }
  },
  deleteProduct: (id) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot delete product.");
      return;
    }
    const { products } = get();
    const newProducts = products.filter((p) => p.id !== id);
    set({ products: newProducts });
    localStorage.setItem("store_products", JSON.stringify(newProducts));
    
    // Remove from Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/products/${id}`))
      .catch((err: any) => console.error("Failed to delete product from firebase:", err));
  },
  addCategory: (category) => {
    const newCategory = { ...category, id: Date.now().toString() };
    const { categories } = get();
    const newCategories = [...categories, newCategory as StoreCategory];
    set({ categories: newCategories });
    localStorage.setItem("store_categories", JSON.stringify(newCategories));
    
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/categories/${newCategory.id}`), cleanUndefined(newCategory))
      .catch((err: any) => console.error("Failed to add category to firebase:", err));
  },
  deleteCategory: (id) => {
    const { categories } = get();
    const newCategories = categories.filter((c) => c.id !== id);
    set({ categories: newCategories });
    localStorage.setItem("store_categories", JSON.stringify(newCategories));
    
    // Remove from Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/categories/${id}`))
      .catch((err: any) => console.error("Failed to delete category from firebase:", err));
  },
  deductStock: (productId, quantity) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot deduct stock.");
      return false;
    }

    const { products, updateProduct } = get();
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    if ((product.stock || 0) < quantity) return false;
    
    updateProduct(productId, { stock: (product.stock || 0) - quantity });
    return true;
  },
  increaseStock: (productId, quantity) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot increase stock.");
      return false;
    }

    const { products, updateProduct } = get();
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    
    updateProduct(productId, { stock: (product.stock || 0) + quantity });
    return true;
  },
  fetchFirebaseProducts: () => {
    const { setProducts, setCategories } = get();
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    
    // Listen to products
    const productsRef = ref(db, `niche_${activeNicheId}/products`);
    onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: Product[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as Product[];
        } else {
          loadedList = Object.values(val) as Product[];
        }
        if (loadedList.length > 0) {
          setProducts(loadedList);
        }
      }
    });

    // Listen to categories
    const categoriesRef = ref(db, `niche_${activeNicheId}/categories`);
    onValue(categoriesRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: StoreCategory[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as StoreCategory[];
        } else {
          loadedList = Object.values(val) as StoreCategory[];
        }
        if (loadedList.length > 0) {
          setCategories(loadedList);
        }
      }
    });
  }
});
