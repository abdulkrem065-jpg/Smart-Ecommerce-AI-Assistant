const fs = require('fs');

let content = fs.readFileSync('src/core/types.ts', 'utf8');

const newInterfaces = `
// الموظف
export interface Employee {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  position: string;           // المسمى الوظيفي
  department: string;         // القسم
  basicSalary: number;        // الراتب الأساسي
  housingAllowance: number;   // بدل سكن
  transportAllowance: number; // بدل نقل
  otherAllowances: number;    // بدلات أخرى
  deductions: number;         // استقطاعات شهرية ثابتة
  joinDate: string;           // تاريخ الالتحاق
  status: 'نشط' | 'مستقيل' | 'موقوف';
  bankAccount?: string;       // رقم الحساب البنكي (لتحويل الراتب)
  idNumber?: string;          // رقم الهوية
  notes?: string;
}

// مسير الرواتب
export interface PayrollRun {
  id: string;
  month: number;              // الشهر (1-12)
  year: number;               // السنة
  date: string;               // تاريخ التشغيل
  status: 'مفتوح' | 'معتمد' | 'مدفوع';
  entries: PayrollEntry[];
  totalGross: number;         // إجمالي المستحقات
  totalDeductions: number;    // إجمالي الاستقطاعات
  totalNet: number;           // صافي الرواتب
  journalEntryId?: string;    // معرف القيد المحاسبي
}

// بند في مسير الرواتب
export interface PayrollEntry {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  additions: number;          // إضافات هذا الشهر
  deductions: number;         // استقطاعات هذا الشهر
  netSalary: number;          // صافي الراتب
}

// إشعار
export interface Notification {
  id: string;
  date: string;
  type: 'تحذير' | 'معلومة' | 'نجاح' | 'خطر';
  title: string;
  message: string;
  module: string;             // الوحدة المرتبطة
  referenceId?: string;       // معرف العنصر المرتبط
  isRead: boolean;
}
`;

fs.writeFileSync('src/core/types.ts', content + newInterfaces);
