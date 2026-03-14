// Deterministic color assignment based on tag name hash
const TAG_COLORS = [
  { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30', dot: 'bg-pink-400' },
  { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  { bg: 'bg-lime-500/20', text: 'text-lime-300', border: 'border-lime-500/30', dot: 'bg-lime-400' },
  { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
];

export function getTagColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function getFaviconUrl(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}
