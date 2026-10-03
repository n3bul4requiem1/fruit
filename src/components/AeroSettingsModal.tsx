import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  X,
  Keyboard,
  Play,
  Image as ImageIcon,
  Smartphone,
  Maximize2,
  Minimize2,
  Upload,
  Link as LinkIcon,
  Check,
  Store,
  Download,
} from 'lucide-react';
import { BackgroundThemeId, SoundTheme, ThemeColor } from '../types/calculator';
import { soundEngine } from '../utils/audio';

interface AeroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  soundTheme: SoundTheme;
  onSoundThemeChange: (theme: SoundTheme) => void;
  colorTheme: ThemeColor;
  onColorThemeChange: (color: ThemeColor) => void;
  bubblesEnabled: boolean;
  onToggleBubbles: () => void;
  backgroundTheme: BackgroundThemeId;
  onSelectBackground: (theme: BackgroundThemeId) => void;
  customGifUrl: string;
  onSetCustomGifUrl: (url: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onOpenGooglePlay?: () => void;
}

export const AeroSettingsModal: React.FC<AeroSettingsModalProps> = ({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  soundTheme,
  onSoundThemeChange,
  colorTheme,
  onColorThemeChange,
  bubblesEnabled,
  onToggleBubbles,
  backgroundTheme,
  onSelectBackground,
  customGifUrl,
  onSetCustomGifUrl,
  isFullscreen,
  onToggleFullscreen,
  hapticsEnabled,
  onToggleHaptics,
  onOpenGooglePlay,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'audio' | 'android'>('themes');
  const [inputGifUrl, setInputGifUrl] = useState(customGifUrl);
  const [isUrlApplied, setIsUrlApplied] = useState(false);

  if (!isOpen) return null;

  const testNumber = () => soundEngine.playNumber();
  const testOperator = () => soundEngine.playOperator();
  const testResult = () => soundEngine.playResult();
  const testClear = () => soundEngine.playClear();

  const handleApplyGifUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputGifUrl.trim()) {
      onSetCustomGifUrl(inputGifUrl.trim());
      onSelectBackground('custom_gif');
      setIsUrlApplied(true);
      setTimeout(() => setIsUrlApplied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSetCustomGifUrl(result);
          onSelectBackground('custom_gif');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg win7-aero-frame rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 relative aero-sheen max-h-[92vh] flex flex-col">
        {/* Windows 7 Dialog Title Bar */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-sky-400/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-cyan-300 flex items-center justify-center text-white shadow-sm">
              <Sliders size={12} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 win7-title-glow">
              Personalização & Configurações Windows 7 Aero
            </h3>
          </div>
          <button
            onClick={onClose}
            className="win7-btn-close w-8 h-5 rounded flex items-center justify-center cursor-pointer"
          >
            <X size={12} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sky-300/40 mb-3 text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('themes')}
            className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'themes'
                ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300'
                : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
            }`}
          >
            <ImageIcon size={14} className="text-sky-600" />
            <span>Temas & GIFs</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300'
                : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
            }`}
          >
            <Volume2 size={14} className="text-sky-600" />
            <span>Sons & Efeitos</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300'
                : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
            }`}
          >
            <Smartphone size={14} className="text-sky-600" />
            <span>Tela Cheia / Android</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin text-xs">
          {/* TAB 1: THEMES & GIFS */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              {/* Wallpaper & GIF Gallery */}
              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm">
                <span className="font-bold text-sky-950 block mb-2 text-xs sm:text-sm">
                  Papéis de Parede & Temas em GIF Animado
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'photorealistic_aquarium',
                      name: 'Aquário Tropical HD',
                      desc: 'Recife realista, peixes e raios de sol',
                      badge: 'HD Realista',
                    },
                    {
                      id: 'win7_aurora',
                      name: 'Windows 7 Original',
                      desc: 'Aurora clássica azul',
                      badge: 'Win 7',
                    },
                    {
                      id: 'frutiger_aero',
                      name: 'Frutiger Aero',
                      desc: 'Gotas de água & colina',
                      badge: 'Aqua',
                    },
                    {
                      id: 'animated_aquarium',
                      name: 'Aquário Marinho',
                      desc: 'Cáusticas e correnteza',
                      badge: 'Animado',
                    },
                    {
                      id: 'animated_rain',
                      name: 'Chuva no Vidro',
                      desc: 'Gotas escorrendo em tempo real',
                      badge: 'GIF Animado',
                    },
                    {
                      id: 'animated_aurora',
                      name: 'Aurora Boreal',
                      desc: 'Ondas de luz noturna',
                      badge: 'GIF Animado',
                    },
                    {
                      id: 'custom_gif',
                      name: 'Meu Próprio GIF',
                      desc: 'Link de GIF ou galeria',
                      badge: 'Personalizado',
                    },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onSelectBackground(theme.id as BackgroundThemeId)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 ${
                        backgroundTheme === theme.id
                          ? 'bg-sky-100/90 border-sky-500 shadow-md ring-2 ring-sky-400'
                          : 'bg-white/80 hover:bg-white border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-950 truncate block">
                            {theme.name}
                          </span>
                          {backgroundTheme === theme.id && (
                            <Check size={13} className="text-sky-600 font-bold shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5 line-clamp-2">
                          {theme.desc}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-200/80 text-sky-800 w-fit">
                        {theme.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom GIF Link & File Upload */}
              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm space-y-2">
                <span className="font-bold text-sky-950 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-sky-600" />
                  Carregar Qualquer GIF da Internet ou Celular
                </span>
                <p className="text-[11px] text-slate-600">
                  Cole o link direto de um GIF (Giphy, Tenor, Pinterest) ou envie um arquivo GIF do seu celular/PC:
                </p>

                <form onSubmit={handleApplyGifUrl} className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/meu-gif-favorito.gif"
                    value={inputGifUrl}
                    onChange={(e) => setInputGifUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {isUrlApplied ? 'Aplicado!' : 'Usar GIF'}
                  </button>
                </form>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 py-1.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload size={13} />
                    <span>Escolher GIF do Celular / Arquivo</span>
                    <input
                      type="file"
                      accept="image/gif,image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Windows 7 Aero Glass Colorization */}
              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm space-y-2">
                <span className="font-bold text-sky-950 block">
                  Cor e Aparência da Janela Aero Glass
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'win7_blue', label: 'Céu Win 7', bg: 'bg-sky-400' },
                    { id: 'aurora', label: 'Esmeralda', bg: 'bg-emerald-400' },
                    { id: 'ocean', label: 'Oceano', bg: 'bg-blue-600' },
                    { id: 'sunset', label: 'Pôr do Sol', bg: 'bg-amber-400' },
                    { id: 'graphite', label: 'Grafite', bg: 'bg-slate-500' },
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => onColorThemeChange(th.id as ThemeColor)}
                      className={`p-1.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        colorTheme === th.id
                          ? 'ring-2 ring-sky-500 bg-white shadow-md'
                          : 'hover:bg-white/60'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${th.bg} shadow-inner border border-white`} />
                      <span className="text-[10px] font-semibold text-slate-700">{th.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Bolhas interativas no fundo
                  </span>
                  <button
                    onClick={onToggleBubbles}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      bubblesEnabled ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {bubblesEnabled ? 'Ativadas' : 'Desativadas'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & SOUND EFFECTS */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950 flex items-center gap-2">
                    <Volume2 size={16} className="text-sky-600" />
                    Volume dos Efeitos Sonoros
                  </span>
                  <button
                    onClick={onToggleMute}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isMuted
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-sky-600 text-white shadow-sm hover:bg-sky-700'
                    }`}
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    {isMuted ? 'Mudo' : 'Ativo'}
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                    <span>Intensidade do Som</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-full accent-sky-600 cursor-pointer disabled:opacity-50"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                    Perfil Acústico
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'calm', label: 'Zen Calminho' },
                      { id: 'aqua', label: 'Aqua Gotas' },
                      { id: 'vista', label: 'Vista Vidro' },
                      { id: 'y2k', label: 'Y2K Synth' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => onSoundThemeChange(st.id as SoundTheme)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          soundTheme === st.id
                            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                            : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound Audition */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                    Ouvir Amostras de Som
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={testNumber}
                      className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-sky-50 text-sky-950 border border-sky-200 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>Gotas (0-9)</span>
                      <Play size={11} className="text-sky-600 fill-sky-600" />
                    </button>
                    <button
                      onClick={testOperator}
                      className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-sky-50 text-sky-950 border border-sky-200 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>Vidro (+ - × ÷)</span>
                      <Play size={11} className="text-sky-600 fill-sky-600" />
                    </button>
                    <button
                      onClick={testResult}
                      className="col-span-2 py-2 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold flex items-center justify-between cursor-pointer shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-emerald-600" />
                        Acorde Mágico de Sino no Resultado (=)
                      </span>
                      <Play size={12} className="text-emerald-600 fill-emerald-600" />
                    </button>
                    <button
                      onClick={testClear}
                      className="col-span-2 py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>Splash d'água ao Limpar (AC)</span>
                      <Play size={11} className="text-rose-600 fill-rose-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FULLSCREEN & ANDROID OPTIMIZATIONS */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              {/* Google Play Store & APK Ready Card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-xl p-3 border border-emerald-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Store size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 text-xs sm:text-sm block">
                        Google Play Store & Pacote APK
                      </span>
                      <span className="text-[10px] text-emerald-800">
                        Pronto para compilar .AAB e postar na loja oficial
                      </span>
                    </div>
                  </div>

                  {onOpenGooglePlay && (
                    <button
                      onClick={onOpenGooglePlay}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Gerar APK / AAB</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  O aplicativo possui manifesto PWA, ícones 512x512 adaptativos (maskable com safe-zone), service worker offline e arquivo Digital Asset Links configurados para o pacote <code>com.aerocalc.app</code>.
                </p>
              </div>

              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sky-950 block text-xs sm:text-sm">
                      Modo Tela Cheia (Fullscreen)
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Expande a calculadora para preencher 100% da tela do Android, tablet ou monitor.
                    </p>
                  </div>
                  <button
                    onClick={onToggleFullscreen}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    {isFullscreen ? 'Sair da Tela Cheia' : 'Entrar em Tela Cheia'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-sky-950 block">
                      Vibração Tátil no Android (Haptic Feedback)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Gera uma vibração sutil ao tocar nas teclas em aparelhos compatíveis.
                    </span>
                  </div>
                  <button
                    onClick={onToggleHaptics}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      hapticsEnabled ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {hapticsEnabled ? 'Ligada' : 'Desligada'}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 space-y-1">
                  <span className="font-bold block">💡 Dica para celular Android:</span>
                  <p>
                    Para a melhor experiência, toque no botão <strong>Maximizar 🗖</strong> na barra de título da janela ou use o botão de tela cheia acima. As teclas ficarão maiores e mais fáceis de tocar!
                  </p>
                </div>
              </div>

              {/* Keyboard shortcuts */}
              <div className="bg-white/70 rounded-xl p-3 border border-white/80 shadow-sm">
                <span className="font-bold text-sky-950 flex items-center gap-1.5 mb-1.5">
                  <Keyboard size={14} className="text-sky-600" />
                  Atalhos de Teclado (PC / Teclado Físico)
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-700">
                  <div><kbd className="px-1 py-0.5 rounded bg-white shadow-sm border font-mono">0-9</kbd> Números</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-white shadow-sm border font-mono">+ - * /</kbd> Operadores</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-white shadow-sm border font-mono">Enter</kbd> Resultado</div>
                  <div><kbd className="px-1 py-0.5 rounded bg-white shadow-sm border font-mono">Esc</kbd> Limpar tudo</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="mt-3 pt-2 border-t border-sky-400/30 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer text-xs"
          >
            Concluir & Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
