import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Fingerprint, 
  Cpu, 
  Dna, 
  Compass, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Activity,
  Award 
} from 'lucide-react';
import { Specialization, UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
}

// 5 exact custom-curated cinematic detective profiles matching the reference layout
const DETECTIVE_AVATARS = [
  {
    name: 'Agente Miller',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Perita Blake',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Detetive Sarah',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Perito Hunter',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Agente Vance',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop'
  }
];

const SPECIALIZATIONS: { type: Specialization; icon: React.ReactNode; desc: string; bonus: string; color: string }[] = [
  {
    type: 'Balístico',
    icon: <Eye className="w-6 h-6" />,
    desc: 'Especialista em estrias de munição, marcas de percussão e dinâmica de tiro.',
    bonus: '+20% precisão em testes balísticos',
    color: 'text-amber-500 bg-amber-950/20 border-amber-800/45'
  },
  {
    type: 'Digital',
    icon: <Cpu className="w-6 h-6" />,
    desc: 'Especialista em recuperação de dados, criptografia e logs em tempo real.',
    bonus: '+20% deciframento de mensagens',
    color: 'text-purple-400 bg-purple-950/20 border-purple-800/45'
  },
  {
    type: 'DNA',
    icon: <Dna className="w-6 h-6" />,
    desc: 'Especialista em sequenciamento de bases químicas e tecidos biológicos.',
    bonus: '+20% correspondência rápida em DNA',
    color: 'text-emerald-400 bg-emerald-950/20 border-emerald-800/45'
  },
  {
    type: 'Investigador de Campo',
    icon: <Compass className="w-6 h-6" />,
    desc: 'Perito versátil ótimo em encontrar pistas em locais hostis e cenas complexas.',
    bonus: 'Destaque visual sutil nas zonas investigativas',
    color: 'text-amber-400 bg-amber-950/20 border-amber-800/45'
  },
  {
    type: 'Criminal Geral',
    icon: <Shield className="w-6 h-6" />,
    desc: 'Líder de coordenação tática com olhar aguçado para detalhes globais.',
    bonus: '+10% XP adicional recebido ao resolver casos',
    color: 'text-cyan-400 bg-cyan-950/20 border-cyan-800/45'
  }
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<Specialization>('Criminal Geral');
  const [avatarIndex, setAvatarIndex] = useState(2); // Middle brunette selected by default

  const handleNextAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % DETECTIVE_AVATARS.length);
  };

  const handlePrevAvatar = () => {
    setAvatarIndex((prev) => (prev - 1 + DETECTIVE_AVATARS.length) % DETECTIVE_AVATARS.length);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      id: 'csi-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: name.trim(),
      avatar: DETECTIVE_AVATARS[avatarIndex].url,
      specialization: selectedSpec,
      tier: 'Estagiário',
      level: 1,
      xp: 0,
      credits: 300, // Generous starter credits
      casesResolved: 0,
      perfectResolutions: 0,
      accuracyRate: 100,
      unlockedCases: ['001'],
    };

    onLogin(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-905" id="login-screen-root">
      
      {/* IMMERSIVE TOP PICTURE - BACKGROUND FROM THE USER */}
      <div className="absolute top-0 left-0 right-0 h-[620px] md:h-[650px] overflow-hidden pointer-events-none z-0" id="top-immersive-banner">
        <img 
          src="https://i.ibb.co/PZmnzgRv/IMAGEM-DE-TOPO.png" 
          alt="CSI Police Operations Background" 
          className="w-full h-full object-cover object-center opacity-70 filter saturate-[1.1] scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Soft immersive terminal matrix gradient fading into standard black slate-950 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-transparent" />
        
        {/* Flashing red and blue siren lighting ambient reflections */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse duration-1000" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse duration-1500" />
      </div>

      {/* HEADER SECTION: Authenticated Credentials */}
      <header className="z-10 w-full max-w-7xl mx-auto px-4 pt-4 md:pt-6 flex items-center justify-between pointer-events-auto" id="login-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg shadow-2xl backdrop-blur-md">
            <Fingerprint className="w-8 h-8 text-cyan-400 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-slate-100 uppercase">
                CSI <span className="text-cyan-400 text-sm tracking-widest block md:inline md:text-lg font-mono">CRIME SCENE ONLINE</span>
              </h1>
            </div>
            <p className="text-[10px] md:text-xs font-mono text-slate-400 tracking-wider uppercase">
              SISTEMA DE CREDENCIAIS E AUTENTICAÇÃO FORENSE // V0.1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            PROTOCOLO ATIVO
          </span>
        </div>
      </header>

      {/* CENTER WORKSTATION CONTAINER */}
      <main className="z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center" id="login-interactive-console">
        
        {/* INTERACTIVE CREDENTIAL BOX: Code Name input */}
        <div className="w-full max-w-xl text-center space-y-5 mb-8" id="welcome-input-panel">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-widest uppercase text-slate-100">
              BEM-VINDO, PERITO
            </h2>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              IDENTIFIQUE-SE PARA ACESSAR A CENTRAL DE INVESTIGAÇÕES
            </p>
          </div>

          <div className="relative group max-w-md mx-auto" id="codename-input-holder">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition">
              <Fingerprint className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="DIGITE SEU CODINOME DE PERITO..."
              className="w-full bg-slate-950/95 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-xs font-mono focus:outline-none focus:border-cyan-500/80 text-center text-slate-100 placeholder-slate-600 transition uppercase tracking-widest shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-sm"
              maxLength={20}
              id="name-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            {name.trim() && (
              <button
                onClick={() => handleSubmit()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-cyan-950/50 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 font-mono text-[9px] font-bold px-3 py-1.5 rounded-lg transition uppercase cursor-pointer"
                id="quick-login-enter-btn"
              >
                Acessar Sistema &raquo;
              </button>
            )}
          </div>
        </div>

        {/* 1. SELECIONE SUA IDENTIFICAÇÃO VISUAL (AVATAR CAROUSEL) */}
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-4 mb-6 relative">
          
          <div className="text-center">
            <h3 className="text-[10px] md:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              - SELECIONE SUA IDENTIFICAÇÃO VISUAL (AVATAR) -
            </h3>
          </div>

          {/* Carousel Selector wrapper */}
          <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto" id="avatar-carousel">
            
            <button
              type="button"
              onClick={handlePrevAvatar}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition cursor-pointer shrink-0"
              id="carousel-left-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar cards grid framing */}
            <div className="flex-1 grid grid-cols-5 gap-3" id="carousel-cards-deck">
              {DETECTIVE_AVATARS.map((avatar, idx) => {
                const isSelected = avatarIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-[4/5] transition-all duration-300 cursor-pointer text-left ${
                      isSelected 
                        ? 'border-cyan-400 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.25)]' 
                        : 'border-slate-900 opacity-40 hover:opacity-100 hover:border-slate-800 scale-95'
                    }`}
                    id={`avatar-btn-${idx}`}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name} 
                      className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mapping name inside portrait bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-1.5">
                      <p className={`text-[8px] font-mono leading-none truncate text-center ${isSelected ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                        {avatar.name}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextAvatar}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition cursor-pointer shrink-0"
              id="carousel-right-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* 2. ESCOLHA SUA ESPECIALIZAÇÃO SECTOR */}
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-4" id="specializations-dashboard-segment">
          
          <div className="text-center">
            <h3 className="text-[10px] md:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              - ESCOLHA SUA ESPECIALIZAÇÃO NA DIVISÃO FORENSE -
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3" id="specialization-selectors-deck">
            {SPECIALIZATIONS.map((spec) => {
              const isSelected = selectedSpec === spec.type;
              return (
                <button
                  key={spec.type}
                  type="button"
                  onClick={() => setSelectedSpec(spec.type)}
                  className={`flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition duration-300 relative overflow-hidden cursor-pointer h-full min-h-[170px] ${
                    isSelected 
                      ? 'bg-slate-950 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.18)] scale-[1.02]' 
                      : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                  }`}
                  id={`spec-btn-${spec.type.replace(' ', '-')}`}
                >
                  {/* Subtle active visual overlay lines */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400" />
                  )}

                  {/* Icon with custom color spec */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 mb-2 ${spec.color}`}>
                    {spec.icon}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className={`text-[10px] uppercase font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {spec.type}
                      </p>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1 min-h-[46px] line-clamp-4 font-sans font-medium">
                        {spec.desc}
                      </p>
                    </div>

                    <p className="text-[8px] font-mono text-pink-400 uppercase font-bold tracking-wider mt-2 bg-pink-950/15 border border-pink-900/10 rounded py-0.5 px-1 leading-snug">
                      {spec.bonus}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* BOTTOM ADMISSION RUNNING BUTTON trigger */}
        <div className="w-full mt-6" id="admission-btn-pane">
          <button
            onClick={() => {
              if (!name.trim()) {
                // If name is blank, default mock codename easily
                setName('PERITO_' + Math.floor(100 + Math.random() * 900));
                setTimeout(() => handleSubmit(), 200);
              } else {
                handleSubmit();
              }
            }}
            className="w-full bg-slate-950 hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 border-2 border-cyan-500/40 active:border-cyan-500 rounded-xl py-4 flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest font-bold transition duration-250 cursor-pointer shadow-lg shadow-cyan-400/5 hover:shadow-cyan-400/15"
            id="register-btn"
          >
            <Fingerprint className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>Inicializar Protocolo de Admissão</span>
          </button>
          <p className="text-[9px] text-center text-slate-600 uppercase font-mono mt-2 tracking-wide">
            Ao continuar, você concorda com os termos de <span className="underline select-none">CONFIDENCIALIDADE</span> e ética forense.
          </p>
        </div>

      </main>

      {/* FOOTER SECTION: Verification forense ativa */}
      <footer className="z-10 bg-slate-950/90 border-t border-slate-900 p-4" id="login-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
          
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1" id="quantic-slot">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span className="uppercase text-slate-400">Sistema Protegido</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-500">Criptografia Quântica Ativa</span>
          </div>

          <div className="flex items-center gap-3" id="sinus-slot">
            <span className="text-slate-400 font-bold tracking-widest text-[9px] uppercase">
              Verificação Forense Ativa
            </span>
            <div className="flex gap-0.5 items-center">
              <div className="w-4 h-3 flex items-center justify-center overflow-hidden shrink-0">
                <svg className="w-full h-full text-cyan-500" viewBox="0 0 40 10" stroke="currentColor" fill="none">
                  <path d="M0,5 L10,5 L13,1 L17,9 L21,3 L24,5 L40,5" strokeWidth="1" />
                </svg>
              </div>
              <div className="w-4 h-3 flex items-center justify-center overflow-hidden shrink-0">
                <svg className="w-full h-full text-cyan-500" viewBox="0 0 40 10" stroke="currentColor" fill="none">
                  <path d="M0,5 L10,5 L13,1 L17,9 L21,3 L24,5 L40,5" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1" id="phoenix-slot">
            <span className="uppercase text-slate-400 font-bold block">Central Forense</span>
            <span className="text-pink-500 font-black block tracking-wider uppercase">FORÇA FÊNIX</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
