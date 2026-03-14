import { useState } from 'react';
import { ExternalLink, Copy, Trash2, Check, Calendar } from 'lucide-react';
import { bookmarksAPI } from '../api';
import { getTagColor, formatDate, getDomain } from '../utils/helpers';

export default function BookmarkCard({ bookmark, onDelete, onTagClick }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this bookmark?')) return;
    setDeleting(true);
    try {
      await bookmarksAPI.delete(bookmark._id);
      onDelete(bookmark._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="card group animate-scale-in flex flex-col gap-3 min-h-[180px]">
      {/* Header: favicon + title + URL */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {bookmark.favicon_url && !imgError ? (
            <img
              src={bookmark.favicon_url}
              alt=""
              className="w-5 h-5 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-dark-300 text-xs font-bold uppercase">
              {getDomain(bookmark.url).charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-dark-50 font-semibold text-sm leading-tight line-clamp-2 mb-0.5">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 text-xs truncate block transition-colors"
          >
            {getDomain(bookmark.url)}
          </a>
        </div>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-dark-100 transition-all duration-200 flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="text-dark-300 text-xs leading-relaxed line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => {
            const color = getTagColor(tag.name);
            return (
              <button
                key={tag._id}
                onClick={() => onTagClick && onTagClick(tag._id)}
                className={`tag-pill border ${color.bg} ${color.text} ${color.border} hover:scale-105`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-dark-500 text-xs">
          <Calendar className="w-3 h-3" />
          {formatDate(bookmark.created_at)}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copy link"
            className={`
              p-1.5 rounded-lg transition-all duration-200 text-xs flex items-center gap-1
              ${copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'hover:bg-white/10 text-dark-400 hover:text-dark-100'
              }
            `}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /><span className="text-xs">Copied</span></> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete bookmark"
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
