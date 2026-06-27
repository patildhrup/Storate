import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storeService } from '../../services/storeService';
import { Star, ArrowLeft, Users, Mail, MapPin } from 'lucide-react';

const OwnerStoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getStoreById(id);
        setStore(data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800">Store not found</h2>
        <Link to="/owner/dashboard" className="text-indigo-600 hover:underline mt-2 inline-block">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/owner/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{store.name}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <p>{store.address}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <Mail className="h-4 w-4 shrink-0" />
              <p>{store.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500 fill-current" />
              <span className="text-2xl font-bold text-amber-600">{store.averageRating || 'N/A'}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2 font-medium">Based on {store.totalRatings} ratings</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Customer Ratings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating Given</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!store.ratings || store.ratings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                      No ratings submitted yet.
                    </td>
                  </tr>
                ) : (
                  store.ratings.map((rating) => (
                    <tr key={rating.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{rating.user?.name || 'Unknown User'}</td>
                      <td className="px-6 py-4 text-slate-600">{rating.user?.email || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-500 font-medium">
                          <Star className="h-4 w-4 fill-current" /> {rating.rating}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerStoreDetail;
