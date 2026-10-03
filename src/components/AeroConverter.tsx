import React, { useState } from 'react';
import { ArrowLeftRight, X, Sparkles, ChevronUp } from 'lucide-react';
import { soundEngine } from '../utils/audio';

type Category = 'length' | 'weight' | 'temp' | 'data';

interface UnitDef {
  label: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const CONVERSIONS: Record<Category, Record<string, UnitDef>> = {
  length: {
    m: { label: 'Metros (m)', toBase: (v) => v, fromBase: (v) => v },
    cm: { label: 'Centímetros (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    km: { label: 'Quilômetros (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    inch: { label: 'Polegadas (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ft: { label: 'Pés (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    mile: { label: 'Milhas (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    kg: { label: 'Quilogramas (kg)', toBase: (v) => v, fromBase: (v) => v },
    g: { label: 'Gramas (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    lb: { label: 'Libras (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    oz: { label: 'Onças (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  },
  temp: {
    c: { label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    f: { label: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
    k: { label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  data: {
    mb: { label: 'Megabytes (MB)', toBase: (v) => v, fromBase: (v) => v },
    gb: { label: 'Gigabytes (GB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    kb: { label: 'Kilobytes (KB)', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
    tb: { label: 'Terabytes (TB)', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
  },
};

interface AeroConverterProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalc?: (val: string) => void;
}

export const AeroConverter: React.FC<AeroConverterProps> = ({
  isOpen,
  onClose,
  onInsertToCalc,
}) => {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [inputValue, setInputValue] = useState<string>('1');

  const handleCategoryChange = (cat: Category) => {
    soundEngine.playOperator();
    setCategory(cat);
    const units = Object.keys(CONVERSIONS[cat]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const calculateOutput = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return '0';
    const catData = CONVERSIONS[category];
    const base = catData[fromUnit]?.toBase(num) ?? num;
    const result = catData[toUnit]?.fromBase(base) ?? base;
    return (Math.round((result + Number.EPSILON) * 1e6) / 1e6).toString();
  };

  const outputValue = calculateOutput();

  const handleSwap = () => {
    soundEngine.playOperator();
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleSendToCalc = () => {
    soundEngine.playResult();
    if (onInsertToCalc) {
      onInsertToCalc(outputValue);
    }
    onClose();
  };

  return (
    <div
      className={`absolute inset-x-0 top-0 z-40 transition-all duration-300 ease-out transform ${
        isOpen
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="win7-aero-frame rounded-b-[28px] p-3.5 shadow-2xl border-t-0 border-x-2 border-b-2 border-white/90 text-slate-800 bg-sky-950/20 backdrop-blur-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-400/30">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={12} />
            </div>
            <span className="font-bold text-xs tracking-wide text-sky-950 win7-title-glow">
              Conversor de Unidades (Aero Slide)
            </span>
          </div>
          <button
            onClick={onClose}
            className="win7-btn-close w-7 h-5 rounded flex items-center justify-center cursor-pointer"
            title="Recolher conversor"
          >
            <X size={12} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white/50 rounded-xl mb-2.5 text-xs font-semibold">
          {(['length', 'weight', 'temp', 'data'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`py-1 rounded-lg transition-all cursor-pointer text-center ${
                category === cat
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              {cat === 'length' && 'Compr.'}
              {cat === 'weight' && 'Massa'}
              {cat === 'temp' && 'Temp.'}
              {cat === 'data' && 'Dados'}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-0.5 text-[11px]">De:</label>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/90 border border-sky-300 text-sm font-lcd font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-white/90 border border-sky-300 font-semibold text-slate-800 focus:outline-none text-[11px]"
              >
                {Object.entries(CONVERSIONS[category]).map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              onClick={handleSwap}
              className="p-1 rounded-full bg-white hover:bg-sky-50 border border-sky-300 text-sky-700 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Inverter unidades"
            >
              <ArrowLeftRight size={13} />
            </button>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5 text-[11px]">Para:</label>
            <div className="flex gap-1.5">
              <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-sky-950/10 border border-sky-300/80 text-sm font-lcd font-bold text-sky-950 flex items-center">
                {outputValue}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-white/90 border border-sky-300 font-semibold text-slate-800 focus:outline-none text-[11px]"
              >
                {Object.entries(CONVERSIONS[category]).map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Send to Calculator Button */}
          {onInsertToCalc && (
            <button
              onClick={handleSendToCalc}
              className="w-full mt-2 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer text-xs"
            >
              Usar valor na calculadora
            </button>
          )}
        </div>

        {/* Pull Handle at bottom to slide back up */}
        <div
          onClick={onClose}
          className="pt-2 flex flex-col items-center justify-center cursor-pointer group select-none"
          title="Deslizar para cima para fechar"
        >
          <div className="w-10 h-1 rounded-full bg-sky-400/60 group-hover:bg-sky-600 transition-colors" />
          <ChevronUp size={14} className="text-sky-600 -mt-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
