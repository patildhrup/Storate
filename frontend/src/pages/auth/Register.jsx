import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      // Errors handled by axios interceptor
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 20, message: 'Minimum 20 characters' },
                  maxLength: { value: 60, message: 'Maximum 60 characters' }
                })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
              <textarea
                {...register('address', { maxLength: { value: 400, message: 'Max 400 characters' } })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px]"
                placeholder="123 Main St..."
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  maxLength: { value: 16, message: 'Maximum 16 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
                    message: 'Must contain an uppercase letter and a special character'
                  }
                })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg active:scale-95 mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
