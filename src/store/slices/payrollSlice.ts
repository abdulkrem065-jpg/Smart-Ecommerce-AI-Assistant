import { StateCreator } from 'zustand';
import { PayrollRun, PayrollEntry, Employee } from '../../core/types';
import { ref, set as firebaseSet, onValue, remove } from 'firebase/database';
import { db } from '../../firebase';

function cleanUndefined(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(item => cleanUndefined(item));
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) cleaned[key] = cleanUndefined(obj[key]);
    }
    return cleaned;
  }
  return obj;
}


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
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const payrollsRef = ref(db, `niche_${activeNicheId}/payroll_runs`);
    onValue(payrollsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: PayrollRun[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as PayrollRun[];
        } else {
          loadedList = Object.values(val) as PayrollRun[];
        }
        set({ payrollRuns: loadedList });
      } else {
        set({ payrollRuns: [] });
      }
    });
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
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/payroll_runs/${newPayroll.id}`), cleanUndefined(newPayroll))
      .catch((err: any) => console.error("Failed to create payroll run:", err));
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

      const updatedRuns = state.payrollRuns.map((p: PayrollRun) =>
          p.id === id ? { ...p, status: 'معتمد', journalEntryId } : p
        );
        return { payrollRuns: updatedRuns };
      });
      const updatedRun = get().payrollRuns.find((p: PayrollRun) => p.id === id);
      if (updatedRun) {
        const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
        firebaseSet(ref(db, `niche_${activeNicheId}/payroll_runs/${id}`), cleanUndefined(updatedRun));
      }
  },

  payPayroll: (id, bankAccountId) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot pay payroll.");
      return;
    }

    set(state => {
      // In a real app, generate the payment voucher and update cash balances
      const updatedRuns = state.payrollRuns.map((p: PayrollRun) =>
          p.id === id ? { ...p, status: 'مدفوع' } : p
        );
        return { payrollRuns: updatedRuns };
      });
      const updatedRunPay = get().payrollRuns.find((p: PayrollRun) => p.id === id);
      if (updatedRunPay) {
        const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
        firebaseSet(ref(db, `niche_${activeNicheId}/payroll_runs/${id}`), cleanUndefined(updatedRunPay));
      }
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
