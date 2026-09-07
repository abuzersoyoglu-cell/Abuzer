import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, show a subtle green check badge
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install-app"
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95 ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
        }`}
        title="Install app on your phone or desktop"
      >
        <Download className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Install App (PWA)</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-750 font-medium transition active:scale-95 ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-xs'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Add to iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Add FixFlow to iPhone</h3>
                </div>
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <p>In Safari, tap the <strong className="text-cyan-300">Share icon (square with arrow up)</strong> at bottom.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <p>Scroll down the options and choose <strong className="text-white">"Add to Home Screen"</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <p>Tap <strong>"Add"</strong> at top right. FixFlow will launch as a native standalone app!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-sm font-semibold text-white transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop or generic browser guide button
  return (
    <button
      id="btn-pwa-quick-shortcut"
      onClick={() => {
        alert("FixFlow AI PWA: You can click the 'Install' icon in your browser's address bar or tap 'Add to Home Screen' on mobile for fullscreen mode.");
      }}
      className={`flex items-center gap-1.5 rounded-xl border border-slate-750 bg-slate-800/80 text-slate-300 hover:bg-slate-750 font-medium transition ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <Download className="w-3.5 h-3.5 text-cyan-400" />
      <span>PWA Mode</span>
    </button>
  );
};
