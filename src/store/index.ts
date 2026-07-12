import { FixedAssetSlice, createFixedAssetSlice } from './slices/fixedAssetSlice';
import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './authSlice';
import { TenantSlice, createTenantSlice } from './tenantSlice';
import { OrderSlice, createOrderSlice } from './slices/orderSlice';
import { InventorySlice, createInventorySlice } from './slices/inventorySlice';
import { AccountingSlice, createAccountingSlice } from './slices/accountingSlice';
import { JournalEngineSlice, createJournalEngineSlice } from './slices/journalEngineSlice';
import { FinancialReportSlice, createFinancialReportSlice } from './slices/financialReportSlice';
import { CustomerSlice, createCustomerSlice } from './slices/customerSlice';
import { SalesReturnSlice, createSalesReturnSlice } from './slices/salesReturnSlice';
import { SupplierSlice, createSupplierSlice } from './slices/supplierSlice';
import { PurchaseSlice, createPurchaseSlice } from './slices/purchaseSlice';
import { CashSlice, createCashSlice } from './slices/cashSlice';
import { CostCenterSlice, createCostCenterSlice } from './slices/costCenterSlice';
import { RoleSlice, createRoleSlice } from './slices/roleSlice';
import { EmployeeSlice, createEmployeeSlice } from './slices/employeeSlice';
import { PayrollSlice, createPayrollSlice } from './slices/payrollSlice';
import { NotificationSlice, createNotificationSlice } from './slices/notificationSlice';

export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice & AccountingSlice & JournalEngineSlice & FinancialReportSlice & CustomerSlice & SalesReturnSlice & SupplierSlice & PurchaseSlice & CashSlice & FixedAssetSlice & CostCenterSlice & RoleSlice & EmployeeSlice & PayrollSlice & NotificationSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createTenantSlice(...a),
  ...createOrderSlice(...a),
  ...createInventorySlice(...a),
  ...createAccountingSlice(...a),
  ...createJournalEngineSlice(...a),
  ...createFinancialReportSlice(...a),
  ...createCustomerSlice(...a),
  ...createSalesReturnSlice(...a),
  ...createSupplierSlice(...a),
  ...createPurchaseSlice(...a),
  ...createCashSlice(...a),
  ...createFixedAssetSlice(...a),
  ...createCostCenterSlice(...a),
  ...createRoleSlice(...a),
  ...createEmployeeSlice(...a),
  ...createPayrollSlice(...a),
  ...createNotificationSlice(...a)
}));
