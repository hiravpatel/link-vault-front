import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LifeBuoy, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Preparing reset request...');

    try {
      const response = await authApi.forgotPassword({ email });
      const resetToken = response.data?.resetToken;

      toast.success('Password reset flow started', { id: loadingToast });
      setSubmitted(true);

      if (resetToken) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
      }
    } catch (error) {
      toast.error(error.message || 'Could not start password reset', { id: loadingToast });
    } finally {
      setLoading(false);
    }
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
            <LifeBuoy className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-dark-50">Reset your password</h1>
          <p className="text-dark-400 mt-2 text-sm">
            Enter your account email. In development, we will route you directly to the reset form.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
              <input
                required
                type="email"
                placeholder="jane@example.com"
                className="input-field pl-11"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? 'Submitting...' : 'Continue'}
          </button>
        </form>

        {submitted && (
          <p className="mt-5 text-xs text-dark-400 leading-relaxed">
            If that email exists, the reset request is now active. In production, this is where your email or OTP delivery would continue.
          </p>
        )}
      </div>
    </div>
  );
}
