import { useEffect, useState } from 'react';
import { storeService } from '../../services/storeService';
import { ratingService } from '../../services/ratingService';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const InlineStarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(star); }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`h-6 w-6 transition-colors ${star <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-300'}`} />
        </button>
      ))}
    </div>
  );
};

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getStores({ search });
        setStores(data.stores);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    // Basic debounce mock
    const timer = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRateStore = async (storeId, rating, isUpdate, ratingId) => {
    try {
      if (isUpdate && ratingId) {
        await ratingService.updateRating(ratingId, { rating });
        toast.success('Rating updated successfully!');
      } else {
        await ratingService.submitRating({ storeId, rating });
        toast.success('Rating submitted successfully!');
      }
      
      // Refresh single store or all
      const data = await storeService.getStores({ search });
      setStores(data.stores);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Explore Stores</h1>
          <p className="text-slate-500 mt-1">Find and rate your favorite stores</p>
        </div>
        <div className="w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="bg-slate-200 h-48 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map(store => (
            <Link key={store.id} to={`/user/stores/${store.id}`} className="group block">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all h-full flex flex-col">
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                <div className="flex items-start gap-2 mt-3 text-slate-500 text-sm flex-1">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{store.address}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-semibold">{store.averageRating || '0.0'}</span>
                    <span className="text-slate-400 text-sm ml-1">({store._count?.ratings || store.totalRatings || 0})</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-slate-500 mb-1">
                      {store.userRating ? 'Your Rating' : 'Rate this store'}
                    </span>
                    <InlineStarRating 
                      value={store.userRating || 0} 
                      onChange={(newRating) => handleRateStore(store.id, newRating, !!store.userRating, store.userRatingId)} 
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {stores.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-500">
              No stores found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
