import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { useAuthActions } from '../hooks/useAuthActions';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  const initialEmail = searchParams.get('email') || '';
  const { resetPassword, loading } = useAuthActions();
  const [formData, setFormData] = useState({
    token: initialToken,
    newPassword: '',
    confirmPassword: '',
  });

  const helperText = useMemo(() => {
    if (initialToken) {
      return initialEmail
        ? `Resetting password for ${initialEmail}`
        : 'Your reset token is already attached to this form.';
    }

    return 'Paste the reset token from your email or development response, then choose a new password.';
  }, [initialEmail, initialToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetPassword(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 p-4 sm:p-6">
      <div className="w-full max-w-md glass rounded-[2rem] border border-white/10 p-6 sm:p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-dark-300 hover:text-dark-50 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-dark-50">Choose a new password</h1>
          <p className="text-dark-400 mt-2 text-sm">{helperText}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!initialToken && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Reset Token</label>
              <input
                required
                type="text"
                placeholder="Paste your reset token"
                className="input-field"
                value={formData.token}
                onChange={(event) => setFormData(prev => ({ ...prev, token: event.target.value }))}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
              <input
                required
                type="password"
                placeholder="Create a stronger password"
                className="input-field pl-11"
                value={formData.newPassword}
                onChange={(event) => setFormData(prev => ({ ...prev, newPassword: event.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
              <input
                required
                type="password"
                placeholder="Repeat the new password"
                className="input-field pl-11"
                value={formData.confirmPassword}
                onChange={(event) => setFormData(prev => ({ ...prev, confirmPassword: event.target.value }))}
              />
            </div>
          </div>

          <p className="text-[11px] text-dark-500">
            Use at least 8 characters with uppercase, lowercase, number, and special character.
          </p>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
