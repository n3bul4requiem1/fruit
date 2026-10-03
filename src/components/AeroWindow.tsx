import React, { useState, useEffect } from 'react';
import {
  History,
  Calculator,
  Binary,
  Layers,
  Palette,
  Wifi,
  BatteryCharging,
  Signal,
  Music,
  Sliders,
  Store,
  Smartphone,
} from 'lucide-react';
import { CalcMode, ThemeColor } from '../types/calculator';

interface AeroWindowProps {
  children: React.ReactNode;
  calcMode: CalcMode;
  onToggleCalcMode: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenGooglePlay?: () => void;
  onToggleConverter: () => void;
  onOpenMusicPlayer: () => void;
  isConverterOpen: boolean;
  historyCount: number;
  colorTheme: ThemeColor;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isAndroidMode: boolean;
  onToggleAndroidMode: () => void;
}

export const AeroWindow: React.FC<AeroWindowProps> = ({
  children,
  calcMode,
  onToggleCalcMode,
  onOpenHistory,
  onOpenSettings,
  onOpenGooglePlay,
  onToggleConverter,
  onOpenMusicPlayer,
  isConverterOpen,
  historyCount,
  colorTheme,
}) => {
  // Live clock for Android status bar
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const getThemeGlassGradient = () => {
    switch (colorTheme) {
      case 'aurora':
        return 'from-emerald-300/75 via-teal-200/45 to-emerald-400/55';
      case 'ocean':
        return 'from-blue-400/75 via-sky-300/45 to-indigo-400/55';
      case 'sunset':
        return 'from-amber-300/75 via-orange-200/45 to-rose-300/55';
      case 'smoke':
      case 'graphite':
        return 'from-slate-300/75 via-slate-200/45 to-slate-400/55';
      case 'win7_blue':
      case 'aqua':
      default:
        return 'from-sky-300/80 via-cyan-200/50 to-sky-400/60';
    }
  };

  return (
    <div
      className={`win7-aero-frame ${getThemeGlassGradient()} w-full max-w-[380px] sm:max-w-[400px] rounded-[30px] p-2.5 sm:p-3 shadow-2xl flex flex-col border-2 border-white/85 select-none relative my-auto`}
    >
      {/* Android Top Status Bar */}
      <div className="flex items-center justify-between px-3 pt-1 pb-1.5 text-[11px] font-bold text-sky-950/90 border-b border-sky-400/20 shrink-0 select-none">
        <span>{timeStr || '12:00'}</span>
        <div className="flex items-center gap-1.5">
          <Signal size={12} className="stroke-[2.5]" />
          <span className="text-[9px]">5G</span>
          <Wifi size={12} className="stroke-[2.5]" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">98%</span>
            <BatteryCharging size={13} className="text-emerald-700 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Android App Header Bar */}
      <div className="flex items-center justify-between px-1.5 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-300 p-0.5 shadow-sm flex items-center justify-center border border-white">
            <Calculator size={13} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-sky-950 win7-title-glow block leading-tight">
              Calculadora Aero
            </span>
            <span className="text-[9px] text-slate-600 block">Android Edition</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Music Player Button */}
          <button
            onClick={onOpenMusicPlayer}
            className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-sky-900 border border-white shadow-sm transition-all cursor-pointer"
            title="Música Tema: Aquatic Ambience"
          >
            <Music size={13} />
          </button>

          {/* Mode switch */}
          <button
            onClick={onToggleCalcMode}
            className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-sky-900 border border-white shadow-sm transition-all cursor-pointer text-[10px] font-bold"
            title={calcMode === 'standard' ? 'Modo Científico' : 'Modo Padrão'}
          >
            {calcMode === 'standard' ? <Binary size={13} /> : <Calculator size={13} />}
          </button>

          {/* Converter Gadget Toggle */}
          <button
            onClick={onToggleConverter}
            className={`p-1.5 rounded-lg border border-white shadow-sm transition-all cursor-pointer ${
              isConverterOpen ? 'bg-sky-500/30 font-bold' : 'bg-white/60 hover:bg-white text-sky-900'
            }`}
            title="Conversor de Unidades"
          >
            <Layers size={13} />
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-sky-900 border border-white shadow-sm transition-all relative cursor-pointer"
            title="Histórico"
          >
            <History size={13} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-600 text-[9px] text-white flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Google Play / APK */}
          {onOpenGooglePlay && (
            <button
              onClick={onOpenGooglePlay}
              className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white border border-white shadow-sm transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Gerar APK & Publicar na Google Play"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">APK</span>
            </button>
          )}

          {/* Themes & Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-sky-900 border border-white shadow-sm transition-all cursor-pointer"
            title="Temas, Sons e Opções"
          >
            <Sliders size={13} />
          </button>
        </div>
      </div>

      {/* Centered Client Box */}
      <div className="win7-client-box rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden shadow-inner relative">
        {children}
      </div>

      {/* Android Bottom Navigation Bar (Back, Home, Overview) */}
      <div className="flex items-center justify-around pt-2 pb-0.5 px-6 text-sky-950/70 shrink-0">
        <button
          onClick={onOpenHistory}
          className="p-1 hover:text-sky-950 transition-colors cursor-pointer"
          title="Histórico"
        >
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-current" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-1 hover:text-sky-950 transition-colors cursor-pointer"
          title="Configurações"
        >
          <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
        </button>
        <button
          onClick={onOpenMusicPlayer}
          className="p-1 hover:text-sky-950 transition-colors cursor-pointer"
          title="Música Tema"
        >
          <div className="w-3 h-3 rounded-sm border-2 border-current" />
        </button>
      </div>
    </div>
  );
};
