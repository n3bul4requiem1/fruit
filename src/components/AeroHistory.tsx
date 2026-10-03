import React from 'react';
import { History, Trash2, X, ArrowUpRight } from 'lucide-react';
import { HistoryItem } from '../types/calculator';

interface AeroHistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  onSelectResult: (result: string) => void;
}

export const AeroHistory: React.FC<AeroHistoryProps> = ({
  history,
  isOpen,
  onClose,
  onClearHistory,
  onSelectResult,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 rounded-3xl overflow-hidden bg-slate-900/85 backdrop-blur-xl border border-cyan-400/40 p-4 sm:p-5 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 text-cyan-200">
        <div className="flex items-center gap-2">
          <History size={18} className="text-cyan-400" />
          <h3 className="font-bold text-sm tracking-wide text-white">Histórico de Cálculos</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Limpar histórico"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer"
            title="Fechar histórico"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1 scrollbar-thin">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cyan-200/60">
            <History size={36} className="mb-2 opacity-40 text-cyan-400" />
            <p className="text-sm font-medium">Nenhum cálculo recente</p>
            <p className="text-xs text-cyan-300/40 mt-1">
              Os resultados calculados aparecerão aqui como uma fita de memória.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item.result)}
              className="group p-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer text-right"
              title="Clique para carregar este resultado"
            >
              <div className="text-xs text-cyan-300/70 font-lcd truncate group-hover:text-cyan-200">
                {item.expression} =
              </div>
              <div className="text-lg font-bold font-lcd text-cyan-100 flex items-center justify-end gap-1.5 group-hover:text-emerald-300">
                <span>{item.result}</span>
                <ArrowUpRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400"
                />
              </div>
              <div className="text-[10px] text-cyan-400/40 mt-1">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
