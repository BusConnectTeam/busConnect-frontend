'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { useUsers } from '@/hooks';
import { User, UserRole } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronDown, LogOut, Shield, User as UserIcon, Users } from 'lucide-react';
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

export default function UserSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, setCurrentUser, isLoading: isLoadingContext } = useCurrentUser();
  const { data: users, isLoading: isLoadingUsers, error, refetch } = useUsers();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsOpen(false);
  };

  const isLoading = isLoadingContext || isLoadingUsers;

  // Agrupar usuarios por rol
  const groupedUsers = users?.reduce(
    (acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    },
    {} as Record<UserRole, User[]>
  );

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
      >
        {currentUser ? (
          <>
            <span className={`p-1.5 rounded-md ${roleColors[currentUser.role]}`}>
              {roleIcons[currentUser.role]}
            </span>
            <span className="hidden lg:inline max-w-[120px] truncate">
              {currentUser.firstName}
            </span>
          </>
        ) : (
          <>
            <Users className="w-5 h-5" />
            <span className="hidden lg:inline">Demo</span>
          </>
        )}
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
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Iniciar sesión
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Selecciona tu cuenta
              </p>
            </div>

            {/* User list */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-petroleo border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-neutral-500 mt-2">Cargando usuarios...</p>
                </div>
              ) : error ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-red-500 mb-2">Error al cargar usuarios</p>
                  <p className="text-xs text-neutral-400 mb-3">
                    {error instanceof Error ? error.message : 'Verifica que el backend esté corriendo'}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-xs text-petroleo hover:underline"
                  >
                    Reintentar
                  </button>
                </div>
              ) : groupedUsers ? (
                <div>
                  {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                    <div key={role}>
                      <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700/50">
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {roleLabels[role as UserRole]}s
                      </span>
                    </div>
                    {roleUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className={`w-full px-4 py-3 flex items-center space-x-3
                                   hover:bg-neutral-100 dark:hover:bg-neutral-700/50
                                   transition-colors text-left
                                   ${currentUser?.id === user.id ? 'bg-petroleo/10 dark:bg-petroleo/20' : ''}`}
                      >
                        <span
                          className={`p-2 rounded-lg ${
                            role === 'ADMIN'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                              : role === 'COMPANY'
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}
                        >
                          {roleIcons[role as UserRole]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        {currentUser?.id === user.id && (
                          <span className="w-2 h-2 bg-petroleo rounded-full" />
                        )}
                      </button>
                    ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-neutral-500">No se pudieron cargar los usuarios</p>
                </div>
              )}
            </div>

            {/* Logout button */}
            {currentUser && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
