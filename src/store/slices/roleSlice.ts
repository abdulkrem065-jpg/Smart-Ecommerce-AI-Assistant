import { StateCreator } from 'zustand';
import { UserRole, SystemUser, UserPermission } from '../../core/types';

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
    // Should fetch from Firebase
  },

  addRole: (role) => {
    const newRole: UserRole = {
      ...role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      userRoles: [...state.userRoles, newRole]
    }));
  },

  updateRole: (id, updates) => {
    set((state) => ({
      userRoles: state.userRoles.map((r) => r.id === id ? { ...r, ...updates } : r)
    }));
  },

  deleteRole: (id) => {
    set((state) => ({
      userRoles: state.userRoles.filter((r) => r.id !== id)
    }));
  },

  fetchUsers: () => {
    // Should fetch from Firebase
  },

  addUser: (user) => {
    const newUser: SystemUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      systemUsers: [...state.systemUsers, newUser]
    }));
  },

  updateUser: (id, updates) => {
    set((state) => ({
      systemUsers: state.systemUsers.map((u) => u.id === id ? { ...u, ...updates } : u)
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      systemUsers: state.systemUsers.filter((u) => u.id !== id)
    }));
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
