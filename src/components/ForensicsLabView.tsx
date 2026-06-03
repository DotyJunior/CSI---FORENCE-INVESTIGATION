import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Microscope, CheckCircle2, RotateCw, ZoomIn, 
  Dna, Cpu, Search, Sparkles, RefreshCw, Layers, ShieldAlert, AlertCircle, Info, Activity
} from 'lucide-react';
import { Case, Hotspot } from '../types';

interface ForensicsLabViewProps {
  currentCase: Case;
  collectedClues: { [key: string]: boolean };
  analyzedClues: { [key: string]: boolean };
  onClueAnalyzed: (analyzedKeys: { [key: string]: boolean }) => void;
  onGoToBoard: () => void;
  onBackToScene: () => void;
}

export default function ForensicsLabView({
  currentCase,
  collectedClues,
  analyzedClues,
  onClueAnalyzed,
  onGoToBoard,
  onBackToScene
}: ForensicsLabViewProps) {
  
  // Choose which collected hotspot to analyze. Default to the first unanalyzed collected one
  const collectedHotspots = currentCase.hotspots.filter(h => collectedClues[h.clueKey]);
  const [activeHotspotId, setActiveHotspotId] = useState<string>(
    collectedHotspots.find(h => !analyzedClues[h.clueKey])?.id || collectedHotspots[0]?.id || ''
  );

  const activeHotspot = currentCase.hotspots.find(h => h.id === activeHotspotId);

  // Ballistics State
  const [balRotation, setBalRotation] = useState(0);
  const [balZoom, setBalZoom] = useState(1);
  const [balFocus, setBalFocus] = useState(50);
  const [balRevealed, setBalRevealed] = useState(false);

  // DNA State - Sequence of standard base-pair alignments (A-T, T-A, C-G, G-C)
  const [dnaPairs, setDnaPairs] = useState<{ id: number; base: 'A' | 'T' | 'C' | 'G'; match: 'A' | 'T' | 'C' | 'G' | '?' }[]>([
    { id: 1, base: 'A', match: '?' },
    { id: 2, base: 'C', match: '?' },
    { id: 3, base: 'T', match: '?' },
    { id: 4, base: 'G', match: '?' },
    { id: 5, base: 'A', match: '?' },
    { id: 6, base: 'G', match: '?' },
  ]);
  const [dnaFinished, setDnaFinished] = useState(false);

  // Digital State
  const [decryptedSectorCount, setDecryptedSectorCount] = useState(0);
  const [matrixGrid, setMatrixGrid] = useState<{ id: number; val: string; active: boolean; corrupted: boolean }[]>([]);

  // Console text
  const [analysisStatusText, setAnalysisStatusText] = useState('Pressione ANALISAR para inicializar diagnóstico.');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset mini-game state whenever active evidence selection changes
  useEffect(() => {
    if (!activeHotspot) return;
    
    setAnalysisStatusText(`Módulo de análise calibrando para: [${activeHotspot.clueTitle.toUpperCase()}]`);
    setBalRotation(0);
    setBalZoom(1);
    setBalFocus(50);
    setBalRevealed(false);

    // Reset DNA matching
    setDnaPairs([
      { id: 1, base: 'A', match: '?' },
      { id: 2, base: 'C', match: '?' },
      { id: 3, base: 'T', match: '?' },
      { id: 4, base: 'G', match: '?' },
      { id: 5, base: 'A', match: '?' },
      { id: 6, base: 'G', match: '?' },
    ]);
    setDnaFinished(false);

    // Reset Digital Matrix
    const bytes = ['A4', 'C9', 'FF', '00', '8B', '3E', '8C', '14', 'F2', 'D1', 'E8', '74', '5E', 'F1', '90', 'B2'];
    const nodes = Array.from({ length: 16 }).map((_, idx) => ({
      id: idx,
      val: bytes[idx % bytes.length],
      active: false,
      corrupted: idx % 3 === 1
    }));
    setMatrixGrid(nodes);
    setDecryptedSectorCount(0);
  }, [activeHotspotId]);

  if (!activeHotspot) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-mono">
        <AlertCircle className="w-12 h-12 text-pink-500 animate-pulse mb-3" />
        <h2 className="text-md font-bold uppercase tracking-wider">Nenhum vestígio coletado encontrado!</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-md text-center font-sans font-medium">
          Você precisa retornar à cena de crime de campo e isolar/fotografar evidências biológicas, balísticas ou digitais primeiro antes de aceder à bancada de exames.
        </p>
        <button
          onClick={onBackToScene}
          className="mt-6 px-5 py-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl text-xs font-bold text-cyan-450 text-cyan-400 cursor-pointer transition uppercase tracking-widest"
          id="back-scene-fallback"
        >
          Retornar à Cena de Crime
        </button>
      </div>
    );
  }

  // Handle action triggers per game type
  const triggerAnalysisComplete = () => {
    setIsProcessing(true);
    setAnalysisStatusText('EXECUTANDO VARREDURA ESPECTRAL E DECODIFICAÇÃO DE POLÍMEROS...');

    setTimeout(() => {
      setIsProcessing(false);
      const nextAnalyzed = { ...analyzedClues, [activeHotspot.clueKey]: true };
      onClueAnalyzed(nextAnalyzed);
      setAnalysisStatusText(`MÁQUINA CONCLUÍDA: Laudo emitido e integrado ao Mural Analítico com sucesso.`);
    }, 1200);
  };

  // Mini-Game Actions

  // 1. Ballistics interaction
  const checkBallisticsSolved = () => {
    // Requires rotation between 75 and 105 degrees, zoom > 2.5x, and Focus ~ 80% to 100%
    if (balRotation >= 75 && balRotation <= 105 && balZoom >= 2.5 && balFocus >= 80) {
      setBalRevealed(true);
      setAnalysisStatusText(`SINAL LOCALIZADO: Micro-estrias metálicas combinam com a amostra!`);
      const nextAnalyzed = { ...analyzedClues, [activeHotspot.clueKey]: true };
      onClueAnalyzed(nextAnalyzed);
    } else {
      setAnalysisStatusText('Erro de calibração mecânica. Gire o cilindro para alinhar as marcas, amplie e foque a micro-lente.');
    }
  };

  // 2. DNA Pair Clicking
  const handleDnaBaseClick = (idx: number, letter: 'A' | 'T' | 'C' | 'G') => {
    const sequence = [...dnaPairs];
    const original = sequence[idx].base;
    
    const isValid = (original === 'A' && letter === 'T') ||
                    (original === 'T' && letter === 'A') ||
                    (original === 'C' && letter === 'G') ||
                    (original === 'G' && letter === 'C');

    if (isValid) {
      sequence[idx].match = letter;
      setDnaPairs(sequence);
      
      const allAligned = sequence.every(p => p.match !== '?');
      if (allAligned) {
        setDnaFinished(true);
        setAnalysisStatusText('ALINHAMENTO CODON APURADO! Sequenciamento nucleotídico de DNA completo.');
        const nextAnalyzed = { ...analyzedClues, [activeHotspot.clueKey]: true };
        onClueAnalyzed(nextAnalyzed);
      } else {
        setAnalysisStatusText('Base correspondida com sucesso na fita helicoidal dupla.');
      }
    } else {
      setAnalysisStatusText(`Incompatibilidade polar: Base '${letter}' não faz par estável com '${original}'.`);
    }
  };

  // 3. Digital Grid Decoding
  const handleMatrixNodeClick = (nodeId: number) => {
    const nextGrid = matrixGrid.map(node => {
      if (node.id === nodeId) {
        return { ...node, active: !node.active };
      }
      return node;
    });
    setMatrixGrid(nextGrid);
    
    const activeCorrectOnes = nextGrid.filter(node => node.active && !node.corrupted).length;
    
    if (activeCorrectOnes >= 5) {
      setAnalysisStatusText('SETOR PRIVADO RESTAURADO E DECRIPTADO! Log de mensagens recuperado.');
      const nextAnalyzed = { ...analyzedClues, [activeHotspot.clueKey]: true };
      onClueAnalyzed(nextAnalyzed);
    } else {
      setAnalysisStatusText(`Reconstruindo clusters estáveis: ${activeCorrectOnes}/5 blocos recuperados.`);
    }
  };

  const isCurrentAnalyzed = analyzedClues[activeHotspot.clueKey];
  const allCollectedCount = collectedHotspots.length;
  const analyzedCount = collectedHotspots.filter(h => analyzedClues[h.clueKey]).length;
  const isEveryEvidenceAnalyzed = collectedHotspots.every(h => analyzedClues[h.clueKey]) && collectedHotspots.length === currentCase.hotspots.length;

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-100 p-3 md:p-6 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-550 selection:text-slate-950" id="forensics-lab-view">
      
      {/* IMMERSIVE TOP PICTURE DECORATION */}
      <div className="absolute top-0 left-0 right-0 h-[280px] overflow-hidden pointer-events-none z-0 opacity-15 mix-blend-screen" id="lab-top-decor">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Laboratory backdrop" 
          className="w-full h-full object-cover object-top blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow" id="lab-alignment-wrapper">
        
        {/* NAV STATS HEADER */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6" id="lab-top-nav">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToScene}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-xl text-slate-400 hover:text-cyan-400 transition cursor-pointer"
              id="lab-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[8px] bg-cyan-950/60 border border-cyan-850 text-cyan-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase inline-block">
                Laboratório Geral CSI
              </span>
              <h1 className="text-sm md:text-md font-bold text-slate-200 mt-1 uppercase tracking-widest">
                Termo de Exame Forense // Miami Div-F
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg">
              Laudos Emitidos: <span className="text-cyan-400 font-bold">{analyzedCount} de {allCollectedCount}</span>
            </span>
            
            {isEveryEvidenceAnalyzed && (
              <button
                onClick={onGoToBoard}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
                id="proceed-board-btn"
              >
                <span>Ir Para Mural</span>
                <Microscope className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>
        </header>

        {/* DOUBLE-SPLIT DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch" id="lab-panel-grid">
          
          {/* SIDEBAR: ACTIVE COLLECTION QUEUE (1 col) */}
          <div className="lg:col-span-1 space-y-4" id="lab-loaded-sidebar">
            <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-4 flex flex-col h-full" style={{ borderColor: '#334155' }}>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">
                FILA DE EXAMES
              </h3>

              <div className="space-y-2.5 flex-1 overflow-y-auto" id="lab-items-queue">
                {collectedHotspots.map(spot => {
                  const isSelected = activeHotspotId === spot.id;
                  const analyzed = analyzedClues[spot.clueKey];
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setActiveHotspotId(spot.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-950 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.12)]' 
                          : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                      }`}
                      id={`lab-queue-item-${spot.id}`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400" />
                      )}

                      <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                          {spot.category}
                        </span>
                        {analyzed ? (
                          <span className="text-[8px] text-emerald-400 font-black tracking-widest bg-emerald-950 px-1 rounded">
                            OK
                          </span>
                        ) : (
                          <span className="text-[8px] text-pink-500 font-black tracking-widest animate-pulse">
                            PENDENTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-200 mt-2 truncate max-w-[180px]">
                        {spot.clueTitle.toUpperCase()}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-850 pt-3 mt-4 text-center">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Procedimento</p>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1 font-medium">
                  Submeta cada evidência acima ao teste científico correspondente. A análise correta revela coincidências essenciais à condenação.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN INTERACTIVE DIGITAL LABORATORY APPARATUS (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-850 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl" id="lab-interactive-station" style={{ borderColor: '#334155' }}>
            
            {/* Caution stripes yellow header limit */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-repeating-linear bg-pink-500" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ec4899, #ec4899 6px, #0f172a 6px, #0f172a 12px)' }} />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3 mt-1">
              <div>
                <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>ÁREA INTEGRADA DE DIAGNÓSTICO // {activeHotspot.category.toUpperCase()}</span>
                </p>
                <h2 className="text-md font-bold text-slate-100 uppercase tracking-wider mt-1.5">
                  {activeHotspot.clueTitle}
                </h2>
              </div>

              {isCurrentAnalyzed && (
                <div className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Laudo Técnico Deferido</span>
                </div>
              )}
            </div>

            {/* MINI GAMES STAGE AREA */}
            <div className="flex-grow flex flex-col items-center justify-center py-6 min-h-[300px]" id="mini-game-stage">
              
              {/* GAME 1: BALLISTICS */}
              {activeHotspot.category === 'Balística' && (
                <div className="w-full max-w-lg space-y-6 text-center" id="ballistics-game">
                  <div className="relative mx-auto w-44 h-44 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-900/10" />
                    
                    <motion.div 
                      animate={{ rotate: balRotation, scale: balZoom }}
                      style={{ filter: `blur(${(Math.abs(85 - balFocus)) / 8}px)` }}
                      className="relative w-32 h-32 flex items-center justify-center"
                    >
                      <svg className="w-28 h-28 text-slate-400" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" className="text-amber-600/80" />
                        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" className="text-amber-700" />
                        <path d="M50 10 L50 90 M10 50 L90 50" stroke="rgba(34,211,238,0.35)" strokeWidth="1" />
                        
                        <text 
                          x="50" 
                          y="54" 
                          fill="#06b6d4" 
                          fontSize="9" 
                          fontWeight="bold" 
                          textAnchor="middle" 
                          className="font-mono tracking-widest select-none opacity-90"
                        >
                          {balRevealed ? '38-NY-991A' : 'X%-##-###'}
                        </text>
                      </svg>
                    </motion.div>

                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-405 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none" />
                  </div>

                  {/* Sliders panel */}
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-3.5 text-left font-mono text-[11px]">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 uppercase">Rotação Mecânica do Cilindro</span>
                        <span className="text-cyan-400 font-bold">{balRotation}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="180" 
                        value={balRotation}
                        onChange={(e) => {
                          setBalRotation(Number(e.target.value));
                          setBalRevealed(false);
                        }}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 uppercase">Ampliação Focal (Zoom)</span>
                        <span className="text-cyan-400 font-bold">{balZoom.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="4" 
                        step="0.1"
                        value={balZoom}
                        onChange={(e) => {
                          setBalZoom(Number(e.target.value));
                          setBalRevealed(false);
                        }}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 uppercase">Ajuste de Nitidez de Camada (Foco)</span>
                        <span className="text-cyan-400 font-bold">{balFocus}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={balFocus}
                        onChange={(e) => {
                          setBalFocus(Number(e.target.value));
                          setBalRevealed(false);
                        }}
                        className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-455 accent-cyan-400"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-900 text-[10px]">
                      <span className="text-slate-500 uppercase">* Requer Rotação ~90°, Zoom &gt;2.5x e Foco &gt;80%</span>
                      <button
                        onClick={checkBallisticsSolved}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 hover:shadow-cyan-400/20 shadow-md text-[10px] rounded uppercase cursor-pointer"
                      >
                        Submeter Calibração
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 2: DNA BIOLOGICAL SEQUENCER */}
              {activeHotspot.category === 'Biológica' && (
                <div className="w-full max-w-lg space-y-6" id="dna-game">
                  <div className="text-center bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      Diretriz: Alinhamento das fitas poliméricas. Selecione letras correspondentes aos pares de bases complementares (<strong className="text-pink-400">A ⇄ T</strong> e <strong className="text-cyan-405 text-cyan-400">C ⇄ G</strong>).
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-2 pt-2 pb-2">
                    {dnaPairs.map((pair, idx) => (
                      <div 
                        key={pair.id} 
                        className="bg-slate-950 border border-slate-900 rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-pink-400 text-xs">
                          {pair.base}
                        </div>

                        <div className="text-slate-500 text-[10px] font-mono leading-none">⇄</div>

                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold border text-xs transition ${
                          pair.match === '?' 
                            ? 'bg-slate-950 border-dashed border-slate-800 text-slate-500 animate-pulse' 
                            : 'bg-cyan-950/40 border-cyan-500 text-cyan-400'
                        }`}>
                          {pair.match}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center">
                      ESCOLHA A BASE COMPLEMENTAR EM SEQUÊNCIA:
                    </p>
                    
                    <div className="flex justify-center gap-3">
                      {['A', 'T', 'C', 'G'].map(letter => {
                        const nextEmptyIdx = dnaPairs.findIndex(p => p.match === '?');
                        return (
                          <button
                            key={letter}
                            onClick={() => {
                              if (nextEmptyIdx !== -1) {
                                handleDnaBaseClick(nextEmptyIdx, letter as any);
                              }
                            }}
                            disabled={nextEmptyIdx === -1}
                            className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-805 text-slate-300 font-bold transition rounded-lg text-xs cursor-pointer disabled:opacity-40"
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 3: DIGITAL CLUSTERS DECODERS */}
              {activeHotspot.category === 'Digital' && (
                <div className="w-full max-w-lg space-y-4" id="digital-game">
                  <div className="text-center bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      Diretriz: Decodificação de partições estáveis. Ative exatamente <strong className="text-cyan-455 text-cyan-400">5 clusters de memória saudáveis</strong> (evite os setores identificados como corrompidos).
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {matrixGrid.map(node => (
                      <button
                        key={node.id}
                        onClick={() => handleMatrixNodeClick(node.id)}
                        className={`h-12 border rounded-xl font-mono text-xs flex flex-col items-center justify-center transition cursor-pointer ${
                          node.active 
                            ? node.corrupted 
                              ? 'bg-rose-950/40 border-rose-500 text-rose-455 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.25)]' 
                              : 'bg-cyan-950/50 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                            : node.corrupted 
                              ? 'bg-slate-900/60 border-rose-900/40 text-slate-650 text-slate-600' 
                              : 'bg-slate-950/90 border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <span className="font-bold">{node.val}</span>
                        {node.corrupted && node.active && (
                          <span className="text-[7px] text-rose-500 uppercase tracking-tighter leading-none mt-0.5">CORRUPTO</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* DIAGNOSTICS LOG CONSOLE */}
            <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4" id="lab-diagnostics-bar">
              <div className="flex-1 min-w-0 bg-slate-950 border border-slate-900 rounded-xl p-3 text-[10px] text-slate-400 w-full" id="lab-logs-console">
                <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block mb-1">
                  PERÍMETRO COMPUTACIONAL LOG
                </span>
                <p className={isProcessing ? 'text-pink-400 animate-pulse' : 'text-slate-300 font-medium'}>
                  {analysisStatusText}
                </p>
              </div>

              {!isCurrentAnalyzed && (
                <button
                  onClick={triggerAnalysisComplete}
                  disabled={isProcessing}
                  className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[10px] uppercase font-bold text-cyan-400 px-5 py-3.5 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50 shrink-0"
                  id="fast-scan-btn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Sequenciar Espectro Rápido</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
