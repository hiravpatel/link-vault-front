import { useState } from 'react';
import { Clock, FileText, Layers, Link as LinkIcon, Plus, Sparkles, Tag as TagIcon, Trash2, X } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'all', label: 'All Items', icon: Layers },
  { id: 'recent', label: 'Recently Added', icon: Clock },
  { id: 'link', label: 'Links', icon: LinkIcon },
  { id: 'note', label: 'Notes', icon: FileText },
  { id: 'prompt', label: 'Prompts', icon: Sparkles },
];

export default function Sidebar({
  tags,
  activeFilter,
  selectedTagId,
  onFilterChange,
  onTagSelect,
  onTagAdded,
  onTagDeleted,
  isOpen,
  onClose,
}) {
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleAddTag = async (event) => {
    event.preventDefault();
    if (!newTagName.trim()) return;

    try {
      await onTagAdded(newTagName.trim());
      setNewTagName('');
      setIsAddingTag(false);
    } catch {
      // Errors are surfaced by the tags hook.
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      <nav className="space-y-1.5 mb-10">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onFilterChange(item.id);
              onClose();
            }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
              activeFilter === item.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'text-dark-400 hover:bg-white/5 hover:text-dark-100'
            }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Tags</h3>
          <button
            onClick={() => setIsAddingTag(true)}
            className="p-1 px-1.5 rounded-lg border border-white/5 bg-dark-700/50 hover:bg-dark-600 transition-all group"
          >
            <Plus className="w-3.5 h-3.5 text-dark-400 group-hover:text-primary-400" />
          </button>
        </div>

        {isAddingTag && (
          <form onSubmit={handleAddTag} className="px-2 mb-4 animate-fade-in animate-slide-up">
            <div className="relative group">
              <input
                autoFocus
                type="text"
                placeholder="Tag name..."
                className="w-full bg-dark-700/50 border border-primary-500/30 rounded-xl py-2 pl-3 pr-10 text-xs text-dark-50 focus:bg-dark-700 transition-all outline-none"
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsAddingTag(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-dark-500 mt-1.5 ml-1">Press Enter to save</p>
          </form>
        )}

        <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {tags.map(tag => (
            <div key={tag._id} className="group relative">
              <button
                onClick={() => {
                  onTagSelect(tag._id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                  selectedTagId === tag._id
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 ring-1 ring-primary-500/20'
                    : 'text-dark-500 hover:bg-white/5 hover:text-dark-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TagIcon className="w-3.5 h-3.5 opacity-60" />
                  <span>{tag.name}</span>
                </div>
                <span className="text-[10px] opacity-60 bg-dark-700 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                  {tag.count}
                </span>
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onTagDeleted(tag._id);
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-accent-coral opacity-0 group-hover:opacity-100 bg-accent-coral/10 rounded-lg hover:bg-accent-coral/20 transition-all z-10"
                title="Delete Tag"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {tags.length === 0 && !isAddingTag && (
            <div className="px-4 py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/5">
              <p className="text-[11px] text-dark-500 font-medium">No tags added yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 p-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-transparent border border-white/5">
        <p className="text-xs font-bold text-primary-400 flex items-center gap-2 mb-1">
          <Layers className="w-3.5 h-3.5" /> Better Organization
        </p>
        <p className="text-[10px] text-dark-400 leading-relaxed font-medium">
          Use categories for broad organization and tags for precise filtering.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={onClose} />
        <aside className="relative w-72 h-full bg-dark-800 border-r border-white/10 shadow-2xl">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold">LV</div>
              <span className="font-bold text-white tracking-tight">Vault Menu</span>
            </div>
            <button onClick={onClose} className="p-2 text-dark-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {sidebarContent}
        </aside>
      </div>

      <aside className="hidden lg:block w-72 h-full border-r border-white/5 bg-dark-800/30 overflow-hidden flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
