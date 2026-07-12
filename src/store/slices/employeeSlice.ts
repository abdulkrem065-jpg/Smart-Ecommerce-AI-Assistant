import { StateCreator } from 'zustand';
import { Employee } from '../../core/types';

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
    // Should fetch from Firebase
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
  },
});
