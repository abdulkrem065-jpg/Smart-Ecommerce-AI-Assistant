import { StateCreator } from 'zustand';
import { PayrollRun, PayrollEntry, Employee } from '../../core/types';

export interface PayrollSlice {
  payrollRuns: PayrollRun[];
  fetchPayrollRuns: () => void;
  createPayrollRun: (month: number, year: number) => void;
  approvePayroll: (id: string) => void;
  payPayroll: (id: string, bankAccountId: string) => void;
  getEmployeePayrollHistory: (employeeId: string) => PayrollEntry[];
}

export const createPayrollSlice: StateCreator<
  PayrollSlice & any,
  [],
  [],
  PayrollSlice
> = (set, get) => ({
  payrollRuns: [],

  fetchPayrollRuns: () => {
    // Should fetch from Firebase
  },

  createPayrollRun: (month, year) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot create payroll run.");
      return;
    }

    const employees: Employee[] = get().employees || [];
    const activeEmployees = employees.filter(e => e.status === 'نشط');
    
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    const entries: PayrollEntry[] = activeEmployees.map(e => {
      const basic = e.basicSalary || 0;
      const housing = e.housingAllowance || 0;
      const transport = e.transportAllowance || 0;
      const other = e.otherAllowances || 0;
      const deductions = e.deductions || 0;
      
      // Default monthly additions/deductions to 0
      const additions = 0;
      const monthlyDeductions = 0;

      const netSalary = basic + housing + transport + other + additions - deductions - monthlyDeductions;
      
      totalGross += (basic + housing + transport + other + additions);
      totalDeductions += (deductions + monthlyDeductions);
      totalNet += netSalary;

      return {
        employeeId: e.id,
        employeeName: e.fullName,
        basicSalary: basic,
        housingAllowance: housing,
        transportAllowance: transport,
        otherAllowances: other,
        additions,
        deductions: deductions + monthlyDeductions,
        netSalary
      };
    });

    const newPayroll: PayrollRun = {
      id: Date.now().toString(),
      month,
      year,
      date: new Date().toISOString(),
      status: 'مفتوح',
      entries,
      totalGross,
      totalDeductions,
      totalNet
    };

    set(state => ({
      payrollRuns: [...state.payrollRuns, newPayroll]
    }));
  },

  approvePayroll: (id) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot approve payroll.");
      return;
    }

    set(state => {
      const payrollRun = state.payrollRuns.find((p: PayrollRun) => p.id === id);
      if (!payrollRun) return state;

      // In a real app, generate the journal entry via JournalEngineSlice
      // const journalEntryId = generateJournalEntry(...)
      const journalEntryId = `JRN-${Date.now()}`;

      return {
        payrollRuns: state.payrollRuns.map((p: PayrollRun) =>
          p.id === id ? { ...p, status: 'معتمد', journalEntryId } : p
        )
      };
    });
  },

  payPayroll: (id, bankAccountId) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot pay payroll.");
      return;
    }

    set(state => {
      // In a real app, generate the payment voucher and update cash balances
      return {
        payrollRuns: state.payrollRuns.map((p: PayrollRun) =>
          p.id === id ? { ...p, status: 'مدفوع' } : p
        )
      };
    });
  },

  getEmployeePayrollHistory: (employeeId) => {
    const history: PayrollEntry[] = [];
    const runs = get().payrollRuns;
    runs.forEach((run: PayrollRun) => {
      const entry = run.entries.find(e => e.employeeId === employeeId);
      if (entry) {
        history.push({ ...entry, _runDate: run.date, _runMonth: run.month, _runYear: run.year } as any);
      }
    });
    return history;
  }
});
