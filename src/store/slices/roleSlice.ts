import { StateCreator } from 'zustand';
import { UserRole, SystemUser, UserPermission } from '../../core/types';
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


export interface RoleSlice {
  userRoles: UserRole[];
  systemUsers: SystemUser[];
  fetchRoles: () => void;
  addRole: (role: Omit<UserRole, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, updates: Partial<UserRole>) => void;
  deleteRole: (id: string) => void;
  fetchUsers: () => void;
  addUser: (user: Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;
  checkPermission: (module: string, action: keyof Omit<UserPermission, 'module'>) => boolean;
}

export const createRoleSlice: StateCreator<RoleSlice> = (set, get) => ({
  userRoles: [],
  systemUsers: [],

  fetchRoles: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    onValue(ref(db, `niche_${activeNicheId}/userRoles`), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        set({ userRoles: Array.isArray(val) ? val.filter(Boolean) : Object.values(val) });
      } else {
        set({ userRoles: [] });
      }
    });
  },

  addRole: (role) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    const newRole: UserRole = {
      ...role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({ userRoles: [...state.userRoles, newRole] }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/userRoles/${newRole.id}`), cleanUndefined(newRole));
  },

  updateRole: (id, updates) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    set((state) => ({ userRoles: state.userRoles.map((r) => r.id === id ? { ...r, ...updates } : r) }));
    const updatedRole = get().userRoles.find((r: UserRole) => r.id === id);
    if (updatedRole) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/userRoles/${id}`), cleanUndefined(updatedRole));
    }
  },

  deleteRole: (id) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    set((state) => ({ userRoles: state.userRoles.filter((r) => r.id !== id) }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/userRoles/${id}`));
  },

  fetchUsers: () => {
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    onValue(ref(db, `niche_${activeNicheId}/systemUsers`), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        set({ systemUsers: Array.isArray(val) ? val.filter(Boolean) : Object.values(val) });
      } else {
        set({ systemUsers: [] });
      }
    });
  },

  addUser: (user) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    const newUser: SystemUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({ systemUsers: [...state.systemUsers, newUser] }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    firebaseSet(ref(db, `niche_${activeNicheId}/systemUsers/${newUser.id}`), cleanUndefined(newUser));
  },

  updateUser: (id, updates) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    set((state) => ({ systemUsers: state.systemUsers.map((u) => u.id === id ? { ...u, ...updates } : u) }));
    const updatedUser = get().systemUsers.find((u: SystemUser) => u.id === id);
    if (updatedUser) {
      const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
      firebaseSet(ref(db, `niche_${activeNicheId}/systemUsers/${id}`), cleanUndefined(updatedUser));
    }
  },

  deleteUser: (id) => {
    if ((get() as any).isPeriodLocked) { console.warn('Period locked'); return; }
    set((state) => ({ systemUsers: state.systemUsers.filter((u) => u.id !== id) }));
    const activeNicheId = localStorage.getItem("store_active_niche") || 'hyper_games';
    remove(ref(db, `niche_${activeNicheId}/systemUsers/${id}`));
  },

  checkPermission: (module, action) => {
    // In a real app, you would determine the current user's roleId from auth state.
    // Here we'll just mock it or assume admin if no user is defined.
    // Return true for now to avoid locking out the UI, but this is where the logic goes:
    // const currentUser = ...
    // const role = get().userRoles.find(r => r.id === currentUser.roleId);
    // const permission = role?.permissions.find(p => p.module === module);
    // return permission ? permission[action] : false;
    return true; 
  }
});
