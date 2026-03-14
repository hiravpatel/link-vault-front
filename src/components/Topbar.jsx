import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Search, Plus, ChevronDown, LogOut, UserCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onAddBookmark, searchQuery, onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.display_name || user?.name || 'User';
  const avatar = user?.avatar || '🦊';

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10 safe-top">
      <div className="flex items-center gap-3 px-4 py-3 max-w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
            <BookMarked className="w-4 h-4 text-primary-400" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">Linkvault</span>
        </div>

        {/* Search Bar */}
        <div className={`
          flex-1 relative transition-all duration-200
          ${searchFocused ? 'flex-[2]' : 'flex-1'}
          max-w-xl mx-auto
        `}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search bookmarks..."
            className="w-full bg-dark-700/50 border border-white/10 rounded-xl pl-9 pr-9 py-2.5
                       text-dark-50 text-sm placeholder-dark-400
                       focus:border-primary-500/50 focus:bg-dark-700 focus:ring-2 focus:ring-primary-500/20
                       transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onAddBookmark}
            className="btn-primary px-3 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center text-base">
                {avatar}
              </div>
              <span className="text-dark-100 text-sm font-medium hidden md:block max-w-[100px] truncate">
                {displayName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-dark-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl py-2 shadow-2xl shadow-black/50 border border-white/10 animate-slide-down z-50">
                <div className="px-4 py-2 border-b border-white/10 mb-1">
                  <p className="text-dark-50 font-semibold text-sm truncate">{displayName}</p>
                  <p className="text-dark-400 text-xs truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/profile-setup'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:text-dark-50 hover:bg-white/10 transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
