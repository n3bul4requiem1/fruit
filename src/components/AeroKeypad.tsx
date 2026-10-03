import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { CalcMode } from '../types/calculator';

interface AeroKeypadProps {
  calcMode: CalcMode;
  isFullscreen?: boolean;
  onNumber: (num: string) => void;
  onDecimal: () => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onSquareRoot: () => void;
  onSquare: () => void;
  onPower: () => void;
  onInverse: () => void;
  onScientificFn: (fn: string) => void;
  onConstant: (c: string) => void;
  onParenthesis: (p: string) => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-') => void;
  hasMemory: boolean;
}

export const AeroKeypad: React.FC<AeroKeypadProps> = ({
  calcMode,
  isFullscreen = false,
  onNumber,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
  onAllClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  onSquareRoot,
  onSquare,
  onPower,
  onInverse,
  onScientificFn,
  onConstant,
  onParenthesis,
  onMemoryAction,
  hasMemory,
}) => {
  // Adaptive vertical padding for mobile / Android fullscreen comfort
  const mainBtnClass = isFullscreen
    ? 'py-4 sm:py-5 text-xl sm:text-2xl rounded-2xl min-h-[54px] sm:min-h-[64px]'
    : 'py-3 sm:py-3.5 text-lg sm:text-xl rounded-2xl min-h-[46px]';
  return (
    <div className="space-y-3">
      {/* Memory Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onMemoryAction('MC')}
          disabled={!hasMemory}
          className={`aero-btn btn-fn py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
            !hasMemory ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Limpar Memória (MC)"
        >
          MC
        </button>
        <button
          onClick={() => onMemoryAction('MR')}
          disabled={!hasMemory}
          className={`aero-btn btn-fn py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
            !hasMemory ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Recuperar Memória (MR)"
        >
          MR
        </button>
        <button
          onClick={() => onMemoryAction('M+')}
          className="aero-btn btn-fn py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
          title="Adicionar à Memória (M+)"
        >
          M+
        </button>
        <button
          onClick={() => onMemoryAction('M-')}
          className="aero-btn btn-fn py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
          title="Subtrair da Memória (M-)"
        >
          M-
        </button>
      </div>

      {/* Scientific Row (if scientific mode is active) */}
      {calcMode === 'scientific' && (
        <div className="grid grid-cols-5 gap-2 pt-1 border-t border-cyan-300/30">
          <button
            onClick={() => onScientificFn('sin')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Seno"
          >
            sin
          </button>
          <button
            onClick={() => onScientificFn('cos')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Cosseno"
          >
            cos
          </button>
          <button
            onClick={() => onScientificFn('tan')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Tangente"
          >
            tan
          </button>
          <button
            onClick={() => onParenthesis('(')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Abre Parênteses"
          >
            (
          </button>
          <button
            onClick={() => onParenthesis(')')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Fecha Parênteses"
          >
            )
          </button>

          <button
            onClick={() => onScientificFn('ln')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Logaritmo Natural"
          >
            ln
          </button>
          <button
            onClick={() => onScientificFn('log')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Logaritmo Base 10"
          >
            log
          </button>
          <button
            onClick={onSquare}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Elevar ao Quadrado (x²)"
          >
            x²
          </button>
          <button
            onClick={onPower}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Potência (xʸ)"
          >
            xʸ
          </button>
          <button
            onClick={onInverse}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Inverso (1/x)"
          >
            ¹/x
          </button>

          <button
            onClick={() => onConstant('π')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Número Pi (π)"
          >
            π
          </button>
          <button
            onClick={() => onConstant('e')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Número de Euler (e)"
          >
            e
          </button>
          <button
            onClick={onSquareRoot}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Raiz Quadrada (√)"
          >
            √
          </button>
          <button
            onClick={() => onScientificFn('!')}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Fatorial (n!)"
          >
            n!
          </button>
          <button
            onClick={onToggleSign}
            className="aero-btn btn-fn py-2 rounded-xl text-xs font-semibold cursor-pointer"
            title="Inverter Sinal (±)"
          >
            ±
          </button>
        </div>
      )}

      {/* Standard Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: C, Backspace, %, ÷ */}
        <button
          onClick={onAllClear}
          className={`aero-btn btn-clear ${mainBtnClass} flex items-center justify-center gap-1 cursor-pointer`}
          title="Limpar Tudo (AC / Esc)"
        >
          <RotateCcw size={18} className="stroke-[2.5]" />
          <span>AC</span>
        </button>

        <button
          onClick={onBackspace}
          className={`aero-btn btn-clear ${mainBtnClass} flex items-center justify-center cursor-pointer`}
          title="Apagar último dígito (Backspace)"
        >
          <Delete size={20} className="stroke-[2.5]" />
        </button>

        <button
          onClick={onPercentage}
          className={`aero-btn btn-op ${mainBtnClass} cursor-pointer`}
          title="Porcentagem (%)"
        >
          %
        </button>

        <button
          onClick={() => onOperator('÷')}
          className={`aero-btn btn-op ${mainBtnClass} font-bold cursor-pointer`}
          title="Divisão (÷)"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, × */}
        <button
          onClick={() => onNumber('7')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          7
        </button>
        <button
          onClick={() => onNumber('8')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          8
        </button>
        <button
          onClick={() => onNumber('9')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          9
        </button>
        <button
          onClick={() => onOperator('×')}
          className={`aero-btn btn-op ${mainBtnClass} font-bold cursor-pointer`}
          title="Multiplicação (×)"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, − */}
        <button
          onClick={() => onNumber('4')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          4
        </button>
        <button
          onClick={() => onNumber('5')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          5
        </button>
        <button
          onClick={() => onNumber('6')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          6
        </button>
        <button
          onClick={() => onOperator('−')}
          className={`aero-btn btn-op ${mainBtnClass} font-bold cursor-pointer`}
          title="Subtração (−)"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => onNumber('1')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          1
        </button>
        <button
          onClick={() => onNumber('2')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          2
        </button>
        <button
          onClick={() => onNumber('3')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          3
        </button>
        <button
          onClick={() => onOperator('+')}
          className={`aero-btn btn-op ${mainBtnClass} font-bold cursor-pointer`}
          title="Adição (+)"
        >
          +
        </button>

        {/* Row 5: 0, ., ±, = (Result with distinct sound!) */}
        <button
          onClick={() => onNumber('0')}
          className={`aero-btn btn-num ${mainBtnClass} cursor-pointer`}
        >
          0
        </button>

        <button
          onClick={onDecimal}
          className={`aero-btn btn-num ${mainBtnClass} font-bold cursor-pointer`}
          title="Ponto decimal (,)"
        >
          ,
        </button>

        {calcMode === 'standard' ? (
          <button
            onClick={onToggleSign}
            className={`aero-btn btn-fn ${mainBtnClass} font-bold cursor-pointer`}
            title="Inverter Sinal (±)"
          >
            ±
          </button>
        ) : (
          <button
            onClick={onClear}
            className={`aero-btn btn-clear ${mainBtnClass} font-bold cursor-pointer`}
            title="Limpar Entrada Atual (C)"
          >
            C
          </button>
        )}

        {/* EQUALS / RESULT BUTTON with magical chime */}
        <button
          onClick={onEquals}
          className={`aero-btn btn-equals ${mainBtnClass} font-black cursor-pointer shadow-[0_4px_16px_rgba(40,200,40,0.5)]`}
          title="Calcular Resultado (= / Enter) - Toca o acorde de sino cristalino!"
        >
          =
        </button>
      </div>
    </div>
  );
};
