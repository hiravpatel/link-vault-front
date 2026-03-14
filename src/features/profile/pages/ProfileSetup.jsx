import { useState } from 'react';
import { User, Tag as TagIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useProfileActions } from '../hooks/useProfileActions';

const AVATARS = ['🦊', '🦄', '🐲', '🐳', '🚀', '🌈', '💎', '🔥'];
const TAG_SUGGESTIONS = ['Work', 'Research', 'Inspiration', 'Design', 'Reading', 'Coding', 'Finance', 'Travel'];

export default function ProfileSetup() {
  const { user } = useAuth();
  const { setupProfile, loading } = useProfileActions();
  const [displayName, setDisplayName] = useState(user?.name?.split(' ')[0] || '');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [selectedTags, setSelectedTags] = useState(['Work', 'Inspiration']);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleComplete = async () => {
    await setupProfile({
      display_name: displayName,
      avatar: selectedAvatar,
      starter_tags: selectedTags
    });
  };

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-lg animate-slide-up relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Finish Your Setup</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-50">Personalize Your Vault</h1>
          <p className="text-dark-400 mt-2">Let's make Linkvault yours.</p>
        </div>

        <div className="glass rounded-[2rem] p-6 sm:p-10 border border-white/5 space-y-10">
          {/* Avatar Section */}
          <section>
            <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-accent-teal/10 text-accent-teal rounded-lg flex items-center justify-center text-xs">1</span>
              Choose your avatar
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                    selectedAvatar === avatar 
                      ? 'bg-primary-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110' 
                      : 'bg-dark-700 hover:bg-dark-600'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </section>

          {/* Display Name Section */}
          <section>
            <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-accent-gold/10 text-accent-gold rounded-lg flex items-center justify-center text-xs">2</span>
              What should we call you?
            </h3>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-400" />
              <input
                type="text"
                placeholder="Your display name"
                className="input-field pl-12 h-14 rounded-2xl"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </section>

          {/* Tags Section */}
          <section>
            <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-accent-coral/10 text-accent-coral rounded-lg flex items-center justify-center text-xs">3</span>
              Choose some starter tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TAG_SUGGESTIONS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40 ring-2 ring-primary-500/20'
                      : 'bg-dark-700 text-dark-400 border border-transparent hover:border-dark-500'
                  }`}
                >
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={handleComplete}
            disabled={loading || !displayName.trim()}
            className="btn-primary w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group shadow-xl"
          >
            {loading ? 'Setting up...' : "I'm ready to save links"}
            {!loading && <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}
