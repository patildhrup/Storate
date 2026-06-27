import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storeService } from '../../services/storeService';
import { ratingService } from '../../services/ratingService';
import { Star, MapPin, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`h-8 w-8 transition-colors ${star <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
};

const StoreDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const userExistingRating = ratings.find(r => r.userId === user?.id);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const [storeData, ratingsData] = await Promise.all([
          storeService.getStoreById(id),
          ratingService.getStoreRatings(id)
        ]);
        setStore(storeData.store);
        setRatings(ratingsData.ratings);
        const mine = ratingsData.ratings.find(r => r.userId === user?.id);
        if (mine) setSelectedRating(mine.rating);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStore();
  }, [id, user?.id]);

  const handleSubmitRating = async () => {
    if (!selectedRating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await ratingService.submitRating({ storeId: id, rating: selectedRating });
      toast.success(userExistingRating ? 'Rating updated!' : 'Rating submitted!');
      // Refresh
      const ratingsData = await ratingService.getStoreRatings(id);
      setRatings(ratingsData.ratings);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-2xl" />;
  if (!store) return <div className="text-center py-12 text-slate-500">Store not found.</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Store Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900">{store.name}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-slate-600">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{store.address}</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{store.email}</div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-500">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-6 w-6 ${s <= Math.round(store.averageRating || 0) ? 'fill-current' : 'text-slate-300'}`} />
            ))}
          </div>
          <span className="text-2xl font-bold text-slate-800">{store.averageRating || '0.0'}</span>
          <span className="text-slate-500">({ratings.length} ratings)</span>
        </div>
      </div>

      {/* Rate this store */}
      {user && user.role === 'NORMAL_USER' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            {userExistingRating ? 'Update Your Rating' : 'Rate This Store'}
          </h2>
          <StarRating value={selectedRating} onChange={setSelectedRating} />
          <button
            onClick={handleSubmitRating}
            disabled={submitting || !selectedRating}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : userExistingRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Customer Reviews</h2>
        {ratings.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to rate this store!</p>
        ) : (
          <div className="space-y-4">
            {ratings.map(r => (
              <div key={r.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  {r.user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-semibold text-slate-800">{r.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'fill-current' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
