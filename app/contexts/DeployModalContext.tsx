'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import DeployModal from '../components/shared/DeployModal';
import { track } from '../lib/analytics';
import { detectMarket } from '../lib/market';

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
   * A "Deploy" click now goes straight to Dodo checkout rather than collecting
   * a form first — buying is the intent, so don't put a form in front of it.
   *
   * The contact modal is the FALLBACK, not the default: if checkout can't be
   * opened (products not configured yet, network blip, Dodo down) we open the
   * modal instead so the click still leads somewhere. A dead Deploy button
   * would be worse than a form.
   */
  const startDeploy = useCallback(async (source = 'unknown') => {
    if (isStartingCheckout) return;
    setIsStartingCheckout(true);
    track('checkout_start', { source });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ market: detectMarket(), source }),
      });
      const data = await res.json().catch(() => null);

      if (data?.ok && data.checkoutUrl) {
        // Full navigation, not router.push — checkout is hosted by Dodo.
        window.location.href = data.checkoutUrl as string;
        return; // keep the busy state through the redirect
      }

      track('checkout_unavailable', { source, reason: data?.reason ?? 'unknown' });
      openModal(source);
    } catch {
      track('checkout_unavailable', { source, reason: 'network_error' });
      openModal(source);
    }
    setIsStartingCheckout(false);
  }, [isStartingCheckout]);
  
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

