'use client'

import { useState } from 'react';
import styles from './Header.module.css';
import { useDeployModal } from '../../contexts/DeployModalContext';
import { track } from '../../lib/analytics';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { startDeploy } = useDeployModal();

  // "Deploy" goes straight to checkout; startDeploy falls back to the contact
  // modal on its own if a session can't be opened.
  const handleDeployClick = (source: string) => {
    void startDeploy(source);
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <img src="/proxe/assets/Proxe-Logo.png" alt="PROXe Logo" className={styles.logo} />
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink} onClick={() => track('nav_click', { label: 'features', location: 'header' })}>Features</a>
          <a href="#" className={styles.navLink} onClick={() => track('nav_click', { label: 'pricing', location: 'header' })}>Pricing</a>
          <button className={styles.deployButton} onClick={() => handleDeployClick('header_deploy')}>Deploy</button>
        </nav>
        <div className={styles.mobileNav}>
          <button 
            className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.plusIcon}>+</span>
          </button>
          <button className={styles.mobileDeployButton} onClick={() => handleDeployClick('header_mobile_deploy')}>Deploy</button>
        </div>
      </div>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="#" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Pricing</a>
        </div>
      )}
    </header>
  );
}

