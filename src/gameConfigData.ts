import { Partner, InvestigationAgency, Season } from './types';

export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'p-sarah',
    name: 'Dra. Sarah Logan',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=200&auto=format&fit=crop',
    role: 'Geneticista Forense',
    specialization: 'DNA / Genética',
    bonusText: '+10% de acerto em DNA',
    bonusMultiplier: {
      dna: 0.10
    },
    bio: 'Doutora em Harvard e veterana de campo. Consegue identificar marcas moleculares degradadas que outros peritos descartariam.',
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    unlockedSkills: ['Reagentes Rápidos (Nível 1)']
  },
  {
    id: 'p-hunter',
    name: 'Detetive Jimmy Hunter',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    role: 'Detetive de Homicídios',
    specialization: 'Interrogatório / Álibis',
    bonusText: '+10% Eficácia na verificação de Álibis',
    bonusMultiplier: {
      interrogation: 0.10
    },
    bio: 'Com 15 anos de corregedoria e corregidoria civil, dezenas de suspeitos confessaram apenas ao encarar seu olhar de ferro refinado.',
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    unlockedSkills: ['Olhar Sônico (Nível 1)']
  },
  {
    id: 'p-vega',
    name: 'Perito Mateo Vega',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    role: 'Perito Balístico Sênior',
    specialization: 'Balística / Vestígios',
    bonusText: '+10% em Perícia Balística',
    bonusMultiplier: {
      ballistic: 0.10
    },
    bio: 'Capaz de reconstruir trajetórias completas apenas analisando sulcos longitudinais e amassamento residual do núcleo de chumbo.',
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    unlockedSkills: ['Olhar de Lupa (Nível 1)']
  }
];

export const DEFAULT_AGENCIES: InvestigationAgency[] = [
  {
    id: 'agency-miami',
    name: 'Agência de Polícia de Miami (DIP)',
    location: 'Miami, Flórida',
    badgeColor: 'border-cyan-500 text-cyan-400 bg-cyan-950/20',
    requiredCredits: 0,
    description: 'Divisão local de Investigações Criminais de Miami. Ideal para peritos recém-formados ganharem confiança na corporação.',
    bonusText: 'Base comum forense por padrão de admissão.',
    unlocked: true
  },
  {
    id: 'agency-ny',
    name: 'Divisão Federal de Nova York (NCIS)',
    location: 'Manhattan, Nova York',
    badgeColor: 'border-purple-500 text-purple-400 bg-purple-950/20',
    requiredCredits: 180,
    description: 'Escritório de alta inteligência de Manhattan que lida com crimes corporativos, malware e finanças lavadas.',
    bonusText: '+10% de ganho de Créditos em resoluções de casos.',
    unlocked: false
  },
  {
    id: 'agency-federal',
    name: 'Centro Científico Federal (FBI Forense)',
    location: 'Sede Quantico',
    badgeColor: 'border-pink-500 text-pink-400 bg-pink-950/20',
    requiredCredits: 400,
    description: 'Laboratório central crimonológico definitivo. Recursos estatais ilimitados de inteligência integrada de computação e sequenciadores nucleares.',
    bonusText: '+15% de bônus em todo XP e Crédito recebidos.',
    unlocked: false
  }
];

export const SEASONS_DATA: Season[] = [
  {
    id: 'season-1',
    title: 'Temporada #1: Redes Clandestinas do Miami-Port',
    tagline: 'A Descoberta do Sindicato',
    description: 'Investigue o circuito químico e as mortes operadas no calçadão de Miami sob liderança secreta de Helena Rios.',
    caseIds: ['001', '002', '003'],
    rewardBonus: 'Bônus de Temporada: +250 XP de maestria ao fechar todos os 3 casos iniciais.'
  },
  {
    id: 'season-2',
    title: 'Temporada #2: Conspiração Suprema no Alto Escalão',
    tagline: 'Limpeza Industrial e Poder',
    description: 'Suba para as coberturas luxuosas de Nova York e enfrente a infiltração cibernética e balística que protege o Senador Sterling.',
    caseIds: ['004', '005'],
    rewardBonus: 'Bônus de Temporada: Insígnia Especial "Perito de Elite do Senado".'
  }
];
