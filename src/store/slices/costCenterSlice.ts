import { StateCreator } from 'zustand';
import { CostCenter } from '../../core/types';

export interface CostCenterSlice {
  costCenters: CostCenter[];
  fetchCostCenters: () => void;
  addCostCenter: (center: Omit<CostCenter, 'id' | 'createdAt' | 'actualSpending'>) => void;
  updateCostCenter: (id: string, updates: Partial<CostCenter>) => void;
  deleteCostCenter: (id: string) => void;
  updateCenterBudget: (id: string, newBudget: number) => void;
  updateCenterSpending: (id: string, amount: number) => void;
  getCentersTree: () => (CostCenter & { children: CostCenter[] })[];
}

export const createCostCenterSlice: StateCreator<
  CostCenterSlice & any,
  [],
  [],
  CostCenterSlice
> = (set, get) => ({
  costCenters: [],
  
  fetchCostCenters: () => {
    // In a real app, this would fetch from Firebase
    // For now, we leave it empty or mock it
  },

  addCostCenter: (center) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot add cost center.");
      return;
    }
    const newCenter: CostCenter = {
      ...center,
      id: Date.now().toString(),
      actualSpending: 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      costCenters: [...state.costCenters, newCenter],
    }));
  },

  updateCostCenter: (id, updates) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update cost center.");
      return;
    }
    set((state) => ({
      costCenters: state.costCenters.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteCostCenter: (id) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot delete cost center.");
      return;
    }
    // Note: should check if it's related to transactions, but we can just delete it for now
    set((state) => ({
      costCenters: state.costCenters.filter((c) => c.id !== id),
    }));
  },

  updateCenterBudget: (id, newBudget) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update budget.");
      return;
    }
    set((state) => ({
      costCenters: state.costCenters.map((c) =>
        c.id === id ? { ...c, budget: newBudget } : c
      ),
    }));
  },

  updateCenterSpending: (id, amount) => {
    if ((get() as any).isPeriodLocked) {
      console.warn("Fiscal period is locked. Cannot update spending.");
      return;
    }
    set((state) => ({
      costCenters: state.costCenters.map((c) =>
        c.id === id ? { ...c, actualSpending: c.actualSpending + amount } : c
      ),
    }));
  },

  getCentersTree: () => {
    const centers = get().costCenters;
    const map = new Map<string, CostCenter & { children: CostCenter[] }>();
    const tree: (CostCenter & { children: CostCenter[] })[] = [];

    centers.forEach((center) => {
      map.set(center.id, { ...center, children: [] });
    });

    centers.forEach((center) => {
      if (center.parentId) {
        const parent = map.get(center.parentId);
        if (parent) {
          parent.children.push(map.get(center.id)!);
        } else {
          tree.push(map.get(center.id)!);
        }
      } else {
        tree.push(map.get(center.id)!);
      }
    });

    return tree;
  },
});
