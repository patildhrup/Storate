import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserPlus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ROLES = ['NORMAL_USER', 'STORE_OWNER', 'ADMIN'];

const UserModal = ({ user, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user || {}
  });

  const onSubmit = async (data) => {
    try {
      if (user) {
        await adminService.updateUser(user.id, data);
        toast.success('User updated');
      } else {
        await adminService.createUser(data);
        toast.success('User created');
      }
      onSave();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 mb-6">{user ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input {...register('name', { required: 'Required', minLength: { value: 20, message: 'Min 20 chars' }, maxLength: { value: 60, message: 'Max 60 chars' } })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: 'Required' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="email@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input {...register('address')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select {...register('role')} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {!user && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" {...register('password', {
                required: 'Required', minLength: { value: 8, message: 'Min 8 chars' }, maxLength: { value: 16, message: 'Max 16 chars' },
                pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, message: 'Needs uppercase & special char' }
              })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">{user ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ search, role: roleFilter, sortBy, order, page, limit });
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, sortBy, order, page]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / limit);

  const roleBadge = (role) => {
    const colors = { ADMIN: 'bg-violet-100 text-violet-700', STORE_OWNER: 'bg-indigo-100 text-indigo-700', NORMAL_USER: 'bg-slate-100 text-slate-600' };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[role] || 'bg-gray-100'}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      {showModal && (
        <UserModal user={selectedUser} onClose={() => { setShowModal(false); setSelectedUser(null); }} onSave={fetchUsers} />
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <button onClick={() => { setSelectedUser(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  { label: 'Name', field: 'name' },
                  { label: 'Email', field: 'email' },
                  { label: 'Address', field: 'address' },
                  { label: 'Role', field: 'role' }
                ].map(h => (
                  <th key={h.field} onClick={() => toggleSort(h.field)} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:bg-slate-100 select-none">
                    {h.label} {sortBy === h.field && (order === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No users found.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{user.address || '—'}</td>
                  <td className="px-6 py-4">
                    {roleBadge(user.role)}
                    {user.role === 'STORE_OWNER' && user.averageRating !== undefined && (
                      <div className="text-xs text-amber-600 mt-1 font-medium text-nowrap">
                        Avg Rating: {user.averageRating} ★
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedUser(user); setShowModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <p className="text-slate-500">Page {page} of {totalPages} ({total} total)</p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
