import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-9xl font-bold text-indigo-600">404</h1>
      <h2 className="text-3xl font-semibold text-slate-900 mt-4">Page Not Found</h2>
      <p className="text-slate-500 mt-2 text-center max-w-md">
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
      </p>
      <Link 
        to="/" 
        className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
