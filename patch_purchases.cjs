const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');

code = code.replace(/import \{ PurchaseInvoice, PurchaseItem \} from '\.\.\/\.\.\/\.\.\/core\/types';/, "import { PurchaseInvoice, PurchaseItem } from '../../../core/types';\nimport { t } from '../../../core/translations';");

code = code.replace(/\{lang === 'en' \? 'Purchase Invoices' : 'فواتير المشتريات'\}/g, "{t('purchaseInvoices.title', lang)}");
code = code.replace(/\{lang === 'en' \? 'Search by ID or supplier\.\.\.' : 'بحث برقم الفاتورة أو المورد\.\.\.'\}/g, "{t('searchByIdOrSupplier', lang)}");
code = code.replace(/\{lang === 'en' \? 'All Statuses' : 'جميع الحالات'\}/g, "{t('allStatuses', lang)}");
code = code.replace(/\{lang === 'en' \? 'Open' : 'مفتوحة'\}/g, "{t('open', lang)}");
code = code.replace(/\{lang === 'en' \? 'Paid' : 'مدفوعة'\}/g, "{t('paid', lang)}");
code = code.replace(/\{lang === 'en' \? 'Cancelled' : 'ملغية'\}/g, "{t('cancelled', lang)}");

code = code.replace(/\{lang === 'en' \? 'Invoice ID' : 'رقم الفاتورة'\}/g, "{t('invoiceId', lang)}");
code = code.replace(/\{lang === 'en' \? 'Supplier' : 'المورد'\}/g, "{t('supplier', lang)}");
code = code.replace(/\{lang === 'en' \? 'Date' : 'التاريخ'\}/g, "{t('date', lang)}");
code = code.replace(/\{lang === 'en' \? 'Total Amount' : 'المبلغ الإجمالي'\}/g, "{t('totalAmount', lang)}");
code = code.replace(/\{lang === 'en' \? 'Status' : 'الحالة'\}/g, "{t('status', lang)}");
code = code.replace(/\{lang === 'en' \? 'Actions' : 'إجراءات'\}/g, "{t('actions', lang)}");

code = code.replace(/\{lang === 'en' \? 'No invoices match your search' : 'لا توجد فواتير مطابقة للبحث'\}/g, "{t('noInvoicesMatch', lang)}");

code = code.replace(/\{lang === 'en' \? 'Purchase Invoice Details' : 'تفاصيل فاتورة المشتريات'\}/g, "{t('invoiceDetails', lang)}");
code = code.replace(/\{lang === 'en' \? 'Supplier Name' : 'اسم المورد'\}/g, "{t('supplierName', lang)}");
code = code.replace(/\{lang === 'en' \? 'Invoice Date' : 'تاريخ الفاتورة'\}/g, "{t('invoiceDate', lang)}");
code = code.replace(/\{lang === 'en' \? 'Payment Date' : 'تاريخ السداد'\}/g, "{t('paymentDate', lang)}");
code = code.replace(/\{lang === 'en' \? 'Purchased Items' : 'الأصناف المشتراة'\}/g, "{t('purchasedItems', lang)}");
code = code.replace(/\{lang === 'en' \? 'Product' : 'المنتج'\}/g, "{t('product', lang)}");
code = code.replace(/\{lang === 'en' \? 'Quantity' : 'الكمية'\}/g, "{t('quantity', lang)}");
code = code.replace(/\{lang === 'en' \? 'Unit Cost' : 'تكلفة الوحدة'\}/g, "{t('unitCost', lang)}");
code = code.replace(/\{lang === 'en' \? 'Total' : 'الإجمالي'\}/g, "{t('total', lang)}");
code = code.replace(/\{lang === 'en' \? 'Final Total' : 'الإجمالي النهائي:'\}/g, "{t('finalTotal', lang)}");
code = code.replace(/\{lang === 'en' \? 'Mark as Paid' : 'تسديد الفاتورة'\}/g, "{t('markAsPaid', lang)}");

code = code.replace(/lang === 'en' \? 'Search by ID or supplier...' : 'بحث برقم الفاتورة أو المورد...'/g, "t('searchByIdOrSupplier', lang)");
code = code.replace(/lang === 'en' \? 'View Details' : 'عرض التفاصيل'/g, "t('viewDetails', lang)");
code = code.replace(/lang === 'en' \? 'Pay Invoice' : 'تسديد الفاتورة'/g, "t('payInvoice', lang)");
code = code.replace(/lang === 'en' \? 'Are you sure you want to mark this invoice as paid\?' : 'هل أنت متأكد من تسديد هذه الفاتورة؟'/g, "t('payInvoiceConfirm', lang)");

fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', code);
