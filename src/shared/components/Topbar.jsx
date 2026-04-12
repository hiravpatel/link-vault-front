import { ChevronDown, LogOut, Plus, Search, Shield, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onAddBookmark, searchQuery, onSearchChange }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-white/5 bg-dark-800/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-sm font-bold">
          LV
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-white to-dark-400 bg-clip-text text-transparent hidden sm:block tracking-tight">
          Linkvault
        </span>
      </div>

      <div className="flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Search titles, links, notes, prompts..."
            className="w-full bg-dark-700/50 border border-transparent focus:border-primary-500/30 focus:bg-dark-700 focus:ring-4 focus:ring-primary-500/5 rounded-xl py-2 pl-10 pr-4 text-sm text-dark-50 transition-all outline-none h-11"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={onAddBookmark}
          className="btn-primary px-4 h-11 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-500/10"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline font-bold text-sm tracking-wide">Add</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-dark-700/50 border border-white/5 hover:bg-dark-700 hover:border-white/10 transition-all group"
          >
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center border border-primary-500/20 group-hover:border-primary-500/40 transition-colors overflow-hidden text-sm font-bold">
              {user?.avatar || 'LV'}
            </div>
            <ChevronDown className={`w-4 h-4 text-dark-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-3 w-56 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl p-2 z-20 animate-fade-in animate-slide-up">
                <div className="px-3 py-3 border-b border-white/5 mb-1.5">
                  <p className="text-sm font-bold text-white truncate">{user?.display_name || user?.name}</p>
                  <p className="text-[11px] text-dark-500 font-medium truncate uppercase tracking-widest mt-0.5">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/profile-setup');
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-dark-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
                >
                  <UserIcon className="w-4 h-4 text-dark-500 group-hover:text-primary-400" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/security');
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-dark-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
                >
                  <Shield className="w-4 h-4 text-dark-500 group-hover:text-primary-400" />
                  Security
                </button>

                <div className="mt-1.5 pt-1.5 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-accent-coral hover:bg-accent-coral/10 rounded-xl transition-all group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
