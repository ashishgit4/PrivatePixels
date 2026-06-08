import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { getPosts, Post } from '../services/api';

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1
                className="text-3xl md:text-4xl text-white font-light tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Your Feed
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {posts.length > 0 ? `${posts.length} post${posts.length !== 1 ? 's' : ''}` : 'No posts yet'}
              </p>
            </div>
            <button
              onClick={fetchPosts}
              className="liquid-glass rounded-full p-3 text-white/60 hover:text-white transition-all hover:bg-white/5"
              aria-label="Refresh feed"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/40 text-sm">Loading posts…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="liquid-glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center max-w-md mx-auto">
              <AlertCircle size={40} className="text-red-400/70" />
              <p className="text-white/70 text-sm">{error}</p>
              <button
                onClick={fetchPosts}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm hover:bg-white/5 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="liquid-glass rounded-full p-8">
                <ImagePlus size={48} className="text-white/30" />
              </div>
              <div className="text-center">
                <p
                  className="text-2xl text-white/60 mb-2"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Nothing here yet
                </p>
                <p className="text-white/30 text-sm">Be the first to share a moment</p>
              </div>
              <button
                onClick={() => navigate('/create')}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Create first post
              </button>
            </div>
          )}

          {/* Posts grid */}
          {!loading && !error && posts.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="break-inside-avoid">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Create button */}
      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-8 right-8 z-50 liquid-glass rounded-full p-4 text-white hover:bg-white/10 transition-all hover:scale-110 shadow-2xl"
        aria-label="Create new post"
      >
        <ImagePlus size={24} />
      </button>
    </div>
  );
}
