import { Post } from '../services/api';
import { Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="liquid-glass rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-white/5">
        <img
          src={post.imageUrl}
          alt={post.caption || 'Post image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Caption + timestamp */}
      <div className="p-4 space-y-2">
        {post.caption && (
          <p className="text-white text-sm leading-relaxed line-clamp-3">{post.caption}</p>
        )}
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Clock size={12} />
          <span>{formatTime(post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
