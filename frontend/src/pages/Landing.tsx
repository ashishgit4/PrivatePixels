import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Aperture, Share2 } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

const FADE_DURATION = 500; // ms
const FADE_OUT_TRIGGER = 0.55; // seconds before end

export default function Landing() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // ─── Fade helpers ───────────────────────────────────────────────────────────
  const cancelFade = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const fadeIn = (video: HTMLVideoElement) => {
    cancelFade();
    fadingOutRef.current = false;
    const startOpacity = video.style.opacity !== '' ? parseFloat(video.style.opacity) : 0;
    const startTime = performance.now();
    const remaining = (1 - startOpacity) * FADE_DURATION;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / remaining, 1);
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const fadeOut = (video: HTMLVideoElement, onComplete?: () => void) => {
    cancelFade();
    fadingOutRef.current = true;
    const startOpacity = video.style.opacity !== '' ? parseFloat(video.style.opacity) : 1;
    const startTime = performance.now();
    const elapsed0 = (1 - startOpacity) * FADE_DURATION; // already consumed

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (FADE_DURATION - elapsed0), 1);
      video.style.opacity = String(startOpacity * (1 - progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        onComplete?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ─── Video event handlers ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';

    const handleCanPlay = () => {
      fadeIn(video);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= FADE_OUT_TRIGGER && !fadingOutRef.current) {
        fadeOut(video);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      cancelFade();
      fadingOutRef.current = false;
      setTimeout(() => {
        video.currentTime = 0;
        video
          .play()
          .then(() => fadeIn(video))
          .catch(() => {});
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelFade();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col relative">
      {/* ─── Background Video ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          autoPlay
          playsInline
          loop={false}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
          style={{ opacity: 0 }}
        />
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ─── Navigation ─── */}
      <nav className="relative z-20 pl-6 pr-6 py-6">
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg">Asme</span>
            </div>
            {/* Nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              <button
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                onClick={() => navigate('/feed')}
              >
                Feed
              </button>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                About
              </a>
            </div>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-4">
            <button
              className="text-white text-sm font-medium hover:text-white/70 transition-colors"
              onClick={() => navigate('/feed')}
            >
              Sign Up
            </button>
            <button
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              onClick={() => navigate('/create')}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Content ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        {/* Heading */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        {/* Email + inputs block */}
        <div className="max-w-xl w-full space-y-4">
          {/* Email input bar */}
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-base outline-none border-none"
              aria-label="Email address"
            />
            <button
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors flex-shrink-0"
              aria-label="Subscribe"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-white text-sm leading-relaxed px-4 text-white/70">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>
        </div>

        {/* Manifesto button */}
        <div className="mt-8">
          <button
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            onClick={() => navigate('/feed')}
          >
            Explore Feed
          </button>
        </div>
      </div>

      {/* ─── Social Footer ─── */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Instagram"
        >
          <Aperture size={20} />
        </button>
        <button
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Twitter"
        >
          <Share2 size={20} />
        </button>
        <button
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Website"
        >
          <Globe size={20} />
        </button>
      </div>
    </div>
  );
}
