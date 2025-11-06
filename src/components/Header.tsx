'use client';

import Link from 'next/link';
import { Bus, Menu, X, Globe, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              BusConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/empresas"
              className="text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
            >
              Empresas
            </Link>
            <Link
              href="/como-funciona"
              className="text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/blog"
              className="text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/ayuda"
              className="text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
            >
              Ayuda
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-5 h-5" />
            </button>
            <Link
              href="/login"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Entrar</span>
            </Link>
            <Link href="/registro-empresa" className="btn-primary">
              Registrar empresa
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300"
            aria-label="Menú"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200 dark:border-neutral-800"
            >
              <div className="py-4 space-y-4">
                <Link
                  href="/empresas"
                  className="block text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
                >
                  Empresas
                </Link>
                <Link
                  href="/como-funciona"
                  className="block text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
                >
                  Cómo funciona
                </Link>
                <Link
                  href="/blog"
                  className="block text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/ayuda"
                  className="block text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary transition-colors"
                >
                  Ayuda
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Link href="/login" className="btn-secondary flex-1 text-center">
                    Entrar
                  </Link>
                  <Link href="/registro-empresa" className="btn-primary flex-1 text-center">
                    Registrar empresa
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}