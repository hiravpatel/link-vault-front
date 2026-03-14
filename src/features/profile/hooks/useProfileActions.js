import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../shared/context/AuthContext';
import { profileApi, tagsApi } from '../api/profileApi';

export const useProfileActions = () => {
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const setupProfile = async ({ display_name, avatar, starter_tags }) => {
    setLoading(true);
    const loadingToast = toast.loading('Setting up your profile...');

    try {
      // 1. Create tags in bulk
      if (starter_tags.length > 0) {
        await tagsApi.createBulk(starter_tags);
      }

      // 2. Update user profile
      const response = await profileApi.updateProfile({
        display_name,
        avatar,
        profile_setup_done: true
      });

      updateUser(response.data);
      
      toast.success('Your vault is ready!', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Profile setup failed', { id: loadingToast });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { setupProfile, loading };
};
