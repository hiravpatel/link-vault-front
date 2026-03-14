import { useState } from 'react';
import { BookOpen, Clock, Tag, Plus, Loader2, Hash, Trash2 } from 'lucide-react';
import { tagsAPI } from '../api';
import { getTagColor } from '../utils/helpers';

export default function Sidebar({
  bookmarks,
  tags,
  activeFilter,
  selectedTagId,
  onFilterChange,
  onTagSelect,
  onTagAdded,
  onTagDeleted,
  isOpen,
  onClose
}) {
  const [newTagName, setNewTagName] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  const [tagError, setTagError] = useState('');

  const totalCount = bookmarks.length;
  const recentCount = bookmarks.filter(b => {
    const date = new Date(b.created_at);
    const seven = new Date();
    seven.setDate(seven.getDate() - 7);
    return date >= seven;
  }).length;

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setAddingTag(true);
    setTagError('');
    try {
      const { data } = await tagsAPI.create(newTagName.trim());
      onTagAdded(data);
      setNewTagName('');
    } catch (err) {
      setTagError(err.response?.data?.message || 'Failed to add tag');
    } finally {
      setAddingTag(false);
    }
  };

  const handleDeleteTag = async (e, tagId) => {
    e.stopPropagation();
    if (!confirm('Delete this tag? It will be removed from all bookmarks.')) return;
    try {
      await tagsAPI.delete(tagId);
      onTagDeleted(tagId);
    } catch {}
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Main Filters */}
        <div className="mb-6">
          <p className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Library</p>
          <div className="space-y-1">
            <button
              onClick={() => { onFilterChange('all'); onClose?.(); }}
              className={`sidebar-item w-full ${activeFilter === 'all' && !selectedTagId ? 'active' : 'text-dark-200'}`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>All Bookmarks</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === 'all' && !selectedTagId ? 'bg-primary-500/30 text-primary-300' : 'bg-dark-600 text-dark-400'}`}>
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => { onFilterChange('recent'); onClose?.(); }}
              className={`sidebar-item w-full ${activeFilter === 'recent' ? 'active' : 'text-dark-200'}`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Recently Added</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === 'recent' ? 'bg-primary-500/30 text-primary-300' : 'bg-dark-600 text-dark-400'}`}>
                {recentCount}
              </span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />Tags
          </p>
          <div className="space-y-1">
            {tags.length === 0 ? (
              <p className="text-dark-500 text-xs px-3 py-2">No tags yet. Add one below!</p>
            ) : (
              tags.map((tag) => {
                const color = getTagColor(tag.name);
                const isActive = selectedTagId === tag._id;
                return (
                  <button
                    key={tag._id}
                    onClick={() => { onTagSelect(tag._id); onClose?.(); }}
                    className={`sidebar-item w-full group ${isActive ? 'active' : 'text-dark-200'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color.dot}`} />
                      <span className="truncate text-sm">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-primary-500/30 text-primary-300' : 'bg-dark-600 text-dark-400'}`}>
                        {tag.count}
                      </span>
                      <button
                        onClick={(e) => handleDeleteTag(e, tag._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Add Tag */}
          <form onSubmit={handleAddTag} className="mt-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => { setNewTagName(e.target.value); setTagError(''); }}
                  placeholder="New tag..."
                  maxLength={50}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg pl-7 pr-2 py-2
                             text-dark-100 text-xs placeholder-dark-500
                             focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20
                             transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={addingTag || !newTagName.trim()}
                className="px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30
                           text-primary-400 rounded-lg text-xs font-medium transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addingTag ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              </button>
            </div>
            {tagError && <p className="text-red-400 text-xs mt-1 px-1">{tagError}</p>}
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 glass border-r border-white/10 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass border-r border-white/10
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
}
