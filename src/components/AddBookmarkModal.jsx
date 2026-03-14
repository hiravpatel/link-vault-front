import { useState, useEffect, useRef } from 'react';
import { X, Link, Type, FileText, Tag, Plus, Check, Loader2 } from 'lucide-react';
import { bookmarksAPI } from '../api';
import { getTagColor, getDomain } from '../utils/helpers';

export default function AddBookmarkModal({ tags, onClose, onAdded }) {
  const [form, setForm] = useState({ url: '', title: '', description: '' });
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const urlInputRef = useRef(null);

  useEffect(() => {
    urlInputRef.current?.focus();
    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm(prev => ({
      ...prev,
      url,
      title: prev.title || (url ? getDomain(url) : '')
    }));
    setError('');
  };

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) return setError('URL is required');
    if (!form.title) return setError('Title is required');

    setLoading(true);
    try {
      const { data } = await bookmarksAPI.create({
        url: form.url,
        title: form.title,
        description: form.description,
        tag_ids: selectedTagIds
      });
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg glass border border-white/10 rounded-t-3xl sm:rounded-3xl
                      animate-slide-up shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Handle for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-dark-500 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-dark-50">Add Bookmark</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-dark-400 hover:text-dark-100 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* URL */}
          <div>
            <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              URL <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                ref={urlInputRef}
                type="url"
                value={form.url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Page title"
                maxLength={255}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              Description <span className="text-dark-500 font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief note about this link..."
                rows={2}
                className="input-field pl-10 resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const color = getTagColor(tag.name);
                  const selected = selectedTagIds.includes(tag._id);
                  return (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => toggleTag(tag._id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                        transition-all duration-200
                        ${selected
                          ? `${color.bg} ${color.text} ${color.border} shadow-md`
                          : 'bg-dark-700/50 text-dark-400 border-white/10 hover:border-white/20 hover:text-dark-200'
                        }
                      `}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : (
                <><Plus className="w-4 h-4" />Save Bookmark</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
