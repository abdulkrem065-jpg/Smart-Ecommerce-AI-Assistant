import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Employee, PayrollRun } from '../../../core/types';
import { t } from '../../../core/translations';
import { formatDate } from '../../../core/utils';
import { Users, Plus, Edit, Trash2, X, CheckCircle, FileText, Check, DollarSign } from 'lucide-react';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';

export const EmployeesTab: React.FC = () => {  const lang = localStorage.getItem('store_lang') || 'ar';
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { employees, payrollRuns, addEmployee, updateEmployee, deleteEmployee, changeEmployeeStatus, createPayrollRun, approvePayroll, payPayroll } = useStore();

  // Employee Modal
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState<Partial<Employee>>({
    fullName: '', phone: '', email: '', address: '', position: '', department: '',
    basicSalary: 0, housingAllowance: 0, transportAllowance: 0, otherAllowances: 0,
    deductions: 0, joinDate: new Date().toISOString().split('T')[0], status: 'نشط',
    bankAccount: '', idNumber: '', notes: ''
  });

  // Payroll Modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollMonth, setPayrollMonth] = useState(new Date().getMonth() + 1);
  const [payrollYear, setPayrollYear] = useState(new Date().getFullYear());

  // View Payroll Details Modal
  const [viewingPayroll, setViewingPayroll] = useState<PayrollRun | null>(null);

  const openEmployeeModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setEmployeeForm(emp);
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        fullName: '', phone: '', email: '', address: '', position: '', department: '',
        basicSalary: 0, housingAllowance: 0, transportAllowance: 0, otherAllowances: 0,
        deductions: 0, joinDate: new Date().toISOString().split('T')[0], status: 'نشط',
        bankAccount: '', idNumber: '', notes: ''
      });
    }
    setIsEmployeeModalOpen(true);
  };

  const saveEmployee = () => {
    if (!employeeForm.fullName || !employeeForm.position || !employeeForm.department) return;
    
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeForm);
    } else {
      addEmployee(employeeForm as Omit<Employee, 'id'>);
    }
    setIsEmployeeModalOpen(false);
  };

  const handleCreatePayroll = () => {
    createPayrollRun(payrollMonth, payrollYear);
    setIsPayrollModalOpen(false);
  };

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(e => e.status === 'نشط').length || 0;
  const totalMonthlySalaries = employees?.filter(e => e.status === 'نشط').reduce((sum, e) => sum + (e.basicSalary || 0) + (e.housingAllowance || 0) + (e.transportAllowance || 0) + (e.otherAllowances || 0), 0) || 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-900/30 p-2 rounded-lg">
            <Users className="text-emerald-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">{t('employees.title')}</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 bg-[#0f172a] p-2 rounded-xl shadow-sm border border-blue-900/40">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'employees' ? 'bg-emerald-900/30 text-emerald-400 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Users size={18} />
          {t('employees')}
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'payroll' ? 'bg-emerald-900/30 text-emerald-400 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <FileText size={18} />
          {t('payroll')}
        </button>
      </div>

      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-blue-900/40 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">إجمالي الموظفين</p>
                <h3 className="text-2xl font-bold text-white">{totalEmployees}</h3>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg text-emerald-400">
                <Users size={24} />
              </div>
            </div>
            <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-blue-900/40 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">الموظفين النشطين</p>
                <h3 className="text-2xl font-bold text-emerald-400">{activeEmployees}</h3>
              </div>
              <div className="bg-green-900/20 p-3 rounded-lg text-green-400">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-blue-900/40 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">إجمالي الرواتب الشهرية</p>
                <h3 className="text-2xl font-bold text-blue-400">{totalMonthlySalaries.toLocaleString()}</h3>
              </div>
              <div className="bg-blue-900/20 p-3 rounded-lg text-blue-400">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-xl shadow-sm border border-blue-900/40 p-6 overflow-x-auto">
            <div className="flex justify-end mb-4">
              <button onClick={() => openEmployeeModal()} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus size={18} />
                <span>{t('addEmployee')}</span>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-3">{t('name')}</th>
                  <th className="px-6 py-3">{t('position')}</th>
                  <th className="px-6 py-3">{t('department')}</th>
                  <th className="px-6 py-3">{t('basicSalary')}</th>
                  <th className="px-6 py-3">{t('status')}</th>
                  <th className="px-6 py-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {employees?.map(e => (
                  <tr key={e.id} className="border-b hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{e.fullName}</td>
                    <td className="px-6 py-4">{e.position}</td>
                    <td className="px-6 py-4">{e.department}</td>
                    <td className="px-6 py-4">{e.basicSalary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        e.status === 'نشط' ? 'bg-green-900/30 text-green-400' :
                        e.status === 'مستقيل' ? 'bg-gray-100 text-white' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEmployeeModal(e)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => deleteEmployee(e.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
                {(!employees || employees.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-4">
                      <EmptyState title={t('noData', lang)} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-[#0f172a] rounded-xl shadow-sm border border-blue-900/40 p-6 overflow-x-auto">
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsPayrollModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
              <span>{t('createPayroll')}</span>
            </button>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
              <tr>
                <th className="px-6 py-3">الشهر / السنة</th>
                <th className="px-6 py-3">التاريخ</th>
                <th className="px-6 py-3">{t('grossSalary')}</th>
                <th className="px-6 py-3">{t('totalNet')}</th>
                <th className="px-6 py-3">{t('status')}</th>
                <th className="px-6 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {payrollRuns?.map(p => (
                <tr key={p.id} className="border-b hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-white">{p.month} / {p.year}</td>
                  <td className="px-6 py-4">{formatDate(p.date, lang)}</td>
                  <td className="px-6 py-4 font-medium">{p.totalGross.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{p.totalNet.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'مدفوع' ? 'bg-green-900/30 text-green-400' :
                      p.status === 'معتمد' ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setViewingPayroll(p)} className="text-indigo-400 hover:bg-indigo-900/20 p-2 rounded-lg bg-[#1e293b] text-xs font-medium">عرض</button>
                    {p.status === 'مفتوح' && (
                      <button onClick={() => approvePayroll(p.id)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded-lg flex items-center gap-1 bg-[#1e293b] text-xs font-medium"><Check size={14}/> {t('approvePayroll')}</button>
                    )}
                    {p.status === 'معتمد' && (
                      <button onClick={() => payPayroll(p.id, 'BANK_ID')} className="text-green-400 hover:bg-green-900/20 p-2 rounded-lg flex items-center gap-1 bg-[#1e293b] text-xs font-medium"><DollarSign size={14}/> {t('payPayroll')}</button>
                    )}
                  </td>
                </tr>
              ))}
              {(!payrollRuns || payrollRuns.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    لا توجد مسيرات رواتب
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center sticky top-0 bg-[#0f172a] z-10">
              <h3 className="font-semibold text-white">{editingEmployee ? t('edit') : t('addEmployee')}</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-300"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">{t('name')}</label><input type="text" value={employeeForm.fullName} onChange={e => setEmployeeForm({...employeeForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('phone')}</label><input type="text" value={employeeForm.phone} onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('email')}</label><input type="email" value={employeeForm.email} onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('position')}</label><input type="text" value={employeeForm.position} onChange={e => setEmployeeForm({...employeeForm, position: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('department')}</label><input type="text" value={employeeForm.department} onChange={e => setEmployeeForm({...employeeForm, department: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('basicSalary')}</label><input type="number" value={employeeForm.basicSalary} onChange={e => setEmployeeForm({...employeeForm, basicSalary: Number(e.target.value)})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('housingAllowance')}</label><input type="number" value={employeeForm.housingAllowance} onChange={e => setEmployeeForm({...employeeForm, housingAllowance: Number(e.target.value)})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('transportAllowance')}</label><input type="number" value={employeeForm.transportAllowance} onChange={e => setEmployeeForm({...employeeForm, transportAllowance: Number(e.target.value)})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('otherAllowances')}</label><input type="number" value={employeeForm.otherAllowances} onChange={e => setEmployeeForm({...employeeForm, otherAllowances: Number(e.target.value)})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('deductions')}</label><input type="number" value={employeeForm.deductions} onChange={e => setEmployeeForm({...employeeForm, deductions: Number(e.target.value)})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('joinDate')}</label><input type="date" value={employeeForm.joinDate} onChange={e => setEmployeeForm({...employeeForm, joinDate: e.target.value})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" /></div>
              <div>
                <label className="block text-sm mb-1">{t('status')}</label>
                <select value={employeeForm.status} onChange={e => setEmployeeForm({...employeeForm, status: e.target.value as any})} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg">
                  <option value="نشط">نشط</option>
                  <option value="مستقيل">مستقيل</option>
                  <option value="موقوف">موقوف</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-blue-900/40 flex justify-end gap-2 sticky bottom-0 bg-[#0f172a]">
              <button onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 text-slate-300 bg-[#0f172a] border border-blue-900/40 bg-[#0b1329] text-white rounded-lg">{t('cancel')}</button>
              <button onClick={saveEmployee} className="px-4 py-2 text-white bg-emerald-600 rounded-lg">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#1e293b]">
              <h3 className="font-semibold text-white">{t('createPayroll')}</h3>
              <button onClick={() => setIsPayrollModalOpen(false)} className="text-slate-400 hover:text-slate-300"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">{t('payrollMonth')}</label>
                <input type="number" min="1" max="12" value={payrollMonth} onChange={e => setPayrollMonth(Number(e.target.value))} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('payrollYear')}</label>
                <input type="number" value={payrollYear} onChange={e => setPayrollYear(Number(e.target.value))} className="w-full px-3 py-2 border border-blue-900/40 bg-[#0b1329] text-white rounded-lg" />
              </div>
            </div>
            <div className="p-4 border-t border-blue-900/40 flex justify-end gap-2 bg-[#1e293b]">
              <button onClick={() => setIsPayrollModalOpen(false)} className="px-4 py-2 text-slate-300 bg-[#0f172a] border border-blue-900/40 bg-[#0b1329] text-white rounded-lg">{t('cancel')}</button>
              <button onClick={handleCreatePayroll} className="px-4 py-2 text-white bg-emerald-600 rounded-lg">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Payroll Details */}
      {viewingPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#1e293b]">
              <h3 className="font-semibold text-white">تفاصيل مسير الرواتب ({viewingPayroll.month}/{viewingPayroll.year})</h3>
              <button onClick={() => setViewingPayroll(null)} className="text-slate-400 hover:text-slate-300"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
               <table className="w-full text-sm text-left rtl:text-right text-slate-400">
                <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                  <tr>
                    <th className="px-4 py-2">{t('name')}</th>
                    <th className="px-4 py-2">{t('basicSalary')}</th>
                    <th className="px-4 py-2">{t('housingAllowance')}</th>
                    <th className="px-4 py-2">{t('transportAllowance')}</th>
                    <th className="px-4 py-2">{t('otherAllowances')}</th>
                    <th className="px-4 py-2 text-red-600">{t('deductions')}</th>
                    <th className="px-4 py-2 font-bold text-emerald-400">{t('netSalary')}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingPayroll.entries.map(entry => (
                    <tr key={entry.employeeId} className="border-b">
                      <td className="px-4 py-3 font-medium text-white">{entry.employeeName}</td>
                      <td className="px-4 py-3">{entry.basicSalary.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.housingAllowance.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.transportAllowance.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.otherAllowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">{entry.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">{entry.netSalary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
