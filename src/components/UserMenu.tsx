'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Shield, User as UserIcon, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <Shield className="w-4 h-4" />,
  CUSTOMER: <UserIcon className="w-4 h-4" />,
  COMPANY: <Building2 className="w-4 h-4" />,
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Admin',
  CUSTOMER: 'Cliente',
  COMPANY: 'Empresa',
};

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-amber-500/20 text-amber-200',
  CUSTOMER: 'bg-emerald-500/20 text-emerald-200',
  COMPANY: 'bg-blue-500/20 text-blue-200',
};

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white/90 hover:text-white
                   transition-colors duration-200 px-3 py-2 min-h-touch
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-white/50 focus-visible:ring-offset-2
                   focus-visible:ring-offset-petroleo rounded-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={`p-1.5 rounded-md ${roleColors[user.role]}`}>
          {roleIcons[user.role]}
        </span>
        <span className="hidden lg:inline max-w-[120px] truncate">
          {user.firstName}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-800
                       rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700
                       overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b
                            border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-petroleo/10 dark:bg-petroleo/20
                                flex items-center justify-center text-sm font-bold
                                text-petroleo dark:text-petroleo-300">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 flex items-center space-x-3
                           hover:bg-neutral-100 dark:hover:bg-neutral-700/50
                           transition-colors text-left"
              >
                <UserIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Mi perfil
                </span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center space-x-3
                           text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                           transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
