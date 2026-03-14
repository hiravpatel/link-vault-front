import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../shared/context/AuthContext';
import { authApi } from '../api/authApi';

/**
 * Custom hook for auth actions with toast notifications and state management
 */
export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { login: setAuthState } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (action, data) => {
    setLoading(true);
    const loadingToast = toast.loading(action === 'register' ? 'Creating account...' : 'Logging in...');

    try {
      const response = await authApi[action](data);

      const { token, user } = response.data;
      setAuthState(token, user);

      toast.success(response.message || 'Success!', { id: loadingToast });

      if (!user.profile_setup_done) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed', { id: loadingToast });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = (data) => handleAuth('register', data);
  const login = (data) => handleAuth('login', data);

  return { register, login, loading };
};
