import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Disc,
  X,
  Repeat,
  Gauge,
  Upload,
  ExternalLink,
} from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
  }
}

interface AeroMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AeroMusicPlayer: React.FC<AeroMusicPlayerProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3); // "um pouco mais baixa" (30%)
  const [speed, setSpeed] = useState<number>(0.85); // "um pouco mais lenta" (0.85x)
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isYtReady, setIsYtReady] = useState<boolean>(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const videoId = 'DP3rDP02lE0'; // Scizzie - Aquatic Ambience [Slowed Version]

  // Initialize YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player('yt-hidden-player', {
          height: '10',
          width: '10',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: { target: { setVolume: (v: number) => void; setPlaybackRate: (r: number) => void } }) => {
              if (!isMounted) return;
              event.target.setVolume(Math.round(volume * 100));
              event.target.setPlaybackRate(speed);
              setIsYtReady(true);
            },
            onStateChange: (event: { data: number }) => {
              if (!isMounted) return;
              // 1 = playing, 2 = paused
              if (event.data === 1) setIsPlaying(true);
              if (event.data === 2) setIsPlaying(false);
            },
          },
        });
      } catch {
        // ignore
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      isMounted = false;
      try {
        if (ytPlayerRef.current?.destroy) {
          ytPlayerRef.current.destroy();
          ytPlayerRef.current = null;
        }
      } catch {
        // ignore
      }
    };
  }, []);

  // Sync volume with YouTube player or custom audio
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : Math.round(volume * 100);
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.setVolume(effectiveVol);
      } catch {
        // ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, isYtReady]);

  // Sync speed / playbackRate
  useEffect(() => {
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.setPlaybackRate(speed);
      } catch {
        // ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed, isYtReady]);

  const handleTogglePlay = useCallback(() => {
    if (customAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    if (ytPlayerRef.current && isYtReady) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {
        // Fallback for mobile autoplay restriction
        setIsPlaying((prev) => !prev);
      }
    }
  }, [isPlaying, isYtReady, customAudioUrl]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pause YouTube
      if (ytPlayerRef.current && isYtReady) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          // ignore
        }
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.playbackRate = speed;
          audioRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  const handleResetToAquaticAmbience = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCustomAudioUrl(null);
    setCustomTitle(null);
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch {
        // ignore
      }
    }
  };

  const activeTitle = customTitle || 'Scizzie - Aquatic Ambience (Slowed & Reverb)';

  const handleCycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speed === 0.85) setSpeed(0.75);
    else if (speed === 0.75) setSpeed(1.0);
    else setSpeed(0.85);
  };

  return (
    <>
      {/* Hidden YouTube Player IFrame Container */}
      <div className="fixed -top-96 -left-96 pointer-events-none opacity-0">
        <div id="yt-hidden-player" />
      </div>

      {/* Hidden HTML5 Audio Element for uploaded files */}
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Mini Music Pill (always available on screen/mobile) */}
      <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 win7-aero-frame rounded-full py-1 px-3 shadow-lg max-w-[340px] w-[90%] sm:w-auto transition-all pointer-events-auto">
        <button
          onClick={handleTogglePlay}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0 ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse'
              : 'bg-gradient-to-r from-sky-500 to-blue-600'
          }`}
          title={isPlaying ? 'Pausar Música' : 'Tocar Música'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onClose()}>
          <div className="flex items-center gap-1.5">
            <Disc
              size={13}
              className={`text-sky-700 shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            />
            <span className="text-[11px] font-bold text-sky-950 truncate block">
              {activeTitle}
            </span>
          </div>
          <span className="text-[9px] text-slate-600 block -mt-0.5 truncate">
            {Math.round(volume * 100)}% vol {isPlaying ? '· Tocando' : '· Pausado'}
          </span>
        </div>

        {/* Quick One-Tap Speed Switcher (Chave de Ouro!) */}
        <button
          onClick={handleCycleSpeed}
          className="px-2 py-0.5 rounded-full bg-sky-200/80 hover:bg-sky-300 text-sky-900 font-bold text-[10px] border border-sky-400/50 cursor-pointer shrink-0 shadow-sm"
          title="Clique para alternar velocidade (0.85x lenta / 0.75x super lenta / 1.0x)"
        >
          {speed}x
        </button>

        <label
          className="p-1 rounded-full hover:bg-white/60 text-sky-800 transition-colors cursor-pointer shrink-0"
          title="Adicionar música dos arquivos"
        >
          <Upload size={13} />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Expanded Modal Music Player Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-md win7-aero-frame rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 relative aero-sheen flex flex-col max-h-[92vh]">
            {/* Title Bar */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-sky-400/30 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
                  <Music size={14} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 win7-title-glow leading-tight">
                    Música Tema Principal
                  </h3>
                  <span className="text-[10px] text-slate-600">
                    Aquatic Ambience · Slowed & Reverb
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="win7-btn-close w-8 h-5 rounded flex items-center justify-center cursor-pointer"
              >
                <X size={12} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Visualizer & Album Display */}
            <div className="aero-screen rounded-xl p-4 mb-3 flex flex-col items-center justify-center relative overflow-hidden min-h-[140px] border border-cyan-500/30">
              {/* Spinning Vinyl Disc */}
              <div
                className={`w-20 h-20 rounded-full border-4 border-cyan-400/50 flex items-center justify-center shadow-lg relative bg-gradient-to-tr from-slate-900 via-sky-950 to-cyan-900 ${
                  isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-sky-200 border-2 border-white flex items-center justify-center shadow-inner">
                  <Music size={14} className="text-sky-900" />
                </div>
              </div>

              {/* Animated Audio Equalizer Bars */}
              <div className="flex items-end gap-1 h-5 mt-2.5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-t bg-gradient-to-t from-cyan-400 to-emerald-300 transition-all ${
                      isPlaying ? 'animate-pulse' : 'h-1'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(4, ((i * 9) % 20) + 4)}px` : '4px',
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                ))}
              </div>

              {/* Track Title */}
              <div className="text-center mt-2 z-10">
                <h4 className="font-bold text-xs sm:text-sm text-cyan-100 font-lcd truncate max-w-xs">
                  {activeTitle}
                </h4>
                <p className="text-[10px] text-cyan-300/80 font-lcd flex items-center justify-center gap-1 mt-0.5">
                  <span>Tema Solicitado: Scizzie (Aquatic Ambience)</span>
                  <a
                    href="https://www.youtube.com/watch?v=DP3rDP02lE0"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-white inline-flex items-center gap-0.5 ml-1"
                    title="Abrir no YouTube"
                  >
                    <ExternalLink size={10} />
                  </a>
                </p>
              </div>
            </div>

            {/* Speed & Volume Controls (Customized for "mais baixa e lenta") */}
            <div className="space-y-3 bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm mb-3">
              {/* Playback Rate / Speed Slider ("um pouco mais lenta") */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <Gauge size={14} className="text-sky-600" />
                    Velocidade (Mais Lenta)
                  </span>
                  <span className="font-lcd text-sky-800 font-bold">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-sky-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0.75x (Super lenta)</span>
                  <span className="font-bold text-sky-700">0.85x (Recomendado)</span>
                  <span>1.0x (Normal)</span>
                </div>
              </div>

              {/* Volume Slider ("um pouco mais baixa") */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <Volume2 size={14} className="text-sky-600" />
                    Volume da Música (Mais Baixa)
                  </span>
                  <span className="font-lcd text-sky-800 font-bold">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  disabled={isMuted}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-sky-200 rounded-lg disabled:opacity-50"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Silenciosa</span>
                  <span className="font-bold text-sky-700">30% (Suave)</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Play / Pause / Mute Controls */}
            <div className="flex items-center justify-center gap-4 mb-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isMuted ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-white/80 border-sky-200 text-sky-900'
                }`}
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-105"
                title={isPlaying ? 'Pausar' : 'Tocar'}
              >
                {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
              </button>

              <button
                onClick={handleResetToAquaticAmbience}
                className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-sky-900 border border-sky-200 transition-all cursor-pointer"
                title="Voltar para Aquatic Ambience"
              >
                <Repeat size={18} />
              </button>
            </div>

            {/* Upload Custom Audio from Phone / PC */}
            <div className="mt-auto">
              <label className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.98]">
                <Upload size={14} />
                <span>Carregar Música Própria dos Arquivos</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {customTitle && (
                <button
                  onClick={handleResetToAquaticAmbience}
                  className="w-full text-center text-[10px] text-sky-700 font-semibold hover:underline mt-1 cursor-pointer"
                >
                  Restaurar para Scizzie - Aquatic Ambience
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
