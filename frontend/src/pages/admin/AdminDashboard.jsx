import { useEffect, useState } from 'react';
import { Users, Store, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data.data || { totalUsers: 0, totalStores: 0, totalRatings: 0 });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-slate-200 rounded w-1/4"></div></div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', link: '/admin/users' },
    { title: 'Total Stores', value: stats.totalStores, icon: Store, color: 'bg-indigo-500', link: '/admin/stores' },
    { title: 'Total Ratings', value: stats.totalRatings, icon: Star, color: 'bg-violet-500', link: '#' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} to={stat.link} className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl text-white ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
