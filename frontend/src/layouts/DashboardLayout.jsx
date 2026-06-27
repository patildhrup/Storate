import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LogOut, Bell, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changePasswordPath = user?.role === 'ADMIN' ? '/admin/change-password' : '/owner/change-password';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(changePasswordPath)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
              title="Change Password">
              <KeyRound className="h-4 w-4" />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
