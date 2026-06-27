import { useEffect, useState } from 'react';
import { storeService } from '../../services/storeService';
import { Star, MapPin, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStores = async () => {
      try {
        const data = await storeService.getStores({ myStores: true });
        setStores(data.stores);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyStores();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Stores</h1>
      <p className="text-slate-500">Manage your stores and view customer ratings.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link key={store.id} to={`/owner/stores/${store.id}`} className="block group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-medium text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  {store.averageRating || 'N/A'}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {store.name}
              </h3>
              
              <div className="flex items-start gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="line-clamp-2">{store.address}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Ratings: {store._count?.ratings || 0}</span>
                <span className="text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Details &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
        {stores.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm">
            <Store className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Stores Found</h3>
            <p className="text-slate-500 mt-1">You haven't been assigned any stores yet. Please contact the administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
