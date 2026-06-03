import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, ShieldAlert, Crosshair, HelpCircle, ArrowLeft, Microscope, 
  RefreshCw, AlertTriangle, Monitor, Sparkles, Volume2, VolumeX, 
  Dna, Sliders, Database, Check, Award, Lock, Unlock, Zap, Eye, CheckCircle2
} from 'lucide-react';
import { Case, Hotspot } from '../types';

interface CrimeSceneViewProps {
  currentCase: Case;
  onEvidenceCollected: (collectedKeys: { [key: string]: boolean }) => void;
  onBackToDashboard: () => void;
  onGoToLab: () => void;
  collectedClues: { [key: string]: boolean };
}

interface ClickMarker {
  id: string;
  x: number;
  y: number;
  isSuccess: boolean;
}

export default function CrimeSceneView({ 
  currentCase, 
  onEvidenceCollected, 
  onBackToDashboard, 
  onGoToLab,
  collectedClues 
}: CrimeSceneViewProps) {
  
  const [clickLogs, setClickLogs] = useState<string[]>([
    'Inicializando scanner espectroscópico de poeira...',
    'Aguardando seleção de zona de interesse...'
  ]);
  const [flashActive, setFlashActive] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  
  // Custom interactive vision filters
  const [activeFilter, setActiveFilter] = useState<'normal' | 'thermal' | 'uv' | 'night'>('normal');
  
  // Interactive click markers & cursor simulation
  const [clickMarkers, setClickMarkers] = useState<ClickMarker[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isInside: false });
  
  // Sound toggle (Web Audio Synth)
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Popups and details
  const [toastEvidence, setToastEvidence] = useState<{ title: string; category: string; description: string } | null>(null);
  const [selectedClueDossier, setSelectedClueDossier] = useState<Hotspot | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const playShutterSound = () => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('/audio-camera-dslr.mp3');
      audio.volume = 0.95;
      audio.play().catch((err) => {
        console.warn("Falha ao reproduzir áudio real DSLR de /audio-camera-dslr.mp3:", err);
      });
    } catch (e) {
      console.warn("Falha ao instanciar objeto de áudio:", e);
    }
  };

  const playSuccessSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1045, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn(e);
    }
  };

  const playFailureSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    addLog(`Despachado para local da infração: ${currentCase.title.toUpperCase()}`);
    addLog(`Filtro óptico ajustado para: ESPECTRO DE CORES DETALHADO.`);
  }, [currentCase]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setClickLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, isInside: true });
  };

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Calculate clicked coordinates relative to the image bounds
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;

    // Check if clicked close to any hotspot
    let foundHotspot: Hotspot | null = null;
    for (const spot of currentCase.hotspots) {
      const distance = Math.sqrt(Math.pow(spot.x - percentX, 2) + Math.pow(spot.y - percentY, 2));
      if (distance <= spot.radius + 4.5) { // Interactive calibration margin
        foundHotspot = spot;
        break;
      }
    }

    const isSuccess = !!foundHotspot;
    const newMarker: ClickMarker = {
      id: Math.random().toString(),
      x: percentX,
      y: percentY,
      isSuccess
    };

    setClickMarkers(prev => [...prev, newMarker]);
    setTimeout(() => {
      setClickMarkers(prev => prev.filter(m => m.id !== newMarker.id));
    }, 1200);

    if (foundHotspot) {
      if (collectedClues[foundHotspot.clueKey]) {
        addLog(`Evidência de categoria [${foundHotspot.category}] já recolhida ao malote.`);
        playFailureSound();
        return;
      }

      // Camera Flash effect
      setFlashActive(true);
      playShutterSound();
      setTimeout(() => setFlashActive(false), 200);

      // Save collection
      const nextCollected = { ...collectedClues, [foundHotspot.clueKey]: true };
      onEvidenceCollected(nextCollected);
      
      // Success logs
      addLog(`✨ [FOTO_REGISTRO] Captura espectral realizada com sucesso!`);
      addLog(`✅ EVIDÊNCIA COLETADA: ${foundHotspot.clueTitle.toUpperCase()}`);
      
      // Trigger "EVIDÊNCIA REGISTRADA" HUD banner alert
      setToastEvidence({
        title: foundHotspot.clueTitle,
        category: foundHotspot.category,
        description: foundHotspot.clueDesc
      });
      
      // Show Dossier on capture automatically for immersion
      setSelectedClueDossier(foundHotspot);
    } else {
      setIncorrectAttempts(prev => prev + 1);
      playFailureSound();
      addLog(`⚠️ [RUÍDO) Sem espectro molecular detectável em X:${percentX.toFixed(1)}% Y:${percentY.toFixed(1)}%.`);
    }
  };

  const getFilterCSS = () => {
    switch (activeFilter) {
      case 'thermal':
        return 'contrast-[1.3] saturate-[2.4] invert-[0.15] hue-rotate-[195deg] brightness-95';
      case 'uv':
        return 'contrast-[1.25] saturate-[1.8] hue-rotate-[255deg] brightness-[0.82]';
      case 'night':
        return 'contrast-[1.4] saturate-[0.1] sepia-[1] hue-rotate-[110deg] brightness-[1.05]';
      default:
        return 'contrast-[1.05] brightness-95 filter saturate-110';
    }
  };

  const allCollected = currentCase.hotspots.every(spot => collectedClues[spot.clueKey]);

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-100 p-3 md:p-6 relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950" id="crime-scene-view">
      
      {/* 35mm Real Camera Flash overlay */}
      <AnimatePresence>
        {flashActive && (
          <motion.div 
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white/95 z-50 pointer-events-none mix-blend-screen"
            id="camera-flash-overlay"
          />
        )}
      </AnimatePresence>

      {/* "EVIDÊNCIA REGISTRADA" HUD Slide Notification */}
      <AnimatePresence>
        {toastEvidence && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 inset-x-4 max-w-lg mx-auto bg-red-950 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] z-50 overflow-hidden"
            id="toast-evidence-hud"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1.5" 
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, #ef4444, #ef4444 6px, #420505 6px, #420505 12px)' }} />
            
            <div className="pl-4 flex items-start gap-3 justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-widest text-red-400 uppercase flex items-center gap-1">
                  <span className="animate-ping block w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  🔴 REGISTRO REALIZADO COM SUCESSO DO CASO
                </p>
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                  {toastEvidence.title}
                </h4>
                <p className="text-[10px] text-red-300/80 uppercase font-bold">
                  Categoria: Perícia {toastEvidence.category}
                </p>
              </div>
              
              <button 
                onClick={() => setToastEvidence(null)}
                className="text-red-400 hover:text-red-200 text-xs font-black px-1.5 py-0.5 border border-red-800 rounded bg-red-900/40 cursor-pointer"
                id="close-hud-toast"
              >
                OCULTAR HUD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLUE FORENSIC DOSSIER MODAL */}
      <AnimatePresence>
        {selectedClueDossier && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-40" id="forensic-dossier-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] block"
              id="forensic-dossier-modal"
            >
              {/* Header */}
              <div className="bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                    Laudo Técnico de Vestígio Forense: [ID-{selectedClueDossier.id}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-cyan-950 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {selectedClueDossier.category}
                  </span>
                </div>
              </div>

              {/* Dossier contents */}
              <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  <div className="md:col-span-4 bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex flex-col items-center justify-center text-center">
                    {selectedClueDossier.category === 'Biológica' ? (
                      <>
                        <Dna className="w-12 h-12 text-emerald-400 border border-emerald-950/40 animate-pulse rounded-full p-2.5 bg-emerald-950/40 shadow-inner" />
                        <span className="text-[10px] text-slate-500 uppercase mt-3 font-bold">DNA Módulo</span>
                        <span className="text-xs font-black text-emerald-400 mt-1 uppercase">Sequência Cromossomo</span>
                      </>
                    ) : selectedClueDossier.category === 'Balística' ? (
                      <>
                        <Zap className="w-12 h-12 text-amber-400 border border-amber-950/40 animate-pulse rounded-full p-2.5 bg-amber-950/40 shadow-inner" />
                        <span className="text-[10px] text-slate-500 uppercase mt-3 font-bold">Balística Módulo</span>
                        <span className="text-xs font-black text-amber-400 mt-1 uppercase">Microestriação</span>
                      </>
                    ) : (
                      <>
                        <Monitor className="w-12 h-12 text-blue-400 border border-blue-950/40 animate-pulse rounded-full p-2.5 bg-blue-950/40 shadow-inner" />
                        <span className="text-[10px] text-slate-500 uppercase mt-3 font-bold">Digital Módulo</span>
                        <span className="text-xs font-black text-cyan-400 mt-1 uppercase">Cripto Hash RAW</span>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Título do Vestígio</p>
                      <h3 className="text-md font-bold text-slate-100 uppercase mt-0.5">
                        {selectedClueDossier.clueTitle}
                      </h3>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Descrição e Evidências Associadas</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium mt-1">
                        {selectedClueDossier.clueDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase font-black">Estado Físico / Catalogação</span>
                    <span className="text-emerald-400 font-bold">RECOLHIDO E PROTEGIDO</span>
                  </div>
                  <div className="h-1 w-full bg-slate-900 overflow-hidden rounded relative">
                    <div className="h-full bg-emerald-500 w-full animate-pulse" />
                  </div>
                  <p className="text-[8px] text-slate-600 uppercase font-semibold leading-relaxed tracking-wider">
                    Assinado digitalmente por Inteligência de Central Criminal Federal. Cadeia de custódia certificada pelo protocolo blockchain do Sindicato Físico de Perícias.
                  </p>
                </div>

              </div>

              {/* Close footer */}
              <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex justify-end">
                <button
                  onClick={() => setSelectedClueDossier(null)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition"
                  id="close-clue-dossier-btn"
                >
                  Fechar Cadeia de Custódia
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE HEADER DECORATION BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[280px] overflow-hidden pointer-events-none z-0 opacity-15 mix-blend-color-dodge" id="scene-top-decor">
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop" 
          alt="Crime scene backdrop frame" 
          className="w-full h-full object-cover object-top blur-[4px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10" id="scene-align-wrap">
        
        {/* TOP STATION HEADER & AUDIO CONTROLS */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-4" id="scene-nav">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl text-slate-400 hover:text-cyan-400 transition cursor-pointer"
              id="back-to-dash-btn"
              title="Voltar ao Map de Expedição"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] bg-red-950 border border-red-900/60 text-red-400 px-1.5 py-0.5 rounded font-black font-semibold tracking-wider uppercase inline-block">
                  CSI INVESTIGAÇÃO ATIVA DE CAMPO
                </span>
                <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                  Sessão Ativa
                </span>
              </div>
              <h1 className="text-sm md:text-md font-bold text-slate-100 uppercase tracking-widest mt-1">
                {currentCase.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Audio Toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 p-2 px-3 border rounded-xl text-[9px] font-bold uppercase tracking-widest transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-slate-900 border-cyan-800/60 text-cyan-400' 
                  : 'bg-slate-900 border-slate-850 text-slate-500'
              }`}
              id="sound-toggle-btn"
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos de Áudio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Som: Ativo' : 'Som: Mudo'}</span>
            </button>

            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="text-slate-500 uppercase font-black text-[9px]">Varreduras Falhas</span>
              <span className="text-red-400 font-bold font-mono">
                {incorrectAttempts}
              </span>
            </div>
          </div>
        </header>

        {/* CADAVERIC OR INDUSTRIAL INCIDENT HEADER STORYBOARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-400" 
               style={{ backgroundImage: 'repeating-linear-gradient(180deg, #f59e0b, #f59e0b 8px, transparent 8px, transparent 16px)' }} />
          <div className="pl-4">
            <p className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 animate-pulse text-red-500" />
              <span>DESPACHO OPERACIONAL DO MIAMI CRIMINAL PERTINE</span>
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              {currentCase.storyline}
            </p>
          </div>
        </div>

        {/* CORE CONTAINER: STYLISH FILTERS & VIEWER */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="crime-scene-interactive-layout">
          
          {/* LENS & COORDINATE ACTIVE SPEC FILTERS BAR (1 COLUMN) */}
          <div className="lg:col-span-1 space-y-4" id="clue-objectives-panel">
            
            {/* Tactical Vision Panel */}
            <div className="bg-slate-900/95 border border-slate-800 p-4 rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  CONTROLE DE VISÃO LENTE
                </h3>
              </div>
              <p className="text-[9px] text-slate-550 text-slate-500 leading-normal font-sans">
                Intercale filtros para ressaltar feixes orgânicos, cápsulas frias ou calor residual elétrico na cena dactilográfica.
              </p>

              <div className="grid grid-cols-1 gap-2 text-[9px]" id="vision-filter-selectors">
                
                {/* Regular filter */}
                <button
                  onClick={() => { setActiveFilter('normal'); addLog('Visão normal redefinida.'); }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border font-bold uppercase transition cursor-pointer ${
                    activeFilter === 'normal' 
                      ? 'bg-slate-950 border-cyan-500 text-cyan-400' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Filtro Digital Padrão
                  </span>
                  <span className="text-[8px] text-slate-600">RAW</span>
                </button>

                {/* Thermal filter */}
                <button
                  onClick={() => { setActiveFilter('thermal'); addLog('Filtro Térmico de Infravermelho em andamento.'); }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border font-bold uppercase tracking-wide transition cursor-pointer ${
                    activeFilter === 'thermal' 
                      ? 'bg-red-950/40 border-red-500 text-red-400' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    Espectral Térmico
                  </span>
                  <span className="text-[8px] text-red-300">HEAT</span>
                </button>

                {/* UV blacklight */}
                <button
                  onClick={() => { setActiveFilter('uv'); addLog('Foco molecular de Luz UV ativo.'); }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border font-bold uppercase tracking-wide transition cursor-pointer ${
                    activeFilter === 'uv' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-400' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Luz Forense UV
                  </span>
                  <span className="text-[8px] text-purple-300">CR_FL</span>
                </button>

                {/* Night vision */}
                <button
                  onClick={() => { setActiveFilter('night'); addLog('Sinal de poeira residual e fósforo noturno ativo.'); }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border font-bold uppercase tracking-wide transition cursor-pointer ${
                    activeFilter === 'night' 
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 bg-emerald-400" />
                    Noturno Infravermelho
                  </span>
                  <span className="text-[8px] text-emerald-400">IR_90</span>
                </button>

              </div>
            </div>

            {/* Checklist of Evidences to discover - redesigned */}
            <div className="bg-slate-900/95 border border-slate-850 p-4 rounded-2xl relative" style={{ borderColor: '#334155' }}>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                <Database className="w-4 h-4 text-slate-400" />
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  ESPECIFICAÇÕES DO LOCAL
                </h3>
              </div>

              <div className="space-y-2.5" id="categories-check-list">
                {currentCase.hotspots.map(spot => {
                  const collected = collectedClues[spot.clueKey];
                  return (
                    <div 
                      key={spot.id}
                      className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                        collected 
                          ? 'bg-slate-950 border-emerald-800/80 text-emerald-400 bg-emerald-950/10' 
                          : 'bg-slate-950/40 border-slate-900/80 text-slate-500'
                      }`}
                      id={`clue-objective-${spot.id}`}
                    >
                      {/* Interactive glow border on collected */}
                      {collected && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-md rounded-full pointer-events-none" />
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          {spot.category === 'Biológica' ? (
                            <Dna className="w-3.5 h-3.5" />
                          ) : spot.category === 'Balística' ? (
                            <Zap className="w-3.5 h-3.5" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5" />
                          )}
                          Perícia {spot.category}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest leading-none ${
                          collected 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                            : 'bg-slate-900 text-slate-700'
                        }`}>
                          {collected ? 'NO BALOTE' : 'PENDENTE'}
                        </span>
                      </div>
                      
                      {collected ? (
                        <div className="mt-2.5 space-y-1">
                          <p className="text-[10px] text-slate-100 uppercase font-bold truncate">
                            ✓ {spot.clueTitle}
                          </p>
                          <span className="text-[8px] text-slate-500 uppercase block font-mono">
                            Dossiê catalogado e armazenado.
                          </span>
                        </div>
                      ) : (
                        <p className="text-[9px] text-slate-500 italic mt-2.5 font-sans font-medium leading-relaxed">
                          Foco no perímetro aguardando varredura espectro-óptica.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {allCollected ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-cyan-950/20 border-2 border-cyan-400 rounded-2xl p-4.5 text-center space-y-3 shadow-[0_0_25px_rgba(6,182,212,0.15)] animate-pulse"
                id="all-collected-alert"
              >
                <div className="flex justify-center">
                  <Award className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                  Varredura Completa!
                </h4>
                <p className="text-[9px] text-slate-300 font-sans font-medium leading-relaxed">
                  Todos os vestígios criminais essenciais foram recolhidos. Prossiga para a bancada do laboratório forense para decifrar os laudos.
                </p>
                
                <button
                  onClick={onGoToLab}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                  id="proceed-lab-btn"
                >
                  <Microscope className="w-3.5 h-3.5 text-slate-950" />
                  <span>Submeter ao Lab Forense</span>
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                <HelpCircle className="w-5 h-5 text-slate-700 mx-auto mb-2" />
                <p className="text-[8px] text-slate-500 uppercase font-black">Instrução de Análise</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans font-medium">
                  Ative diferentes filtros à esquerda para destacar pistas. Quando o cursor em cruz se alinhar a algum vestígio, clique para fotografar com o recolhedor.
                </p>
              </div>
            )}
          </div>

          {/* MAIN INTERACTIVE SCENE VIEWPORT (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-5" id="crime-scene-interactive-grid">
            
            {/* INTERACTIVE CRT VIEWPORT CONTAINER */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 block">
              
              {/* Caution tape edge */}
              <div className="absolute top-0 bottom-0 left-0 w-2 z-10" 
                   style={{ backgroundImage: 'repeating-linear-gradient(180deg, #f59e0b, #f59e0b 8px, #0f172a 8px, #0f172a 16px)' }} />
              
              {/* Camera Grid Viewfinder Details Overlays */}
              <div className="absolute top-3 left-6 z-15 pointer-events-none text-[8px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-4 bg-slate-950/65 px-2.5 py-1.5 rounded-md border border-slate-900" id="cam-lens-top-left">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                  REC 1080P_HD
                </span>
                <span>F/3.2 S:1/120</span>
                <span className="text-cyan-400 font-bold">FILTRO: {activeFilter.toUpperCase()}</span>
              </div>

              <div className="absolute top-3 right-4 z-15 pointer-events-none text-[8px] font-mono text-slate-400 bg-slate-950/65 px-2.5 py-1.5 rounded-md border border-slate-900" id="cam-lens-top-right">
                <span>ZOOM INTEGRADO OPT_x1.5</span>
              </div>

              {/* HIGH-TECH CURSOR DETECTIVE DISPLAY */}
              {mousePos.isInside && (
                <div 
                  className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
                  style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
                >
                  <div className="relative">
                    {/* Retro sci-fi crosshair */}
                    <div className="w-10 h-10 border border-cyan-400/50 rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-8 h-8 border border-dashed border-cyan-400/30 rounded-full" />
                    </div>
                    {/* Small dot & ticks */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                    </div>
                    {/* Tiny stats overlay below pointer */}
                    <div className="absolute top-11 left-6 bg-slate-950/90 border border-slate-800 rounded px-1.5 py-0.5 text-[6px] text-cyan-400 font-mono uppercase tracking-widest whitespace-nowrap whitespace-pre">
                      SPECTR_SCAN_35mm // X:{mousePos.x} Y:{mousePos.y}
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN ACTIVE VIEW WRAP */}
              <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setMousePos(prev => ({ ...prev, isInside: true }))}
                onMouseLeave={() => setMousePos(prev => ({ ...prev, isInside: false }))}
                onClick={handleSceneClick}
                className="relative select-none overflow-hidden cursor-none"
                id="interactive-scene-image-wrapper"
              >
                {/* Visual feedback static line effects to enforce "placar de plantão / CSI terminal" */}
                <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.03] z-[22]" />

                {/* Main image with active optical vision filters */}
                <img 
                  src={currentCase.sceneImage} 
                  alt={currentCase.title} 
                  className={`w-full h-auto max-h-[460px] md:max-h-[500px] lg:max-h-[540px] xl:max-h-[580px] w-full object-cover block transition-all duration-300 filter ${getFilterCSS()}`}
                  referrerPolicy="no-referrer"
                />

                {/* Sub-reticle specs coordinate markings (high-grade visual) */}
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/95 border-t border-slate-900 px-4 py-2 flex justify-between font-mono text-[8px] text-slate-500 z-20 uppercase font-black">
                  <span>SISTEMA DE CAPTURA DE VESTÍGIOS SPECTRO // PROVEDOR COORDENADAS</span>
                  <span className="text-[7px] text-slate-650 tracking-widest">PROPRIEDADE DE CENTRAL FORENSE FEDERAL (MIAMI)</span>
                </div>

                {/* Dynamic floating click feedback marker rings */}
                {clickMarkers.map(marker => (
                  <motion.div
                    key={marker.id}
                    initial={{ scale: 0.2, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute z-25 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  >
                    {marker.isSuccess ? (
                      <div className="w-14 h-14 border-4 border-emerald-400/90 rounded-full flex items-center justify-center bg-emerald-500/10">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 border-4 border-red-500/90 rounded-full flex items-center justify-center bg-red-950/20">
                        <span className="text-red-500 text-xs font-black">✖</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Hotspots clickable zone mapping */}
                {currentCase.hotspots.map(spot => {
                  const collected = collectedClues[spot.clueKey];
                  return (
                    <div
                      key={spot.id}
                      style={{ 
                        left: `${spot.x}%`, 
                        top: `${spot.y}%`, 
                        width: `${spot.radius * 2.8}%`,
                        height: `${spot.radius * 2.8}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onMouseEnter={() => setHoveredHotspotId(spot.id)}
                      onMouseLeave={() => setHoveredHotspotId(null)}
                      className={`absolute rounded-full border transition-all duration-300 flex items-center justify-center ${
                        collected 
                          ? 'border-emerald-500/80 bg-emerald-500/15 scale-102 shadow-[0_0_15px_rgba(16,185,129,0.45)]' 
                          : hoveredHotspotId === spot.id
                            ? 'border-cyan-400 bg-cyan-500/25 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.65)]'
                            : 'border-cyan-500/10 bg-cyan-400/5 hover:border-cyan-400/40 animate-pulse'
                      }`}
                      id={`scene-interactive-spot-${spot.id}`}
                    >
                      <span className="sr-only">{spot.name}</span>
                      
                      {/* Interactive focus crosshair */}
                      {(hoveredHotspotId === spot.id || collected) && (
                        <Crosshair className={`w-4 h-4 ${collected ? 'text-emerald-400 animate-spin-slow' : 'text-cyan-400 animate-pulse'}`} />
                      )}

                      {/* Discreet visual highlight element representing investigable items */}
                      {!collected && hoveredHotspotId !== spot.id && (
                        <span className="block w-2.5 h-2.5 bg-cyan-400/20 border border-cyan-400/50 rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DIRECT RECOLHIDO MALOTE / VISUAL INVENTORY SHELF */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-lg" id="visual-inventory-shelf">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest block">
                    MALOTE COLETOR // REGISTRO DE EVIDÊNCIAS COLETADAS
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-mono font-bold">
                  Armazenamento Criptografado de Evidências
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="inventory-slots-grid">
                {currentCase.hotspots.map(spot => {
                  const collected = collectedClues[spot.clueKey];
                  return (
                    <div
                      key={spot.id}
                      onClick={() => collected && setSelectedClueDossier(spot)}
                      className={`rounded-xl border p-3 transition duration-200 text-left flex flex-col justify-between ${
                        collected 
                          ? 'bg-slate-950 border-emerald-800/80 hover:border-emerald-500 text-emerald-400 cursor-pointer hover:scale-102 hover:shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                          : 'bg-slate-950/40 border-slate-900/50 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            collected ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/10' : 'bg-slate-900/50 text-slate-600'
                          }`}>
                            {collected ? spot.category : 'BLOQUEADO'}
                          </span>
                          {collected ? (
                            <Unlock className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Lock className="w-3 h-3 text-slate-800" />
                          )}
                        </div>

                        {collected ? (
                          <p className="text-[10px] text-slate-200 capitalize font-bold leading-tight line-clamp-1">
                            {spot.clueTitle}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-650 text-slate-600 italic font-mono uppercase tracking-wider block animate-pulse">
                            [ ESTATO: SEM SINAL ]
                          </p>
                        )}
                      </div>

                      {collected ? (
                        <div className="mt-2 text-[8px] uppercase tracking-wider font-bold text-slate-400 hover:text-cyan-400 flex items-center justify-between">
                          <span>EXAMINAR DOSSIÊ</span>
                          <span className="text-[10px]">&rarr;</span>
                        </div>
                      ) : (
                        <span className="text-[8px] text-slate-700 block uppercase tracking-tight italic font-mono mt-2">
                          Colete na cena...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactical Spectrograph Logging Console */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-[9px] text-slate-400 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 text-slate-500 uppercase tracking-widest font-bold">
                <span>CONTRAL DE LOG POLICIAL ESPECTRO-DE-PÓ</span>
                <span className="text-cyan-400 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block animate-ping" />
                  SINAL ONLINE SAT_OK
                </span>
              </div>
              
              <div className="space-y-1 max-h-[100px] overflow-y-auto" id="spectro-logs-console">
                {clickLogs.map((log, index) => (
                  <p key={index} className={log.includes('COLETADA') || log.includes('CAPTURA') ? 'text-cyan-400 font-bold' : log.includes('RUÍDO') ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                    {log}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
