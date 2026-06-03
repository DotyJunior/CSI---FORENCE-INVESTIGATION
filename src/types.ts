export type Specialization = 
  | 'Balístico' 
  | 'Digital' 
  | 'DNA' 
  | 'Criminal Geral' 
  | 'Investigador de Campo'
  // Futuras especializações estruturadas para expansão:
  | 'Perícia Criminal Avançada'
  | 'Balística Aplicada'
  | 'Sequenciamento de DNA'
  | 'Investigação de Crimes Digitais'
  | 'Divisão de Homicídios'
  | 'Divisão de Narcóticos'
  | 'Esquadrão Antibombas'
  | 'Investigação de Crimes Financeiros';

export type CareerTier = 
  | 'Estagiário'
  | 'Assistente Técnico'
  | 'Técnico Forense'
  | 'Perito Criminal'
  | 'Perito Sênior'
  | 'Supervisor'
  | 'Chefe de Divisão'
  | 'Diretor da Agência';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  specialization: Specialization;
  tier: CareerTier;
  level: number;
  xp: number;
  credits: number;
  casesResolved: number;
  perfectResolutions: number;
  accuracyRate: number; // Percentage
  unlockedCases: string[]; // caseIds
  partners?: Partner[];
  activePartnerId?: string;
  activeAgencyId?: string;
}

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialization: string;
  bonusText: string;
  bonusMultiplier: {
    dna?: number;
    ballistic?: number;
    digital?: number;
    interrogation?: number;
  };
  bio: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  unlockedSkills: string[];
}

export interface InvestigationAgency {
  id: string;
  name: string;
  location: string;
  badgeColor: string;
  requiredCredits: number;
  description: string;
  bonusText: string;
  unlocked: boolean;
}

export interface Season {
  id: string;
  title: string;
  tagline: string;
  description: string;
  caseIds: string[];
  rewardBonus: string;
}

export type EvidenceType = 'Balística' | 'Biológica' | 'Digital';

export interface Hotspot {
  id: string;
  name: string;
  category: EvidenceType;
  x: number; // Percent from left (0 to 100)
  y: number; // Percent from top (0 to 100)
  radius: number; // Clickable radius in percent
  clueKey: string; // Linking key
  clueTitle: string;
  clueDesc: string;
}

export interface Suspect {
  id: string;
  name: string;
  avatar: string;
  role: string;
  motive: string;
  digitalMatch: number; // percentage match
  dnaMatch: number;
  ballisticMatch: number;
  alibiScore: number; // negative score meaning álibi is strong
  description: string;
  guilty: boolean;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Crítico';
  rewardXp: number;
  rewardCredits: number;
  sceneImage: string; // fallback illustration seed or path
  storyline: string;
  scenePrompt: string; // useful for descriptions or visuals
  hotspots: Hotspot[];
  suspects: Suspect[];
  conclusionNote: string;
}

export interface LeaderboardEntry {
  name: string;
  tier: CareerTier;
  specialization: Specialization;
  casesResolved: number;
  level: number;
  xp: number;
  isCurrentUser?: boolean;
}
