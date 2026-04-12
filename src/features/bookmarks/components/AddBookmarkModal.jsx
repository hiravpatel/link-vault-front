import { useMemo, useState } from 'react';
import { FileText, Link as LinkIcon, Plus, Sparkles, Tag as TagIcon, Type, X } from 'lucide-react';

const ITEM_TYPES = [
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'note', label: 'Note', icon: FileText },
  { id: 'prompt', label: 'Prompt', icon: Sparkles },
];

export default function AddBookmarkModal({ tags, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    type: 'link',
    url: '',
    title: '',
    description: '',
    content: '',
    category: '',
    tag_ids: [],
  });
  const [loading, setLoading] = useState(false);

  const isLink = formData.type === 'link';
  const helperCopy = useMemo(() => {
    if (formData.type === 'prompt') return 'Store a reusable prompt or instruction set.';
    if (formData.type === 'note') return 'Capture notes, paragraphs, or personal research.';
    return 'Save a URL with enough context to find it instantly later.';
  }, [formData.type]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onAdded({
        ...formData,
        url: isLink ? formData.url : null,
        content: isLink ? null : formData.content,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (id) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(id)
        ? prev.tag_ids.filter(tagId => tagId !== id)
        : [...prev.tag_ids, id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-dark-800 border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-slide-up overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-800/90 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-dark-50">Save to Vault</h2>
            <p className="text-xs text-dark-400 mt-0.5">{helperCopy}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-white/5 rounded-xl hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-3 ml-1">Content Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ITEM_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateField('type', id)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                    formData.type === id
                      ? 'bg-primary-500/15 text-primary-300 border-primary-500/40'
                      : 'bg-dark-700/60 text-dark-300 border-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLink && (
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" /> URL
              </label>
              <input
                required={isLink}
                type="url"
                placeholder="https://example.com"
                className="input-field h-12 rounded-xl text-sm"
                value={formData.url}
                onChange={(event) => updateField('url', event.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
              <Type className="w-3.5 h-3.5" /> Title
            </label>
            <input
              required
              type="text"
              placeholder={isLink ? 'Website title' : formData.type === 'note' ? 'Note title' : 'Prompt title'}
              className="input-field h-12 rounded-xl text-sm"
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Description
            </label>
            <textarea
              placeholder="A short summary for future-you"
              rows="3"
              className="input-field py-3 rounded-xl text-sm resize-none"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </div>

          {!isLink && (
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> {formData.type === 'prompt' ? 'Prompt Body' : 'Content'}
              </label>
              <textarea
                required={!isLink}
                placeholder={formData.type === 'prompt' ? 'Write the full prompt here...' : 'Write your note or paragraph here...'}
                rows="6"
                className="input-field py-3 rounded-xl text-sm resize-none"
                value={formData.content}
                onChange={(event) => updateField('content', event.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 ml-1">Category</label>
            <input
              type="text"
              placeholder="Work, Learning, Product, Writing..."
              className="input-field h-12 rounded-xl text-sm"
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
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
                <p className="text-xs text-dark-500 italic py-2">No tags yet. Create some in the sidebar first.</p>
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
              {loading ? 'Saving...' : 'Save Item'}
              {!loading && <Plus className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
