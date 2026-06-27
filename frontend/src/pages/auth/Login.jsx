import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success('Login successful!');
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/');
    } catch (error) {
      // Errors are handled by the axios interceptor implicitly
      console.error(error);
    }
  };

  const autofillCredentials = (role) => {
    if (role === 'ADMIN') {
      setValue('email', 'admin@example.com');
      setValue('password', 'Admin@1234');
    } else if (role === 'OWNER') {
      setValue('email', 'owner@example.com');
      setValue('password', 'Owner@1234');
    } else if (role === 'USER') {
      setValue('email', 'user@example.com');
      setValue('password', 'User@1234');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-6">Welcome Back</h2>
        
        {/* Quick Login Toggler */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-800 text-center mb-3 uppercase tracking-wider">Quick Login (Testing)</p>
          <div className="flex gap-2 justify-center">
            <button 
              type="button" 
              onClick={() => autofillCredentials('ADMIN')}
              className="px-3 py-1.5 text-sm bg-white text-indigo-700 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
            >
              Admin
            </button>
            <button 
              type="button" 
              onClick={() => autofillCredentials('OWNER')}
              className="px-3 py-1.5 text-sm bg-white text-purple-700 font-medium rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors shadow-sm"
            >
              Owner
            </button>
            <button 
              type="button" 
              onClick={() => autofillCredentials('USER')}
              className="px-3 py-1.5 text-sm bg-white text-emerald-700 font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              User
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
