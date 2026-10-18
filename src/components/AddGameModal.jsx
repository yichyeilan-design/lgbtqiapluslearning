import React, { useState } from 'react';
import { X, Eye, Check } from 'lucide-react';

export const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [iframeSource, setIframeSource] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const extractUrl = (input) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["'](.*?)["']/);
      return match ? match[1] : trimmed;
    }
    return trimmed;
  };

  const handlePreview = () => {
    const url = extractUrl(iframeSource);
    if (!url) {
      setError('Please provide an iframe URL or embed code to preview.');
      return;
    }
    setError('');
    setPreviewActive(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = extractUrl(iframeSource);
    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }
    if (!url) {
      setError('Valid Iframe URL or embed code is required.');
      return;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      description: description.trim() || 'Custom user embedded game.',
      controls: controls.trim() || 'Mouse and keyboard controls.',
      iframeUrl: url,
      embedCode: `<iframe src="${url}" width="100%" height="100%" frameborder="0" allowfullscreen allow="gamepad; autoplay"></iframe>`,
      rating: 5.0,
      plays: 1,
      badge: 'Custom',
      themeColor: '#10b981',
      tags: ['Custom', category],
      custom: true
    };

    onAddGame(newGame);
    onClose();
    setTitle('');
    setDescription('');
    setControls('');
    setIframeSource('');
    setPreviewActive(false);
    setError('');
  };

  const activeUrl = extractUrl(iframeSource);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Add Game via Iframe</h3>
            <p className="text-xs text-slate-400">Embed any HTML5 game directly into your library</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Retro Space Blaster"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Controls Info</label>
              <input
                type="text"
                placeholder="e.g. Arrow keys to steer"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Iframe Source (URL or &lt;iframe&gt; code)
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. https://example.com/game or <iframe src='...'></iframe>"
              value={iframeSource}
              onChange={(e) => {
                setIframeSource(e.target.value);
                setPreviewActive(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Short summary of game objective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Live Preview Toggle */}
          <div>
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Test & Preview Iframe</span>
            </button>

            {previewActive && activeUrl && (
              <div className="mt-2 w-full h-44 bg-black rounded-lg border border-slate-800 overflow-hidden relative">
                <iframe
                  src={activeUrl}
                  title="Preview"
                  className="w-full h-full border-0"
                  allow="fullscreen; autoplay; gamepad"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save Game to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
