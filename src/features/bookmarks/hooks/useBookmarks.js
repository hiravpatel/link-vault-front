import { startTransition, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { bookmarksApi } from '../api/bookmarksApi';

const EMPTY_META = {
  page: 1,
  limit: 24,
  total: 0,
  totalPages: 1,
  categories: [],
};

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await bookmarksApi.getAll(params);
      startTransition(() => {
        setBookmarks(response.data || []);
        setMeta(response.meta || EMPTY_META);
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load vault items');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = async (data) => {
    const loadingToast = toast.loading('Saving item...');
    try {
      const response = await bookmarksApi.create(data);
      toast.success(response.message || 'Item saved!', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to save item', { id: loadingToast });
      throw error;
    }
  };

  const deleteBookmark = async (id) => {
    const loadingToast = toast.loading('Deleting item...');
    try {
      const response = await bookmarksApi.delete(id);
      toast.success(response.message || 'Item removed', { id: loadingToast });
      return id;
    } catch (error) {
      toast.error(error.message || 'Failed to delete item', { id: loadingToast });
      throw error;
    }
  };

  return {
    bookmarks,
    meta,
    loading,
    fetchBookmarks,
    addBookmark,
    deleteBookmark,
    setBookmarks,
  };
};
