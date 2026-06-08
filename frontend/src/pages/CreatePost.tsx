import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ImagePlus, Send, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { createPost } from '../services/api';

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    setError(null);
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to post.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      await createPost(formData);
      navigate('/feed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create post. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate('/feed')}
              className="liquid-glass rounded-full p-2.5 text-white/60 hover:text-white transition-all hover:bg-white/5"
              aria-label="Back to feed"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1
                className="text-3xl text-white font-light tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                New Post
              </h1>
              <p className="text-white/40 text-sm mt-0.5">Share a moment with the world</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image drop zone */}
            {!preview ? (
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`liquid-glass rounded-3xl aspect-square flex flex-col items-center justify-center gap-5 cursor-pointer transition-all ${
                  dragging ? 'bg-white/5 scale-[1.01]' : 'hover:bg-white/[0.02]'
                }`}
                role="button"
                aria-label="Upload image"
              >
                <div className={`liquid-glass rounded-full p-6 transition-transform ${dragging ? 'scale-110' : ''}`}>
                  {dragging ? (
                    <Upload size={36} className="text-white/60" />
                  ) : (
                    <ImagePlus size={36} className="text-white/40" />
                  )}
                </div>
                <div className="text-center px-8">
                  <p
                    className="text-xl text-white/60 mb-1"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {dragging ? 'Drop it here' : 'Add your photo'}
                  </p>
                  <p className="text-white/30 text-sm">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-white/20 text-xs mt-2">
                    JPEG, PNG, GIF, WebP · Up to 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
            ) : (
              /* Image preview */
              <div className="liquid-glass rounded-3xl overflow-hidden relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full object-cover max-h-[500px]"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-4 right-4 liquid-glass rounded-full p-2.5 text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Caption input */}
            <div className="liquid-glass rounded-2xl p-1 overflow-hidden">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption…"
                maxLength={2200}
                rows={4}
                className="w-full bg-transparent text-white placeholder:text-white/30 text-sm leading-relaxed resize-none outline-none border-none p-4"
                aria-label="Post caption"
              />
              <div className="px-4 pb-3 flex justify-end">
                <span className="text-white/20 text-xs">{caption.length}/2200</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="liquid-glass rounded-xl px-4 py-3 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !image}
              className={`w-full liquid-glass rounded-full px-8 py-4 text-white font-medium flex items-center justify-center gap-3 transition-all ${
                !image
                  ? 'opacity-30 cursor-not-allowed'
                  : loading
                  ? 'opacity-60 cursor-wait'
                  : 'hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Posting…</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Share Post</span>
                </>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
