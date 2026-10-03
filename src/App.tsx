import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FloatingBubbles } from './components/FloatingBubbles';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AeroWindow } from './components/AeroWindow';
import { AeroDisplay } from './components/AeroDisplay';
import { AeroKeypad } from './components/AeroKeypad';
import { AeroHistory } from './components/AeroHistory';
import { AeroSettingsModal } from './components/AeroSettingsModal';
import { AeroConverter } from './components/AeroConverter';
import { AeroMusicPlayer } from './components/AeroMusicPlayer';
import {
  CalcMode,
  AngleMode,
  HistoryItem,
  SoundTheme,
  ThemeColor,
  BackgroundThemeId,
} from './types/calculator';
import { soundEngine } from './utils/audio';
import {
  evaluateExpression,
  formatNumberForDisplay,
  factorial,
} from './utils/calculatorEngine';
import { Smartphone } from 'lucide-react';

export default function App() {
  // Calculator States
  const [expression, setExpression] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [memoryValue, setMemoryValue] = useState<number | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [calcMode, setCalcMode] = useState<CalcMode>('standard');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');

  // Android & Fullscreen States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAndroidMode, setIsAndroidMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aerocalc_android_mode');
      if (saved !== null) return saved === 'true';
      return window.innerWidth < 768; // Auto-enable on mobile viewports
    } catch {
      return false;
    }
  });
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [shakeToast, setShakeToast] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aerocalc_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Modals & Gadgets
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState<boolean>(false);

  // Settings & Theme
  const [volume, setVolume] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [soundTheme, setSoundTheme] = useState<SoundTheme>('calm'); // Calm sounds by default!
  const [colorTheme, setColorTheme] = useState<ThemeColor>('win7_blue');
  const [bubblesEnabled, setBubblesEnabled] = useState<boolean>(true);

  // Background Theme: Default to the Photorealistic Aquarium!
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundThemeId>(() => {
    try {
      const saved = localStorage.getItem('aerocalc_bg_theme');
      if (saved) return saved as BackgroundThemeId;
    } catch {
      // ignore
    }
    return 'photorealistic_aquarium';
  });

  const [customGifUrl, setCustomGifUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('aerocalc_custom_gif') || '';
    } catch {
      return '';
    }
  });

  // Device motion refs
  const lastShakeRef = useRef<number>(0);
  const lastAccRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aerocalc_history', JSON.stringify(history.slice(0, 50)));
    } catch {
      // ignore
    }
  }, [history]);

  // Persist choices
  useEffect(() => {
    try {
      localStorage.setItem('aerocalc_bg_theme', backgroundTheme);
      localStorage.setItem('aerocalc_android_mode', isAndroidMode.toString());
      if (customGifUrl) {
        localStorage.setItem('aerocalc_custom_gif', customGifUrl);
      }
    } catch {
      // ignore
    }
  }, [backgroundTheme, isAndroidMode, customGifUrl]);

  // Listen to browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    soundEngine.playOperator();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleToggleAndroidMode = useCallback(() => {
    soundEngine.playOperator();
    setIsAndroidMode((prev) => !prev);
  }, []);

  // Sync audio engine settings
  useEffect(() => {
    soundEngine.setVolume(volume);
    soundEngine.setMuted(isMuted);
    soundEngine.setTheme(soundTheme);
  }, [volume, isMuted, soundTheme]);

  // Audio control handlers
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playNumber();
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    soundEngine.setVolume(vol);
  };

  const handleSoundThemeChange = (theme: SoundTheme) => {
    setSoundTheme(theme);
    soundEngine.setTheme(theme);
    soundEngine.playNumber();
  };

  // Calculator Handlers
  const handleNumber = useCallback(
    (num: string) => {
      soundEngine.playNumber(num);
      if (hasEvaluated) {
        setCurrentValue(num);
        setHasEvaluated(false);
      } else {
        if (currentValue === '0' || currentValue === 'Erro' || currentValue === 'Erro de sintaxe') {
          setCurrentValue(num);
        } else {
          setCurrentValue(currentValue + num);
        }
      }
    },
    [currentValue, hasEvaluated]
  );

  const handleDecimal = useCallback(() => {
    soundEngine.playNumber();
    if (hasEvaluated) {
      setCurrentValue('0.');
      setHasEvaluated(false);
      return;
    }
    if (!currentValue.includes('.')) {
      setCurrentValue(currentValue + '.');
    }
  }, [currentValue, hasEvaluated]);

  const handleOperator = useCallback(
    (op: string) => {
      soundEngine.playOperator();
      const formattedOp = ` ${op} `;
      if (hasEvaluated) {
        setExpression(`${currentValue}${formattedOp}`);
        setHasEvaluated(false);
      } else {
        setExpression(`${expression}${currentValue}${formattedOp}`);
      }
      setCurrentValue('0');
    },
    [currentValue, expression, hasEvaluated]
  );

  const handleEquals = useCallback(() => {
    const fullExpr = `${expression}${currentValue}`;
    if (!fullExpr.trim()) return;

    const res = evaluateExpression(fullExpr, angleMode);

    if (res.isError) {
      soundEngine.playError();
      setCurrentValue(res.value);
      setHasEvaluated(true);
    } else {
      // Calming, gentle, relaxing result sound
      soundEngine.playResult();
      setCurrentValue(res.value);
      setExpression('');
      setHasEvaluated(true);

      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        expression: fullExpr,
        result: res.value,
        timestamp: new Date(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
    }
  }, [expression, currentValue, angleMode]);

  const handleClear = useCallback(() => {
    soundEngine.playClear();
    setCurrentValue('0');
  }, []);

  const handleAllClear = useCallback(() => {
    soundEngine.playClear();
    setExpression('');
    setCurrentValue('0');
    setHasEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    soundEngine.playBackspace();
    if (hasEvaluated) {
      setCurrentValue('0');
      setHasEvaluated(false);
      return;
    }
    if (currentValue.length > 1) {
      setCurrentValue(currentValue.slice(0, -1));
    } else {
      setCurrentValue('0');
    }
  }, [currentValue, hasEvaluated]);

  const handleToggleSign = useCallback(() => {
    soundEngine.playNumber();
    if (currentValue === '0' || currentValue.includes('Erro')) return;
    if (currentValue.startsWith('-')) {
      setCurrentValue(currentValue.slice(1));
    } else {
      setCurrentValue('-' + currentValue);
    }
  }, [currentValue]);

  const handlePercentage = useCallback(() => {
    soundEngine.playOperator();
    const num = parseFloat(currentValue);
    if (!isNaN(num)) {
      const val = (num / 100).toString();
      setCurrentValue(val);
    }
  }, [currentValue]);

  const handleSquareRoot = useCallback(() => {
    soundEngine.playOperator();
    const num = parseFloat(currentValue);
    if (num < 0) {
      soundEngine.playError();
      setCurrentValue('Erro: Raiz negativa');
      setHasEvaluated(true);
      return;
    }
    const res = Math.sqrt(num);
    const clean = Math.round((res + Number.EPSILON) * 1e12) / 1e12;
    setCurrentValue(clean.toString());
    setHasEvaluated(true);
  }, [currentValue]);

  const handleSquare = useCallback(() => {
    soundEngine.playOperator();
    const num = parseFloat(currentValue);
    const res = Math.round((Math.pow(num, 2) + Number.EPSILON) * 1e12) / 1e12;
    setCurrentValue(res.toString());
    setHasEvaluated(true);
  }, [currentValue]);

  const handlePower = useCallback(() => {
    soundEngine.playOperator();
    setExpression(`${expression}${currentValue} ^ `);
    setCurrentValue('0');
  }, [expression, currentValue]);

  const handleInverse = useCallback(() => {
    soundEngine.playOperator();
    const num = parseFloat(currentValue);
    if (num === 0) {
      soundEngine.playError();
      setCurrentValue('Erro: Divisão por 0');
      setHasEvaluated(true);
      return;
    }
    const res = Math.round((1 / num + Number.EPSILON) * 1e12) / 1e12;
    setCurrentValue(res.toString());
    setHasEvaluated(true);
  }, [currentValue]);

  const handleScientificFn = useCallback(
    (fn: string) => {
      soundEngine.playOperator();
      const num = parseFloat(currentValue);

      if (fn === '!') {
        if (num < 0 || !Number.isInteger(num)) {
          soundEngine.playError();
          setCurrentValue('Erro');
          setHasEvaluated(true);
          return;
        }
        const f = factorial(num);
        setCurrentValue(f.toString());
        setHasEvaluated(true);
        return;
      }

      if (fn === 'sin' || fn === 'cos' || fn === 'tan') {
        const rad = angleMode === 'deg' ? (num * Math.PI) / 180 : num;
        let res = 0;
        if (fn === 'sin') res = Math.sin(rad);
        if (fn === 'cos') res = Math.cos(rad);
        if (fn === 'tan') res = Math.tan(rad);
        const clean = Math.round((res + Number.EPSILON) * 1e12) / 1e12;
        setCurrentValue(clean.toString());
        setHasEvaluated(true);
        return;
      }

      if (fn === 'ln') {
        if (num <= 0) {
          soundEngine.playError();
          setCurrentValue('Erro');
          setHasEvaluated(true);
          return;
        }
        const res = Math.round((Math.log(num) + Number.EPSILON) * 1e12) / 1e12;
        setCurrentValue(res.toString());
        setHasEvaluated(true);
        return;
      }

      if (fn === 'log') {
        if (num <= 0) {
          soundEngine.playError();
          setCurrentValue('Erro');
          setHasEvaluated(true);
          return;
        }
        const res = Math.round((Math.log10(num) + Number.EPSILON) * 1e12) / 1e12;
        setCurrentValue(res.toString());
        setHasEvaluated(true);
        return;
      }
    },
    [currentValue, angleMode]
  );

  const handleConstant = useCallback((c: string) => {
    soundEngine.playNumber();
    if (c === 'π') setCurrentValue(`${Math.PI}`);
    if (c === 'e') setCurrentValue(`${Math.E}`);
  }, []);

  const handleParenthesis = useCallback(
    (p: string) => {
      soundEngine.playOperator();
      if (p === '(') {
        setExpression(`${expression}( `);
      } else {
        setExpression(`${expression}${currentValue} ) `);
        setCurrentValue('0');
      }
    },
    [expression, currentValue]
  );

  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-') => {
      soundEngine.playMemory();
      const currentNum = parseFloat(currentValue) || 0;
      switch (action) {
        case 'MC':
          setMemoryValue(null);
          break;
        case 'MR':
          if (memoryValue !== null) {
            setCurrentValue(memoryValue.toString());
            setHasEvaluated(true);
          }
          break;
        case 'M+':
          setMemoryValue((prev) => (prev ?? 0) + currentNum);
          break;
        case 'M-':
          setMemoryValue((prev) => (prev ?? 0) - currentNum);
          break;
      }
    },
    [currentValue, memoryValue]
  );

  // Device-motion listener for Android/mobile devices (Shake to Clear with haptic feedback)
  useEffect(() => {
    let lastTime = Date.now();
    const SHAKE_DELTA_THRESHOLD = 14;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const now = Date.now();
      if (now - lastTime > 100) {
        lastTime = now;

        const x = acc.x ?? 0;
        const y = acc.y ?? 0;
        const z = acc.z ?? 0;

        const deltaX = Math.abs(x - lastAccRef.current.x);
        const deltaY = Math.abs(y - lastAccRef.current.y);
        const deltaZ = Math.abs(z - lastAccRef.current.z);

        lastAccRef.current = { x, y, z };

        if (deltaX + deltaY + deltaZ > SHAKE_DELTA_THRESHOLD) {
          if (now - lastShakeRef.current > 1200) {
            lastShakeRef.current = now;

            // Trigger handleAllClear function
            handleAllClear();

            // Trigger haptic feedback effect
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate?.([50, 50, 60, 60]);
              } catch {
                // ignore
              }
            }

            // Show toast notification
            setShakeToast(true);
            setTimeout(() => setShakeToast(false), 2200);
          }
        }
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [handleAllClear]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumber(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleAllClear,
    handlePercentage,
  ]);

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full relative flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
      {/* Dynamic Animated & Live Wallpaper Background */}
      <AnimatedBackground themeId={backgroundTheme} customGifUrl={customGifUrl} />

      {/* Interactive Floating Aqua Bubbles at z-[10], strictly behind calculator */}
      {bubblesEnabled && <FloatingBubbles />}

      {/* Main Centered Glass Workspace for Android */}
      <main className="relative z-20 w-full flex-1 flex flex-col items-center justify-center pointer-events-none my-auto">
        <div className="w-full flex items-center justify-center">
          {/* Main Calculator Window (pointer-events-auto for all interactions) */}
          <div className="pointer-events-auto flex justify-center w-full max-w-[390px] sm:max-w-[410px]">
            <AeroWindow
              calcMode={calcMode}
              onToggleCalcMode={() =>
                setCalcMode((prev) => (prev === 'standard' ? 'scientific' : 'standard'))
              }
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onToggleConverter={() => setIsConverterOpen((prev) => !prev)}
              onOpenMusicPlayer={() => setIsMusicPlayerOpen(true)}
              isConverterOpen={isConverterOpen}
              historyCount={history.length}
              colorTheme={colorTheme}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              isAndroidMode={isAndroidMode}
              onToggleAndroidMode={handleToggleAndroidMode}
            >
              {/* Slide-Down Unit Converter Drawer (deslizando pra baixo!) */}
              <AeroConverter
                isOpen={isConverterOpen}
                onClose={() => setIsConverterOpen(false)}
                onInsertToCalc={(val) => {
                  setCurrentValue(val);
                  setHasEvaluated(true);
                }}
              />

              {/* Display screen */}
              <AeroDisplay
                expression={expression}
                currentValue={formatNumberForDisplay(currentValue)}
                hasMemory={memoryValue !== null}
                angleMode={angleMode}
                isMuted={isMuted}
                onToggleSound={handleToggleSound}
                onToggleAngleMode={() =>
                  setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
                }
              />

              {/* Keypad */}
              <AeroKeypad
                calcMode={calcMode}
                isFullscreen={isFullscreen || isAndroidMode}
                onNumber={handleNumber}
                onDecimal={handleDecimal}
                onOperator={handleOperator}
                onEquals={handleEquals}
                onClear={handleClear}
                onAllClear={handleAllClear}
                onBackspace={handleBackspace}
                onToggleSign={handleToggleSign}
                onPercentage={handlePercentage}
                onSquareRoot={handleSquareRoot}
                onSquare={handleSquare}
                onPower={handlePower}
                onInverse={handleInverse}
                onScientificFn={handleScientificFn}
                onConstant={handleConstant}
                onParenthesis={handleParenthesis}
                onMemoryAction={handleMemoryAction}
                hasMemory={memoryValue !== null}
              />

              {/* Internal History Drawer */}
              <AeroHistory
                history={history}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                onClearHistory={() => setHistory([])}
                onSelectResult={(res) => {
                  setCurrentValue(res);
                  setHasEvaluated(true);
                  setIsHistoryOpen(false);
                }}
              />
            </AeroWindow>
          </div>
        </div>
      </main>

      {/* Shake Detection Glass Toast Notification */}
      {shakeToast && (
        <div className="fixed top-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <div className="win7-aero-frame rounded-2xl py-2 px-4 shadow-xl flex items-center gap-2 text-xs font-bold text-sky-950 border border-white">
            <Smartphone size={16} className="text-sky-600 animate-wiggle" />
            <span>Celular agitado: Calculadora limpa! (AC) 📳</span>
          </div>
        </div>
      )}

      {/* Floating & Modal Music Player */}
      <AeroMusicPlayer
        isOpen={isMusicPlayerOpen}
        onClose={() => setIsMusicPlayerOpen(false)}
      />

      {/* Settings, Themes & Audio Modal */}
      <AeroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleSound}
        soundTheme={soundTheme}
        onSoundThemeChange={handleSoundThemeChange}
        colorTheme={colorTheme}
        onColorThemeChange={setColorTheme}
        bubblesEnabled={bubblesEnabled}
        onToggleBubbles={() => setBubblesEnabled((prev) => !prev)}
        backgroundTheme={backgroundTheme}
        onSelectBackground={setBackgroundTheme}
        customGifUrl={customGifUrl}
        onSetCustomGifUrl={setCustomGifUrl}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        hapticsEnabled={hapticsEnabled}
        onToggleHaptics={() => setHapticsEnabled((prev) => !prev)}
      />
    </div>
  );
}
