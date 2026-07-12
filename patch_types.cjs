const fs = require('fs');
const path = 'src/core/types.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('export interface FixedAsset')) {
  code += `
// الأصل الثابت
export interface FixedAsset {
  id: string;
  name: string;               // اسم الأصل
  category: string;           // تصنيف (أثاث، أجهزة، مركبات، عقارات)
  purchaseDate: string;       // تاريخ الشراء
  purchaseValue: number;      // قيمة الشراء
  salvageValue: number;       // قيمة الخردة
  usefulLife: number;         // العمر الإنتاجي (بالشهور)
  depreciationMethod: 'قسط ثابت' | 'متناقص';  // طريقة الإهلاك
  depreciationRate: number;   // معدل الإهلاك (يُحتسب تلقائياً)
  accumulatedDepreciation: number;  // مجمع الإهلاك
  bookValue: number;          // القيمة الدفترية الحالية
  monthlyDepreciation: number; // قسط الإهلاك الشهري
  lastDepreciationDate?: string;  // تاريخ آخر إهلاك
  status: 'نشط' | 'مباع' | 'مستهلك';
  notes?: string;
}

// قسط الإهلاك
export interface DepreciationEntry {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  amount: number;
  accumulatedBefore: number;
  accumulatedAfter: number;
  bookValueAfter: number;
  journalEntryId?: string;
}
`;
  fs.writeFileSync(path, code);
}
