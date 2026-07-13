import { StateCreator } from 'zustand';
import { Employee } from '../../core/types';
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


export interface EmployeeSlice {
  employees: Employee[];
  fetchEmployees: () => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  changeEmployeeStatus: (id: string, status: Employee['status']) => void;
}

export const createEmployeeSlice: StateCreator<
  EmployeeSlice & any,
  [],
  [],
  EmployeeSlice
> = (set, get) => ({
  employees: [],
  
  fetchEmployees: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    const employeesRef = ref(db, `niche_${activeNicheId}/employees`);
    onValue(employeesRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        let loadedList: Employee[] = [];
        if (Array.isArray(val)) {
          loadedList = val.filter(Boolean) as Employee[];
        } else {
          loadedList = Object.values(val) as Employee[];
        }
        set({ employees: loadedList });
      } else {
        set({ employees: [] });
      }
    });
  },

  addEmployee: (employee) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot add employee.");
      return;
    }
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    set((state) => ({
      employees: [...state.employees, newEmployee],
    }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/employees/${newEmployee.id}`), cleanUndefined(newEmployee))
      .catch((err: any) => console.error("Failed to add employee:", err));
  },

  updateEmployee: (id, updates) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update employee.");
      return;
    }
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
    const updatedEmployee = get().employees.find((e: Employee) => e.id === id);
    if (updatedEmployee) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/employees/${id}`), cleanUndefined(updatedEmployee))
        .catch((err: any) => console.error("Failed to update employee:", err));
    }
  },

  deleteEmployee: (id) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot delete employee.");
      return;
    }
    // Check if payrolls exist in a real app
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/employees/${id}`))
      .catch((err: any) => console.error("Failed to delete employee:", err));
  },

  changeEmployeeStatus: (id, status) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot change employee status.");
      return;
    }
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, status } : e
      ),
    }));
    const updatedEmployeeStatus = get().employees.find((e: Employee) => e.id === id);
    if (updatedEmployeeStatus) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/employees/${id}`), cleanUndefined(updatedEmployeeStatus))
        .catch((err: any) => console.error("Failed to change employee status:", err));
    }
  },
});
