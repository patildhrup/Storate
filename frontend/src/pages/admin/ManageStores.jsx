import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { storeService } from '../../services/storeService';
import { PlusCircle, Search, Pencil, Trash2, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const StoreModal = ({ store, onClose, onSave }) => {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: store ? { ...store, ownerId: store.ownerId || '' } : {}
  });

  useEffect(() => {
    // Fetch users so admin can easily select one
    adminService.getUsers({ limit: 100 }).then(data => {
      setUsers(data.users.filter(u => u.role !== 'ADMIN'));
    }).catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (store) {
        await adminService.updateStore(store.id, data);
        toast.success('Store updated');
      } else {
        await adminService.createStore(data);
        toast.success('Store created');
      }
      onSave();
      onClose();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
        <h2 className="text-xl font-bold text-slate-800 mb-6">{store ? 'Edit Store' : 'Add Store'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
            <input {...register('name', { required: 'Required', minLength: { value: 20, message: 'Min 20 chars' }, maxLength: { value: 60, message: 'Max 60 chars' } })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Store name..." />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: 'Required' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="store@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea {...register('address', { required: 'Required', maxLength: { value: 400, message: 'Max 400 chars' } })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]" placeholder="Store address..." />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign Owner</label>
            <select {...register('ownerId', { required: 'Owner is required' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option value="">Select an owner...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email}) - {u.role}
                </option>
              ))}
            </select>
            {errors.ownerId && <p className="text-red-500 text-xs mt-1">{errors.ownerId.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">{store ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await storeService.getStores({ search, sortBy, order, page, limit });
      setStores(data.stores);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchStores(), 300);
    return () => clearTimeout(t);
  }, [search, sortBy, order, page]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this store?')) return;
    try {
      await adminService.deleteStore(id);
      toast.success('Store deleted');
      fetchStores();
    } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {showModal && (
        <StoreModal store={selectedStore}
          onClose={() => { setShowModal(false); setSelectedStore(null); }}
          onSave={fetchStores} />
      )}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Stores</h1>
        <button onClick={() => { setSelectedStore(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <PlusCircle className="h-4 w-4" /> Add Store
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input type="text" placeholder="Search by name or address..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  { label: 'Name', field: 'name' },
                  { label: 'Email', field: 'email' },
                  { label: 'Address', field: 'address' },
                  { label: 'Avg Rating', field: 'averageRating' }
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
              ) : stores.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No stores found.</td></tr>
              ) : stores.map(store => (
                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{store.name}</td>
                  <td className="px-6 py-4 text-slate-600">{store.email}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{store.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{store.averageRating || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedStore(store); setShowModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(store.id)}
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

export default ManageStores;
