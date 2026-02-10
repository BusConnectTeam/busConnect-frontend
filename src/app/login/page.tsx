'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks';
import { ApiException } from '@/lib/api';
import { LoginFormData, loginSchema } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Bus, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await loginMutation.mutateAsync(data);
      login(response);
      router.push('/');
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 401) {
          setServerError('Email o contraseña incorrectos');
        } else if (error.status === 400) {
          setServerError(error.message);
        } else {
          setServerError(error.message);
        }
      } else {
        setServerError('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-petroleo" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-petroleo via-petroleo-700 to-petroleo-900
                     relative overflow-hidden items-center justify-center p-12"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-8">
              <Bus className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Bienvenido a BusConnect
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              La plataforma de reservas de autocares más completa de Catalunya.
              Encuentra y reserva el transporte perfecto para tu viaje.
            </p>
          </div>
        </motion.div>

        {/* Right: Login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12
                        bg-neutral-50 dark:bg-neutral-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="bg-petroleo/10 dark:bg-petroleo/20 p-3 rounded-2xl inline-flex mb-4">
                <Bus className="w-8 h-8 text-petroleo dark:text-petroleo-300" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Iniciar sesión
              </h1>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl
                            border border-neutral-200 dark:border-neutral-700 p-8">
              <div className="hidden lg:block mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Iniciar sesión
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  Accede a tu cuenta de BusConnect
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200
                             dark:border-red-800 rounded-xl p-4"
                  role="alert"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {serverError}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5
                                     text-neutral-400" aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      {...register('email')}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-neutral-900
                                  text-neutral-900 dark:text-white placeholder:text-neutral-400
                                  focus:outline-none focus:ring-2 focus:ring-petroleo/50 focus:border-petroleo
                                  transition-colors ${
                                    errors.email
                                      ? 'border-red-300 dark:border-red-700'
                                      : 'border-neutral-300 dark:border-neutral-600'
                                  }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5
                                     text-neutral-400" aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Tu contraseña"
                      {...register('password')}
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white dark:bg-neutral-900
                                  text-neutral-900 dark:text-white placeholder:text-neutral-400
                                  focus:outline-none focus:ring-2 focus:ring-petroleo/50 focus:border-petroleo
                                  transition-colors ${
                                    errors.password
                                      ? 'border-red-300 dark:border-red-700'
                                      : 'border-neutral-300 dark:border-neutral-600'
                                  }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400
                                 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || loginMutation.isPending}
                  className="w-full py-3 px-6 bg-petroleo hover:bg-petroleo-700
                             text-white font-semibold rounded-xl transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-petroleo/50 focus:ring-offset-2
                             dark:focus:ring-offset-neutral-800"
                >
                  {isSubmitting || loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  ¿No tienes cuenta?{' '}
                  <Link
                    href="/registro"
                    className="text-petroleo dark:text-petroleo-300 font-medium
                               hover:underline focus:outline-none focus:underline"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
