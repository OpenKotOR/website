import { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
// import ThemeToggle from '../common/ThemeToggle/ThemeToggle';

export default function TopNav() {
  const { state } = useAppContext();
  const { inviteUrl } = state.config;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#projects', label: 'Projects' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className="topnav">
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        <span className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Navigation links */}
      <div className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.href} className="nav-item">
              <a 
                href={item.href} 
                className="nav-link"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Theme toggle and CTA button */}
        <div className="nav-actions">
          {/* <ThemeToggle /> */}
          <a 
            className="cta" 
            href={inviteUrl} 
            target="_blank" 
            rel="noopener"
            onClick={closeMenu}
          >
            Join the Discord →
          </a>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
