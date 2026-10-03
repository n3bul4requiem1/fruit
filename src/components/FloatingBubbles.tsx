import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, RotateCcw, Sparkles, Wind } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Bubble {
  id: string;
  x: number; // percentage 0-100
  size: number; // px 32-72
  duration: number; // seconds 11-20
  delay: number; // seconds
  fast?: boolean;
}

interface PopEffect {
  id: string;
  x: number; // exact clientX
  y: number; // exact clientY
  size: number;
  combo: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const FloatingBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popEffects, setPopEffects] = useState<PopEffect[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('aerocalc_pop_count') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [combo, setCombo] = useState<number>(0);
  const [denseMode, setDenseMode] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<RippleRing[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const poppingSetRef = useRef<Set<string>>(new Set());
  const comboTimerRef = useRef<number | null>(null);

  // Distribute bubbles nicely on background sides (so calculator in center remains clean)
  const getAmbientX = () => {
    if (Math.random() < 0.7) {
      return Math.random() < 0.5 ? 2 + Math.random() * 26 : 72 + Math.random() * 25;
    }
    return 6 + Math.random() * 88;
  };

  // Initialize bubbles
  useEffect(() => {
    const count = denseMode ? 24 : 14;
    const initial: Bubble[] = Array.from({ length: count }, (_, i) => ({
      id: `b-${Date.now()}-${i}-${Math.random()}`,
      x: getAmbientX(),
      size: 32 + Math.random() * 42,
      duration: denseMode ? 8 + Math.random() * 6 : 12 + Math.random() * 8,
      delay: Math.random() * 6,
      fast: denseMode,
    }));
    setBubbles(initial);
  }, [denseMode]);

  // Save popped count
  useEffect(() => {
    try {
      localStorage.setItem('aerocalc_pop_count', poppedCount.toString());
    } catch {
      // ignore
    }
  }, [poppedCount]);

  // High-DPI Canvas render loop for water droplet physics & caustic shockwaves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw expanding water ripple shockwaves
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.6;
        r.alpha -= 0.038;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        // Outer aqua shockwave
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, r.alpha)})`;
        ctx.lineWidth = Math.max(1, 3.2 * r.alpha);
        ctx.stroke();

        // Inner caustic glint ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, r.alpha * 0.75)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw flying water droplets with gravity, air resistance & specular glints
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.vx *= 0.975; // air friction
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        // Droplet body with radial water glow
        const grad = ctx.createRadialGradient(
          p.x - p.radius * 0.3,
          p.y - p.radius * 0.3,
          p.radius * 0.1,
          p.x,
          p.y,
          p.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, p.alpha * 1.3)})`);
        grad.addColorStop(0.45, `rgba(186, 230, 253, ${p.alpha * 0.9})`);
        grad.addColorStop(1, `rgba(56, 189, 248, ${p.alpha * 0.25})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Tiny specular glint on droplet
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Spawn visual pop effect on canvas with particles and ripples
  const spawnWaterPopPhysics = (cx: number, cy: number, size: number) => {
    // 1. Add expanding caustic ripple rings
    ripplesRef.current.push(
      {
        x: cx,
        y: cy,
        radius: size * 0.35,
        maxRadius: size * 1.7,
        alpha: 0.95,
      },
      {
        x: cx,
        y: cy,
        radius: size * 0.2,
        maxRadius: size * 2.3,
        alpha: 0.75,
      }
    );

    // 2. Add realistic water droplet particles
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * Math.PI * 2) / particleCount + (Math.random() - 0.5) * 0.35;
      const speed = 2.8 + Math.random() * 5.2;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // slight upward burst bias
        radius: 2.2 + Math.random() * 3.8,
        alpha: 0.98,
        decay: 0.018 + Math.random() * 0.012,
      });
    }
  };

  // Pop handler: accurately anchored to exact screen coordinates!
  const handlePop = useCallback(
    (bubble: Bubble, cx: number, cy: number) => {
      if (poppingSetRef.current.has(bubble.id)) return;
      poppingSetRef.current.add(bubble.id);

      // Handle combo streak
      let currentCombo = 1;
      setCombo((prev) => {
        currentCombo = prev + 1;
        return currentCombo;
      });

      if (comboTimerRef.current) {
        window.clearTimeout(comboTimerRef.current);
      }
      comboTimerRef.current = window.setTimeout(() => {
        setCombo(0);
      }, 1300);

      // Play bubble pop with combo pitch escalation
      soundEngine.playBubblePop(currentCombo);

      // Increment count
      setPoppedCount((prev) => prev + 1);

      // 1. Immediately remove bubble from list so it NEVER snaps/jumps to top:0!
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

      // 2. Spawn exact position pop effect overlay
      const effectId = `pop-${Date.now()}-${Math.random()}`;
      setPopEffects((prev) => [
        ...prev.slice(-15),
        {
          id: effectId,
          x: cx,
          y: cy,
          size: bubble.size,
          combo: currentCombo,
        },
      ]);

      // Remove pop effect after animation completes
      setTimeout(() => {
        setPopEffects((prev) => prev.filter((p) => p.id !== effectId));
        poppingSetRef.current.delete(bubble.id);
      }, 700);

      // 3. Trigger Canvas Water Physics at exact (cx, cy)
      spawnWaterPopPhysics(cx, cy, bubble.size);

      // 4. Respawn replacement bubble from bottom after delay
      setTimeout(() => {
        setBubbles((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}-${Math.random()}`,
            x: getAmbientX(),
            size: 32 + Math.random() * 42,
            duration: denseMode ? 8 + Math.random() * 6 : 12 + Math.random() * 8,
            delay: 0,
            fast: denseMode,
          },
        ]);
      }, 2000);
    },
    [denseMode]
  );

  const onBubblePointerDown = (bubble: Bubble, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Get exact bounding rect of the bubble in screen coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    handlePop(bubble, cx, cy);
  };

  // Spawn swarm of extra bubbles
  const handleSpawnSwarm = () => {
    soundEngine.playNumber();
    const newBubbles: Bubble[] = Array.from({ length: 6 }, (_, i) => ({
      id: `swarm-${Date.now()}-${i}-${Math.random()}`,
      x: getAmbientX(),
      size: 30 + Math.random() * 38,
      duration: 8 + Math.random() * 5,
      delay: i * 0.12,
      fast: true,
    }));
    setBubbles((prev) => [...prev.slice(-18), ...newBubbles]);
  };

  // Background click to spawn a new bubble right where the user taps!
  const onBackgroundPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only if clicking on the background layer directly
    if (e.target !== e.currentTarget) return;

    const xPercent = (e.clientX / window.innerWidth) * 100;
    const newBubble: Bubble = {
      id: `spawn-${Date.now()}-${Math.random()}`,
      x: Math.max(3, Math.min(94, xPercent)),
      size: 36 + Math.random() * 32,
      duration: 10 + Math.random() * 6,
      delay: 0,
    };

    soundEngine.playNumber();
    setBubbles((prev) => [...prev, newBubble]);

    // Small water ripple at tap location
    spawnWaterPopPhysics(e.clientX, e.clientY, 28);
  };

  return (
    <>
      {/* Canvas for High-Performance Water Particle & Droplet Physics */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[12] w-full h-full"
      />

      {/* Background Interactive Tap Layer + Floating Bubbles (z-[10]) */}
      <div
        onPointerDown={onBackgroundPointerDown}
        className="fixed inset-0 pointer-events-auto overflow-hidden z-[10]"
        title="Dica: Clique no fundo para criar bolhas ou toque nelas para estourar!"
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onPointerDown={(e) => onBubblePointerDown(bubble, e)}
            className="floating-bubble"
            style={{
              left: `${bubble.x}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: `${bubble.fast ? 'floatBubbleFast' : 'floatBubble'} ${bubble.duration}s infinite linear`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Exact-Position Pop Burst Effect Overlays (z-[15]) */}
      {popEffects.map((pop) => (
        <div
          key={pop.id}
          className="fixed pointer-events-none z-[15]"
          style={{
            left: `${pop.x}px`,
            top: `${pop.y}px`,
          }}
        >
          {/* Outer expanding aqua shockwave ring */}
          <div
            className="absolute rounded-full border-2 border-cyan-200/90 shadow-[0_0_20px_rgba(56,189,248,0.8)]"
            style={{
              width: `${pop.size * 1.5}px`,
              height: `${pop.size * 1.5}px`,
              animation: 'bubblePopRing 0.38s ease-out forwards',
            }}
          />

          {/* Inner crystal glass glare */}
          <div
            className="absolute rounded-full border border-white/95"
            style={{
              width: `${pop.size * 0.9}px`,
              height: `${pop.size * 0.9}px`,
              animation: 'bubblePopRing 0.28s cubic-bezier(0.1, 0.9, 0.2, 1) forwards',
            }}
          />

          {/* Sparkle Glint Star ✨ */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-cyan-200 select-none text-base filter drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
            style={{
              animation: 'bubbleSparkle 0.45s ease-out forwards',
            }}
          >
            ✨
          </div>

          {/* Floating Score / Combo Badge */}
          <div
            className="absolute -translate-x-1/2 pointer-events-none select-none font-bold text-xs whitespace-nowrap text-white win7-title-glow flex items-center gap-1 drop-shadow-md"
            style={{
              animation: 'bubblePopScore 0.65s ease-out forwards',
            }}
          >
            {pop.combo > 1 ? (
              <span className="bg-gradient-to-r from-cyan-400 to-sky-300 text-sky-950 px-2 py-0.5 rounded-full shadow-md text-[11px] font-extrabold flex items-center gap-0.5 border border-white/80">
                <Sparkles size={11} className="text-amber-400 fill-amber-400" />
                x{pop.combo}!
              </span>
            ) : (
              <span className="text-cyan-200 font-bold text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                +1 🫧
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Bubble Pop Counter & Gadget Widget (Bottom Right) */}
      <div className="fixed bottom-3 right-3 sm:right-6 z-30 select-none pointer-events-auto">
        <div className="win7-aero-frame rounded-full py-1 px-3 flex items-center gap-2 shadow-lg text-xs font-bold text-sky-950 border border-white/80">
          {/* Total Popped Count */}
          <div
            className="flex items-center gap-1.5 cursor-default"
            title="Total de bolhas d'água estouradas"
          >
            <span className={`text-base transition-transform ${combo > 0 ? 'scale-125' : ''}`}>
              🫧
            </span>
            <span className="tabular-nums font-extrabold text-sky-900">{poppedCount}</span>
            <span className="hidden sm:inline font-medium text-slate-600">estouradas</span>
          </div>

          {/* Combo Indicator Badge */}
          {combo > 1 && (
            <div className="animate-bounce bg-sky-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm flex items-center gap-0.5">
              <Sparkles size={10} className="fill-amber-300 text-amber-300" />
              <span>x{combo}</span>
            </div>
          )}

          <div className="w-px h-3.5 bg-sky-400/40" />

          {/* Quick Spawn More Bubbles Button */}
          <button
            onClick={handleSpawnSwarm}
            className="p-1 rounded-full hover:bg-white/80 text-sky-700 transition-transform active:scale-90 cursor-pointer flex items-center gap-1"
            title="Soltar uma rajada de bolhas (+6)!"
          >
            <Plus size={13} className="stroke-[3]" />
            <span className="text-[10px] hidden sm:inline">Mais</span>
          </button>

          {/* Dense mode / Bubble Stream toggle */}
          <button
            onClick={() => {
              soundEngine.playNumber();
              setDenseMode((prev) => !prev);
            }}
            className={`p-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
              denseMode
                ? 'bg-sky-500 text-white shadow-sm ring-1 ring-white'
                : 'hover:bg-white/80 text-sky-700'
            }`}
            title={denseMode ? 'Chuva de bolhas ATIVA (toque para acalmar)' : 'Ativar modo Chuva de Bolhas'}
          >
            <Wind size={12} className={denseMode ? 'animate-spin' : ''} />
            <span className="text-[10px] hidden sm:inline">
              {denseMode ? 'Chuva' : 'Calmo'}
            </span>
          </button>

          {/* Reset Counter Button */}
          {poppedCount > 0 && (
            <button
              onClick={() => {
                soundEngine.playClear();
                setPoppedCount(0);
                setCombo(0);
              }}
              className="p-1 rounded-full hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Zerar contador de bolhas"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
