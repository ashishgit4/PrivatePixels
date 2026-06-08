import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ImagePlus, LayoutGrid, Home } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/feed', label: 'Feed', icon: LayoutGrid },
    { path: '/create', label: 'Create', icon: ImagePlus },
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="liquid-glass rounded-2xl px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Globe size={22} className="text-white" />
          <span className="text-white font-semibold text-lg">Asme</span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          {links.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
