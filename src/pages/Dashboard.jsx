import { useState, useEffect, useMemo } from 'react';
import { Menu, Bookmark, Search, SlidersHorizontal } from 'lucide-react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import BookmarkCard from '../components/BookmarkCard';
import AddBookmarkModal from '../components/AddBookmarkModal';
import { bookmarksAPI, tagsAPI } from '../api';

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bmRes, tagRes] = await Promise.all([
          bookmarksAPI.getAll(),
          tagsAPI.getAll()
        ]);
        setBookmarks(bmRes.data);
        setTags(tagRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Computed filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Filter by active filter
    if (activeFilter === 'recent') {
      const seven = new Date();
      seven.setDate(seven.getDate() - 7);
      result = result.filter(b => new Date(b.created_at) >= seven);
    }

    // Filter by tag
    if (selectedTagId) {
      result = result.filter(b =>
        b.tags && b.tags.some(t => t._id === selectedTagId)
      );
    }

    // Filter by search query
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

  const handleBookmarkAdded = (bookmark) => {
    setBookmarks(prev => [bookmark, ...prev]);
    // Update tag counts
    if (bookmark.tags?.length > 0) {
      setTags(prev => prev.map(t => {
        const inBookmark = bookmark.tags.some(bt => bt._id === t._id);
        return inBookmark ? { ...t, count: t.count + 1 } : t;
      }));
    }
  };

  const handleBookmarkDeleted = (bookmarkId) => {
    const deleted = bookmarks.find(b => b._id === bookmarkId);
    setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
    // Update tag counts
    if (deleted?.tags?.length > 0) {
      setTags(prev => prev.map(t => {
        const wasInBookmark = deleted.tags.some(bt => bt._id === t._id);
        return wasInBookmark ? { ...t, count: Math.max(0, t.count - 1) } : t;
      }));
    }
  };

  const handleTagAdded = (tag) => {
    setTags(prev => [...prev, tag]);
  };

  const handleTagDeleted = (tagId) => {
    setTags(prev => prev.filter(t => t._id !== tagId));
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
      setActiveFilter('all');
    }
  };

  const activeTagName = selectedTagId
    ? tags.find(t => t._id === selectedTagId)?.name
    : null;

  return (
    <div className="h-screen flex flex-col bg-dark-800 overflow-hidden">
      <Topbar
        onAddBookmark={() => setShowModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          bookmarks={bookmarks}
          tags={tags}
          activeFilter={activeFilter}
          selectedTagId={selectedTagId}
          onFilterChange={handleFilterChange}
          onTagSelect={handleTagSelect}
          onTagAdded={handleTagAdded}
          onTagDeleted={handleTagDeleted}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Mobile menu + filter bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden btn-ghost p-2"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-dark-50">
                    {searchQuery
                      ? `Results for "${searchQuery}"`
                      : activeTagName
                        ? `#${activeTagName}`
                        : activeFilter === 'recent'
                          ? 'Recently Added'
                          : 'All Bookmarks'
                    }
                  </h2>
                  <p className="text-dark-400 text-xs mt-0.5">
                    {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {(searchQuery || selectedTagId || activeFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTagId(null); setActiveFilter('all'); }}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 h-44 animate-pulse">
                    <div className="flex gap-3 mb-3">
                      <div className="w-9 h-9 bg-dark-600 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-dark-600 rounded w-3/4" />
                        <div className="h-3 bg-dark-700 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-dark-700 rounded w-full" />
                      <div className="h-3 bg-dark-700 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredBookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-dark-700/50 rounded-3xl flex items-center justify-center mb-4">
                  {searchQuery ? (
                    <Search className="w-10 h-10 text-dark-500" />
                  ) : (
                    <Bookmark className="w-10 h-10 text-dark-500" />
                  )}
                </div>
                <h3 className="text-dark-200 font-semibold text-lg mb-2">
                  {searchQuery ? 'No matches found' : 'No bookmarks yet'}
                </h3>
                <p className="text-dark-500 text-sm max-w-xs">
                  {searchQuery
                    ? `No bookmarks match "${searchQuery}". Try a different search.`
                    : 'Click the + Add button to save your first bookmark.'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary mt-6"
                  >
                    Add your first bookmark
                  </button>
                )}
              </div>
            )}

            {/* Bookmark Grid */}
            {!loading && filteredBookmarks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

          {/* Safe bottom padding for PWA */}
          <div className="h-6 safe-bottom" />
        </main>
      </div>

      {/* Add Bookmark Modal */}
      {showModal && (
        <AddBookmarkModal
          tags={tags}
          onClose={() => setShowModal(false)}
          onAdded={handleBookmarkAdded}
        />
      )}
    </div>
  );
}
