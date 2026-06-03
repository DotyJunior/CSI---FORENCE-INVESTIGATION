import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldAlert, Crosshair, HelpCircle, ArrowLeft, Microscope, RefreshCw, AlertTriangle, Monitor, Sparkles } from 'lucide-react';
import { Case, Hotspot } from '../types';

interface CrimeSceneViewProps {
  currentCase: Case;
  onEvidenceCollected: (collectedKeys: { [key: string]: boolean }) => void;
  onBackToDashboard: () => void;
  onGoToLab: () => void;
  collectedClues: { [key: string]: boolean };
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
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addLog(`Despachado para local da infração: ${currentCase.title.toUpperCase()}`);
    addLog(`AVISO DIVISIONAL: Fita de isolamento amarela ativa no perímetro.`);
  }, [currentCase]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setClickLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Calculate clicked coordinates relative to the image bounds
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked close to any hotspot
    let foundHotspot: Hotspot | null = null;
    for (const spot of currentCase.hotspots) {
      const distance = Math.sqrt(Math.pow(spot.x - x, 2) + Math.pow(spot.y - y, 2));
      if (distance <= spot.radius + 3.5) { // Touch/click margin of error
        foundHotspot = spot;
        break;
      }
    }

    if (foundHotspot) {
      if (collectedClues[foundHotspot.clueKey]) {
        addLog(`Evidência de categoria [${foundHotspot.category}] já recolhida ao malote.`);
        return;
      }

      // 35mm flash photographic effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 200);

      // Save collection
      const nextCollected = { ...collectedClues, [foundHotspot.clueKey]: true };
      onEvidenceCollected(nextCollected);
      
      addLog(`✨ [FOTO_REGISTRO] Captura espectral realizada com sucesso!`);
      addLog(`✅ EVIDÊNCIA COLETADA: ${foundHotspot.clueTitle.toUpperCase()}`);
    } else {
      setIncorrectAttempts(prev => prev + 1);
      addLog(`⚠️ [RUIDO SPECTRO] Coordenadas X:${x.toFixed(1)}% Y:${y.toFixed(1)}% sem resíduo autêntico.`);
    }
  };

  const allCollected = currentCase.hotspots.every(spot => collectedClues[spot.clueKey]);

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-100 p-3 md:p-6 relative overflow-x-hidden selection:bg-cyan-550 selection:text-slate-950" id="crime-scene-view">
      
      {/* 35mm Camera Flash overlay */}
      <AnimatePresence>
        {flashActive && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/95 z-50 pointer-events-none mix-blend-screen"
            id="camera-flash-overlay"
          />
        )}
      </AnimatePresence>

      {/* IMMERSIVE HEADER DECORATION BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[280px] overflow-hidden pointer-events-none z-0 opacity-20 mix-blend-color-dodge" id="scene-top-decor">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Crime scene backdrop frame" 
          className="w-full h-full object-cover object-top blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10" id="scene-align-wrap">
        
        {/* TOP COORD-NAV NAVIGATION */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-4" id="scene-nav">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 hover:border-cyan-555 hover:border-cyan-400 rounded-xl text-slate-400 hover:text-cyan-450 hover:text-cyan-400 transition cursor-pointer"
              id="back-to-dash-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[8px] bg-red-950 border border-red-900/60 text-red-400 px-1.5 py-0.5 rounded font-black font-semibold tracking-wider uppercase inline-block">
                Levantamento Tecnológico
              </span>
              <h1 className="text-sm md:text-md font-bold text-slate-205 text-slate-100 uppercase tracking-widest mt-1">
                Local da Infração // {currentCase.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="text-slate-500 uppercase">Scanning falhos</span>
              <span className="text-pink-400 font-bold font-mono">
                {incorrectAttempts}
              </span>
            </div>
          </div>
        </header>

        {/* INCIDENT DETAILS BRIEF */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-repeating bg-amber-400" 
               style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 6px, transparent 6px, transparent 12px)' }} />
          <p className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mb-1.5 flex items-center gap-1 mt-1">
            <ShieldAlert className="w-4 h-4" />
            <span>DESPACHO OPERACIONAL - MIAMI POLICE DEPT</span>
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
            {currentCase.storyline}
          </p>
        </div>

        {/* CORE WORK PIECE SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="crime-scene-interactive-layout">
          
          {/* LEFT COLUMN: Categories to search and actions (width 1 col) */}
          <div className="lg:col-span-1 space-y-4" id="clue-objectives-panel">
            
            <div className="bg-slate-900/95 border border-slate-850 p-4 rounded-2xl relative" style={{ borderColor: '#334155' }}>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">
                EVIDÊNCIAS NO LOCAL
              </h3>

              <div className="space-y-2.5" id="categories-check-list">
                {currentCase.hotspots.map(spot => {
                  const collected = collectedClues[spot.clueKey];
                  return (
                    <div 
                      key={spot.id}
                      className={`p-3 rounded-xl border transition duration-200 ${
                        collected 
                          ? 'bg-slate-950 border-emerald-800 text-emerald-400 bg-emerald-950/10' 
                          : 'bg-slate-950/45 border-slate-900 text-slate-500'
                      }`}
                      id={`clue-objective-${spot.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          Perícia {spot.category}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest leading-none ${
                          collected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-slate-900 text-slate-700'
                        }`}>
                          {collected ? 'NO MALOTE' : 'ANÁLISE'}
                        </span>
                      </div>
                      
                      {collected ? (
                        <p className="text-[10px] text-slate-200 uppercase font-bold mt-2 truncate">
                          ✓ {spot.clueTitle}
                        </p>
                      ) : (
                        <p className="text-[9px] text-slate-650 text-slate-600 italic mt-2 font-sans font-medium">
                          Passe o cursor sobre os focos da cena e clique para fotografar...
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick proceed to Forensics laboratory panel if all found */}
            {allCollected ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-cyan-950/20 border-2 border-cyan-400 rounded-2xl p-5 text-center space-y-3.5 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                id="all-collected-alert"
              >
                <div className="flex justify-center">
                  <ShieldAlert className="w-8 h-8 text-cyan-400 animate-bounce" />
                </div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Varredura Completa!
                </h4>
                <p className="text-[10px] text-slate-300 font-sans font-medium leading-relaxed">
                  Todos os vestígios criminais essenciais foram recolhidos. Prossiga para a bancada do laboratório forense para decifrar os laudos.
                </p>
                
                <button
                  onClick={onGoToLab}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                  id="proceed-lab-btn"
                >
                  <Microscope className="w-4 h-4 text-slate-950" />
                  <span>Submeter ao Lab Forense</span>
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 text-center">
                <HelpCircle className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <p className="text-[9px] text-slate-500 uppercase font-black">Instrução Espetral</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans font-medium">
                  Preste atenção a vestígios evidentes, marcas de sangue ou cápsulas de armas. Quando o cursor crosshair se alinhar, clique para disparar o flash de 35mm.
                </p>
              </div>
            )}
          </div>

          {/* MAIN INTERACTIVE SCENE VIEWPORT: image mapping (width 3 cols) */}
          <div className="lg:col-span-3 space-y-4" id="crime-scene-interactive-grid">
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-850 shadow-2xl bg-slate-950 cursor-crosshair" style={{ borderColor: '#334155' }}>
              
              {/* Caution tape edge */}
              <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-amber-400 z-10" 
                   style={{ backgroundImage: 'repeating-linear-gradient(180deg, #f59e0b, #f59e0b 10px, #0f172a 10px, #0f172a 20px)' }} />
              
              <div 
                ref={containerRef}
                onClick={handleSceneClick}
                className="relative select-none"
                id="interactive-scene-image-wrapper"
              >
                <img 
                  src={currentCase.sceneImage} 
                  alt={currentCase.title} 
                  className="w-full h-auto max-h-[500px] object-cover block opacity-90 transition-all duration-300 filter contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />

                {/* Sub-reticle specs coordinate markings (high-grade visual) */}
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 border-t border-slate-900 px-4 py-2 flex justify-between font-mono text-[8px] text-slate-500 z-20 uppercase font-black">
                  <span>DISPOSITIVO CAMERA SPECTRO_35mm // LINHA ATIVA_OK</span>
                  <span>PREPARADO PARA DISPARO DE FLASH COLETOR</span>
                </div>

                {/* Active spot coordinate markers */}
                {currentCase.hotspots.map(spot => {
                  const collected = collectedClues[spot.clueKey];
                  return (
                    <div
                      key={spot.id}
                      style={{ 
                        left: `${spot.x}%`, 
                        top: `${spot.y}%`, 
                        width: `${spot.radius * 2}%`,
                        height: `${spot.radius * 2}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onMouseEnter={() => setHoveredHotspotId(spot.id)}
                      onMouseLeave={() => setHoveredHotspotId(null)}
                      className={`absolute rounded-full border flex items-center justify-center transition-all duration-300 ${
                        collected 
                          ? 'border-emerald-400 bg-emerald-500/10 scale-102 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : hoveredHotspotId === spot.id
                            ? 'border-cyan-400 bg-cyan-500/20 scale-108 shadow-[0_0_18px_rgba(34,211,238,0.6)]'
                            : 'border-transparent bg-transparent'
                      }`}
                      id={`scene-interactive-spot-${spot.id}`}
                    >
                      {(hoveredHotspotId === spot.id || collected) && (
                        <Crosshair className={`w-4 h-4 ${collected ? 'text-emerald-400 animate-spin-slow' : 'text-cyan-455 text-cyan-400 animate-pulse'}`} />
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
                <span className="text-cyan-400 animate-pulse">SINAL ONLINE SAT</span>
              </div>
              
              <div className="space-y-1 max-h-[120px] overflow-y-auto" id="spectro-logs-console">
                {clickLogs.map((log, index) => (
                  <p key={index} className={log.includes('COLETADA') || log.includes('CAPTURA') ? 'text-cyan-400 font-bold' : log.includes('RUIDO') ? 'text-pink-400' : 'text-slate-400'}>
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
