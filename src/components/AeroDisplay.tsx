import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { AngleMode } from '../types/calculator';

interface AeroDisplayProps {
  expression: string;
  currentValue: string;
  hasMemory: boolean;
  angleMode: AngleMode;
  isMuted: boolean;
  onToggleSound: () => void;
  onToggleAngleMode: () => void;
}

export const AeroDisplay: React.FC<AeroDisplayProps> = ({
  expression,
  currentValue,
  hasMemory,
  angleMode,
  isMuted,
  onToggleSound,
  onToggleAngleMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Determine dynamic font size based on text length to prevent overflow
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 18) return 'text-xl sm:text-2xl';
    if (len > 12) return 'text-2xl sm:text-3xl';
    if (len > 8) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  return (
    <div className="aero-screen rounded-2xl p-4 sm:p-5 mb-4 text-white select-text">
      {/* Top Indicators Bar */}
      <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-cyan-200/80 mb-2 border-b border-cyan-500/20 pb-1.5">
        <div className="flex items-center gap-3">
          {/* Deg / Rad toggle badge */}
          <button
            onClick={onToggleAngleMode}
            className="hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-cyan-900/40 border border-cyan-400/30 text-[10px]"
            title="Alternar entre Graus e Radianos"
          >
            {angleMode.toUpperCase()}
          </button>

          {/* Memory Flag */}
          {hasMemory && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-bold">
              M
            </span>
          )}

          <span className="text-[11px] text-cyan-300/70 hidden sm:inline">
            Frutiger Aero Precision
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            className="p-1 rounded hover:bg-cyan-400/20 transition-colors text-cyan-200 hover:text-white cursor-pointer"
            title={isMuted ? 'Ativar Sons' : 'Desativar Sons'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-cyan-400/20 transition-colors text-cyan-200 hover:text-white cursor-pointer"
            title="Copiar resultado"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* Expression Tape Line */}
      <div className="min-h-[22px] text-right text-xs sm:text-sm font-lcd text-cyan-300/80 tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none px-1">
        {expression || '\u00A0'}
      </div>

      {/* Main Digits Display */}
      <div
        className={`font-lcd font-bold text-right tracking-wider text-cyan-100 drop-shadow-[0_0_12px_rgba(34,197,238,0.6)] ${getFontSizeClass(
          currentValue
        )} overflow-x-auto whitespace-nowrap scrollbar-none py-1 px-1 transition-all duration-150`}
      >
        {currentValue}
      </div>
    </div>
  );
};
