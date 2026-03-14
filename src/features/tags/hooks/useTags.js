import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tagsApi } from '../api/tagsApi';

/**
 * Hook for managing tags state and actions
 */
export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tagsApi.getAll();
      setTags(response.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTag = async (name) => {
    try {
      const response = await tagsApi.create(name);
      const newTag = response.data;
      
      setTags(prev => [...prev, newTag]);
      toast.success(response.message || `Tag "${name}" added`);
      return newTag;
    } catch (err) {
      toast.error(err.message || 'Failed to add tag');
      throw err;
    }
  };

  const deleteTag = async (id) => {
    const loadingToast = toast.loading('Deleting tag...');
    try {
      const response = await tagsApi.delete(id);
      
      setTags(prev => prev.filter(t => t._id !== id));
      
      toast.success(response.message || 'Tag deleted', { id: loadingToast });
      return id;
    } catch (err) {
      toast.error(err.message || 'Failed to delete tag', { id: loadingToast });
      throw err;
    }
  };

  return {
    tags,
    setTags,
    loading,
    fetchTags,
    addTag,
    deleteTag,
  };
};
