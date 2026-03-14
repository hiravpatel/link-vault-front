import { useState } from 'react';
import { X, Link as LinkIcon, Type, FileText, Tag as TagIcon, Plus } from 'lucide-react';

export default function AddBookmarkModal({ tags, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tag_ids: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdded(formData);
      onClose();
    } catch (err) {
      // Error is handled by the useBookmarks hook's toast
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (id) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(id)
        ? prev.tag_ids.filter(tid => tid !== id)
        : [...prev.tag_ids, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-800 border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-800/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-dark-50">Add Bookmark</h2>
            <p className="text-xs text-dark-400 mt-0.5">Save a new link to your vault</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-white/5 rounded-xl hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5" /> URL
            </label>
            <input
              required
              type="url"
              placeholder="https://example.com"
              className="input-field h-12 rounded-xl text-sm"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
              <Type className="w-3.5 h-3.5" /> Title
            </label>
            <input
              required
              type="text"
              placeholder="Website Title"
              className="input-field h-12 rounded-xl text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Description (Optional)
            </label>
            <textarea
              placeholder="What is this link about?"
              rows="3"
              className="input-field py-3 rounded-xl text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-3 ml-1 flex items-center gap-2">
              <TagIcon className="w-3.5 h-3.5" /> Select Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {tags.map(tag => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    formData.tag_ids.includes(tag._id)
                      ? 'bg-primary-500/20 text-primary-300 border-primary-500/40 ring-1 ring-primary-500/20'
                      : 'bg-dark-700 text-dark-500 border-transparent hover:border-dark-500'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="text-xs text-dark-500 italic py-2">No tags yet. Create some in the sidebar!</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-dark-800 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-dark-700 text-dark-300 font-bold hover:bg-dark-600 transition-all border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
              {loading ? 'Saving...' : 'Save Bookmark'}
              {!loading && <Plus className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
