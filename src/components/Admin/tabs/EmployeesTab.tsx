import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Employee, PayrollRun } from '../../../core/types';
import { t } from '../../../core/translations';
import { Users, Plus, Edit, Trash2, X, CheckCircle, FileText, Check, DollarSign } from 'lucide-react';

export const EmployeesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');
  
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
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Users className="text-emerald-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('employees.title')}</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'employees' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users size={18} />
          {t('employees')}
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'payroll' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText size={18} />
          {t('payroll')}
        </button>
      </div>

      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">إجمالي الموظفين</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalEmployees}</h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                <Users size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">الموظفين النشطين</p>
                <h3 className="text-2xl font-bold text-emerald-600">{activeEmployees}</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">إجمالي الرواتب الشهرية</p>
                <h3 className="text-2xl font-bold text-blue-600">{totalMonthlySalaries.toLocaleString()}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
            <div className="flex justify-end mb-4">
              <button onClick={() => openEmployeeModal()} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus size={18} />
                <span>{t('addEmployee')}</span>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                  <tr key={e.id} className="border-b hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{e.fullName}</td>
                    <td className="px-6 py-4">{e.position}</td>
                    <td className="px-6 py-4">{e.department}</td>
                    <td className="px-6 py-4">{e.basicSalary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        e.status === 'نشط' ? 'bg-green-100 text-green-800' :
                        e.status === 'مستقيل' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEmployeeModal(e)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => deleteEmployee(e.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
                {(!employees || employees.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      لا يوجد موظفين
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsPayrollModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
              <span>{t('createPayroll')}</span>
            </button>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                <tr key={p.id} className="border-b hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.month} / {p.year}</td>
                  <td className="px-6 py-4">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{p.totalGross.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{p.totalNet.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'مدفوع' ? 'bg-green-100 text-green-800' :
                      p.status === 'معتمد' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setViewingPayroll(p)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg bg-gray-50 text-xs font-medium">عرض</button>
                    {p.status === 'مفتوح' && (
                      <button onClick={() => approvePayroll(p.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg flex items-center gap-1 bg-gray-50 text-xs font-medium"><Check size={14}/> {t('approvePayroll')}</button>
                    )}
                    {p.status === 'معتمد' && (
                      <button onClick={() => payPayroll(p.id, 'BANK_ID')} className="text-green-600 hover:bg-green-50 p-2 rounded-lg flex items-center gap-1 bg-gray-50 text-xs font-medium"><DollarSign size={14}/> {t('payPayroll')}</button>
                    )}
                  </td>
                </tr>
              ))}
              {(!payrollRuns || payrollRuns.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-800">{editingEmployee ? t('edit') : t('addEmployee')}</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">{t('name')}</label><input type="text" value={employeeForm.fullName} onChange={e => setEmployeeForm({...employeeForm, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('phone')}</label><input type="text" value={employeeForm.phone} onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('email')}</label><input type="email" value={employeeForm.email} onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('position')}</label><input type="text" value={employeeForm.position} onChange={e => setEmployeeForm({...employeeForm, position: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('department')}</label><input type="text" value={employeeForm.department} onChange={e => setEmployeeForm({...employeeForm, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('basicSalary')}</label><input type="number" value={employeeForm.basicSalary} onChange={e => setEmployeeForm({...employeeForm, basicSalary: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('housingAllowance')}</label><input type="number" value={employeeForm.housingAllowance} onChange={e => setEmployeeForm({...employeeForm, housingAllowance: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('transportAllowance')}</label><input type="number" value={employeeForm.transportAllowance} onChange={e => setEmployeeForm({...employeeForm, transportAllowance: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('otherAllowances')}</label><input type="number" value={employeeForm.otherAllowances} onChange={e => setEmployeeForm({...employeeForm, otherAllowances: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('deductions')}</label><input type="number" value={employeeForm.deductions} onChange={e => setEmployeeForm({...employeeForm, deductions: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">{t('joinDate')}</label><input type="date" value={employeeForm.joinDate} onChange={e => setEmployeeForm({...employeeForm, joinDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div>
                <label className="block text-sm mb-1">{t('status')}</label>
                <select value={employeeForm.status} onChange={e => setEmployeeForm({...employeeForm, status: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="نشط">نشط</option>
                  <option value="مستقيل">مستقيل</option>
                  <option value="موقوف">موقوف</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 text-gray-600 bg-white border rounded-lg">{t('cancel')}</button>
              <button onClick={saveEmployee} className="px-4 py-2 text-white bg-emerald-600 rounded-lg">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">{t('createPayroll')}</h3>
              <button onClick={() => setIsPayrollModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">{t('payrollMonth')}</label>
                <input type="number" min="1" max="12" value={payrollMonth} onChange={e => setPayrollMonth(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('payrollYear')}</label>
                <input type="number" value={payrollYear} onChange={e => setPayrollYear(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
              <button onClick={() => setIsPayrollModalOpen(false)} className="px-4 py-2 text-gray-600 bg-white border rounded-lg">{t('cancel')}</button>
              <button onClick={handleCreatePayroll} className="px-4 py-2 text-white bg-emerald-600 rounded-lg">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Payroll Details */}
      {viewingPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">تفاصيل مسير الرواتب ({viewingPayroll.month}/{viewingPayroll.year})</h3>
              <button onClick={() => setViewingPayroll(null)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">{t('name')}</th>
                    <th className="px-4 py-2">{t('basicSalary')}</th>
                    <th className="px-4 py-2">{t('housingAllowance')}</th>
                    <th className="px-4 py-2">{t('transportAllowance')}</th>
                    <th className="px-4 py-2">{t('otherAllowances')}</th>
                    <th className="px-4 py-2 text-red-600">{t('deductions')}</th>
                    <th className="px-4 py-2 font-bold text-emerald-600">{t('netSalary')}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingPayroll.entries.map(entry => (
                    <tr key={entry.employeeId} className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-900">{entry.employeeName}</td>
                      <td className="px-4 py-3">{entry.basicSalary.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.housingAllowance.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.transportAllowance.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.otherAllowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">{entry.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{entry.netSalary.toLocaleString()}</td>
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
