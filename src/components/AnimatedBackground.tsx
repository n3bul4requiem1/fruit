import React, { useEffect, useRef } from 'react';
import { BackgroundThemeId } from '../types/calculator';
import win7Bg from '../assets/images/win7_aurora_bg_1790995806341.jpg';
import frutigerBg from '../assets/images/frutiger_aero_bg_1790995576704.jpg';
import aquariumHdBg from '../assets/images/aero_aquarium_hd_1790996061413.jpg';

interface AnimatedBackgroundProps {
  themeId: BackgroundThemeId;
  customGifUrl?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  themeId,
  customGifUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // If theme is animated aquarium, rain, or aurora
  useEffect(() => {
    if (
      themeId !== 'animated_aquarium' &&
      themeId !== 'animated_rain' &&
      themeId !== 'animated_aurora' &&
      themeId !== 'photorealistic_aquarium'
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Realistic swimming fish overlays for photorealistic aquarium
    const marineLife = [
      { x: 100, y: height * 0.35, speed: 1.2, size: 55, dir: 1 },
      { x: width * 0.75, y: height * 0.52, speed: -0.9, size: 68, dir: -1 },
      { x: width * 0.25, y: height * 0.72, speed: 1.5, size: 48, dir: 1 },
      { x: width * 0.88, y: height * 0.28, speed: -1.3, size: 60, dir: -1 },
    ];

    // Rain setup
    const raindrops = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 15 + Math.random() * 25,
      speed: 12 + Math.random() * 15,
      radius: 2 + Math.random() * 4,
    }));

    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      if (themeId === 'photorealistic_aquarium') {
        // Subtle caustic light rays moving over the HD aquarium image
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const startX = ((i * width) / 4 + Math.sin(t * 0.5 + i) * 80) % width;
          ctx.moveTo(startX, 0);
          ctx.lineTo(startX + 140, height);
          ctx.lineTo(startX + 60, height);
          ctx.lineTo(startX - 40, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Subtle realistic floating fish shadows & highlights
        marineLife.forEach((fish) => {
          fish.x += fish.speed;
          if (fish.speed > 0 && fish.x > width + 120) fish.x = -120;
          if (fish.speed < 0 && fish.x < -120) fish.x = width + 120;

          const fishY = fish.y + Math.sin(t * 1.5 + fish.x * 0.01) * 12;
          ctx.save();
          ctx.translate(fish.x, fishY);
          if (fish.speed < 0) ctx.scale(-1, 1);

          // Soft translucent water caustic sheen on fish
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.45, fish.size * 0.22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (themeId === 'animated_aquarium') {
        // Deep turquoise aquatic gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#005f73');
        grad.addColorStop(0.5, '#0a9396');
        grad.addColorStop(1, '#001219');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Water caustics
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 12;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          for (let x = 0; x < width; x += 30) {
            const y = Math.sin(x * 0.005 + t + i) * 35 + (height * (i + 1)) / 5;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (themeId === 'animated_rain') {
        // Rain on glass
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0a2540');
        grad.addColorStop(0.5, '#004369');
        grad.addColorStop(1, '#011627');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        raindrops.forEach((drop) => {
          drop.y += drop.speed;
          if (drop.y > height) {
            drop.y = -drop.len;
            drop.x = Math.random() * width;
          }

          ctx.strokeStyle = 'rgba(180, 230, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 1, drop.y + drop.len);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(drop.x, drop.y + drop.len, drop.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (themeId === 'animated_aurora') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#020b14');
        grad.addColorStop(0.6, '#05233d');
        grad.addColorStop(1, '#02182b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        for (let i = 0; i < 3; i++) {
          const auroraGrad = ctx.createLinearGradient(0, 0, width, 0);
          auroraGrad.addColorStop(0, 'rgba(0, 255, 200, 0)');
          auroraGrad.addColorStop(0.3, i === 1 ? 'rgba(78, 240, 55, 0.28)' : 'rgba(0, 210, 255, 0.25)');
          auroraGrad.addColorStop(0.7, 'rgba(0, 255, 170, 0.35)');
          auroraGrad.addColorStop(1, 'rgba(0, 150, 255, 0)');

          ctx.fillStyle = auroraGrad;
          ctx.beginPath();
          ctx.moveTo(0, height * 0.45);
          for (let x = 0; x <= width; x += 40) {
            const waveY =
              Math.sin(x * 0.003 + t + i * 1.5) * 60 +
              Math.cos(x * 0.006 - t * 0.5) * 35 +
              height * (0.35 + i * 0.12);
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [themeId]);

  if (themeId === 'photorealistic_aquarium') {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 z-0"
        style={{ backgroundImage: `url(${aquariumHdBg})` }}
      >
        {/* Subtle aquatic ambient light & canvas overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/15 via-transparent to-cyan-950/25 pointer-events-none" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
    );
  }

  if (themeId === 'win7_aurora') {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-500 z-0"
        style={{ backgroundImage: `url(${win7Bg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/30 via-transparent to-cyan-500/20 pointer-events-none" />
      </div>
    );
  }

  if (themeId === 'frutiger_aero') {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-500 z-0"
        style={{ backgroundImage: `url(${frutigerBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 via-transparent to-cyan-950/30 pointer-events-none" />
      </div>
    );
  }

  if (themeId === 'custom_gif' && customGifUrl) {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-500 z-0"
        style={{ backgroundImage: `url(${customGifUrl})` }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] pointer-events-none" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
    />
  );
};
