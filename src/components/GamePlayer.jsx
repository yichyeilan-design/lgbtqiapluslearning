import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Heart,
  Star,
  Info,
  SlidersHorizontal,
  EyeOff
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onTriggerPanic
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [useRawSource, setUseRawSource] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  const handleOpenExternal = () => {
    window.open(game.iframeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full max-w-6xl mx-auto py-4 px-3 sm:px-6 transition-all ${theaterMode ? 'max-w-none px-0 py-0' : ''}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games</span>
          </button>

          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{game.title}</span>
              {game.badge && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  {game.badge}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{game.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="tabular-nums">{game.rating.toFixed(1)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => setTheaterMode(!theaterMode)}
            title="Toggle Theater / Wide Mode"
            className={`p-2 rounded-lg transition-colors ${
              theaterMode ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            title="Restart / Reload Game"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {game.rawSourceEmbed && (
            <button
              onClick={() => setUseRawSource(!useRawSource)}
              title="Toggle between Playable Game and Raw Iframe embed"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                useRawSource
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {useRawSource ? 'Raw Embed' : 'Game View'}
            </button>
          )}

          <button
            onClick={handleOpenExternal}
            title="Open game in new window"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        ref={containerRef}
        className={`relative w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center ${
          theaterMode ? 'h-[85vh] rounded-none border-x-0' : 'aspect-16/10 sm:aspect-16/9 max-h-[78vh]'
        } ${isFullscreen ? '!h-screen !w-screen !max-h-none !rounded-none !border-0' : ''}`}
      >
        {useRawSource && game.rawSourceEmbed ? (
          <div
            className="w-full h-full flex items-center justify-center bg-slate-950"
            dangerouslySetInnerHTML={{ __html: game.rawSourceEmbed.replace('style="display: none;"', 'style="width: 100%; height: 100%; border: 0;"') }}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0 bg-slate-950"
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}

        {/* Floating Quick Panic shortcut pill in fullscreen */}
        {isFullscreen && (
          <button
            onClick={onTriggerPanic}
            title="Instant Panic Screen"
            className="absolute top-3 right-3 z-50 bg-slate-950/80 hover:bg-rose-950 border border-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded text-xs flex items-center gap-1.5"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Panic (\)</span>
          </button>
        )}
      </div>

      {/* Game Details and Controls Instructions */}
      {!theaterMode && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-1">About {game.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {game.description}
            </p>
            {game.tags && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Tags:</span>
                {game.tags.map((tag, idx) => (
                  <span key={tag} className="text-slate-400">
                    {tag}{idx < game.tags.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  Controls & Keys
                </span>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 font-mono leading-relaxed">
                {game.controls}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Source: Stored in <code className="text-emerald-400">games.json</code></span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                Press \ to Panic
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
