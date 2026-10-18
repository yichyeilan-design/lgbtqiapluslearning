import React from 'react';
import { Play, Heart, Star, Sparkles } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}) => {
  const formatPlays = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col"
    >
      {/* Visual Header / Cover Canvas */}
      <div
        className="relative w-full aspect-16/10 flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${game.themeColor || '#10b981'}25, #090d16 85%)`
        }}
      >
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Game Title Icon / Art Centerpiece */}
        <div className="relative z-10 flex flex-col items-center gap-2 transform group-hover:scale-105 transition-transform duration-200">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
            style={{
              backgroundColor: `${game.themeColor || '#10b981'}20`,
              color: game.themeColor || '#10b981'
            }}
          >
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase opacity-75">
            {game.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-lg bg-slate-950/70 backdrop-blur-sm border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Play Overlay Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 z-10">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
              {game.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Clean unboxed metadata with bullet separators */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">{game.rating.toFixed(1)}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="tabular-nums">{formatPlays(game.plays)} plays</span>
          </div>

          {game.badge && (
            <span className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-wider">
              {game.badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
