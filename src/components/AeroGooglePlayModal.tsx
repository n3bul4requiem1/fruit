import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Terminal,
  Store,
  Layers,
  Sparkles,
  X,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEngine } from '../utils/audio';

interface AeroGooglePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AeroGooglePlayModal: React.FC<AeroGooglePlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'pwabuilder' | 'cli' | 'checklist'>('pwabuilder');

  if (!isOpen) return null;

  const appLiveUrl = 'https://ais-pre-4vhn5xxluu7s72bpdyf5gi-599543494141.us-east1.run.app';
  const manifestUrl = `${appLiveUrl}/manifest.webmanifest`;
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?url=${encodeURIComponent(appLiveUrl)}`;

  const bubblewrapCommand = `npm i -g @bubblewrap/cli\nbubblewrap init --manifest=${manifestUrl}\nbubblewrap build`;

  const handleCopyCmd = () => {
    soundEngine.playOperator();
    navigator.clipboard?.writeText(bubblewrapCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyUrl = () => {
    soundEngine.playOperator();
    navigator.clipboard?.writeText(manifestUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="win7-aero-frame w-full max-w-[520px] max-h-[92vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border-2 border-white/90">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-sky-400/40 via-cyan-300/30 to-sky-400/40 border-b border-white/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-sky-400 p-0.5 shadow-sm flex items-center justify-center border border-white">
              <Store size={13} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-sky-950 win7-title-glow block leading-tight">
                Gerar APK & Publicar na Google Play
              </span>
              <span className="text-[10px] text-slate-600 block">
                Pacote Android Oficial (TWA / AAB / WebAPK)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="win7-btn-close w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shadow-sm transition-all"
            title="Fechar"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-xs">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-xl p-3 border border-emerald-300/80 shadow-sm flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-950 text-xs block">
                Aplicativo 100% Compatível e Pronto para a Google Play!
              </span>
              <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                Todos os arquivos obrigatórios (Web App Manifest com ícones adaptativos 512x512, Safe-Zone Maskable, Service Worker offline e Digital Asset Links) estão compilados e ativos.
              </p>
            </div>
          </div>

          {/* Quick Install Directly to Android / Mobile if supported */}
          <div className="bg-white/80 rounded-xl p-3 border border-white/90 shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-sky-950 text-xs block flex items-center gap-1.5">
                <Smartphone size={15} className="text-sky-600" />
                Instalar no Celular Agora (WebAPK)
              </span>
              <span className="text-[11px] text-slate-600">
                {isInstalled
                  ? 'O AeroCalc já está instalado como app no seu dispositivo!'
                  : 'Cria o ícone no seu celular Android sem precisar abrir loja.'}
              </span>
            </div>

            {isInstalled ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 border border-emerald-300">
                <Check size={12} /> Instalado
              </span>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Download size={13} />
                Instalar App
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 italic">Disponível no Chrome Android</span>
            )}
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-sky-300/40 text-xs font-semibold gap-1 pt-1">
            <button
              onClick={() => setActiveSubTab('pwabuilder')}
              className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'pwabuilder'
                  ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300 font-bold'
                  : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
              }`}
            >
              <Sparkles size={13} className="text-sky-600" />
              <span>Opção 1: PWABuilder (1 Clique)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('cli')}
              className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'cli'
                  ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300 font-bold'
                  : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
              }`}
            >
              <Terminal size={13} className="text-sky-600" />
              <span>Opção 2: Bubblewrap CLI</span>
            </button>
            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`py-1.5 px-3 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'checklist'
                  ? 'bg-white text-sky-950 shadow-sm border border-b-0 border-sky-300 font-bold'
                  : 'text-slate-700 hover:text-sky-950 hover:bg-white/40'
              }`}
            >
              <Layers size={13} className="text-sky-600" />
              <span>Google Play Console</span>
            </button>
          </div>

          {/* TAB 1: PWABuilder (Recommended official 1-click generator) */}
          {activeSubTab === 'pwabuilder' && (
            <div className="bg-white/80 rounded-xl p-3 border border-white/90 shadow-sm space-y-3">
              <div>
                <span className="font-bold text-sky-950 text-xs sm:text-sm block">
                  Gerador Automático de APK & AAB (PWABuilder)
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  O <strong>PWABuilder</strong> (ferramenta oficial recomendada pelo Google) valida o app online e gera diretamente o pacote <code>.aab</code> assinado para publicar na Play Store, além do <code>.apk</code> para teste.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 space-y-1 text-[11px] text-sky-900">
                <span className="font-bold block flex items-center gap-1">
                  <ShieldCheck size={14} className="text-sky-600" />
                  URL do seu App para o Gerador:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appLiveUrl}
                    className="flex-1 px-2 py-1 rounded bg-white border border-sky-300 text-[11px] text-slate-800 font-mono select-all"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="p-1 px-2 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedUrl ? <Check size={11} /> : <Copy size={11} />}
                    {copiedUrl ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <span>Abrir PWABuilder e Baixar Pacote Android</span>
                <ExternalLink size={14} />
              </a>

              <p className="text-[10px] text-slate-500 text-center">
                No site do PWABuilder, clique em <strong>Package for Stores</strong> &rarr; <strong>Android</strong> &rarr; <strong>Generate Package</strong>.
              </p>
            </div>
          )}

          {/* TAB 2: Bubblewrap CLI */}
          {activeSubTab === 'cli' && (
            <div className="bg-white/80 rounded-xl p-3 border border-white/90 shadow-sm space-y-2.5">
              <div>
                <span className="font-bold text-sky-950 text-xs block">
                  Compilar APK/AAB no seu Computador com Bubblewrap
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  A CLI oficial do time do Google Chrome/Android para criar o projeto Android Studio e o APK/AAB:
                </p>
              </div>

              <div className="relative">
                <pre className="p-2.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed border border-slate-700">
                  {bubblewrapCommand}
                </pre>
                <button
                  onClick={handleCopyCmd}
                  className="absolute top-2 right-2 p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold border border-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCmd ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copiedCmd ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p>O Bubblewrap cria automaticamente:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700">
                  <li><code>app-release-bundle.aab</code> (Arquivo que você sobe na Google Play Store)</li>
                  <li><code>app-release-signed.apk</code> (Arquivo para instalar no Android via pendrive/WhatsApp)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Checklist Google Play Console */}
          {activeSubTab === 'checklist' && (
            <div className="bg-white/80 rounded-xl p-3 border border-white/90 shadow-sm space-y-2.5">
              <span className="font-bold text-sky-950 text-xs block">
                Passo a Passo no Google Play Console:
              </span>

              <ol className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Acesse <strong>play.google.com/console</strong> e crie seu app.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Selecione: <strong>Aplicativo</strong> &rarr; <strong>Gratuito</strong> &rarr; <strong>Ferramentas / Produtividade</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Na ficha da loja, use os ícones gerados (o ícone 512x512 está disponível em <code>/pwa-512x512.png</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Na seção <strong>Produção</strong>, arraste o arquivo <code>app-release-bundle.aab</code> gerado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                  <span>Envie para revisão do Google Play! Seu app Frutiger Aero estará na loja para milhões de celulares.</span>
                </li>
              </ol>
            </div>
          )}

          {/* Included Files info */}
          <div className="bg-sky-50/80 rounded-xl p-2.5 border border-sky-200 text-[10px] text-sky-950 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <FileCode size={12} className="text-sky-600" />
              Arquivos de Configuração Inclusos na Raiz do Projeto:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-slate-700">
              <div>&bull; /public/pwa-512x512.png</div>
              <div>&bull; /public/pwa-maskable-512x512.png</div>
              <div>&bull; /public/.well-known/assetlinks.json</div>
              <div>&bull; /public/twa-manifest.json</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/70 border-t border-sky-300/40 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
