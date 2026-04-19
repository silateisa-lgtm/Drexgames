/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  X, 
  Maximize2, 
  RotateCcw, 
  ExternalLink,
  Github,
  Play,
  TrendingUp,
  Clock,
  LayoutGrid,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games] = useState(gamesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(games.map(g => g.category))];
    return cats;
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-[#ececec]">
      {/* Top Nav */}
      <nav className="h-[70px] bg-surface border-b border-border flex items-center justify-between px-10 sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setSelectedGame(null)}
        >
          <div className="w-8 h-8 bg-brand rounded shadow-[0_0_15px_var(--color-brand-glow)] flex items-center justify-center">
            <Gamepad2 className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-[4px] text-brand logo-glow">
            VOID
          </span>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search for games, categories, or players..."
            className="w-full bg-[#1a1a24] border border-border rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand/40 transition-colors placeholder:text-text-dim"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-text-dim hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-brand border-2 border-white/20 shadow-lg shadow-brand/20"></div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only visible in list mode */}
        {!selectedGame && (
          <aside className="hidden lg:flex w-[240px] bg-surface border-right border-border flex-col p-8 overflow-y-auto no-scrollbar">
            <div className="text-[11px] uppercase tracking-[1.5px] text-text-dim mb-6 font-bold">Menu</div>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium text-sm transition-all ${
                    selectedCategory === cat 
                      ? 'bg-brand text-white shadow-[0_0_20px_var(--color-brand-glow)]' 
                      : 'text-text-dim hover:bg-surface-hover hover:text-white'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? 'bg-white' : 'bg-transparent border border-text-dim'}`} />
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-12 text-[11px] uppercase tracking-[1.5px] text-text-dim mb-6 font-bold">Friends</div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff88]"></div>
                <span className="text-sm text-[#ccc] font-medium">Hyperion_99</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff88]"></div>
                <span className="text-sm text-[#ccc] font-medium">Vortex_Gamer</span>
              </div>
            </div>
          </aside>
        )}

        <main className={`flex-1 overflow-y-auto immersive-gradient p-10 ${selectedGame ? 'w-full' : ''}`}>
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Featured Games</h2>
                  <div className="text-sm text-brand font-bold cursor-pointer hover:underline">
                    View All &rarr;
                  </div>
                </div>

                {/* Hero Section */}
                <section className="relative rounded-2xl overflow-hidden aspect-[21/9] flex items-center px-12 group border border-border">
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/20 to-transparent z-10" />
                  <img 
                    src="https://picsum.photos/seed/nebula/1200/600" 
                    alt="Featured" 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-[1.5s]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="relative z-20 max-w-lg space-y-4">
                    <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest">
                      <div className="w-8 h-[2px] bg-brand"></div>
                      New Release
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white">
                      VOYAGER <span className="text-brand">6</span>
                    </h1>
                    <p className="text-text-dim text-lg font-medium leading-relaxed max-w-sm">
                      Deep space survival simulation. Master the void.
                    </p>
                    <button className="bg-brand text-white px-10 py-3.5 rounded-lg font-bold shadow-[0_0_20px_var(--color-brand-glow)] hover:scale-105 transition-transform">
                      Play Now
                    </button>
                  </div>
                </section>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedGame(game)}
                        className="group cursor-pointer bg-card-bg border border-border rounded-xl overflow-hidden hover:border-brand hover:shadow-[0_0_30px_rgba(112,0,255,0.15)] transition-all duration-300 flex flex-col"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          {index === 0 && (
                            <div className="absolute top-3 right-3 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase z-10">
                              New
                            </div>
                          )}
                          <img 
                            src={game.thumbnail} 
                            alt={game.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <h3 className="font-bold text-[16px] text-white group-hover:text-brand transition-colors">
                            {game.title}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-text-dim font-medium uppercase tracking-wider">{game.category} • 4.8★</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto text-text-dim">
                        <LayoutGrid className="w-10 h-10" />
                      </div>
                      <p className="text-text-dim font-medium">No results found in the sector.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto w-full space-y-8"
              >
                <div className="w-full h-[75vh] rounded-2xl overflow-hidden bg-black border border-border relative group shadow-2xl">
                  <iframe 
                    src={selectedGame.iframeUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    title={selectedGame.title}
                  />
                  
                  {/* HUD Controls */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-1.5 bg-black/80 rounded-xl backdrop-blur-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-[1px] h-5 bg-white/10" />
                    <button 
                      onClick={() => {
                        const iframe = document.querySelector('iframe');
                        if (iframe) iframe.src = iframe.src;
                      }}
                      className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={toggleFullScreen}
                      className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <a 
                      href={selectedGame.iframeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[2px] text-brand">
                        <span>{selectedGame.category}</span>
                        <span className="w-1 h-1 rounded-full bg-text-dim"></span>
                        <span className="text-text-dim">Immersive Mode</span>
                      </div>
                      <h2 className="text-4xl font-black text-white tracking-tighter">
                        {selectedGame.title.toUpperCase()}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-lg border border-border bg-surface hover:border-brand transition-all text-sm font-bold shadow-lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      DISCONNECT
                    </button>
                  </div>
                  <p className="text-text-dim text-lg leading-relaxed max-w-3xl pr-12">
                    {selectedGame.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Stats Bar (Footer) */}
      <footer className="h-10 bg-surface border-t border-border flex items-center px-10 text-[11px] font-bold text-text-dim gap-8 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          Server Status: <span className="text-[#00ff88]">Online</span>
        </div>
        <div className="flex items-center gap-2">
          Players Online: <span className="text-white">12,842</span>
        </div>
        <div className="flex items-center gap-2">
          Latency: <span className="text-white">24ms</span>
        </div>
        <div className="ml-auto text-[10px] opacity-40">
          v2.4.0-build-stable
        </div>
      </footer>
    </div>
  );
}
