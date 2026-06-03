import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  MapPin, 
  UserPlus, 
  Compass, 
  Award, 
  Play, 
  ArrowLeft, 
  BrainCircuit, 
  UserCheck, 
  TrendingUp, 
  Tv, 
  Activity,
  Heart,
  Sparkles,
  Info
} from 'lucide-react';
import { Case, UserProfile, Partner } from '../types';
import { SEASONS_DATA } from '../gameConfigData';

interface BriefingRoomProps {
  currentCase: Case;
  profile: UserProfile;
  onLaunchCase: (partnerId: string) => void;
  onCancel: () => void;
  onUpdatePartnerXp?: (partnerId: string, addedXp: number) => void;
}

export default function BriefingRoom({ currentCase, profile, onLaunchCase, onCancel }: BriefingRoomProps) {
  const partners: Partner[] = profile.partners || [];
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    profile.activePartnerId || (partners.length > 0 ? partners[0].id : '')
  );

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);
  const currentSeason = SEASONS_DATA.find(s => s.caseIds.includes(currentCase.id)) || SEASONS_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-100 p-3 md:p-6 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-550 selection:text-slate-950" id="briefing-root">
      
      {/* IMMERSIVE TOP PICTURE DECORATION */}
      <div className="absolute top-0 left-0 right-0 h-[380px] overflow-hidden pointer-events-none z-0 opacity-30 mix-blend-screen" id="briefing-top-decor">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Precinct Briefing Operations Background" 
          className="w-full h-full object-cover object-top blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow" id="briefing-content-envelope">
        
        {/* HEADER STATS BLOCK */}
        <header className="flex items-center justify-between border-b border-slate-900 pb-5 mb-6" id="briefing-back-heading">
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/45 rounded-xl text-xs font-bold transition cursor-pointer"
              id="briefing-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Mural</span>
            </button>
            <div>
              <span className="text-[8px] bg-cyan-950/60 border border-cyan-800 text-cyan-400 px-1.5 py-0.5 rounded font-black font-semibold tracking-wider uppercase inline-block">
                Briefing de Inquérito
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/40 px-3.5 py-1.5 rounded-full animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            <span>Transmissão Divisional Estabelecida</span>
          </div>
        </header>

        {/* WORK SPLIT GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* CRIME BRIEFING BLOCK (Left columns, width 3 cols) */}
          <div className="lg:col-span-3 flex flex-col bg-slate-900/90 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl relative" style={{ borderColor: '#334155' }} id="briefing-left-panel">
            
            {/* Caution Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-repeating-linear bg-pink-500" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ec4899, #ec4899 6px, #0f172a 6px, #0f172a 12px)' }} />

            <div className="relative h-64 md:h-72 bg-slate-950 flex flex-col justify-end p-6">
              <img 
                src={currentCase.sceneImage} 
                alt={currentCase.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-[0.75] contrast-[1.2]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              
              <div className="relative space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono bg-pink-950 text-pink-400 border border-pink-900/40 px-2.5 py-0.5 rounded-md uppercase font-bold tracking-wider">
                    {currentSeason.title.split(':')[0]}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md text-slate-100 uppercase tracking-widest ${
                    currentCase.difficulty === 'Fácil' ? 'bg-emerald-950/80 border border-emerald-800/60' :
                    currentCase.difficulty === 'Médio' ? 'bg-cyan-950/80 border border-cyan-805' :
                    'bg-amber-950/80 border border-amber-900/60'
                  }`}>
                    Perigo: {currentCase.difficulty}
                  </span>
                </div>
                
                <h1 className="text-xl md:text-3xl font-display font-black tracking-widest text-slate-100 uppercase leading-snug">
                  {currentCase.title}
                </h1>
                
                <p className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1.5 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-cyan-455 text-cyan-500" />
                  <span>Miami Police Department • Central Forense</span>
                </p>
              </div>
            </div>

            {/* Synopsis texts */}
            <div className="p-6 flex-1 space-y-6 bg-slate-950/40 font-family-mono">
              
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Sinopse Institucional do Ocorrido</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                  {currentCase.description}
                </p>
              </div>

              {/* Direct Tactical Instructions */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4.5 space-y-2.5 relative">
                <div className="absolute top-3.5 right-4 flex items-center gap-1.5 text-[8px] font-mono text-slate-500">
                  <Tv className="w-3.5 h-3.5 text-pink-500 fill-pink-500/10" />
                  <span>CANAL SECURE_BRIEF_A</span>
                </div>
                <h4 className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Diretrizes Táticas de Coleta de Evidências</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                  {currentCase.storyline}
                </p>
              </div>

              {/* Season descriptor row */}
              <div className="border border-slate-900 bg-slate-950/80 p-3.5 rounded-xl flex items-center gap-3.5" id="season-connection-brief">
                <div className="p-2 bg-pink-950/20 border border-pink-900/30 rounded text-pink-500 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Linha Operacional Conectada</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 uppercase">{currentSeason.title}</p>
                  <p className="text-[9px] text-pink-400 font-bold mt-0.5 uppercase tracking-wide">{currentSeason.rewardBonus}</p>
                </div>
              </div>

            </div>

          </div>

          {/* SQUAD MATE CHOICER (Right, width 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-between" id="briefing-right-panel">
            
            {/* Squad partners choicers */}
            <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-xl" style={{ borderColor: '#334155' }}>
              <div className="flex items-center justify-between border-b border-slate-805 border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    ALOCAR COMPANHEIRO DE CAMPO
                  </h3>
                </div>
                <span className="text-[8px] font-mono text-slate-500 font-bold">DESPACHO</span>
              </div>

              <p className="text-[11px] text-slate-450 text-slate-400 leading-relaxed font-sans font-medium">
                Selecione o perito suporte que irá assinar o laudo com você. Seus bônus forenses aplicam-se a todas as análises realizadas no laboratório.
              </p>

              {/* Choose roster list */}
              <div className="space-y-3" id="briefing-partners-roster">
                {partners.map((partner) => {
                  const isSelected = selectedPartnerId === partner.id;
                  return (
                    <button
                      key={partner.id}
                      type="button"
                      onClick={() => setSelectedPartnerId(partner.id)}
                      className={`w-full flex items-start gap-3.5 p-3 rounded-xl border text-left transition relative overflow-hidden cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-950 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.12)]' 
                          : 'bg-slate-950/30 border-slate-900 hover:border-slate-800'
                      }`}
                      id={`briefing-partner-card-${partner.id}`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400" />
                      )}

                      <img 
                        src={partner.avatar} 
                        alt={partner.name} 
                        className={`w-11 h-11 rounded-full object-cover shrink-0 border ${isSelected ? 'border-cyan-400' : 'border-slate-800'}`}
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-200 truncate uppercase">{partner.name}</p>
                          <span className="text-[9px] text-cyan-400 font-bold uppercase shrink-0">LV {partner.level}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase mt-0.5">{partner.role}</p>
                        
                        {/* Bonus description label */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[8px] bg-pink-950/20 text-pink-400 border border-pink-900/30 px-1.5 py-0.5 rounded uppercase font-bold">
                            {partner.specialization}
                          </span>
                          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wide">
                            {partner.bonusText}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deep bio and abilities of the selected mate if active */}
            {selectedPartner && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedPartner.id}
                className="bg-slate-900/90 border border-slate-850 rounded-2xl p-5 space-y-4 flex-1 flex flex-col justify-between"
                style={{ borderColor: '#334155' }}
                id="selected-partner-details"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <BrainCircuit className="w-4 h-4 text-pink-400" />
                    <span>REGISTROS E ARQUIVO DO AGENTE SUPORTE</span>
                  </div>

                  <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">
                    "{selectedPartner.bio}"
                  </p>
                </div>

                {/* Abilities list */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[8px] font-bold uppercase">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Habilidades Forenses Homologadas:</span>
                  </div>
                  
                  <div className="space-y-1.5 font-mono text-[10px]" id="partner-skills-list">
                    {selectedPartner.unlockedSkills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                        <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate uppercase font-bold">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Direct confirm dispatch button triggers case */}
            <div className="pt-2">
              <button
                onClick={() => onLaunchCase(selectedPartnerId)}
                className="w-full bg-slate-950 hover:bg-cyan-950/50 text-cyan-400 hover:text-cyan-300 border-2 border-cyan-500/40 active:border-cyan-500 font-bold py-4 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-cyan-455/5"
                id="confirm-dispatch-btn"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span>INICIALIZAR DESPACHO POLICIAL</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
