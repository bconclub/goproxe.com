'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import DeployModal from '../components/shared/DeployModal';
import { track } from '../lib/analytics';

interface DeployModalContextType {
  /** @param source where the open was triggered from (for analytics) */
  openModal: (source?: string) => void;
  closeModal: () => void;
  isOpen: boolean;
  setOnFormSubmit: (callback: (() => void) | null) => void;
  /**
   * Deploy CTAs capture contact details, then open brand onboarding.
   */
  startDeploy: (source?: string) => Promise<void>;
  /** Retained for existing CTA busy-state consumers. */
  isStartingCheckout: boolean;
}

const DeployModalContext = createContext<DeployModalContextType | undefined>(undefined);

export function DeployModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onFormSubmitCallback, setOnFormSubmitCallback] = useState<(() => void) | null>(null);

  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [modalSource, setModalSource] = useState('unknown');

  const openModal = (source = 'unknown') => {
    track('deploy_modal_open', { source });
    setModalSource(source);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  /**
   * Capture name and phone before the separate brand onboarding page.
   * Sales enquiries retain their existing booking flow.
   */
  const startDeploy = useCallback(async (source = 'unknown') => {
    openModal(source);
  }, []);
  
  const setOnFormSubmit = useCallback((callback: (() => void) | null) => {
    setOnFormSubmitCallback(() => callback);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (onFormSubmitCallback) {
      onFormSubmitCallback();
    }
  }, [onFormSubmitCallback]);

  return (
    <DeployModalContext.Provider value={{ openModal, closeModal, isOpen, setOnFormSubmit, startDeploy, isStartingCheckout }}>
      {children}
      <DeployModal isOpen={isOpen} onClose={closeModal} onFormSubmit={handleFormSubmit} source={modalSource} />
    </DeployModalContext.Provider>
  );
}

export function useDeployModal() {
  const context = useContext(DeployModalContext);
  if (context === undefined) {
    throw new Error('useDeployModal must be used within a DeployModalProvider');
  }
  return context;
}

