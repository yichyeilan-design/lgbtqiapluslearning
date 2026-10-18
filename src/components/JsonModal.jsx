import React, { useState } from 'react';
import { X, Copy, Check, Download, RotateCcw, AlertCircle } from 'lucide-react';

export const JsonModal = ({
  isOpen,
  onClose,
  games,
  onUpdateGames,
  onResetDefaults
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentJsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = () => {
    setJsonText(currentJsonString);
    setIsEditing(true);
    setError('');
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON must be an array of game objects.');
      }
      onUpdateGames(parsed);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>games.json</span>
              <span className="text-xs text-slate-400 font-normal">({games.length} games loaded)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each game is structured with title, category, and iframe embed parameters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Edit JSON
              </button>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
              >
                Apply Changes
              </button>
            )}

            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-3 p-3 bg-rose-950/60 border border-rose-800 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content area */}
        <div className="p-6 flex-1 overflow-auto bg-slate-950 font-mono text-xs">
          {isEditing ? (
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-96 bg-transparent text-emerald-400 focus:outline-none resize-none font-mono"
              spellCheck={false}
            />
          ) : (
            <pre className="text-slate-300 whitespace-pre-wrap select-all leading-relaxed">
              {currentJsonString}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
