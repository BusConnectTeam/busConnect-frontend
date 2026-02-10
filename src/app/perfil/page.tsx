'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import {
  Calendar,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Building2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  CUSTOMER: 'Cliente',
  COMPANY: 'Empresa',
};

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CUSTOMER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  COMPANY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <Shield className="w-4 h-4" />,
  CUSTOMER: <UserIcon className="w-4 h-4" />,
  COMPANY: <Building2 className="w-4 h-4" />,
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-petroleo" />
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <div className="h-16" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-petroleo via-petroleo-700 to-petroleo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-coral rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm
                            flex items-center justify-center text-3xl font-bold text-white
                            border border-white/30">
              {initials}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/70 mt-1">{user.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                              bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-white/80">{roleIcons[user.role]}</span>
                <span className="text-sm font-medium text-white">
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Info card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg
                          border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
              Información personal
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-petroleo/10 dark:bg-petroleo/20">
                  <Mail className="w-5 h-5 text-petroleo dark:text-petroleo-300" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-petroleo/10 dark:bg-petroleo/20">
                  <Phone className="w-5 h-5 text-petroleo dark:text-petroleo-300" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Teléfono</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {user.phone || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-petroleo/10 dark:bg-petroleo/20">
                  <Calendar className="w-5 h-5 text-petroleo dark:text-petroleo-300" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Miembro desde</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {memberSince}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${roleColors[user.role]}`}>
                  {roleIcons[user.role]}
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Rol</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {roleLabels[user.role]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg
                          border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
              Acciones
            </h2>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           border border-red-200 dark:border-red-800
                           text-red-600 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-950/20
                           transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
