import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, XCircle, Award, ArrowRight, RotateCcw, Coins, Star, ShieldAlert } from 'lucide-react';
import { Case, Suspect, CareerTier } from '../types';

interface AccusationResultProps {
  currentCase: Case;
  selectedSuspect: Suspect;
  isGuilty: boolean;
  onConfirmSuccess: (gainedXp: number, gainedCredits: number) => void;
  onRetry: () => void;
  currentTier: CareerTier;
}

export default function AccusationScreen({
  currentCase,
  selectedSuspect,
  isGuilty,
  onConfirmSuccess,
  onRetry,
  currentTier
}: AccusationResultProps) {
  
  const CAREER_TIERS: CareerTier[] = [
    'Estagiário',
    'Assistente Técnico',
    'Técnico Forense',
    'Perito Criminal',
    'Perito Sênior',
    'Supervisor',
    'Chefe de Divisão',
    'Diretor da Agência'
  ];
  
  const currentLevelIdx = CAREER_TIERS.indexOf(currentTier);
  const nextTier = currentLevelIdx < CAREER_TIERS.length - 1 ? CAREER_TIERS[currentLevelIdx + 1] : currentTier;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-mono flex flex-col items-center justify-center relative overflow-hidden" id="accusation-root">
      
      {/* IMMERSIVE TOP BACKGROUND PICTURE FOR SCREEN CONTINUITY */}
      <div className="absolute top-0 left-0 right-0 h-[320px] overflow-hidden pointer-events-none z-0 opacity-15 mix-blend-screen" id="accusation-top-decor">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Atmospheric CSI background" 
          className="w-full h-full object-cover object-top blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className={`absolute inset-0 opacity-10 pointer-events-none ${isGuilty ? 'bg-cyan-500' : 'bg-pink-500'} blur-3xl`} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-850 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10"
        style={{ borderColor: '#334155' }}
        id="accusation-box"
      >
        {/* Caution line themed header */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${isGuilty ? 'bg-cyan-500' : 'bg-pink-500'}`} />

        {isGuilty ? (
          /* SUCCESS VERDICT PANEL (REAL GUILTY CONDEMNATION) */
          <div className="space-y-6 text-center" id="accusation-success">
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cyan-950/40 border border-cyan-550/70 border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.25)] animate-pulse">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
                VEREDITO DIVISIONAL // ORDEM EMITIDA OK
              </p>
              <h1 className="text-xl font-display font-black tracking-widest uppercase mt-2 text-slate-100">
                PROVAS INCONTESTÁVEIS ACEITAS!
              </h1>
            </div>

            {/* Suspect detail profiling card */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4.5 flex items-center gap-4 text-left">
              <img 
                src={selectedSuspect.avatar} 
                alt={selectedSuspect.name} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-400 shrink-0 filter brightness-[0.9]"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-[8px] bg-cyan-950 border border-cyan-900/60 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  Custódia Policial Garantida
                </span>
                <h4 className="font-bold text-slate-100 text-sm truncate uppercase mt-1.5 leading-none">{selectedSuspect.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-1 font-sans font-medium">
                  {currentCase.conclusionNote}
                </p>
              </div>
            </div>

            {/* Field Earnings block */}
            <div className="bg-slate-950/45 border border-slate-800/80 rounded-xl p-4 grid grid-cols-2 gap-4 text-center" id="results-rewards">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                <div className="flex justify-center mb-1 text-cyan-400">
                  <Star className="w-4 h-4 fill-cyan-400/20 text-cyan-400" />
                </div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Prestígio Forense</p>
                <p className="text-md font-bold text-cyan-400 mt-1">+{currentCase.rewardXp} XP</p>
              </div>
              
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                <div className="flex justify-center mb-1 text-amber-500">
                  <Coins className="w-4 h-4" />
                </div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Precompensa Divisional</p>
                <p className="text-md font-bold text-amber-400 mt-1">+{currentCase.rewardCredits} C$</p>
              </div>
            </div>

            {/* Career promotion timeline preview indicator */}
            <div className="bg-cyan-950/20 border border-cyan-900/40 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase text-[9px] font-bold">Próxima Patente de Perfil:</span>
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">{nextTier}</span>
            </div>

            <button
              onClick={() => onConfirmSuccess(currentCase.rewardXp, currentCase.rewardCredits)}
              className="w-full bg-slate-950 hover:bg-cyan-950/40 text-cyan-400 border-2 border-cyan-555 border-cyan-500/40 hover:border-cyan-500 font-bold py-4 px-5 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg shadow-cyan-500/5 hover:-translate-y-0.5"
              id="confirm-success-btn"
            >
              <span>Reivindicar Credenciais Policiais</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        ) : (
          /* RETIAL/CHALLENGE FAIL DISPLAY (habeas corpus, false accusation) */
          <div className="space-y-6 text-center" id="accusation-failure">
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-950/40 border border-pink-500/60 rounded-full flex items-center justify-center text-pink-500 mb-4 shadow-[0_0_15px_rgba(236,72,153,0.25)] animate-pulse">
                <XCircle className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest leading-none">
                SINDICÂNCIA INTERNA // AÇÃO CANCELADA
              </p>
              <h1 className="text-xl font-display font-black tracking-widest uppercase mt-2 text-slate-100">
                PROVAS REJEITADAS NO TRIBUNAL
              </h1>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4.5 text-left space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-pink-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Insuficiência Técnico-Científica</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                Sua equipe emitiu uma ordem de prisão prematura contra <strong>{selectedSuspect.name}</strong> ({selectedSuspect.role}). O juiz corregedor alegou falta de amparo material.
              </p>
              <p className="text-xs text-slate-450 text-slate-400 leading-relaxed font-sans font-medium border-t border-slate-900 pt-2.5">
                Os matches biológicos (DNA) ou o alinhamento balístico estriado não atingiram o limiar divisional de exatidão científica exigido pela promotoria.
              </p>
            </div>

            <div className="bg-pink-950/20 border border-pink-900/30 p-3.5 rounded-xl text-[9px] font-mono text-pink-400 leading-normal text-left uppercase">
              ⚠ ALERTA DE PROCEDIMENTO: Erros de indiciamento custam prestígio civil. Retorne ao laboratório, ajuste as marcas de rotação/foco ou conclua os minijogos de DNA para garantir 100% de match.
            </div>

            <button
              onClick={onRetry}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-350 hover:text-pink-400 font-bold py-4 px-5 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5"
              id="retry-accusation-btn"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sanear Laudo (Voltar ao Mural)</span>
            </button>

          </div>
        )}

      </motion.div>
    </div>
  );
}
