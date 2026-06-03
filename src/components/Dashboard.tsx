import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Trophy, 
  Coins, 
  Compass, 
  LogOut, 
  ArrowRight, 
  Building, 
  Users, 
  Briefcase, 
  TrendingUp, 
  UserCheck, 
  Network,
  Activity,
  Radio,
  Clock,
  Skull,
  AlertTriangle,
  Monitor,
  Eye,
  FileText
} from 'lucide-react';
import { UserProfile, Case, LeaderboardEntry, Partner, CareerTier } from '../types';
import { DEFAULT_AGENCIES, SEASONS_DATA } from '../gameConfigData';

interface DashboardProps {
  profile: UserProfile;
  cases: Case[];
  completedCases: string[];
  onSelectCase: (caseId: string) => void;
  onLogout: () => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Perito Horatio C.', tier: 'Diretor da Agência', specialization: 'Criminal Geral', casesResolved: 142, level: 50, xp: 9999 },
  { name: 'Dra. Gil Grissom', tier: 'Diretor da Agência', specialization: 'DNA', casesResolved: 139, level: 49, xp: 9540 },
  { name: 'Mac Taylor', tier: 'Chefe de Divisão', specialization: 'Balístico', casesResolved: 110, level: 42, xp: 8120 },
  { name: 'Carly Vance', tier: 'Perito Sênior', specialization: 'Digital', casesResolved: 82, level: 31, xp: 5800 },
  { name: 'Ryan Wolfe', tier: 'Supervisor', specialization: 'Balístico', casesResolved: 74, level: 28, xp: 5100 },
];

const CAREER_TIERS_ROUTEMAP: { tier: CareerTier; levelReq: number; code: string }[] = [
  { tier: 'Estagiário', levelReq: 1, code: 'G-10' },
  { tier: 'Assistente Técnico', levelReq: 3, code: 'G-20' },
  { tier: 'Técnico Forense', levelReq: 5, code: 'G-30' },
  { tier: 'Perito Criminal', levelReq: 7, code: 'F-10' },
  { tier: 'Perito Sênior', levelReq: 10, code: 'F-20' },
  { tier: 'Supervisor', levelReq: 13, code: 'S-10' },
  { tier: 'Chefe de Divisão', levelReq: 16, code: 'D-10' },
  { tier: 'Diretor da Agência', levelReq: 20, code: 'EX' },
];

// Immersive Police Dispatch Scanner quotes that cycle automatically
const MOCK_RADIO_DISPATCHES = [
  '🚨 [HOMICÍDIO ATIVO] Galpão 4, Zona Industrial. Suspeito fugiu a pé. Viatura 402 no encalço.',
  '⚠️ [LAB] Correspondência balística concluída em disparo na Avenida Ocean Drive.',
  '📡 [RECONHECIMENTO FACIAL] Câmera de Vigilância Privada flagrou imagem parcial de suspeito no Porto.',
  '🚨 [CRIME SCENE #02] DNA coletado em vestígios sob unhas da vítima encaminhado para Triagem.',
  '⚡ [ALERTA GERAL] Divisão Federal reporta atividade ligada ao Sindicato de Tráfico Digital.',
  '🚔 [VIATURAS EM CAMPO] Perímetro do Bairro Portuário isolado com fita amarela.'
];

export default function Dashboard({ 
  profile, 
  cases, 
  completedCases, 
  onSelectCase, 
  onLogout,
  onSaveProfile 
}: DashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'CASOS' | 'CENTRAL'>('CASOS');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  // Immersive changing radio chatter
  const [radioText, setRadioText] = useState(MOCK_RADIO_DISPATCHES[0]);
  const [radioIndex, setRadioIndex] = useState(0);

  // Time stamp updated to look operational
  const [currentTime, setCurrentTime] = useState('12:45:30');

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);

    const radioInterval = setInterval(() => {
      setRadioIndex((prev) => {
        const next = (prev + 1) % MOCK_RADIO_DISPATCHES.length;
        setRadioText(MOCK_RADIO_DISPATCHES[next]);
        return next;
      });
    }, 6050);

    return () => {
      clearInterval(timeInterval);
      clearInterval(radioInterval);
    };
  }, []);

  const partners: Partner[] = profile.partners && profile.partners.length > 0 ? profile.partners : [];
  const currentAgencyId = profile.activeAgencyId || 'agency-miami';

  const userRankEntry: LeaderboardEntry = {
    name: `${profile.name} (Você)`,
    tier: profile.tier,
    specialization: profile.specialization,
    casesResolved: profile.casesResolved,
    level: profile.level,
    xp: profile.xp,
    isCurrentUser: true,
  };

  const fullLeaderboard = [...MOCK_LEADERBOARD, userRankEntry].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.xp - a.xp;
  });

  const xpThreshold = profile.level * 400;
  const xpPercentage = Math.min((profile.xp / xpThreshold) * 100, 100);

  const showFeedback = (text: string) => {
    setFeedbackMsg(text);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const handleSelectAgency = (agencyId: string) => {
    const updatedProfile = {
      ...profile,
      activeAgencyId: agencyId
    };
    onSaveProfile(updatedProfile);
    const agName = agencyId === 'agency-miami' ? 'Agência Miami' : agencyId === 'agency-ny' ? 'Agência Nova York' : 'FBI Federal';
    showFeedback(`Agência Ativa alterada para: ${agName}. Bônus aplicados.`);
  };

  const handleUnlockAgency = (agency: typeof DEFAULT_AGENCIES[0]) => {
    if (profile.credits < agency.requiredCredits) {
      showFeedback(`Créditos Forenses insuficientes! Requer C$ ${agency.requiredCredits}.`);
      return;
    }

    const updatedProfile = {
      ...profile,
      credits: profile.credits - agency.requiredCredits,
      activeAgencyId: agency.id
    };
    onSaveProfile(updatedProfile);
    showFeedback(`Agência ${agency.name} desbloqueada e definida como Ativa!`);
  };

  const handleSetActivePartner = (partnerId: string) => {
    const updatedProfile = {
      ...profile,
      activePartnerId: partnerId
    };
    onSaveProfile(updatedProfile);
    const pName = partners.find(p => p.id === partnerId)?.name || 'Sarah';
    showFeedback(`Parceiro ativo redefinido para: ${pName}`);
  };

  const handleTrainPartner = (partnerId: string) => {
    const COST = 45;
    const XP_GAIN = 30;

    if (profile.credits < COST) {
      showFeedback(`Créditos insuficientes para treinamento! Requer C$ ${COST}.`);
      return;
    }

    let updatedPartners = [...partners];
    const partnerIdx = updatedPartners.findIndex(p => p.id === partnerId);
    if (partnerIdx === -1) return;

    let partner = { ...updatedPartners[partnerIdx] };
    partner.xp += XP_GAIN;
    let leveledUp = false;

    while (partner.xp >= partner.nextLevelXp) {
      partner.xp -= partner.nextLevelXp;
      partner.level += 1;
      partner.nextLevelXp = Math.round(partner.nextLevelXp * 1.5);
      leveledUp = true;
      
      if (partner.level === 2) {
        partner.unlockedSkills.push(partner.id === 'p-sarah' ? 'Análise Ultraveloz (Nível 2)' : partner.id === 'p-hunter' ? 'Pressão Psicológica (Nível 2)' : 'Raiamento Fino (Nível 2)');
        partner.bonusText = partner.id === 'p-sarah' ? '+15% de acerto em DNA' : partner.id === 'p-hunter' ? '+15% Eficácia na verificação de Álibis' : '+15% em Perícia Balística';
        if (partner.id === 'p-sarah') partner.bonusMultiplier.dna = 0.15;
        if (partner.id === 'p-hunter') partner.bonusMultiplier.interrogation = 0.15;
        if (partner.id === 'p-vega') partner.bonusMultiplier.ballistic = 0.15;
      } else if (partner.level >= 3) {
        partner.unlockedSkills.push(partner.id === 'p-sarah' ? 'Mapeador Genômico 3D (Nível 3)' : partner.id === 'p-hunter' ? 'Detector de Falsidade (Nível 3)' : 'Trajetória Holográfica (Nível 3)');
        partner.bonusText = partner.id === 'p-sarah' ? '+20% de acerto em DNA' : partner.id === 'p-hunter' ? '+20% Eficácia na verificação de Álibis' : '+20% em Perícia Balística';
        if (partner.id === 'p-sarah') partner.bonusMultiplier.dna = 0.20;
        if (partner.id === 'p-hunter') partner.bonusMultiplier.interrogation = 0.20;
        if (partner.id === 'p-vega') partner.bonusMultiplier.ballistic = 0.20;
      }
    }

    updatedPartners[partnerIdx] = partner;

    const updatedProfile = {
      ...profile,
      credits: profile.credits - COST,
      partners: updatedPartners
    };

    onSaveProfile(updatedProfile);
    showFeedback(
      leveledUp 
        ? `SENSACIONAL! ${partner.name} atingiu o NÍVEL ${partner.level}! Nova habilidade liberada!` 
        : `Treinamento realizado! +${XP_GAIN} XP concedido a ${partner.name.split(' ')[0]}.`
    );
  };

  const activePartner = partners.find(p => p.id === (profile.activePartnerId || 'p-sarah')) || partners[0];
  const activeAgency = DEFAULT_AGENCIES.find(a => a.id === currentAgencyId) || DEFAULT_AGENCIES[0];

  const getCaseOperationalStatus = (csId: string, isUnlocked: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return {
        label: 'RESOLVIDO',
        colorClass: 'bg-emerald-950/80 border-emerald-555 border-emerald-500/30 text-emerald-400',
        dotColor: 'bg-emerald-400',
        badge: '🟢 RESOLVIDO',
        extraStats: (
          <div className="mt-2.5 pt-2.5 border-t border-slate-900 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-400">
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Resultado</span>
              <span className="font-bold text-emerald-400 truncate block">Culpado Identificado</span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Taxa de Certeza</span>
              <span className="font-bold text-slate-200 block">{profile.accuracyRate || 98}% Taxa</span>
            </div>
          </div>
        )
      };
    }
    
    if (!isUnlocked) {
      return {
        label: 'CUSTÓDIA BLOQUEADA',
        colorClass: 'bg-slate-950/40 border-slate-900/60 text-slate-500',
        dotColor: 'bg-slate-700',
        badge: '⚫ ARQUIVADO / BLOQUEADO',
        extraStats: (
          <div className="mt-2.5 pt-2.5 border-t border-slate-900 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            🔒 Protocolos pendentes ou credencial insuficiente.
          </div>
        )
      };
    }

    if (csId === '001') {
      return {
        label: 'EQUIPE NO LOCAL',
        colorClass: 'bg-blue-950/80 border-blue-500/30 text-blue-400',
        dotColor: 'bg-blue-400',
        badge: '🔵 EQUIPE NO LOCAL',
        extraStats: (
          <div className="mt-2.5 pt-2.5 border-t border-slate-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-400">
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Coleta de Pistas</span>
              <span className="font-bold text-slate-200 block">7 / 15 Evidências</span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Progresso Real</span>
              <span className="font-bold text-blue-400 block">45% Concluído</span>
            </div>
          </div>
        )
      };
    }

    if (csId === '002') {
      return {
        label: 'INVESTIGANDO',
        colorClass: 'bg-amber-950/80 border-amber-500/30 text-amber-400',
        dotColor: 'bg-amber-400',
        badge: '🟠 INVESTIGANDO',
        extraStats: (
          <div className="mt-2.5 pt-2.5 border-t border-slate-900 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-400">
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Responsável Base</span>
              <span className="font-bold text-slate-200 block truncate">{profile.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Atualização Recente</span>
              <span className="font-bold text-amber-400 block">Há 2 horas</span>
            </div>
          </div>
        )
      };
    }

    if (csId === '003') {
      return {
        label: 'ANÁLISE FORENSE',
        colorClass: 'bg-purple-950/80 border-purple-500/30 text-purple-400',
        dotColor: 'bg-purple-400',
        badge: '🟣 ANÁLISE FORENSE',
        extraStats: (
          <div className="mt-2.5 pt-2.5 border-t border-slate-900 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-400">
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Laboratório</span>
              <span className="font-bold text-purple-400 block">Análise DNA Biológica</span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] tracking-wider block">Situação Atual</span>
              <span className="font-bold text-slate-300 block">Triagem de Material</span>
            </div>
          </div>
        )
      };
    }

    return {
      label: 'INVESTIGANDO',
      colorClass: 'bg-amber-950/80 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400',
      badge: '🟠 INVESTIGANDO',
      extraStats: (
        <div className="mt-2.5 pt-2.5 border-t border-slate-900 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-400">
          <div>
            <span className="text-slate-500 text-[8px] tracking-wider block">Encarregado</span>
            <span className="font-bold text-slate-200 block truncate">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[8px] tracking-wider block">Atualização Recente</span>
            <span className="font-bold text-amber-400 block">Aguardando Coleta</span>
          </div>
        </div>
      )
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-slate-100 p-3 md:p-6 relative overflow-x-hidden" id="dashboard-root">
      
      {/* IMMERSIVE TOP PICTURE - GLIDES BEHIND LOGO */}
      <div className="absolute top-0 left-0 right-0 h-[380px] overflow-hidden pointer-events-none z-0 opacity-40 mix-blend-lighten" id="dashboard-decor-top">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="Precinct Operations" 
          className="w-full h-full object-cover object-top filter saturate-[0.8] blur-[2px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Dynamic Siren Lights blinking back-reflections */}
      <div className="absolute top-4 left-1/3 w-64 h-24 bg-red-600/5 rounded-full blur-[70px] animate-pulse duration-1000" />
      <div className="absolute top-8 right-1/4 w-64 h-24 bg-blue-600/5 rounded-full blur-[70px] animate-pulse duration-[1800ms]" />

      <AnimatePresence>
        {feedbackMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg bg-slate-950 border-2 border-red-500 text-red-200 rounded-lg p-3 shadow-[0_0_25px_rgba(239,68,68,0.2)] font-mono text-xs flex items-center gap-3"
            id="dashboard-feedback-toast"
          >
            <Activity className="w-5 h-5 text-red-400 shrink-0 animate-ping" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10" id="main-terminal-frame">
        
        {/* Back navigation button to login screen */}
        <div className="flex justify-start mb-4" id="back-to-welcome-btn-holder">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-cyan-400 hover:text-cyan-350 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition duration-200 cursor-pointer shadow-md"
            id="back-to-welcome-btn"
          >
            <span>&larr; Voltar para Tela Inicial</span>
          </button>
        </div>
        
        {/* TOP TERMINAL META STATS & COMMUNICATIONS */}
        <header className="flex flex-col lg:flex-row items-stretch justify-between gap-4 border-b border-slate-800 pb-5 mb-6" id="ops-station-header">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 border-2 border-slate-700 rounded-xl relative shadow-[0_0_15px_rgba(15,23,42,0.6)]">
              <Shield className="w-9 h-9 text-cyan-400 stroke-[1.5]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-slate-100 uppercase">
                  CENTRAL DE EXPEDIÇÃO <span className="text-cyan-400 font-mono">CSI</span>
                </h1>
                <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-800/60 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest animate-pulse">
                  ESTADO: PLANTÃO ATIVO
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                SISTEMA OPERACIONAL INTEGRADOR • ESTAÇÃO: {profile.id.toUpperCase()} • AGENTE ATIVO: {profile.name.toUpperCase()}
              </p>
            </div>
          </div>

          {/* POLICE RADIO CHATTER LIVE CHANNEL TAPE - SUPER IMMERSIVE */}
          <div className="flex-1 max-w-xl bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-inner relative overflow-hidden" id="police-radio-ticker">
            <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 bg-red-950 border border-red-800/40 text-red-400 text-[10px] font-mono rounded font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>FREQUÊNCIA DE RÁDIO L-18</span>
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-300 font-mono leading-none truncate">
                {radioText}
              </p>
              <p className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">
                Atualizando canais de satélite...
              </p>
            </div>

            {/* Simulated UTC Forensics Clock */}
            <div className="text-right text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0 px-2 border-l border-slate-900 bg-slate-900/40 py-1 rounded">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime} UTC</span>
            </div>
          </div>

          {/* Nav buttons styled like mission panels */}
          <div className="flex items-center bg-slate-900/90 p-1 border border-slate-800 rounded-xl shrink-0" id="ops-nav-tabs">
            <button
              onClick={() => setActiveTab('CASOS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer relative ${
                activeTab === 'CASOS'
                  ? 'bg-cyan-950/40 border border-cyan-400 text-cyan-300 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/20'
              }`}
              id="tab-btn-cases"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>MURAL DE POLÍCIA</span>
            </button>
            
            <button
              onClick={() => setActiveTab('CENTRAL')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer relative ${
                activeTab === 'CENTRAL'
                  ? 'bg-cyan-950/40 border border-cyan-400 text-cyan-300 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/20'
              }`}
              id="tab-btn-ops"
            >
              <Building className="w-4 h-4 text-pink-400" />
              <span>CENTRAL OPERACIONAL</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
          </div>

        </header>

        {/* WORK PRECINCT CENTRAL SPLIT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="dashboard-layout">
          
          {/* PRECINCT SIDEBAR: Profile intelligence center */}
          <div className="lg:col-span-1 space-y-6" id="profile-sidebar">
            
            {/* Dossier Card with yellow danger stripes */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" 
                   style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 8px, #0f172a 8px, #0f172a 16px)' }} />

              <div className="flex items-center gap-4 mt-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-950/20">
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover filter brightness-[0.95]" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-slate-900">
                    {profile.level}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 inline-block truncate uppercase">
                    ID_PERITO: {profile.id.substring(0, 7)}
                  </p>
                  <h2 className="font-display font-black text-slate-100 truncate text-md uppercase mt-1">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-pink-400 uppercase tracking-widest font-bold">
                    <Award className="w-3 h-3" />
                    <span>{profile.tier}</span>
                  </div>
                </div>
              </div>

              {/* Specialization detail */}
              <div className="mt-4 p-2 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-[10px]">
                <span className="text-slate-500 uppercase">Especialidade</span>
                <span className="text-cyan-400 font-bold uppercase">{profile.specialization}</span>
              </div>

              {/* Progress experience stats */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-400 uppercase">Progresso de Carreira</span>
                  <span className="text-cyan-400 font-mono">{profile.xp} / {xpThreshold} XP</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded overflow-hidden border border-slate-800">
                  <div 
                    className="bg-cyan-500 h-full rounded transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>

              {/* Forensic credits */}
              <div className="mt-4 flex items-center justify-between bg-slate-950/80 border border-slate-900 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Verba de Pesquisa</span>
                </div>
                <span className="text-xs font-bold text-amber-400 font-black">
                  C$ {profile.credits}
                </span>
              </div>

              {/* Quick Logout command */}
              <button
                onClick={onLogout}
                className="w-full mt-4 py-2 bg-slate-950 hover:bg-rose-950/20 hover:border-rose-900 border border-slate-900 hover:text-rose-400 text-slate-500 text-[9px] uppercase tracking-wider rounded-lg transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                id="precinct-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Retirar Credenciais</span>
              </button>
            </div>

            {/* Dossier Field Squad dispatched in team */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xl">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>DESPACHO DE CAMPO</span>
              </h3>
              
              {/* Active Partner row */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-900 p-2.5 rounded-xl">
                <img src={activePartner?.avatar} alt={activePartner?.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-cyan-500/30" referrerPolicy="no-referrer" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] text-slate-500 uppercase">Companheiro Selecionado</p>
                  <p className="text-xs font-bold text-slate-200 truncate uppercase">{activePartner?.name}</p>
                  <span className="text-[9px] text-cyan-400 font-semibold block truncate leading-tight">{activePartner?.bonusText}</span>
                </div>
              </div>

              {/* Active Station Headquarters */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-900 p-2.5 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-pink-955/20 border border-pink-900/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Building className="w-4 h-4 text-pink-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] text-slate-500 uppercase">Estação Base</p>
                  <p className="text-[11px] font-bold text-slate-205 truncate uppercase">{activeAgency?.name.split(' (')[0]}</p>
                  <span className="text-[9px] text-pink-400 truncate font-bold leading-tight block">{activeAgency?.bonusText}</span>
                </div>
              </div>
            </div>

            {/* Surveillance Feed Widget placeholder - EXTREMELY IMMERSIVE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xl relative overflow-hidden" id="precinct-surv-feed">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-cyan-500" />
                  <span>FEED CÂMERA DE RUA #42</span>
                </span>
                <span className="text-[8px] text-red-500 font-bold uppercase animate-ping">
                  REC
                </span>
              </div>
              <div className="relative aspect-video bg-slate-950 rounded border border-slate-900 flex flex-col justify-between p-2 pointer-events-none select-none">
                {/* Horizontal scanner bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500/20 shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-bounce" />
                
                <div className="text-[8px] text-slate-500 flex justify-between">
                  <span>LAT: 25.7617 N</span>
                  <span>LNG: 80.1918 W</span>
                </div>

                <div className="text-center">
                  <Skull className="w-6 h-6 text-slate-805 text-slate-700/50 mx-auto" />
                  <p className="text-[7px] text-slate-600 mt-1 uppercase">Sinal Criptografado</p>
                </div>

                <div className="text-[7px] text-slate-500 text-right">
                  Miami Harbor - Marina Dock
                </div>
              </div>
            </div>

            {/* General crime statistics summary card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>EFICIÊNCIA EM MISSÕES</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                  <p className="text-[8px] text-slate-500 uppercase">Casos Concluídos</p>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5">{profile.casesResolved}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                  <p className="text-[8px] text-slate-500 uppercase">Laudos Perfeitos</p>
                  <p className="text-lg font-bold text-pink-400 mt-0.5">{profile.perfectResolutions}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-400 uppercase">Precisão Operacional</span>
                  <span className="text-emerald-400">{profile.accuracyRate}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded" 
                    style={{ width: `${profile.accuracyRate}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* MAIN COLUMN AREA (DYNAMIC TABS) */}
          <div className="lg:col-span-3 space-y-6" id="dashboard-main-panel">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: AVAILABLE CRIME BOARD (Ocorrências e Mural de Casos) */}
              {activeTab === 'CASOS' && (
                <motion.div
                  key="cases-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  
                  {/* SEÇÃO ESPECIAL: ALERTA AGORA (Ocorrência Recém-Recebida) */}
                  <div className="bg-slate-900/90 border-2 border-red-500 rounded-2xl p-5 relative overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.15)] backdrop-blur animate-pulse" id="alerta-agora-broadcast">
                    
                    {/* Pulsing hazard stripe on the left side */}
                    <div className="absolute top-0 bottom-0 left-0 w-2.5" 
                         style={{ backgroundImage: 'repeating-linear-gradient(0deg, #ef4444, #ef4444 10px, #0f172a 10px, #0f172a 20px)' }} />
                    
                    <div className="pl-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/20 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-duration-1000"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <span className="text-xs font-black text-red-500 uppercase tracking-widest font-mono">
                            🔴 ALERTA AGORA // NOVA OCORRÊNCIA DETECTADA
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-red-400 uppercase tracking-widest font-mono">
                          EQUIPE NECESSÁRIA
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left font-mono">
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase font-black">Caso ID</p>
                          <p className="text-xs font-black text-slate-205 text-slate-200 mt-0.5">CASO #2487 (COD-001)</p>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase font-black">Localização</p>
                          <p className="text-xs font-black text-slate-202 text-slate-200 mt-0.5">Distrito Industrial</p>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase font-black">Horário Captura</p>
                          <p className="text-xs font-black text-slate-202 text-slate-200 mt-0.5">23:47 LOCAL</p>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <p className="text-[10px] text-slate-500 uppercase font-black">Prioridade Operação</p>
                          <p className="text-xs font-black text-red-400 mt-0.5 tracking-wider uppercase">ALTA</p>
                        </div>
                      </div>

                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 md:flex md:items-center md:justify-between md:gap-5">
                        <div className="space-y-1.5 flex-1">
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">DESCRIÇÃO DA OCORRÊNCIA</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                            Um vigilante relatou atividade suspeita em um laboratório químico abandonado. Uma equipe forense foi solicitada estruturalmente.
                          </p>
                        </div>
                        
                        <div className="shrink-0 mt-3 md:mt-0">
                          {completedCases.includes('001') ? (
                            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Missão Concluída</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onSelectCase('001')}
                              className="w-full md:w-auto bg-red-650 hover:bg-red-500 bg-red-600 text-slate-950 hover:scale-102 font-black py-2.5 px-5 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-md shadow-red-500/10"
                            >
                              <Activity className="w-3.5 h-3.5" />
                              <span>Aceitar Missão</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE DISPATCH MAP BOARD */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6" id="mural-casos-panel">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                          <Flame className="w-5 h-5 text-pink-500 animate-pulse" />
                          <span>TEMPORADA #1: CONEXÃO CYBER-SINDICATO (MIAMI-NY)</span>
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Fita de isolamento amarela ativa. Selecione um caso para obter o briefing e iniciar a coleta de pistas.
                        </p>
                      </div>
                      <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 px-3 py-1 rounded font-bold uppercase shrink-0">
                        Investigações Resolvidas: {completedCases.length} de {cases.length}
                      </span>
                    </div>

                    {/* CASES DECK GRID (Immersive layouts) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="cases-grid">
                      {cases.map((cs, index) => {
                        const isCompleted = completedCases.includes(cs.id);
                        const isUnlocked = index === 0 || completedCases.includes(cases[index - 1].id);
                        const opStatus = getCaseOperationalStatus(cs.id, isUnlocked, isCompleted);

                        return (
                          <div
                            key={cs.id}
                            className={`group relative flex flex-col justify-between bg-slate-950 rounded-xl overflow-hidden border transition-all duration-300 ${
                              isUnlocked 
                                ? isCompleted 
                                  ? 'border-emerald-500/40 shadow-[0_4px_15px_rgba(16,185,129,0.06)]'
                                  : 'border-slate-800 hover:border-cyan-500/50 shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                                : 'border-slate-950 opacity-40'
                            }`}
                            id={`case-card-${cs.id}`}
                          >
                            {/* Operational Status Header Banner */}
                            <div className={`px-4 py-2 border-b text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 ${opStatus.colorClass}`}>
                              <span className={`w-2 h-2 rounded-full ${opStatus.dotColor} ${!isCompleted && isUnlocked && 'animate-ping'}`} />
                              <span>{opStatus.badge}</span>
                            </div>

                            {/* Cinematic Case Image */}
                            <div className="relative h-44 overflow-hidden bg-slate-900">
                              <img 
                                src={cs.sceneImage} 
                                alt={cs.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                              
                              {/* Caution Stripe on locked or complete status */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-repeating bg-amber-400 opacity-60" 
                                   style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 4px, transparent 4px, transparent 8px)' }} />

                              {/* Difficulty indicator top left */}
                              <span className={`absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                cs.difficulty === 'Fácil' ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/50' :
                                cs.difficulty === 'Médio' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-800/50' :
                                cs.difficulty === 'Difícil' ? 'bg-amber-950/90 text-amber-400 border border-amber-805/50' :
                                'bg-rose-950/90 text-rose-400 border border-rose-800/50 animate-pulse'
                              }`}>
                                PERIGO: {cs.difficulty}
                              </span>

                              {/* Unlocked / Sealed caution stamp */}
                              {isCompleted && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-lg shadow-lg">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>RESOLVIDO // FECHADO</span>
                                </div>
                              )}
                            </div>

                            {/* Info particulars */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-[8px] text-cyan-450 text-cyan-400 font-mono font-bold uppercase tracking-widest block mb-1">
                                  CASO DE REGISTRO CSI-{cs.id}
                                </p>
                                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition select-none uppercase">
                                  {cs.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed mt-2 line-clamp-3 font-sans font-medium">
                                  {cs.description}
                                </p>

                                {/* Dynamic CSI Operation Stats */}
                                {opStatus.extraStats}
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-950 flex items-center justify-between">
                                {/* Rewards badge */}
                                <div className="flex gap-3 text-[10px] font-mono font-bold">
                                  <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-1.5 py-0.5 rounded">+{cs.rewardXp} XP</span>
                                  <span className="text-amber-400 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded">+{cs.rewardCredits} C$</span>
                                </div>

                                {/* Main actionable */}
                                {isUnlocked ? (
                                  <button
                                    onClick={() => onSelectCase(cs.id)}
                                    className={`flex items-center gap-1 text-[10px] font-bold px-3 py-2 rounded-lg transition-all cursor-pointer uppercase ${
                                      isCompleted
                                        ? 'bg-slate-950 border border-emerald-800 text-emerald-400 hover:bg-slate-900'
                                        : 'bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-black shadow-md shadow-cyan-505/20 hover:scale-102'
                                    }`}
                                    id={`case-play-btn-${cs.id}`}
                                  >
                                    <span>{isCompleted ? 'Reanalisar Pistas' : 'Acessar Briefing'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1 text-[9px] text-slate-650 text-slate-500 font-bold bg-slate-900/40 px-2 py-1 rounded" id={`case-locked-btn-${cs.id}`}>
                                    <Lock className="w-3" />
                                    <span>CASO BLOQUEADO</span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* --OS OUTROS CASOS (DIVISÃO DE SUPORTE OPERACIONAL MULTI-CO-LATERAIS DA CIDADE) */}
                    <div className="mt-8 pt-6 border-t border-slate-800" id="other-precinct-cases">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-350 text-slate-300 tracking-wider uppercase font-mono flex items-center gap-2">
                            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span>MONITORAMENTO DE SESSÕES CO-LATERAIS EM ANDAMENTO (OUTROS CASOS)</span>
                          </h4>
                          <p className="text-[9px] text-slate-500">
                            Canais de patrulha e investigação forense ativos em outras divisões civis sob jurisdição federal.
                          </p>
                        </div>
                        <span className="text-[8px] bg-slate-950 text-slate-500 border border-slate-800 px-2.5 py-1 rounded font-bold uppercase shrink-0 tracking-wider">
                          Feed Integrado Ativo
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4" id="other-cases-grid">
                        
                        {/* Case #2481: Investigando */}
                        <div className="bg-slate-950/40 border border-amber-900/30 hover:border-amber-500/30 rounded-xl p-3.5 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] bg-amber-950 border border-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                🟠 Investigando
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 font-bold">#2481</span>
                            </div>
                            <h5 className="text-[11px] font-black tracking-normal text-slate-200 uppercase truncate">
                              Disparo Noturno
                            </h5>
                          </div>
                          <div className="mt-3.5 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Perito:</span>
                              <span className="text-slate-300 font-bold">PERITO_685</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Atualiz.:</span>
                              <span className="text-amber-400 font-bold">Há 2 horas</span>
                            </div>
                          </div>
                        </div>

                        {/* Case #2478: Equipe no Local */}
                        <div className="bg-slate-950/40 border border-blue-900/30 hover:border-blue-500/30 rounded-xl p-3.5 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] bg-blue-950 border border-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                🔵 Equipe no Local
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 font-bold">#2478</span>
                            </div>
                            <h5 className="text-[11px] font-black tracking-normal text-slate-200 uppercase truncate">
                              Armazém Sob Fogo
                            </h5>
                          </div>
                          <div className="mt-3.5 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Pistas:</span>
                              <span className="text-slate-300 font-bold">7 / 15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Progresso:</span>
                              <span className="text-blue-400 font-bold">45%</span>
                            </div>
                          </div>
                        </div>

                        {/* Case #2475: Análise Forense */}
                        <div className="bg-slate-950/40 border border-purple-900/30 hover:border-purple-500/30 rounded-xl p-3.5 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] bg-purple-950 border border-purple-900/50 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                🟣 Análise Forense
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 font-bold">#2475</span>
                            </div>
                            <h5 className="text-[11px] font-black tracking-normal text-slate-200 uppercase truncate">
                              Químico Suspeito
                            </h5>
                          </div>
                          <div className="mt-3.5 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Lab:</span>
                              <span className="text-purple-400 font-bold font-mono">DNA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Situação:</span>
                              <span className="text-slate-300 font-bold truncate">Aguardando resultado</span>
                            </div>
                          </div>
                        </div>

                        {/* Case #2469: Resolvido */}
                        <div className="bg-slate-950/40 border border-emerald-900/30 hover:border-emerald-500/30 rounded-xl p-3.5 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] bg-emerald-950 border border-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                🟢 Resolvido
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 font-bold">#2469</span>
                            </div>
                            <h5 className="text-[11px] font-black tracking-normal text-slate-200 uppercase truncate">
                              Corretora Cripto
                            </h5>
                          </div>
                          <div className="mt-3.5 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Resultado:</span>
                              <span className="text-emerald-400 font-bold">Culpado ID</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Certeza:</span>
                              <span className="text-slate-300 font-bold">98%</span>
                            </div>
                          </div>
                        </div>

                        {/* Case #2451: Arquivado */}
                        <div className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-xl p-3.5 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                ⚫ Arquivado
                              </span>
                              <span className="text-[8px] font-mono text-slate-600 font-bold">#2451</span>
                            </div>
                            <h5 className="text-[11px] font-black tracking-normal text-slate-200 uppercase truncate">
                              Álibi Deletado
                            </h5>
                          </div>
                          <div className="mt-3.5 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Solução:</span>
                              <span className="text-slate-400 font-bold font-mono">Arquivado</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 uppercase text-[8px]">Motivo:</span>
                              <span className="text-red-400 font-bold">Insuficiente</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* HIGH-GRADE INTELLIGENCE LEADERBOARD */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5" id="global-ranking-sec">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <h3 className="text-xs font-bold text-slate-205 text-slate-200 uppercase tracking-widest">
                        RANKING DIGITAL DE PERITOS DE ELITE (DIVISIONAL TERMINAL)
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-mono text-slate-300" id="ranking-table">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 text-[9px] uppercase">
                            <th className="py-2.5 pl-3">Colocação</th>
                            <th className="py-2.5">Agente Forense</th>
                            <th className="py-2.5">Especialidade</th>
                            <th className="py-2.5">Hierarquia Atribuição</th>
                            <th className="py-2.5 text-center">Laudos Resolvidos</th>
                            <th className="py-2.5 text-right pr-3">Nível Classificação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 font-medium">
                          {fullLeaderboard.map((entry, index) => {
                            const isUser = entry.isCurrentUser;
                            return (
                              <tr 
                                key={index} 
                                className={`transition ${isUser ? 'bg-cyan-950/40 text-cyan-400 border-l-2 border-l-cyan-450 font-bold' : 'hover:bg-slate-900/20'}`}
                                id={`ranking-row-${index}`}
                              >
                                <td className="py-3 pl-3">
                                  <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-black ${
                                    index === 0 ? 'bg-amber-450 text-slate-950 bg-amber-400' :
                                    index === 1 ? 'bg-slate-300 text-slate-950' :
                                    index === 2 ? 'bg-amber-700 text-slate-50' : 
                                    'bg-slate-800 text-slate-400 animate-none'
                                  }`}>
                                    0{index + 1}
                                  </span>
                                </td>
                                <td className="py-3 text-slate-100 font-sans font-bold">
                                  {entry.name}
                                </td>
                                <td className="py-3 text-slate-400 uppercase text-[10px]">
                                  {entry.specialization}
                                </td>
                                <td className="py-3 text-[10px] text-pink-500 font-bold uppercase tracking-wider">
                                  {entry.tier}
                                </td>
                                <td className="py-3 text-center text-slate-200 font-bold">
                                  {entry.casesResolved} casos
                                </td>
                                <td className="py-3 text-right pr-3 text-cyan-400 font-bold">
                                  NÍVEL {entry.level}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: CENTRAL OPERATIONS (Agências, Parceiros, Planilha de Evolução) */}
              {activeTab === 'CENTRAL' && (
                <motion.div
                  key="ops-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  id="central-operacoes-panel"
                >
                  
                  {/* SUB-SECTION A: INVESTIGATION AGENCIES (Agências de Investigação) */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Building className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                          UNIDADES DE INVESTIGAÇÃO CRIMINAL DISPONÍVEIS
                        </h3>
                        <p className="text-[10px] text-slate-450 text-slate-400 mt-0.5">
                          Associe-se a diferentes agências para obter novos bônus sobre as provas periciadas no laboratório.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="ops-agencies-grid">
                      {DEFAULT_AGENCIES.map((agency) => {
                        const isActive = agency.id === currentAgencyId;
                        const isMiami = agency.id === 'agency-miami';
                        const isNY = agency.id === 'agency-ny';
                        const isFed = agency.id === 'agency-federal';
                        
                        const isUnlocked = isMiami || 
                                           (isNY && completedCases.length >= 1) || 
                                           (isFed && completedCases.length >= 2);

                        return (
                          <div
                            key={agency.id}
                            className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                              isActive
                                ? 'bg-cyan-950/20 border-cyan-455 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                : 'bg-slate-950/80 border-slate-900 hover:border-slate-800'
                            }`}
                            id={`ops-agency-card-${agency.id}`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${agency.badgeColor}`}>
                                  {agency.location}
                                </span>
                                {isActive && (
                                  <span className="text-[8px] font-mono bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                                    ESTAÇÃO ATIVA SINAL
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-slate-200 uppercase">
                                {agency.name}
                              </h4>

                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                                {agency.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2">
                              <p className="text-[9px] font-mono text-emerald-450 text-emerald-400 font-bold uppercase">
                                Atribuição: {agency.bonusText}
                              </p>

                              {isActive ? (
                                <div className="w-full text-center py-2 bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-450 text-cyan-400 font-black uppercase tracking-wider rounded select-none">
                                  Servidores Alinhados
                                </div>
                              ) : isUnlocked ? (
                                <button
                                  onClick={() => handleSelectAgency(agency.id)}
                                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] text-slate-200 rounded font-bold uppercase tracking-wider transition cursor-pointer"
                                  id={`select-agency-btn-${agency.id}`}
                                >
                                  Mudar Local Alocação
                                </button>
                              ) : (
                                <div className="space-y-1.5">
                                  <div className="text-[9px] text-slate-500 flex items-center gap-1 justify-center">
                                    <Lock className="w-3 h-3 text-pink-500" />
                                    <span>Requer {isNY ? 'Resolvido Caso #1' : 'Resolvido 2 Casos'}</span>
                                  </div>
                                  <button
                                    onClick={() => handleUnlockAgency(agency)}
                                    className="w-full py-1.5 bg-pink-950/20 hover:bg-pink-900/20 text-pink-400 border border-pink-900/40 text-[9px] rounded font-bold uppercase tracking-wider transition cursor-pointer"
                                    id={`unlock-agency-btn-${agency.id}`}
                                  >
                                    Licenciar por C$ {agency.requiredCredits}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SUB-SECTION B: PARTNER EXPERIENCE & SELECTION */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h3 className="text-xs font-bold text-slate-202 text-slate-200 uppercase tracking-widest">
                            SISTEMA CO-PERITOS EM CAMPO (SQUAD DEVELOPMENT)
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Treine sua equipe forense utilizando créditos para potencializar os bônus permanentes cedidos aos exames de provas de laboratório.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4" id="ops-partners-mapping-deck">
                      {partners.map((partner) => {
                        const isSelected = profile.activePartnerId === partner.id;
                        const partnerXpPercentage = Math.min((partner.xp / partner.nextLevelXp) * 100, 100);

                        return (
                          <div
                            key={partner.id}
                            className={`p-4 rounded-xl border flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition ${
                              isSelected
                                ? 'bg-slate-950 border-cyan-500/60 shadow-[0_4px_15px_rgba(6,182,212,0.04)]'
                                : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                            }`}
                            id={`ops-partner-row-${partner.id}`}
                          >
                            
                            {/* Profile details */}
                            <div className="flex items-center gap-4 min-w-[240px] max-w-sm shrink-0">
                              <div className="relative">
                                <img
                                  src={partner.avatar}
                                  alt={partner.name}
                                  className={`w-14 h-14 rounded-xl object-cover shrink-0 border-2 ${isSelected ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-slate-900'}`}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute -bottom-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[9px] font-black h-4 w-10 flex items-center justify-center rounded border border-slate-950 px-1 leading-none shadow">
                                  LV {partner.level}
                                </div>
                              </div>

                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-200 text-sm truncate uppercase font-display">
                                  {partner.name}
                                </h4>
                                <p className="text-[9px] text-slate-450 text-slate-400 uppercase font-bold">{partner.role}</p>
                                <p className="text-[8px] text-pink-400 font-bold uppercase mt-1 tracking-wider bg-pink-950/20 border border-pink-900/30 px-1.5 py-0.5 rounded inline-block">
                                  ESPECIALISTA: {partner.specialization}
                                </p>
                              </div>
                            </div>

                            {/* Center level stats */}
                            <div className="flex-1 w-full max-w-xs space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-slate-500 uppercase">Proficiência de Provas</span>
                                <span className="text-cyan-400">{partner.xp} / {partner.nextLevelXp} XP</span>
                              </div>
                              <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-800">
                                <div
                                  className="bg-cyan-500 h-full rounded transition-all duration-300"
                                  style={{ width: `${partnerXpPercentage}%` }}
                                />
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {partner.unlockedSkills.map((sk, sidx) => (
                                  <span key={sidx} className="text-[8px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 border border-slate-800 rounded">
                                    ✦ {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Accionables training/toggle active */}
                            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto justify-end">
                              
                              <button
                                onClick={() => handleTrainPartner(partner.id)}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[9px] rounded-lg tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
                                id={`train-partner-btn-${partner.id}`}
                              >
                                <ArrowRight className="w-3 h-3 text-amber-400" />
                                <span>Treinar [+30 XP]</span>
                                <span className="text-amber-405 text-amber-400 font-bold bg-amber-950/45 px-1 py-0.5 rounded border border-amber-800/30">C$ 45</span>
                              </button>

                              {isSelected ? (
                                <button
                                  className="px-3 py-2 bg-cyan-950/40 border border-cyan-805 border-cyan-800 text-cyan-400 text-[9px] rounded-lg tracking-wider uppercase font-extrabold select-none shrink-0"
                                  id={`alocated-partner-${partner.id}`}
                                >
                                  ✓ Despachado Convosco
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSetActivePartner(partner.id)}
                                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[9px] rounded-lg tracking-wider font-bold uppercase transition cursor-pointer shrink-0"
                                  id={`set-active-partner-btn-${partner.id}`}
                                >
                                  Alocar Parceiro
                                </button>
                              )}

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SUB-SECTION C: CAREER TIMELINE TRACK */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Briefcase className="w-5 h-5 text-cyan-450 text-cyan-400" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                          TABELA DE CARGOS DA DELEGACIA FORENSE
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Mostra o plano de ascensão institucional forense. Resolva inquéritos para atingir novas patentes de liderança.
                        </p>
                      </div>
                    </div>

                    <div className="relative overflow-x-auto pb-4 pt-2">
                      <div className="absolute top-[37px] left-8 right-8 h-0.5 bg-slate-900" />
                      
                      <div className="flex gap-10 min-w-[900px] px-4 justify-between" id="career-timeline">
                        {CAREER_TIERS_ROUTEMAP.map((node) => {
                          const isCurrentTier = profile.tier === node.tier;
                          const tiersList = CAREER_TIERS_ROUTEMAP.map(n => n.tier);
                          const userIdx = tiersList.indexOf(profile.tier as CareerTier);
                          const nodeIdx = tiersList.indexOf(node.tier);
                          const isReached = nodeIdx <= userIdx;

                          return (
                            <div 
                              key={node.tier}
                              className="flex flex-col items-center text-center space-y-2 relative"
                              id={`career-node-${node.tier.replace(' ', '-')}`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all relative z-10 ${
                                isCurrentTier 
                                  ? 'bg-cyan-950 border-cyan-400 text-cyan-450 scale-110 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                                  : isReached 
                                    ? 'bg-slate-900 border-emerald-500 text-emerald-400' 
                                    : 'bg-slate-950 border-slate-90a border-slate-800 text-slate-600'
                              }`}>
                                {isCurrentTier ? (
                                  <Shield className="w-5 h-5 text-cyan-400" />
                                ) : isReached ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <span className="text-[10px] font-mono font-bold text-slate-500">{node.code}</span>
                                )}
                              </div>

                              <div className="min-w-[120px]">
                                <p className={`text-[10px] font-bold uppercase transition ${isCurrentTier ? 'text-cyan-400' : isReached ? 'text-slate-350 text-slate-305' : 'text-slate-600'}`}>
                                  {node.tier}
                                </p>
                                <p className="text-[9px] text-slate-500">
                                  Requer Nível {node.levelReq}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SUB-SECTION D: RECENT STORY ARCS SEASONS LIST */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Flame className="w-5 h-5 text-pink-500" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-202 text-slate-200 uppercase tracking-widest">
                          CONEXÕES DE CASOS CRIMINAIS (CABAL STORY SEASONS)
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Casos criminais resolvidos contribuem para a desarticulação do crime organizado por inteira temporada operacional.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 font-mono" id="ops-seasons-grid">
                      {SEASONS_DATA.map((season) => {
                        const totalSeasonCases = season.caseIds.length;
                        const completedSeasonCasesCount = season.caseIds.filter(id => completedCases.includes(id)).length;
                        const isSeasonCompleted = completedSeasonCasesCount === totalSeasonCases;

                        return (
                          <div 
                            key={season.id} 
                            className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                            id={`season-card-${season.id}`}
                          >
                            <div className="md:col-span-1 space-y-1">
                              <span className="text-[8px] uppercase bg-pink-955/35 bg-pink-950/40 text-pink-400 border border-pink-901 border-pink-900/40 px-2 py-0.5 rounded font-bold">
                                {season.tagline}
                              </span>
                              <h4 className="text-xs font-bold uppercase text-slate-200 block mt-1">
                                {season.title}
                              </h4>
                            </div>

                            <div className="md:col-span-2 text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                              {season.description}
                            </div>

                            <div className="md:col-span-1 border-l border-slate-900 md:pl-4 space-y-1 text-center md:text-left">
                              <p className="text-[8px] text-slate-500 uppercase">Progresso de Temporada</p>
                              <p className="text-[11px] font-bold text-slate-200">
                                {completedSeasonCasesCount} / {totalSeasonCases} Casos Fechados
                              </p>
                              
                              <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden mt-1">
                                <div 
                                  className="bg-pink-500 h-full rounded"
                                  style={{ width: `${(completedSeasonCasesCount / totalSeasonCases) * 100}%` }}
                                />
                              </div>
                              
                              {isSeasonCompleted ? (
                                <p className="text-[9px] text-emerald-400 flex items-center gap-1 justify-center md:justify-start mt-1 font-bold uppercase">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Arco Desativado</span>
                                </p>
                              ) : (
                                <p className="text-[8px] text-slate-500 mt-1">
                                  Resolva {totalSeasonCases - completedSeasonCasesCount} mais para bônus corporativo.
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
