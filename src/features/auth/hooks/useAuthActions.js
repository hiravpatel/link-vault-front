import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../shared/context/AuthContext';
import { authApi } from '../api/authApi';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { login: setAuthState, logout: clearAuthState } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (action, data) => {
    setLoading(true);
    const loadingToast = toast.loading(action === 'register' ? 'Creating account...' : 'Logging in...');

    try {
      const response = await authApi[action](data);
      const { accessToken, user } = response.data;

      setAuthState(accessToken, user);
      toast.success(response.message || 'Success!', { id: loadingToast });

      navigate(user.profile_setup_done ? '/dashboard' : '/profile-setup');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Authentication failed', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = (data) => handleAuth('register', data);
  const login = (data) => handleAuth('login', data);

  const logout = async () => {
    setLoading(true);
    try {
      await clearAuthState();
      toast.success('Signed out successfully');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (data) => {
    setLoading(true);
    const loadingToast = toast.loading('Preparing password reset...');

    try {
      const response = await authApi.forgotPassword(data);
      toast.success(response.message || 'Password reset request prepared', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to start password reset', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    const loadingToast = toast.loading('Updating password...');

    try {
      const response = await authApi.resetPassword(data);
      const { accessToken, user } = response.data;
      setAuthState(accessToken, user);
      toast.success(response.message || 'Password updated successfully', { id: loadingToast });
      navigate(user.profile_setup_done ? '/dashboard' : '/profile-setup');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to reset password', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    const loadingToast = toast.loading('Saving new password...');

    try {
      const response = await authApi.changePassword(data);
      const { accessToken, user } = response.data;
      setAuthState(accessToken, user);
      toast.success(response.message || 'Password changed successfully', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to change password', { id: loadingToast });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    changePassword,
    loading,
  };
};
