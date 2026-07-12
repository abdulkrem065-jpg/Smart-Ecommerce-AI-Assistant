const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');

// Replace standard lang texts with t()
code = code.replace(/import \{ Order, CartItem \} from '\.\.\/\.\.\/\.\.\/core\/types';/, "import { Order, CartItem } from '../../../core/types';\nimport { t } from '../../../core/translations';");

code = code.replace(/\{lang === 'en' \? 'Sales Invoices' : 'فواتير المبيعات'\}/g, "{t('salesInvoices.title', lang)}");
code = code.replace(/\{lang === 'en' \? 'Search by ID or customer\.\.\.' : 'بحث برقم الفاتورة أو العميل\.\.\.'\}/g, "{t('searchByIdOrCustomer', lang)}");
code = code.replace(/\{lang === 'en' \? 'All Statuses' : 'جميع الحالات'\}/g, "{t('allStatuses', lang)}");
code = code.replace(/\{lang === 'en' \? 'Delivered 🟢' : 'تم التسليم 🟢'\}/g, "{t('delivered', lang)}");
code = code.replace(/\{lang === 'en' \? 'Processing' : 'قيد المعالجة'\}/g, "{t('processing', lang)}");
code = code.replace(/\{lang === 'en' \? 'Rejected 🔴' : 'مرفوض 🔴'\}/g, "{t('rejected', lang)}");

code = code.replace(/\{lang === 'en' \? 'Invoice ID' : 'رقم الفاتورة'\}/g, "{t('invoiceId', lang)}");
code = code.replace(/\{lang === 'en' \? 'Customer' : 'العميل'\}/g, "{t('customer', lang)}");
code = code.replace(/\{lang === 'en' \? 'Date' : 'التاريخ'\}/g, "{t('date', lang)}");
code = code.replace(/\{lang === 'en' \? 'Payment Method' : 'طريقة الدفع'\}/g, "{t('paymentMethod', lang)}");
code = code.replace(/\{lang === 'en' \? 'Total Amount' : 'المبلغ'\}/g, "{t('totalAmount', lang)}");
code = code.replace(/\{lang === 'en' \? 'Status' : 'الحالة'\}/g, "{t('status', lang)}");
code = code.replace(/\{lang === 'en' \? 'Actions' : 'إجراءات'\}/g, "{t('actions', lang)}");

code = code.replace(/\{lang === 'en' \? 'No invoices match your search' : 'لا توجد فواتير مطابقة للبحث'\}/g, "{t('noInvoicesMatch', lang)}");

code = code.replace(/\{lang === 'en' \? 'Invoice Details' : 'تفاصيل الفاتورة'\}/g, "{t('invoiceDetails', lang)}");
code = code.replace(/\{lang === 'en' \? 'Customer Name' : 'اسم العميل'\}/g, "{t('customerName', lang)}");
code = code.replace(/\{lang === 'en' \? 'Phone' : 'رقم الهاتف'\}/g, "{t('phone', lang)}");
code = code.replace(/\{lang === 'en' \? 'Date' : 'تاريخ الفاتورة'\}/g, "{t('invoiceDate', lang)}");
code = code.replace(/\{lang === 'en' \? 'Items' : 'الأصناف'\}/g, "{t('items', lang)}");
code = code.replace(/\{lang === 'en' \? 'Product' : 'اسم المنتج'\}/g, "{t('product', lang)}");
code = code.replace(/\{lang === 'en' \? 'Quantity' : 'الكمية'\}/g, "{t('quantity', lang)}");
code = code.replace(/\{lang === 'en' \? 'Unit Price' : 'السعر'\}/g, "{t('unitPrice', lang)}");
code = code.replace(/\{lang === 'en' \? 'Total' : 'الإجمالي'\}/g, "{t('total', lang)}");
code = code.replace(/\{lang === 'en' \? 'Final Total' : 'الإجمالي النهائي:'\}/g, "{t('finalTotal', lang)}");
code = code.replace(/\{lang === 'en' \? 'Download PDF' : 'تحميل PDF'\}/g, "{t('downloadPdf', lang)}");
code = code.replace(/lang === 'en' \? 'Search by ID or customer...' : 'بحث برقم الفاتورة أو العميل...'/g, "t('searchByIdOrCustomer', lang)");
code = code.replace(/lang === 'en' \? 'View Details' : 'عرض التفاصيل'/g, "t('viewDetails', lang)");

fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', code);
