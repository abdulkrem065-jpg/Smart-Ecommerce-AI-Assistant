const fs = require('fs');
let code = fs.readFileSync('src/store/slices/inventorySlice.ts', 'utf8');

// Update Interface
const interfaceDef = `  deleteCategory: (id: string) => void;
  fetchFirebaseProducts: () => void;
}`;
const newInterfaceDef = `  deleteCategory: (id: string) => void;
  fetchFirebaseProducts: () => void;
  deductStock: (productId: string, quantity: number) => boolean;
  increaseStock: (productId: string, quantity: number) => boolean;
}`;
code = code.replace(interfaceDef, newInterfaceDef);

// Add isPeriodLocked to addProduct
const addProduct = `  addProduct: (product) => {
    const newProduct = { ...product, id: Date.now().toString() };`;
const newAddProduct = `  addProduct: (product) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot add product.");
      return;
    }
    const newProduct = { ...product, id: Date.now().toString() };`;
code = code.replace(addProduct, newAddProduct);

// Add isPeriodLocked to updateProduct
const updateProduct = `  updateProduct: (id, updated) => {
    const { products } = get();`;
const newUpdateProduct = `  updateProduct: (id, updated) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot update product.");
      return;
    }
    const { products } = get();`;
code = code.replace(updateProduct, newUpdateProduct);

// Add isPeriodLocked to deleteProduct
const deleteProduct = `  deleteProduct: (id) => {
    const { products } = get();`;
const newDeleteProduct = `  deleteProduct: (id) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot delete product.");
      return;
    }
    const { products } = get();`;
code = code.replace(deleteProduct, newDeleteProduct);

// Add new methods deductStock and increaseStock at the end
const fetchProducts = `  fetchFirebaseProducts: () => {
    const { setProducts, setCategories } = get();`;

const newMethods = `  deductStock: (productId, quantity) => {
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
    const { setProducts, setCategories } = get();`;

code = code.replace(fetchProducts, newMethods);

fs.writeFileSync('src/store/slices/inventorySlice.ts', code);
