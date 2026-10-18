/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Dices,
  Play,
  Heart,
  Star,
  Sparkles,
  Flame,
  Clock,
  X
} from 'lucide-react';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonModal } from './components/JsonModal';
import { CloakModal } from './components/CloakModal';
import { PanicScreen } from './components/PanicScreen';
import { applyCloak, getInitialCloak } from './utils/cloak';

export default function App() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [activeCloak, setActiveCloak] = useState('default');

  const searchInputRef = useRef(null);

  // Initialize cloaking and load games
  useEffect(() => {
    const savedCloak = getInitialCloak();
    setActiveCloak(savedCloak);
    applyCloak(savedCloak);

    // Load favorites & recent from localStorage
    try {
      const savedFavs = localStorage.getItem('unblockzone_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecent = localStorage.getItem('unblockzone_recent');
      if (savedRecent) setRecentlyPlayed(JSON.parse(savedRecent));
    } catch (e) {
      console.error('Error loading saved state:', e);
    }

    // Fetch games.json
    fetch('/games.json')
      .then((res) => res.json())
      .then((data) => {
        try {
          const customGames = localStorage.getItem('unblockzone_custom_games');
          if (customGames) {
            const parsedCustom = JSON.parse(customGames);
            setGames([...data, ...parsedCustom]);
          } else {
            setGames(data);
          }
        } catch {
          setGames(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load games.json:', err);
        setIsLoading(false);
      });
  }, []);

  // Keyboard shortcut listener (\ for panic, / for search, Esc to exit modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === '\\') {
        e.preventDefault();
        setIsPanicActive((prev) => !prev);
      } else if (e.key === '/' && !isInput && !activeGame) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (isPanicActive) setIsPanicActive(false);
        else if (isAddModalOpen) setIsAddModalOpen(false);
        else if (isJsonModalOpen) setIsJsonModalOpen(false);
        else if (isCloakModalOpen) setIsCloakModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanicActive, isAddModalOpen, isJsonModalOpen, isCloakModalOpen, activeGame]);

  const handleSelectCloak = (option) => {
    setActiveCloak(option);
    applyCloak(option);
  };

  const handleToggleFavorite = (gameId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('unblockzone_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handlePlayGame = (game) => {
    setActiveGame(game);
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const updated = [game.id, ...filtered].slice(0, 8);
      localStorage.setItem('unblockzone_recent', JSON.stringify(updated));
      return updated;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGame = (newGame) => {
    const updatedGames = [newGame, ...games];
    setGames(updatedGames);
    try {
      const customOnly = updatedGames.filter((g) => g.custom);
      localStorage.setItem('unblockzone_custom_games', JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save custom game:', e);
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('unblockzone_custom_games');
    fetch('/games.json')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setIsJsonModalOpen(false);
      });
  };

  const handleUpdateGames = (newGamesList) => {
    setGames(newGamesList);
    const customOnly = newGamesList.filter((g) => g.custom);
    localStorage.setItem('unblockzone_custom_games', JSON.stringify(customOnly));
  };

  const handleSurpriseMe = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  const categories = useMemo(() => {
    const set = new Set();
    games.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        if (showFavoritesOnly && !favorites.includes(game.id)) return false;
        if (selectedCategory !== 'All' && game.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchCat = game.category.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchTags = game.tags?.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchCat || matchDesc || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy, showFavoritesOnly, favorites]);

  const featuredGame = useMemo(() => {
    return games.find((g) => g.isFeatured) || games[0];
  }, [games]);

  const recentGameItems = useMemo(() => {
    return recentlyPlayed
      .map((id) => games.find((g) => g.id === id))
      .filter((g) => g !== undefined);
  }, [recentlyPlayed, games]);

  if (isPanicActive) {
    return <PanicScreen onDismiss={() => setIsPanicActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveGame(null);
        }}
        currentCategory={selectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Active Game Player Screen */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onTriggerPanic={() => setIsPanicActive(true)}
          />
        ) : (
          <>
            {/* Featured Hero Banner */}
            {selectedCategory === 'All' && !searchQuery && !showFavoritesOnly && featuredGame && (
              <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 80% 50%, ${featuredGame.themeColor || '#10b981'}, transparent 70%)`
                  }}
                />
                <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="uppercase tracking-wider">Spotlight Game</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                      {featuredGame.title}
                    </h1>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {featuredGame.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => handlePlayGame(featuredGame)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Play Now</span>
                      </button>

                      <button
                        onClick={handleSurpriseMe}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
                      >
                        <Dices className="w-4 h-4 text-emerald-400" />
                        <span>Surprise Me</span>
                      </button>
                    </div>

                    {/* Unboxed metadata line */}
                    <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>{featuredGame.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="tabular-nums">{featuredGame.rating.toFixed(1)}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>Iframe Embedded</span>
                    </div>
                  </div>

                  {/* Visual Centerpiece Icon */}
                  <div className="hidden md:flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-2xl border border-slate-800/80 aspect-square w-52 shadow-inner">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl mb-3"
                      style={{
                        backgroundColor: `${featuredGame.themeColor || '#10b981'}25`,
                        color: featuredGame.themeColor || '#10b981'
                      }}
                    >
                      <Flame className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      {featuredGame.plays.toLocaleString()} Plays
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recently Played Tray */}
            {recentGameItems.length > 0 && !searchQuery && !showFavoritesOnly && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Continue Playing</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {recentGameItems.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handlePlayGame(game)}
                      className="flex items-center gap-2.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg shrink-0 transition-all text-left group"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: `${game.themeColor || '#10b981'}20`,
                          color: game.themeColor || '#10b981'
                        }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                        {game.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search, Filter Tabs & Sort Controls */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search unblocked games... (Press /)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort selector & Random Game */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="popular" className="bg-slate-900">Most Popular</option>
                      <option value="rating" className="bg-slate-900">Top Rated</option>
                      <option value="az" className="bg-slate-900">Alphabetical</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSurpriseMe}
                    title="Launch a random unblocked game"
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <Dices className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Segmented Category Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat && !showFavoritesOnly;
                  const count = cat === 'All'
                    ? games.length
                    : games.filter((g) => g.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFavoritesOnly(false);
                      }}
                      className={`px-3.5 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-100 text-slate-950 shadow-sm'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[11px] tabular-nums ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Games Grid Heading */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-white font-bold tabular-nums">{filteredGames.length}</span> games
                {showFavoritesOnly && ' in Favorites'}
                {selectedCategory !== 'All' && !showFavoritesOnly && ` in ${selectedCategory}`}
              </div>
            </div>

            {/* Games Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 animate-pulse">
                    <div className="aspect-16/10 bg-slate-800 rounded-lg mb-3" />
                    <div className="h-4 bg-slate-800 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-850 rounded w-full mb-3" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPlay={handlePlayGame}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800/80 p-8">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Games Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  {showFavoritesOnly
                    ? "You haven't bookmarked any games yet. Click the heart icon on any game card."
                    : `No results matching "${searchQuery}". Try searching for another title or clear your filters.`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setShowFavoritesOnly(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">lgbtqiapluslearning</span>
            <span>· All games loaded as iframe modules from <code className="text-emerald-400">games.json</code></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsCloakModalOpen(true)} className="hover:text-white transition-colors">
              Tab Cloak
            </button>
            <button onClick={() => setIsJsonModalOpen(true)} className="hover:text-white transition-colors">
              games.json
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="hover:text-white transition-colors">
              Add Game
            </button>
            <button onClick={() => setIsPanicActive(true)} className="hover:text-amber-400 transition-colors">
              Panic Screen (\)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onUpdateGames={handleUpdateGames}
        onResetDefaults={handleResetDefaults}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={handleSelectCloak}
      />
    </div>
  );
}
