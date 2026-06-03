import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, ShieldCheck, UserCheck, AlertTriangle, 
  MapPin, HelpCircle, FileText, CheckSquare, Layers, Fingerprint, Award, Link, Eye, Info
} from 'lucide-react';
import { Case, Suspect, Hotspot } from '../types';

interface InvestigationBoardProps {
  currentCase: Case;
  analyzedClues: { [key: string]: boolean };
  onBackToLab: () => void;
  onAccuseSuspect: (suspect: Suspect) => void;
}

export default function InvestigationBoard({
  currentCase,
  analyzedClues,
  onBackToLab,
  onAccuseSuspect
}: InvestigationBoardProps) {
  
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(currentCase.suspects[0]?.id || '');
  const activeSuspect = currentCase.suspects.find(s => s.id === selectedSuspectId);

  // Evidence list showing details
  const activeCaseClues = currentCase.hotspots;

  // Count how many clues have been analyzed
  const analyzedCount = activeCaseClues.filter(c => analyzedClues[c.clueKey]).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 md:p-6 font-mono flex flex-col justify-between relative overflow-x-hidden selection:bg-pink-600 selection:text-slate-950" id="investigation-board-view">
      
      {/* IMMERSIVE TOP BACKGROUND PICTURE WITH GRADIENT */}
      <div className="absolute top-0 left-0 right-0 h-[280px] overflow-hidden pointer-events-none z-0 opacity-20 mix-blend-color-dodge" id="board-immersive-decor">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Crime scene forensics backdrop" 
          className="w-full h-full object-cover object-top blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col" id="board-alignment-container">
        
        {/* TOP STATION PANEL WITH IMMERSIVE NAVIGATION */}
        <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6" id="board-top-nav">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLab}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 hover:border-pink-500 rounded-xl text-slate-400 hover:text-pink-400 transition cursor-pointer"
              id="board-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <h1 className="text-xl font-display font-black tracking-widest text-slate-100 uppercase">
                  MURAL DE CONEXÃO ANALÍTICA
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">
                SISTEMA CSI-BOARD // COMPARATIVO MULTIPAR CONDENSADO // CASO: {currentCase.title.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3" id="board-metrics-pill">
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="text-slate-500 uppercase">Evidências Decodificadas</span>
              <span className="text-pink-400 font-bold font-mono">
                {analyzedCount} de {activeCaseClues.length}
              </span>
            </div>
          </div>
        </header>

        {/* CORKBOARD INVESTIGATION DECK GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch" id="board-main-layout">
          
          {/* DOSSIER PANEL Left column 4 cols (Evidence pin board) */}
          <div className="lg:col-span-4" id="board-clues-dossier">
            <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-5 h-full flex flex-col relative" style={{ borderColor: '#334155' }}>
              
              {/* Caution tape trim */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-repeating-linear bg-cyan-500" 
                   style={{ backgroundImage: 'repeating-linear-gradient(45deg, #06b6d4, #06b6d4 6px, #0f172a 6px, #0f172a 12px)' }} />

              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4 flex items-center gap-2 mt-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>DOSSIER DE EVIDÊNCIAS DE LABORATÓRIO</span>
              </h2>

              <p className="text-[9px] text-slate-500 leading-normal mb-3 font-sans font-medium uppercase">
                * Conectores analisados no laboratório geram fios de ligação lógica vermelhos abaixo.
              </p>

              {/* CLUES SCROLLABLE GRID */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px] pr-1.5 scrollbar-thin scrollbar-thumb-slate-800" id="analyzed-clues-list">
                {activeCaseClues.map(hot => {
                  const analyzed = analyzedClues[hot.clueKey];
                  return (
                    <div 
                      key={hot.id}
                      className={`p-3.5 rounded-xl border relative transition duration-200 ${
                        analyzed 
                          ? 'bg-slate-950 border-cyan-800/80 text-slate-200 shadow-[0_4px_12px_rgba(6,182,212,0.03)]' 
                          : 'bg-slate-950/25 border-slate-900/40 text-slate-600'
                      }`}
                      id={`board-clue-card-${hot.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${analyzed ? 'bg-cyan-950/65 text-cyan-400 border-cyan-800/40' : 'bg-slate-900/40 text-slate-600 border-none'}`}>
                          {hot.category}
                        </span>
                        
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${analyzed ? 'text-cyan-400 animate-pulse' : 'text-slate-700'}`}>
                          {analyzed ? '● ANALISADO' : '✕ SEM EXAME'}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold uppercase tracking-wide mt-2.5 ${analyzed ? 'text-slate-100' : 'text-slate-600'}`}>
                        {hot.clueTitle}
                      </h4>

                      {analyzed ? (
                        <div className="space-y-2 mt-2 font-sans font-medium leading-relaxed">
                          <p className="text-[11px] text-slate-300">
                            {hot.clueDesc}
                          </p>
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[9px] font-mono text-cyan-500 uppercase font-black tracking-wider">
                            <span>Vínculo com suspeito:</span>
                            <span>{hot.category === 'Digital' ? 'Logs de Satélite' : hot.category === 'Biológica' ? 'Compatibilidade Biológica' : 'Perícia Balística'}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-600 italic leading-normal mt-1.5 font-sans font-medium">
                          Retorne à bancada do laboratório e submeta esse vestígio aos testes científicos para obter o laudo técnico completo.
                        </p>
                      )}

                      {/* Small visual connection point */}
                      {analyzed && (
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-pink-500 border border-slate-950" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* INTERACTIVE HUB RIGHT PANEL 8 cols (Suspect targets detailing matching logic) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6" id="board-suspects-interactive-hub">
            
            {/* Suspect card select tabs */}
            <div className="bg-slate-900/95 border border-slate-850 p-4 rounded-2xl relative" id="suspects-selectshadow-header">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                - SELECIONE O ALVO DA INVESTIGAÇÃO PARA ALINHAR O DOUTRINÁRIO -
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="board-suspects-grids">
                {currentCase.suspects.map(sus => {
                  const isSelected = selectedSuspectId === sus.id;
                  return (
                    <button
                      key={sus.id}
                      onClick={() => setSelectedSuspectId(sus.id)}
                      className={`relative p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-between gap-1.5 min-h-[120px] ${
                        isSelected 
                          ? 'bg-slate-950 border-pink-500 text-slate-100 shadow-[0_0_15px_rgba(236,72,153,0.18)] scale-102' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800'
                      }`}
                      id={`board-tab-sub-${sus.id}`}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition ${isSelected ? 'border-pink-500' : 'border-slate-800'}`}>
                          <img 
                            src={sus.avatar} 
                            alt={sus.name} 
                            className="w-full h-full object-cover filter brightness-[0.9]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {isSelected && (
                          <div className="absolute top-[-6px] right-[-6px] bg-pink-500 font-bold text-[8px] text-slate-950 px-1 py-0.5 rounded shadow">
                            ALVO
                          </div>
                        )}
                      </div>

                      <div className="w-full text-center">
                        <p className={`text-[10px] font-bold uppercase truncate ${isSelected ? 'text-pink-400' : 'text-slate-400'}`}>
                          {sus.name}
                        </p>
                        <p className="text-[8px] text-slate-500 uppercase truncate mt-0.5 leading-none">
                          {sus.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target diagnostic alignment comparing card */}
            {activeSuspect && (
              <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-6 relative flex-1 flex flex-col justify-between" id="board-profile-panel">
                
                {/* Immersive dossier red line thread decoration background to replicate physical board look */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,1),transparent_50%)]" />
                
                {/* Left/right side connection tape */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-repeating-linear bg-pink-500" 
                     style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ec4899, #ec4899 8px, #0f172a 8px, #0f172a 16px)' }} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-2" id="board-profile-layout">
                  
                  {/* Photo profile card */}
                  <div className="md:col-span-1 space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img 
                        src={activeSuspect.avatar} 
                        alt={activeSuspect.name} 
                        className="w-full h-48 object-cover filter brightness-[0.85] contrast-[1.15]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-2 text-center text-[9px] font-mono text-slate-400 border-t border-slate-900">
                        REGISTRO_FEDERAL: ID_{activeSuspect.id.toUpperCase()}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl space-y-1">
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-pink-500" />
                        <span>MOTIVAÇÃO DELITUOSA PROVÁVEL</span>
                      </p>
                      <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-medium">
                        {activeSuspect.motive}
                      </p>
                    </div>
                  </div>

                  {/* Comparatives gauges & evidence match indicators */}
                  <div className="md:col-span-2 space-y-5" id="board-profile-gauges">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider font-display">
                        <Fingerprint className="w-5 h-5 text-pink-500 animate-pulse" />
                        <span>Ficha Criminal Integrada // {activeSuspect.name}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 font-sans font-medium">
                        {activeSuspect.description}
                      </p>
                    </div>

                    {/* RED COINCIDENCE ALIGNMENTS */}
                    <div className="space-y-4 text-xs font-mono">
                      
                      {/* DNA */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400 font-bold uppercase">Marcas de DNA Comparadas (Genoma)</span>
                          <span className={`font-bold transition ${activeSuspect.dnaMatch > 75 ? 'text-pink-400' : 'text-slate-600'}`}>
                            {analyzedClues['hair_sample'] || analyzedClues['blood_splash'] || analyzedClues['saliva_glass'] || analyzedClues['glove_scrap'] || analyzedClues['gas_mask_hairs']
                              ? `COMPATIBILIDADE BIOLÓGICA: ${activeSuspect.dnaMatch}%` 
                              : 'Requer Laudo Técnico DNA'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded overflow-hidden border border-slate-800">
                          <div 
                            className="bg-cyan-500 h-full rounded transition-all duration-300"
                            style={{ width: `${analyzedClues['hair_sample'] || analyzedClues['blood_splash'] || analyzedClues['saliva_glass'] || analyzedClues['glove_scrap'] || analyzedClues['gas_mask_hairs'] ? activeSuspect.dnaMatch : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* DIGITAL MATCH KEYS */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400 font-bold uppercase">Dispositivos Inteligentes / Telecomunicadores</span>
                          <span className={`font-bold transition ${activeSuspect.digitalMatch > 75 ? 'text-pink-400' : 'text-slate-600'}`}>
                            {analyzedClues['usb_pendrive'] || analyzedClues['tablet_gps'] || analyzedClues['cellphone_water'] || analyzedClues['hdd_shattered'] || analyzedClues['senator_server']
                              ? `COMPATIBILIDADE TELECOM: ${activeSuspect.digitalMatch}%` 
                              : 'Requer Recuperação de Dados'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded overflow-hidden border border-slate-800">
                          <div 
                            className="bg-purple-500 h-full rounded transition-all duration-300"
                            style={{ width: `${analyzedClues['usb_pendrive'] || analyzedClues['tablet_gps'] || analyzedClues['cellphone_water'] || analyzedClues['hdd_shattered'] || analyzedClues['senator_server'] ? activeSuspect.digitalMatch : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* BALLISTIC MATCH GAUGE */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400 font-bold uppercase">Dinâmica Balística e Raiamento Estriado</span>
                          <span className={`font-bold transition ${activeSuspect.ballisticMatch > 75 ? 'text-pink-400' : 'text-slate-600'}`}>
                            {analyzedClues['bullet_case'] || analyzedClues['casing_38'] || analyzedClues['silencer_found'] || analyzedClues['bullet_9mm'] || analyzedClues['sterling_pistol']
                              ? `COMPATIBILIDADE BALÍSTICA: ${activeSuspect.ballisticMatch}%` 
                              : 'Requer Laudo Balístico'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded overflow-hidden border border-slate-800">
                          <div 
                            className="bg-amber-500 h-full rounded transition-all duration-300"
                            style={{ width: `${analyzedClues['bullet_case'] || analyzedClues['casing_38'] || analyzedClues['silencer_found'] || analyzedClues['bullet_9mm'] || analyzedClues['sterling_pistol'] ? activeSuspect.ballisticMatch : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Alibi score display */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]" id="board-alibi-notes">
                        <span className="text-slate-500 uppercase font-black">Investigação de Álibi / Depoimentos de Testemunha:</span>
                        <span className={`font-bold uppercase tracking-wider ${Math.abs(activeSuspect.alibiScore) > 50 ? 'text-emerald-400' : 'text-pink-500'}`}>
                          {Math.abs(activeSuspect.alibiScore) > 50 ? '● ÁLIBI CONFIRMADO EM AUDIÊNCIA' : '● EXTREMAMENTE SUSPEITO / ÁLIBI FORJADO'}
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Mandado de prisão accionable trigger button */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left bg-slate-950 border border-slate-900 rounded-xl p-4" id="board-compromise-panel">
                  <div className="flex items-start gap-2 max-w-md">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        Recomendação Divisional de Captura
                      </p>
                      <p className="text-[9px] text-slate-400 font-sans leading-relaxed">
                        Acuse o suspeito caso as evidências acima sustentem o match técnico de forma inequívoca. Emitir um mandato de prisão inadequado prejudica o índice de prestígio forense.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAccuseSuspect(activeSuspect)}
                    className="w-full sm:w-auto bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-slate-950 font-bold font-mono text-[10px] uppercase tracking-widest px-5 py-3.5 rounded-xl flex items-center gap-2 transition duration-200 cursor-pointer shadow-lg shadow-pink-600/10 hover:-translate-y-0.5 shrink-0"
                    id="accuse-btn"
                  >
                    <UserCheck className="w-4 h-4 text-slate-950" />
                    <span>EMITIR MANDADO DE PRISÃO</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
