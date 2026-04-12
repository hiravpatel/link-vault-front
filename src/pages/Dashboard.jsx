import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Bookmark, Layers, Menu, Search } from 'lucide-react';
import Topbar from '../shared/components/Topbar';
import Sidebar from '../shared/components/Sidebar';
import { useBookmarks } from '../features/bookmarks/hooks/useBookmarks';
import { useTags } from '../features/tags/hooks/useTags';
import BookmarkCard from '../features/bookmarks/components/BookmarkCard';
import AddBookmarkModal from '../features/bookmarks/components/AddBookmarkModal';

function getRequestParams({ activeFilter, deferredSearchQuery, selectedTagId, selectedCategory }) {
  const params = {
    q: deferredSearchQuery || undefined,
    tagId: selectedTagId || undefined,
    category: selectedCategory || undefined,
    limit: 100,
    sort: 'newest',
  };

  if (['link', 'note', 'prompt'].includes(activeFilter)) {
    params.type = activeFilter;
  }

  if (activeFilter === 'recent') {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    params.from = recentDate.toISOString();
  }

  return params;
}

export default function Dashboard() {
  const { bookmarks, meta, loading: bmLoading, fetchBookmarks, addBookmark, deleteBookmark } = useBookmarks();
  const { tags, loading: tagLoading, fetchTags, addTag, deleteTag } = useTags();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  const requestParams = useMemo(() => getRequestParams({
    activeFilter,
    deferredSearchQuery,
    selectedTagId,
    selectedCategory,
  }), [activeFilter, deferredSearchQuery, selectedTagId, selectedCategory]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchBookmarks(requestParams);
  }, [fetchBookmarks, requestParams]);

  const refreshVault = async () => {
    await Promise.all([
      fetchBookmarks(requestParams),
      fetchTags(),
    ]);
  };

  const handleTagSelect = (tagId) => {
    setSelectedTagId(prev => (prev === tagId ? null : tagId));
  };

  const handleBookmarkCreated = async (data) => {
    await addBookmark(data);
    await refreshVault();
  };

  const handleBookmarkDeleted = async (id) => {
    await deleteBookmark(id);
    await refreshVault();
  };

  const handleTagDeleted = async (id) => {
    await deleteTag(id);
    if (selectedTagId === id) {
      setSelectedTagId(null);
    }
    await refreshVault();
  };

  const loading = bmLoading || tagLoading;
  const activeTagName = selectedTagId ? tags.find(tag => tag._id === selectedTagId)?.name : null;
  const contextLabel = searchQuery
    ? `Search: "${searchQuery}"`
    : activeTagName
      ? `#${activeTagName}`
      : selectedCategory
        ? `Category: ${selectedCategory}`
        : activeFilter === 'recent'
          ? 'Recently Added'
          : activeFilter === 'all'
            ? 'All Items'
            : activeFilter[0].toUpperCase() + activeFilter.slice(1);

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
          onFilterChange={setActiveFilter}
          onTagSelect={handleTagSelect}
          onTagAdded={addTag}
          onTagDeleted={handleTagDeleted}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 lg:max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 bg-dark-700/50 rounded-xl border border-white/5"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">{contextLabel}</h2>
                  <p className="text-xs text-dark-500 font-medium uppercase tracking-widest mt-0.5">
                    {meta.total || bookmarks.length} item{(meta.total || bookmarks.length) !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              {(searchQuery || selectedTagId || selectedCategory || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTagId(null);
                    setSelectedCategory('');
                    setActiveFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Clear filters
                </button>
              )}
            </div>

            {meta.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    !selectedCategory
                      ? 'bg-primary-500/15 text-primary-300 border-primary-500/40'
                      : 'bg-dark-700/60 text-dark-300 border-white/5'
                  }`}
                >
                  All Categories
                </button>
                {meta.categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(prev => (prev === category ? '' : category))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-500/15 text-primary-300 border-primary-500/40'
                        : 'bg-dark-700/60 text-dark-300 border-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {loading && bookmarks.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="glass rounded-2xl p-6 h-56 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && bookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-dark-700/50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/5 shadow-2xl">
                  {searchQuery || selectedCategory || selectedTagId ? (
                    <Search className="w-10 h-10 text-dark-600" />
                  ) : (
                    <Bookmark className="w-10 h-10 text-dark-600" />
                  )}
                </div>
                <h3 className="text-dark-200 font-bold text-xl mb-2">
                  {searchQuery || selectedCategory || selectedTagId ? 'No matching items found' : 'Your vault is empty'}
                </h3>
                <p className="text-dark-500 text-sm max-w-xs leading-relaxed">
                  {searchQuery || selectedCategory || selectedTagId
                    ? 'Try a different keyword, tag, category, or content type to widen the results.'
                    : 'Save links, notes, and prompts here so they stay easy to search from any device.'}
                </p>
                {!searchQuery && !selectedCategory && !selectedTagId && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary mt-8 px-8 py-3 rounded-2xl shadow-xl shadow-primary-500/20"
                  >
                    Add your first item
                  </button>
                )}
              </div>
            )}

            {!loading && bookmarks.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {bookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark._id}
                      bookmark={bookmark}
                      onDelete={handleBookmarkDeleted}
                      onTagClick={handleTagSelect}
                    />
                  ))}
                </div>

                {meta.total > bookmarks.length && (
                  <div className="mt-6 text-center text-xs text-dark-500 flex items-center justify-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Showing the first {bookmarks.length} of {meta.total} items. Pagination support is ready on the backend.
                  </div>
                )}
              </>
            )}
          </div>
          <div className="h-10 safe-bottom" />
        </main>
      </div>

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
