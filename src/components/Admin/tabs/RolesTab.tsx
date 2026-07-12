import React, { useState } from 'react';
import { useStore } from '../../../store';
import { t } from '../../../core/translations';
import { Shield, Plus, Edit, Trash2, X, Users, Check, XCircle } from 'lucide-react';
import { UserRole, SystemUser, UserPermission } from '../../../core/types';

export const RolesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  
  const { userRoles, systemUsers, addRole, updateRole, deleteRole, addUser, updateUser, deleteUser } = useStore();

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const defaultPermissions: UserPermission[] = [
    'inventory', 'orders', 'customers', 'suppliers', 
    'sales_invoices', 'purchase_invoices', 'sales_returns', 'purchase_returns',
    'cash_accounts', 'fixed_assets', 'cost_centers', 'accounting', 
    'reports', 'settings', 'users'
  ].map(mod => ({
    module: mod,
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  }));
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<UserPermission[]>(defaultPermissions);

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userForm, setUserForm] = useState<Partial<SystemUser>>({
    fullName: '', username: '', password: '', roleId: '', email: '', phone: '', isActive: true
  });

  const openRoleModal = (role?: UserRole) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      // Merge with default to ensure all modules exist
      const merged = defaultPermissions.map(dp => {
        const existing = role.permissions.find(rp => rp.module === dp.module);
        return existing || dp;
      });
      setPermissions(merged);
    } else {
      setEditingRole(null);
      setRoleName('');
      setPermissions(defaultPermissions);
    }
    setIsRoleModalOpen(true);
  };

  const saveRole = () => {
    if (!roleName) return;
    if (editingRole) {
      updateRole(editingRole.id, { name: roleName, permissions });
    } else {
      addRole({ name: roleName, permissions });
    }
    setIsRoleModalOpen(false);
  };

  const handlePermissionChange = (module: string, field: keyof UserPermission, value: boolean) => {
    setPermissions(prev => prev.map(p => p.module === module ? { ...p, [field]: value } : p));
  };

  const openUserModal = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ ...user, password: '' });
    } else {
      setEditingUser(null);
      setUserForm({ fullName: '', username: '', password: '', roleId: '', email: '', phone: '', isActive: true });
    }
    setIsUserModalOpen(true);
  };

  const saveUser = () => {
    if (!userForm.username || !userForm.fullName || !userForm.roleId) return;
    
    const roleName = userRoles.find(r => r.id === userForm.roleId)?.name || '';

    if (editingUser) {
      updateUser(editingUser.id, { ...userForm, roleName });
    } else {
      addUser({ ...userForm, roleName } as Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin'>);
    }
    setIsUserModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Shield className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('roles.title')}</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'roles' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Shield size={18} />
          {t('roles')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'users' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users size={18} />
          {t('users')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        {activeTab === 'roles' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => openRoleModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={18} />
                <span>{t('addRole')}</span>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">{t('name')}</th>
                  <th className="px-6 py-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {userRoles?.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openRoleModal(r)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => deleteRole(r.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => openUserModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={18} />
                <span>{t('addUser')}</span>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">{t('name')}</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">{t('roles')}</th>
                  <th className="px-6 py-3">{t('status')}</th>
                  <th className="px-6 py-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {systemUsers?.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.fullName}</td>
                    <td className="px-6 py-4">{u.username}</td>
                    <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">{u.roleName}</span></td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="flex items-center gap-1 text-green-600"><Check size={16}/> {t('active')}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600"><XCircle size={16}/> {t('inactive')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openUserModal(u)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-800">{editingRole ? t('edit') : t('addRole')}</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-4">{t('permissions')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions.map((perm) => (
                    <div key={perm.module} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="font-semibold text-gray-700 mb-3">{perm.module}</div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={perm.canView} onChange={(e) => handlePermissionChange(perm.module, 'canView', e.target.checked)} /> {t('view')}</label>
                        <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={perm.canCreate} onChange={(e) => handlePermissionChange(perm.module, 'canCreate', e.target.checked)} /> {t('create')}</label>
                        <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={perm.canEdit} onChange={(e) => handlePermissionChange(perm.module, 'canEdit', e.target.checked)} /> {t('edit')}</label>
                        <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={perm.canDelete} onChange={(e) => handlePermissionChange(perm.module, 'canDelete', e.target.checked)} /> {t('delete')}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('cancel')}</button>
              <button onClick={saveRole} className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">{editingUser ? t('edit') : t('addUser')}</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input type="text" value={userForm.fullName} onChange={(e) => setUserForm({...userForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('roles')}</label>
                <select value={userForm.roleId} onChange={(e) => setUserForm({...userForm, roleId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">--</option>
                  {userRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={userForm.isActive} onChange={(e) => setUserForm({...userForm, isActive: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">{t('active')}</label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
              <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('cancel')}</button>
              <button onClick={saveUser} className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
