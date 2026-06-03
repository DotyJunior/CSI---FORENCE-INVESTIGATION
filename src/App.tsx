/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import CrimeSceneView from './components/CrimeSceneView';
import ForensicsLabView from './components/ForensicsLabView';
import InvestigationBoard from './components/InvestigationBoard';
import AccusationScreen from './components/AccusationScreen';
import { UserProfile, Case, Suspect, CareerTier } from './types';
import { casesData } from './casesData';
import BriefingRoom from './components/BriefingRoom';
import { DEFAULT_PARTNERS, DEFAULT_AGENCIES } from './gameConfigData';

type ScreenState = 'LOGIN' | 'DASHBOARD' | 'BRIEFING' | 'SCENE' | 'LAB' | 'BOARD' | 'ACCUSATION_RESULT';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenState>('LOGIN');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const normalizeProfile = (parsed: UserProfile): UserProfile => {
    const updated = { ...parsed };
    if (!updated.partners || updated.partners.length === 0) {
      updated.partners = JSON.parse(JSON.stringify(DEFAULT_PARTNERS));
    }
    if (!updated.activePartnerId) {
      updated.activePartnerId = DEFAULT_PARTNERS[0].id;
    }
    if (!updated.activeAgencyId) {
      updated.activeAgencyId = DEFAULT_AGENCIES[0].id;
    }
    return updated;
  };
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  
  // Progress states for current case session
  const [collectedClues, setCollectedClues] = useState<{ [key: string]: boolean }>({});
  const [analyzedClues, setAnalyzedClues] = useState<{ [key: string]: boolean }>({});
  
  // Accusation outcome
  const [accusedSuspect, setAccusedSuspect] = useState<Suspect | null>(null);
  const [isAccusedGuilty, setIsAccusedGuilty] = useState<boolean>(false);

  // Dynamic Level to Tier resolution function
  const resolveCareerTier = (lvl: number): CareerTier => {
    if (lvl >= 20) return 'Diretor da Agência';
    if (lvl >= 16) return 'Chefe de Divisão';
    if (lvl >= 13) return 'Supervisor';
    if (lvl >= 10) return 'Perito Sênior';
    if (lvl >= 7) return 'Perito Criminal';
    if (lvl >= 5) return 'Técnico Forense';
    if (lvl >= 3) return 'Assistente Técnico';
    return 'Estagiário';
  };

  // On mount, check if user session exists in localStorage
  useEffect(() => {
    const cachedProfile = localStorage.getItem('csi_user_profile');
    const cachedCompleted = localStorage.getItem('csi_completed_cases');

    if (cachedProfile) {
      try {
        const parsed: UserProfile = JSON.parse(cachedProfile);
        const initializedProfile = normalizeProfile(parsed);
        setProfile(initializedProfile);
        setActiveScreen('DASHBOARD');
      } catch (err) {
        console.error('Falha ao processar cache de perfil:', err);
      }
    }
    
    if (cachedCompleted) {
      try {
        setCompletedCases(JSON.parse(cachedCompleted));
      } catch (err) {
        console.error('Falha ao processar cache de casos resolvidos:', err);
      }
    }
  }, []);

  // Sync profile edits to localStorage
  const saveProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('csi_user_profile', JSON.stringify(updatedProfile));
  };

  const handleLogin = (newProfile: UserProfile) => {
    const initializedProfile = normalizeProfile(newProfile);
    setProfile(initializedProfile);
    localStorage.setItem('csi_user_profile', JSON.stringify(initializedProfile));
    setActiveScreen('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('csi_user_profile');
    localStorage.removeItem('csi_completed_cases');
    setProfile(null);
    setCompletedCases([]);
    setSelectedCase(null);
    setCollectedClues({});
    setAnalyzedClues({});
    setAccusedSuspect(null);
    setActiveScreen('LOGIN');
  };

  // Launch a case investigation
  const handleSelectCase = (caseId: string) => {
    const c = casesData.find(cs => cs.id === caseId);
    if (!c) return;

    setSelectedCase(c);
    // Reset previous case investigation temporary trackers
    setCollectedClues({});
    setAnalyzedClues({});
    setAccusedSuspect(null);
    
    // Dispatch to Cinematic Briefing Room first!
    setActiveScreen('BRIEFING');
  };

  // Hotspot elements registration
  const handleEvidenceCollected = (collectedKeys: { [key: string]: boolean }) => {
    setCollectedClues(collectedKeys);
  };

  // Forensic mini-games registration
  const handleClueAnalyzed = (analyzedKeys: { [key: string]: boolean }) => {
    setAnalyzedClues(analyzedKeys);
  };

  // Core accusation mandate execution
  const handleAccuseSuspect = (suspect: Suspect) => {
    setAccusedSuspect(suspect);
    setIsAccusedGuilty(suspect.guilty);
    setActiveScreen('ACCUSATION_RESULT');
  };

  // Finish case successfully, claim XP/Credits and level up
  const handleConfirmSuccess = (gainedXp: number, gainedCredits: number) => {
    if (!profile || !selectedCase) return;

    const nextCompleted = Array.from(new Set([...completedCases, selectedCase.id]));
    setCompletedCases(nextCompleted);
    localStorage.setItem('csi_completed_cases', JSON.stringify(nextCompleted));

    let updatedXp = profile.xp + gainedXp;
    let updatedLevel = profile.level;
    let threshold = updatedLevel * 400;

    // Check level up loops
    while (updatedXp >= threshold) {
      updatedXp -= threshold;
      updatedLevel += 1;
      threshold = updatedLevel * 400;
    }

    const nextTier = resolveCareerTier(updatedLevel);

    // Earn partner XP as well!
    let updatedPartners = profile.partners ? [...profile.partners] : [];
    const activePartnerIdx = updatedPartners.findIndex(p => p.id === profile.activePartnerId);

    if (activePartnerIdx !== -1) {
      let partner = { ...updatedPartners[activePartnerIdx] };
      partner.xp += Math.round(gainedXp * 0.8); // 80% of player XP goes to partner
      while (partner.xp >= partner.nextLevelXp) {
        partner.xp -= partner.nextLevelXp;
        partner.level += 1;
        partner.nextLevelXp = Math.round(partner.nextLevelXp * 1.5);
        
        // Level up brand new skills
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
      updatedPartners[activePartnerIdx] = partner;
    }

    const updatedProfile: UserProfile = {
      ...profile,
      xp: updatedXp,
      level: updatedLevel,
      tier: nextTier,
      credits: profile.credits + gainedCredits,
      casesResolved: nextCompleted.length,
      partners: updatedPartners,
      perfectResolutions: profile.perfectResolutions + 1, // Phase 1 defaults to perfect
      accuracyRate: Math.max(90, Math.min(100, profile.accuracyRate + 2)), // Boost precision rate
    };

    saveProfileUpdate(updatedProfile);
    
    // Tear down session and return
    setSelectedCase(null);
    setCollectedClues({});
    setAnalyzedClues({});
    setAccusedSuspect(null);
    setActiveScreen('DASHBOARD');
  };

  // Retry accusation (bypasses hard blocks, allows player to re-examine clues)
  const handleRetryAccusation = () => {
    // Decrease slight dynamic performance accuracy rating on error
    if (profile) {
      const updatedProfile = {
        ...profile,
        accuracyRate: Math.max(65, profile.accuracyRate - 5),
      };
      saveProfileUpdate(updatedProfile);
    }
    setAccusedSuspect(null);
    setActiveScreen('BOARD');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" id="application-container">
      <AnimatePresence mode="wait">
        
        {/* SCREEN 1: LOGIN */}
        {activeScreen === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {/* SCREEN 2: DASHBOARD */}
        {activeScreen === 'DASHBOARD' && profile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Dashboard 
              profile={profile}
              cases={casesData}
              completedCases={completedCases}
              onSelectCase={handleSelectCase}
              onLogout={handleLogout}
              onSaveProfile={saveProfileUpdate}
            />
          </motion.div>
        )}

        {/* SCREEN BRIEFING: BRIEFING ROOM BEFORE FIELD DEPLOYMENT */}
        {activeScreen === 'BRIEFING' && selectedCase && profile && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <BriefingRoom 
              currentCase={selectedCase}
              profile={profile}
              onLaunchCase={(partnerId) => {
                const updatedProfile = {
                  ...profile,
                  activePartnerId: partnerId
                };
                saveProfileUpdate(updatedProfile);
                setActiveScreen('SCENE');
              }}
              onCancel={() => setActiveScreen('DASHBOARD')}
            />
          </motion.div>
        )}

        {/* SCREEN 3: CRIME SCENE EVIDENCE SEARCH */}
        {activeScreen === 'SCENE' && selectedCase && (
          <motion.div
            key="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <CrimeSceneView 
              currentCase={selectedCase}
              collectedClues={collectedClues}
              onEvidenceCollected={handleEvidenceCollected}
              onBackToDashboard={() => setActiveScreen('DASHBOARD')}
              onGoToLab={() => setActiveScreen('LAB')}
            />
          </motion.div>
        )}

        {/* SCREEN 4: LABORATORY INTERACTIVE STATION */}
        {activeScreen === 'LAB' && selectedCase && (
          <motion.div
            key="lab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ForensicsLabView 
              currentCase={selectedCase}
              collectedClues={collectedClues}
              analyzedClues={analyzedClues}
              onClueAnalyzed={handleClueAnalyzed}
              onGoToBoard={() => setActiveScreen('BOARD')}
              onBackToScene={() => setActiveScreen('SCENE')}
            />
          </motion.div>
        )}

        {/* SCREEN 5: INVESTIGATION BOARD & SUSPECT AUDIT */}
        {activeScreen === 'BOARD' && selectedCase && (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <InvestigationBoard 
              currentCase={selectedCase}
              analyzedClues={analyzedClues}
              onBackToLab={() => setActiveScreen('LAB')}
              onAccuseSuspect={handleAccuseSuspect}
            />
          </motion.div>
        )}

        {/* SCREEN 6: TRIAL RESULT CINEMATIC */}
        {activeScreen === 'ACCUSATION_RESULT' && selectedCase && accusedSuspect && profile && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AccusationScreen 
              currentCase={selectedCase}
              selectedSuspect={accusedSuspect}
              isGuilty={isAccusedGuilty}
              currentTier={profile.tier}
              onConfirmSuccess={handleConfirmSuccess}
              onRetry={handleRetryAccusation}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
