import { Link } from 'react-router-dom';
import { Store, Star, ShieldCheck, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48 bg-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute -top-52 -left-52 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            The #1 Store Rating Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Discover & Rate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              The Best Local Stores
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of users sharing authentic experiences. Help your community find hidden gems and hold businesses accountable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STORE_OWNER' ? '/owner/dashboard' : '/user/dashboard'}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5"
                >
                  Start Rating Now
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose RateMyStore?</h2>
            <p className="mt-4 text-lg text-slate-600">Built for trust, transparency, and community growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 group">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Authentic Reviews</h3>
              <p className="text-slate-600 leading-relaxed">
                Real ratings from verified users. Our platform ensures that every review comes from a genuine community member.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 group">
              <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Business Insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Store owners get powerful dashboards to track performance, manage feedback, and improve their services.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group">
              <div className="h-14 w-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Reliable</h3>
              <p className="text-slate-600 leading-relaxed">
                Built with industry-leading security practices. Your data is safe, and interactions are heavily protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to shape your local community?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of others in making better shopping decisions.</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-50 transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-600 mb-4">
          <Store className="h-6 w-6" />
          <span className="text-xl font-bold text-slate-900">RateMyStore</span>
        </div>
        <p className="text-slate-500">© 2026 RateMyStore Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
