import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, BookMarked } from 'lucide-react';
import { usersAPI, tagsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const AVATARS = ['🦊', '🐉', '🚀', '🌊', '🎯', '⚡', '🦋', '🌙'];
const STARTER_TAGS = ['Work', 'Research', 'Design', 'Dev', 'Reading', 'Videos'];

export default function ProfileSetup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🦊');
  const [displayName, setDisplayName] = useState(user?.display_name || user?.name || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Update profile
      const { data: updatedUser } = await usersAPI.updateProfile({
        display_name: displayName || user?.name,
        avatar: selectedAvatar,
        profile_setup_done: true
      });

      // Create starter tags in bulk
      if (selectedTags.length > 0) {
        await tagsAPI.createBulk(selectedTags);
      }

      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Linkvault</h1>
            <p className="text-dark-300 text-xs">Personalize your vault</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark-50">Set up your profile</h2>
            <p className="text-dark-300 text-sm mt-1">Pick an avatar and your starter tags</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Picker */}
            <div>
              <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3 block">
                Choose your avatar
              </label>
              <div className="grid grid-cols-8 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      w-full aspect-square text-2xl rounded-2xl flex items-center justify-center
                      transition-all duration-200 border-2
                      ${selectedAvatar === avatar
                        ? 'bg-primary-500/30 border-primary-400 scale-110 shadow-lg shadow-primary-500/30'
                        : 'bg-dark-700/50 border-transparent hover:border-white/20 hover:bg-dark-600/50 hover:scale-105'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3 block">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user?.name || 'How should we call you?'}
                className="input-field"
                maxLength={100}
              />
              <p className="text-dark-400 text-xs mt-1.5">Defaults to your full name if left empty</p>
            </div>

            {/* Starter Tags */}
            <div>
              <label className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3 block">
                Starter tags <span className="text-dark-400 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {STARTER_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`
                      flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-200 border
                      ${selectedTags.includes(tag)
                        ? 'bg-primary-500/30 border-primary-400 text-primary-300 shadow-primary-500/20 shadow-md'
                        : 'bg-dark-700/50 border-white/10 text-dark-300 hover:border-white/25 hover:text-dark-100'
                      }
                    `}
                  >
                    {selectedTags.includes(tag) && <CheckCircle className="w-3.5 h-3.5" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Setting up vault...</>
              ) : (
                <>Enter my vault<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
