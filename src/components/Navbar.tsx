'use client';

import Link from 'next/link';
import { Bus, Menu, X, Globe, User } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-white/90 hover:text-white transition-colors duration-200
                 min-h-touch min-w-touch flex items-center justify-center px-3
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                 focus-visible:ring-offset-2 focus-visible:ring-offset-petroleo rounded-md"
    >
      {children}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-neutral-800 hover:text-petroleo dark:text-white
                 dark:hover:text-coral transition-colors py-3 px-4
                 min-h-touch flex items-center
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleo/50
                 rounded-md"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Cerrar menú con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Trap focus dentro del menú móvil cuando está abierto
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-petroleo shadow-lg"
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group min-h-touch
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/50 focus-visible:ring-offset-2
                       focus-visible:ring-offset-petroleo rounded-lg px-2"
            aria-label="BusConnect - Ir a inicio"
          >
            <div
              className="bg-white/20 backdrop-blur-sm p-2 rounded-lg
                         group-hover:bg-white/30 transition-colors duration-200"
              aria-hidden="true"
            >
              <Bus className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-white">
              BusConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-2"
            role="menubar"
            aria-label="Menú de navegación"
          >
            <NavLink href="/empresas">Empresas</NavLink>
            <NavLink href="/como-funciona">Cómo funciona</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/ayuda">Ayuda</NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              type="button"
              className="p-3 text-white/80 hover:text-white transition-colors duration-200
                         min-h-touch min-w-touch flex items-center justify-center
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-white/50 focus-visible:ring-offset-2
                         focus-visible:ring-offset-petroleo rounded-lg"
              aria-label="Cambiar idioma"
              aria-haspopup="true"
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Idioma</span>
            </button>

            <Link
              href="/login"
              className="flex items-center space-x-2 text-white/90 hover:text-white
                         transition-colors duration-200 px-4 py-2 min-h-touch
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-white/50 focus-visible:ring-offset-2
                         focus-visible:ring-offset-petroleo rounded-lg"
              aria-label="Iniciar sesión"
            >
              <User className="w-5 h-5" aria-hidden="true" />
              <span>Entrar</span>
            </Link>

            <Link
              href="/registro-empresa"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30
                         text-white font-medium
                         px-6 py-2.5 rounded-lg transition-all duration-200
                         border border-white/30
                         min-h-touch flex items-center
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-white/50 focus-visible:ring-offset-2
                         focus-visible:ring-offset-petroleo"
            >
              Registrar empresa
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-3 text-white min-h-touch min-w-touch
                       flex items-center justify-center
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/50 focus-visible:ring-offset-2
                       focus-visible:ring-offset-petroleo rounded-lg"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 md:hidden"
                style={{ top: '64px' }}
                onClick={closeMobileMenu}
                aria-hidden="true"
              />

              {/* Menu panel */}
              <motion.div
                ref={mobileMenuRef}
                id="mobile-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 md:hidden
                           bg-white dark:bg-neutral-900 shadow-xl
                           border-t border-petroleo-800"
                role="menu"
                aria-label="Menú móvil"
              >
                <div className="py-2">
                  <MobileNavLink href="/empresas" onClick={closeMobileMenu}>
                    Empresas
                  </MobileNavLink>
                  <MobileNavLink href="/como-funciona" onClick={closeMobileMenu}>
                    Cómo funciona
                  </MobileNavLink>
                  <MobileNavLink href="/blog" onClick={closeMobileMenu}>
                    Blog
                  </MobileNavLink>
                  <MobileNavLink href="/ayuda" onClick={closeMobileMenu}>
                    Ayuda
                  </MobileNavLink>

                  <div
                    className="mt-4 pt-4 px-4 border-t border-neutral-200 dark:border-neutral-700
                               flex flex-col space-y-3"
                  >
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="w-full text-center py-3 px-4
                                 border border-petroleo text-petroleo dark:text-white
                                 dark:border-white/20 rounded-lg font-medium
                                 hover:bg-petroleo/5 dark:hover:bg-white/5
                                 transition-colors min-h-touch flex items-center justify-center
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-petroleo/50"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/registro-empresa"
                      onClick={closeMobileMenu}
                      className="w-full text-center py-3 px-4
                                 bg-petroleo/10 hover:bg-petroleo/20 text-petroleo
                                 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white
                                 border border-petroleo/20 dark:border-white/20
                                 rounded-lg font-medium transition-all
                                 backdrop-blur-sm
                                 min-h-touch flex items-center justify-center
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-petroleo/50"
                    >
                      Registrar empresa
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Skip link para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4
                   bg-white text-petroleo px-4 py-2 rounded-lg font-medium z-50
                   focus:outline-none focus:ring-2 focus:ring-petroleo"
      >
        Saltar al contenido principal
      </a>
    </header>
  );
}
