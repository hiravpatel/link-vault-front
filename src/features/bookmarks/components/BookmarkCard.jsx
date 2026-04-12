import { Calendar, Copy, ExternalLink, FileText, Link2, Sparkles, Tag as TagIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, getDomain } from '../../../shared/utils/helpers';

function getItemIcon(type) {
  if (type === 'note') return FileText;
  if (type === 'prompt') return Sparkles;
  return Link2;
}

export default function BookmarkCard({ bookmark, onDelete, onTagClick }) {
  const {
    _id,
    type = 'link',
    url,
    title,
    description,
    content,
    category,
    favicon_url,
    tags,
    created_at,
  } = bookmark;

  const Icon = getItemIcon(type);
  const canOpen = Boolean(url);

  const handleCopy = async () => {
    const textToCopy = url || content || description || title;
    await navigator.clipboard.writeText(textToCopy);
    toast.success(type === 'link' ? 'Link copied to clipboard!' : 'Content copied to clipboard!');
  };

  return (
    <div className="group glass rounded-2xl p-5 border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col h-full animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary-500/20 transition-colors">
            {type === 'link' && favicon_url ? (
              <img
                src={favicon_url}
                alt=""
                className="w-6 h-6 object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Icon className="w-5 h-5 text-primary-300" />
            )}
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-primary-300 border border-primary-500/20">
              {type}
            </span>
            {category && (
              <p className="text-[11px] text-dark-400 mt-2 uppercase tracking-wider font-semibold">{category}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
            title={type === 'link' ? 'Copy link' : 'Copy content'}
          >
            <Copy className="w-4 h-4" />
          </button>
          {canOpen && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-dark-400 hover:text-accent-teal hover:bg-accent-teal/10 rounded-lg transition-all"
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onDelete(_id)}
            className="p-2 text-dark-400 hover:text-accent-coral hover:bg-accent-coral/10 rounded-lg transition-all"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-dark-50 leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors mb-2">
          {title}
        </h3>
        {url && (
          <p className="text-xs text-dark-500 mb-3 font-medium flex items-center gap-1.5 uppercase tracking-wider">
            {getDomain(url)}
          </p>
        )}

        {description && (
          <p className="text-sm text-dark-300 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {content && (
          <p className="text-sm text-dark-200/90 line-clamp-4 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <button
                key={tag._id}
                onClick={(event) => {
                  event.stopPropagation();
                  onTagClick(tag._id);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
              >
                <TagIcon className="w-2.5 h-2.5" />
                {tag.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] font-semibold text-dark-500 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
