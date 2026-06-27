import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-red-100 p-6 rounded-full text-red-600 mb-6">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Access Denied</h1>
      <p className="text-slate-500 text-center max-w-md mb-8">
        You don't have the necessary permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link 
        to="/" 
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
