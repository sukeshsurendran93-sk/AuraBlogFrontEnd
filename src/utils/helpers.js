export const calculateReadTime = (content) => {
  if (!content || typeof content !== "string") return 1;
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const timeAgo = (timestamp) => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

export const highlightText = (text, query) => {
  if (!query || !text) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-primary/30 text-on-surface px-1 rounded">$1</mark>',
  );
};

export const getRelatedPosts = (posts, currentId, category, limit = 3) => {
  if (!posts || !Array.isArray(posts)) return [];
  return posts
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, limit);
};

export const slugify = (text) => {
  if (!text || typeof text !== "string") return "untitled";
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "") || "untitled"
  );
};
