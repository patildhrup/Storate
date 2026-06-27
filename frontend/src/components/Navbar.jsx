import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-indigo-600" />
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              RateMyStore
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STORE_OWNER' ? '/owner/dashboard' : '/user/dashboard'} 
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
