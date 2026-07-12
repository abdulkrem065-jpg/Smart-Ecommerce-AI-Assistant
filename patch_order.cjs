const fs = require('fs');
let code = fs.readFileSync('src/store/slices/orderSlice.ts', 'utf8');

// Add isPeriodLocked to updateOrderStatus
const updateOrderStatus = `  updateOrderStatus: (orderId, status) => {
    const { orders } = get();`;
const newUpdateOrderStatus = `  updateOrderStatus: (orderId, status) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update order.");
      return;
    }
    const { orders } = get();`;
code = code.replace(updateOrderStatus, newUpdateOrderStatus);

// Add isPeriodLocked to deleteOrder
const deleteOrder = `  deleteOrder: (orderId) => {
    const { orders } = get();`;
const newDeleteOrder = `  deleteOrder: (orderId) => {
    const state = get() as any;
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot delete order.");
      return;
    }
    const { orders } = get();`;
code = code.replace(deleteOrder, newDeleteOrder);

// Modify addOrder
const addOrder = `  addOrder: (order) => {
    const { orders } = get();
    const newOrders = [order, ...orders];
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
        
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    set(ref(db, \`niche_\${activeNicheId}/orders/\${order.id}\`), cleanUndefined(order))
      .catch((err: any) => console.error("Failed to add order to firebase: ", err));
  },`;

const newAddOrder = `  addOrder: (order) => {
    const state = get() as any;
    
    // 1. Check Fiscal Period Lock
    if (state.isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot create new order.");
      return;
    }

    // 2. Deduct Stock automatically
    for (const item of order.items) {
      if (item.product.is_digital_service || item.product.isApiProduct) continue; // Skip digital if not tracked
      const success = state.deductStock(item.product.id, item.quantity);
      if (!success) {
        console.warn(\`Failed to deduct stock for product \${item.product.id}. Order aborted.\`);
        return false;
      }
    }

    // 3. Create Auto Journal Entry
    if (state.createAutoJournalEntry) {
      // Determine tax (simplified logic: Assuming tax is already in totalPrice or we need to extract it)
      // We will just debit cash/customer and credit sales for the total.
      const isCash = order.paymentMethod === 'كاش' || order.paymentMethod === 'نقدي' || order.paymentMethod === 'شبكة' || order.paymentMethod === 'حوالة';
      const debitAccountId = isCash ? 'ACC-CASH' : (order.customerId ? \`CUST-\${order.customerId}\` : 'ACC-CUSTOMERS');
      const debitAccountName = isCash ? 'الصندوق / البنك' : (order.customerName ? \`عميل: \${order.customerName}\` : 'العملاء');

      const journalPayload = {
        description: \`مبيعات فاتورة رقم \${order.id} للعميل \${order.customerName}\`,
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
      // Add to customer debt
      state.updateCustomerBalance(order.customerId, order.totalPrice);
    }

    const { orders } = get();
    const newOrders = [order, ...orders];
    set({ orders: newOrders });
    localStorage.setItem("store_orders", JSON.stringify(newOrders));
        
    // Write directly to Firebase
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    set(ref(db, \`niche_\${activeNicheId}/orders/\${order.id}\`), cleanUndefined(order))
      .catch((err: any) => console.error("Failed to add order to firebase: ", err));
  },`;

code = code.replace(addOrder, newAddOrder);

fs.writeFileSync('src/store/slices/orderSlice.ts', code);
