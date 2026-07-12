const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');

code = code.replace(/import \{ CashAccount, ReceiptVoucher, PaymentVoucher, Custody, CashTransfer \} from '\.\.\/\.\.\/\.\.\/core\/types';/, "import { CashAccount, ReceiptVoucher, PaymentVoucher, Custody, CashTransfer } from '../../../core/types';\nimport { t } from '../../../core/translations';");

code = code.replace(/\{lang === 'en' \? 'Accounts' : 'الحسابات'\}/g, "{t('accounts', lang)}");
code = code.replace(/lang === 'en' \? 'Accounts' : 'الحسابات'/g, "t('accounts', lang)");
code = code.replace(/\{lang === 'en' \? 'Receipts' : 'سندات القبض'\}/g, "{t('receipts', lang)}");
code = code.replace(/lang === 'en' \? 'Receipts' : 'سندات القبض'/g, "t('receipts', lang)");
code = code.replace(/\{lang === 'en' \? 'Payments' : 'سندات الصرف'\}/g, "{t('payments', lang)}");
code = code.replace(/lang === 'en' \? 'Payments' : 'سندات الصرف'/g, "t('payments', lang)");
code = code.replace(/\{lang === 'en' \? 'Custodies' : 'العهد'\}/g, "{t('custodies', lang)}");
code = code.replace(/lang === 'en' \? 'Custodies' : 'العهد'/g, "t('custodies', lang)");
code = code.replace(/\{lang === 'en' \? 'Transfers' : 'التحويلات'\}/g, "{t('transfers', lang)}");
code = code.replace(/lang === 'en' \? 'Transfers' : 'التحويلات'/g, "t('transfers', lang)");

code = code.replace(/\{lang === 'en' \? 'Treasury & Banks' : 'الخزينة والبنوك'\}/g, "{t('cashAccounts.title', lang)}");
code = code.replace(/\{lang === 'en' \? 'Cash & Bank Accounts' : 'حسابات الصناديق والبنوك'\}/g, "{t('cashAndBankAccounts', lang)}");
code = code.replace(/\{lang === 'en' \? 'Add Account' : 'إضافة حساب'\}/g, "{t('addAccount', lang)}");

code = code.replace(/\{lang === 'en' \? 'No accounts added yet' : 'لم يتم إضافة حسابات بعد'\}/g, "{t('noAccountsAdded', lang)}");

code = code.replace(/\{lang === 'en' \? 'Date' : 'التاريخ'\}/g, "{t('date', lang)}");
code = code.replace(/\{lang === 'en' \? 'Description' : 'البيان'\}/g, "{t('description', lang)}");
code = code.replace(/\{lang === 'en' \? 'From' : 'من جهة'\}/g, "{t('fromParty', lang)}");
code = code.replace(/\{lang === 'en' \? 'Deposited To' : 'الحساب المودع'\}/g, "{t('depositedTo', lang)}");
code = code.replace(/\{lang === 'en' \? 'Amount' : 'المبلغ'\}/g, "{t('amount', lang)}");

code = code.replace(/\{lang === 'en' \? 'No receipt vouchers' : 'لا توجد سندات قبض'\}/g, "{t('noReceiptVouchers', lang)}");

code = code.replace(/\{lang === 'en' \? 'Paid To' : 'إلى جهة'\}/g, "{t('paidTo', lang)}");
code = code.replace(/\{lang === 'en' \? 'Paid From' : 'تم الصرف من'\}/g, "{t('paidFrom', lang)}");
code = code.replace(/\{lang === 'en' \? 'No payment vouchers' : 'لا توجد سندات صرف'\}/g, "{t('noPaymentVouchers', lang)}");

code = code.replace(/\{lang === 'en' \? 'Employee' : 'الموظف'\}/g, "{t('employee', lang)}");
code = code.replace(/\{lang === 'en' \? 'Purpose' : 'الغرض'\}/g, "{t('purpose', lang)}");
code = code.replace(/\{lang === 'en' \? 'Status' : 'الحالة'\}/g, "{t('status', lang)}");
code = code.replace(/\{lang === 'en' \? 'No custodies' : 'لا توجد عهد'\}/g, "{t('noCustodies', lang)}");

code = code.replace(/\{lang === 'en' \? 'From Account' : 'من حساب'\}/g, "{t('fromAccount', lang)}");
code = code.replace(/\{lang === 'en' \? 'To Account' : 'إلى حساب'\}/g, "{t('toAccount', lang)}");
code = code.replace(/\{lang === 'en' \? 'No transfers' : 'لا توجد تحويلات'\}/g, "{t('noTransfers', lang)}");

code = code.replace(/\{lang === 'en' \? 'Add New Account' : 'إضافة حساب خزينة جديد'\}/g, "{t('addNewAccount', lang)}");
code = code.replace(/\{lang === 'en' \? 'Account Name' : 'اسم الحساب'\}/g, "{t('accountName', lang)}");
code = code.replace(/placeholder=\{lang === 'en' \? 'e.g. Main Cash' : 'مثال: الصندوق الرئيسي'\}/g, "placeholder={t('accountNamePlaceholder', lang)}");
code = code.replace(/\{lang === 'en' \? 'Type' : 'النوع'\}/g, "{t('type', lang)}");
code = code.replace(/\{lang === 'en' \? 'Cash Box' : 'صندوق \(نقد\)'\}/g, "{t('cashBox', lang)}");
code = code.replace(/\{lang === 'en' \? 'Bank Account' : 'حساب بنكي'\}/g, "{t('bankAccount', lang)}");
code = code.replace(/\{lang === 'en' \? 'Opening Balance' : 'الرصيد الافتتاحي'\}/g, "{t('openingBalance', lang)}");
code = code.replace(/\{lang === 'en' \? 'Save' : 'حفظ'\}/g, "{t('save', lang)}");
code = code.replace(/\{lang === 'en' \? 'Cancel' : 'إلغاء'\}/g, "{t('cancel', lang)}");

fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', code);
