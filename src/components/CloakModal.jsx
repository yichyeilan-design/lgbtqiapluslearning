import React from 'react';
import { X, Shield, Check } from 'lucide-react';

const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Normal (lgbtqiapluslearning)',
    title: 'lgbtqiapluslearning',
    subtitle: 'Standard site title and controller icon',
    icon: '🎮'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Unit 4 Research Notes - Google Docs',
    subtitle: 'Disguises tab as an ongoing Google Docs assignment',
    icon: '📄'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    subtitle: 'Disguises tab as active classroom course page',
    icon: '🏫'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    subtitle: 'Disguises tab as university or school Canvas student portal',
    icon: '🎓'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    subtitle: 'Disguises tab as Google Drive cloud storage',
    icon: '📁'
  }
];

export const CloakModal = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">Tab Cloaking</h3>
              <p className="text-xs text-slate-400">Camouflage your browser tab title and favicon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="p-6 space-y-2.5">
          {CLOAK_PRESETS.map((preset) => {
            const isSelected = activeCloak === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectCloak(preset.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800 border-sky-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{preset.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{preset.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate max-w-xs">
                      {preset.title}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
          Tip: You can also press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">\</kbd> at any time for the instant study notes panic screen.
        </div>
      </div>
    </div>
  );
};
