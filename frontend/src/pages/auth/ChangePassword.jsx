import { useForm } from 'react-hook-form';
import { authService } from '../../services/authService';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      reset();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input type="password" {...register('currentPassword', { required: 'Required' })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
            </div>
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input type="password" {...register('newPassword', {
                required: 'Required',
                minLength: { value: 8, message: 'Min 8 characters' },
                maxLength: { value: 16, message: 'Max 16 characters' },
                pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, message: 'Needs uppercase & special char' }
              })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input type="password" {...register('confirmPassword', {
                required: 'Required',
                validate: v => v === newPassword || 'Passwords do not match'
              })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
