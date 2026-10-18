import React from 'react';
import { Gamepad2, Shield, EyeOff, Plus, FileCode, Heart } from 'lucide-react';

export const Header = ({
  onOpenCloakModal,
  onOpenAddModal,
  onOpenJsonModal,
  onTriggerPanic,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onSelectCategory,
  currentCategory
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onSelectCategory('All');
            if (showFavoritesOnly) onToggleFavoritesOnly();
          }}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:scale-105 transition-all">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap lowercase">
              lgbtqiaplus<span className="text-emerald-400">learning</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              onSelectCategory('All');
              if (showFavoritesOnly) onToggleFavoritesOnly();
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              !showFavoritesOnly && currentCategory === 'All' ? 'text-white font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              !showFavoritesOnly && currentCategory === 'Arcade' ? 'text-white font-semibold' : ''
            }`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              !showFavoritesOnly && currentCategory === 'Puzzle' ? 'text-white font-semibold' : ''
            }`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Action')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              !showFavoritesOnly && currentCategory === 'Action' ? 'text-white font-semibold' : ''
            }`}
          >
            Action
          </button>
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
              showFavoritesOnly ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-400' : ''}`} />
            <span>Favorites ({favoritesCount})</span>
          </button>
          <button
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white text-slate-400"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>games.json</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Tab Cloak */}
          <button
            onClick={onOpenCloakModal}
            title="Disguise this tab as Google Docs or Classroom"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Cloak Tab</span>
          </button>

          {/* Panic Button */}
          <button
            onClick={onTriggerPanic}
            title="Emergency academic disguise screen (Hotkey: \)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:bg-amber-950/30 hover:border-amber-700/50 transition-all whitespace-nowrap"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panic</span>
            <kbd className="hidden lg:inline text-[10px] bg-slate-800 px-1 rounded text-slate-400 border border-slate-700">\</kbd>
          </button>

          {/* Add Game Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all whitespace-nowrap shadow-sm shadow-emerald-950"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
