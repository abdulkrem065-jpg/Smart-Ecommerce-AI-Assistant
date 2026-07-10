import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './authSlice';
import { TenantSlice, createTenantSlice } from './tenantSlice';
import { OrderSlice, createOrderSlice } from './slices/orderSlice';
import { InventorySlice, createInventorySlice } from './slices/inventorySlice';

export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createTenantSlice(...a),
  ...createOrderSlice(...a),
  ...createInventorySlice(...a)
}));
