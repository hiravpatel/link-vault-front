import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { bookmarksApi } from '../api/bookmarksApi';

/**
 * Hook for managing bookmarks state and actions
 */
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookmarksApi.getAll();
      setBookmarks(response.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = async (data) => {
    const loadingToast = toast.loading('Saving bookmark...');
    try {
      const response = await bookmarksApi.create(data);
      const newBookmark = response.data;
      
      setBookmarks(prev => [newBookmark, ...prev]);
      
      toast.success(response.message || 'Bookmark saved!', { id: loadingToast });
      return newBookmark;
    } catch (err) {
      console.error('Add bookmark error:', err);
      toast.error(err.message || 'Failed to save bookmark', { id: loadingToast });
      throw err;
    }
  };

  const deleteBookmark = async (id) => {
    const loadingToast = toast.loading('Deleting bookmark...');
    try {
      const response = await bookmarksApi.delete(id);
      
      setBookmarks(prev => prev.filter(b => b._id !== id));
      
      toast.success(response.message || 'Bookmark removed', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Failed to delete bookmark', { id: loadingToast });
      throw err;
    }
  };

  return {
    bookmarks,
    setBookmarks,
    loading,
    fetchBookmarks,
    addBookmark,
    deleteBookmark,
  };
};
