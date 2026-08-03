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
   * "Deploy" CTAs → straight to payment. Falls back to the contact modal if
   * checkout can't be opened, so the button is never dead.
   */
  startDeploy: (source?: string) => Promise<void>;
  /** True while a checkout session is being opened (for button busy states). */
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
   * A "Deploy" click opens the capture form first, and the form hands off to
   * Dodo checkout on submit (see DeployModal).
   *
   * Details BEFORE payment on purpose: we keep the lead even when someone
   * abandons the checkout page, and their name/email prefill the Dodo form
   * instead of being typed twice. The booking calendar then moves to AFTER
   * payment (/thank-you?checkout=success) as an onboarding call.
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

