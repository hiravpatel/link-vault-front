import { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuthActions } from '../../auth/hooks/useAuthActions';

export default function Security() {
  const { changePassword, loading } = useAuthActions();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await changePassword(formData);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-dark-800 text-dark-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold">Account Security</h1>
          <p className="text-dark-400 mt-2 text-sm">
            Update your password and keep your account protected across web, PWA, and APK sessions.
          </p>
        </div>

        <div className="glass rounded-[2rem] border border-white/10 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ['currentPassword', 'Current Password'],
              ['newPassword', 'New Password'],
              ['confirmPassword', 'Confirm New Password'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">{label}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    required
                    type="password"
                    className="input-field pl-11"
                    value={formData[field]}
                    onChange={(event) => setFormData(prev => ({ ...prev, [field]: event.target.value }))}
                  />
                </div>
              </div>
            ))}

            <p className="text-[11px] text-dark-500">
              Use at least 8 characters with uppercase, lowercase, number, and special character.
            </p>

            <button type="submit" disabled={loading} className="btn-primary justify-center w-full sm:w-auto">
              {loading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
