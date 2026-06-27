import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'NORMAL_USER';

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Stores', path: '/admin/stores', icon: Store },
  ];

  const ownerLinks = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'Settings', path: '/owner/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : ownerLinks;

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <Store className="h-6 w-6" />
          RateMyStore
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.includes(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
            {role[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">{user?.name}</span>
            <span className="text-xs text-slate-400">{role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
