import { useState, useEffect, useMemo } from 'react';
import { Menu, Bookmark, Search } from 'lucide-react';

// Shared Components
import Topbar from '../shared/components/Topbar';
import Sidebar from '../shared/components/Sidebar';

// Features
import { useBookmarks } from '../features/bookmarks/hooks/useBookmarks';
import { useTags } from '../features/tags/hooks/useTags';
import BookmarkCard from '../features/bookmarks/components/BookmarkCard';
import AddBookmarkModal from '../features/bookmarks/components/AddBookmarkModal';

export default function Dashboard() {
  // Hooks with integrated state and toasts
  const { bookmarks, setBookmarks, loading: bmLoading, fetchBookmarks, addBookmark, deleteBookmark } = useBookmarks();
  const { tags, setTags, loading: tagLoading, fetchTags, addTag, deleteTag } = useTags();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    fetchBookmarks();
    fetchTags();
  }, [fetchBookmarks, fetchTags]);

  // Combined Filtering Logic
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // 1. App-level Filter
    if (activeFilter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(b => new Date(b.created_at) >= sevenDaysAgo);
    }

    // 2. Tag Selection
    if (selectedTagId) {
      result = result.filter(b => 
        b.tags && b.tags.some(t => t._id === selectedTagId)
      );
    }

    // 3. Text Search (title, url, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.url.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.name.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [bookmarks, activeFilter, selectedTagId, searchQuery]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSelectedTagId(null);
  };

  const handleTagSelect = (tagId) => {
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
      setActiveFilter('all');
    } else {
      setSelectedTagId(tagId);
      setActiveFilter('tag');
    }
  };

  const handleBookmarkCreated = async (data) => {
    const bookmark = await addBookmark(data);
    // Update tag counts locally
    if (bookmark.tags?.length > 0) {
      setTags(prev => prev.map(t => {
        const inBookmark = bookmark.tags.some(bt => bt._id === t._id);
        return inBookmark ? { ...t, count: t.count + 1 } : t;
      }));
    }
  };

  const handleBookmarkDeleted = async (id) => {
    const deleted = bookmarks.find(b => b._id === id);
    await deleteBookmark(id);
    // Update tag counts locally
    if (deleted?.tags?.length > 0) {
      setTags(prev => prev.map(t => {
        const wasInBookmark = deleted.tags.some(bt => bt._id === t._id);
        return wasInBookmark ? { ...t, count: Math.max(0, t.count - 1) } : t;
      }));
    }
  };

  const handleTagDeleted = async (id) => {
    await deleteTag(id);
    if (selectedTagId === id) {
      setSelectedTagId(null);
      setActiveFilter('all');
    }
    // Refresh bookmarks as tags were removed from them (cascading)
    fetchBookmarks();
  };

  const activeTagName = selectedTagId 
    ? tags.find(t => t._id === selectedTagId)?.name 
    : null;

  const loading = bmLoading || tagLoading;

  return (
    <div className="h-screen flex flex-col bg-dark-800 overflow-hidden text-dark-50">
      <Topbar 
        onAddBookmark={() => setShowModal(true)} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          tags={tags}
          activeFilter={activeFilter}
          selectedTagId={selectedTagId}
          onFilterChange={handleFilterChange}
          onTagSelect={handleTagSelect}
          onTagAdded={addTag}
          onTagDeleted={handleTagDeleted}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 lg:max-w-7xl mx-auto">
            
            {/* Context Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 bg-dark-700/50 rounded-xl border border-white/5"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">
                    {searchQuery 
                      ? `Search: "${searchQuery}"` 
                      : activeTagName 
                        ? `#${activeTagName}` 
                        : activeFilter === 'recent' 
                          ? 'Recently Added' 
                          : 'All Bookmarks'
                    }
                  </h2>
                  <p className="text-xs text-dark-500 font-medium uppercase tracking-widest mt-0.5">
                    {filteredBookmarks.length} item{filteredBookmarks.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              {(searchQuery || selectedTagId || activeFilter !== 'all') && (
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedTagId(null); setActiveFilter('all'); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && bookmarks.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse" />
                ))}
              </div>
            )}

            {/* Empty States */}
            {!loading && filteredBookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-dark-700/50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/5 shadow-2xl">
                  {searchQuery ? <Search className="w-10 h-10 text-dark-600" /> : <Bookmark className="w-10 h-10 text-dark-600" />}
                </div>
                <h3 className="text-dark-200 font-bold text-xl mb-2">
                  {searchQuery ? 'No bookmarks found' : 'Your vault is empty'}
                </h3>
                <p className="text-dark-500 text-sm max-w-xs leading-relaxed">
                  {searchQuery 
                    ? `We couldn't find any results for "${searchQuery}". Maybe try a different keyword?` 
                    : "Save your favorite links, articles, and research here. They'll be safe and searchable forever."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary mt-8 px-8 py-3 rounded-2xl shadow-xl shadow-primary-500/20"
                  >
                    Add your first link
                  </button>
                )}
              </div>
            )}

            {/* Bookmark Grid */}
            {!loading && filteredBookmarks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard 
                    key={bookmark._id} 
                    bookmark={bookmark} 
                    onDelete={handleBookmarkDeleted}
                    onTagClick={handleTagSelect}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="h-10 safe-bottom" />
        </main>
      </div>

      {/* Modals */}
      {showModal && (
        <AddBookmarkModal 
          tags={tags} 
          onClose={() => setShowModal(false)}
          onAdded={handleBookmarkCreated}
        />
      )}
    </div>
  );
}
