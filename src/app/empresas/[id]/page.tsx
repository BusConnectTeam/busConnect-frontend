'use client';

import { busesApi, companiesApi } from '@/lib/api';
import { BusCompany, BusTypeEntity } from '@/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  Building2,
  Bus,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plug,
  Shield,
  Sparkles,
  Star,
  Tv,
  Users,
  Wifi,
  Wind,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const seatTypeLabels: Record<string, string> = {
  standard: 'Estándar',
  premium: 'Premium',
  vip: 'VIP',
  sleeper: 'Cama',
};

const seatTypeColors: Record<string, string> = {
  standard: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
  premium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  vip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  sleeper: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function EmpresaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = Number(params.id);

  const [company, setCompany] = useState<BusCompany | null>(null);
  const [buses, setBuses] = useState<BusTypeEntity[]>([]);
  const [stats, setStats] = useState<{ totalBuses: number; totalDrivers: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!companyId || isNaN(companyId)) {
      setError('ID de empresa inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [companyData, busesData, statsData] = await Promise.all([
        companiesApi.getById(companyId),
        busesApi.getByCompany(companyId),
        companiesApi.getStats(companyId),
      ]);

      setCompany(companyData);
      setBuses(busesData.filter((b) => b.active));
      setStats({ totalBuses: statsData.busCount, totalDrivers: statsData.driverCount });
    } catch (error) {
      console.error('Error loading company details:', error);
      setError('No se pudo cargar la información de la empresa.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-32" role="status" aria-live="polite">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-petroleo" aria-hidden="true" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-petroleo/20 rounded-full"></div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 font-medium">
              Cargando empresa...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24">
        <div className="container-custom">
          <div className="text-center py-32" role="alert">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-10 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {error || 'Empresa no encontrada'}
              </p>
              <div className="flex gap-4 justify-center">
                <button type="button" onClick={() => router.back()} className="btn-secondary">
                  Volver
                </button>
                <button type="button" onClick={loadData} className="btn-primary">
                  Reintentar
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  // Calcular años de experiencia
  const yearsOfExperience = company.foundedYear
    ? new Date().getFullYear() - company.foundedYear
    : null;

  return (
    <main className="min-h-screen">
      {/* SECCIÓN 1: Hero - Fondo OSCURO (gradiente petroleo) */}
      <section
        className="hero-wave gradient-primary pt-24 pb-28 pattern-dots"
        aria-labelledby="company-title"
      >
        <div className="container-custom relative">
          {/* Breadcrumb navegación */}
          <nav aria-label="Navegación de migas de pan">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link
                href="/empresas"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Volver a empresas
              </Link>
            </motion.div>
          </nav>

          <header>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Logo con efecto */}
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/20 shadow-2xl">
                  {company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.logoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-14 h-14 md:w-18 md:h-18 text-white/50" aria-hidden="true" />
                  )}
                </div>
                {company.verified && (
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-petroleo shadow-lg"
                    aria-label="Empresa verificada"
                  >
                    <CheckCircle className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Info principal */}
              <div className="flex-1">
                {company.verified && (
                  <div className="mb-3">
                    <span className="badge-verified">
                      <Shield className="w-4 h-4" aria-hidden="true" />
                      Empresa Verificada
                    </span>
                  </div>
                )}

                <h1
                  id="company-title"
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
                >
                  {company.name}
                </h1>
                <p className="text-white/70 text-lg mb-6">{company.legalName}</p>

                {/* Stats destacados */}
                <div
                  className="flex flex-wrap gap-4"
                  aria-label="Estadísticas de la empresa"
                >
                  <div className="stat-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-coral/20 rounded-lg flex items-center justify-center">
                        <Bus className="w-5 h-5 text-coral" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats?.totalBuses ?? 0}</p>
                        <p className="text-white/60 text-sm">Autocares</p>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats?.totalDrivers ?? 0}</p>
                        <p className="text-white/60 text-sm">Conductores</p>
                      </div>
                    </div>
                  </div>
                  {yearsOfExperience && yearsOfExperience > 0 && (
                    <div className="stat-card">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{yearsOfExperience}</p>
                          <p className="text-white/60 text-sm">Años experiencia</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </header>
        </div>
      </section>

      {/* SECCIÓN 2: Contenido principal - Fondo CLARO */}
      <section
        className="section bg-neutral-50 dark:bg-neutral-900 -mt-8"
        aria-labelledby="fleet-title"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal - Flota de buses */}
            <div className="lg:col-span-2">
              {/* Header de sección con acento de color */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-6 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden"
              >
                {/* Acento decorativo superior */}
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" aria-hidden="true" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                      <Bus className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2
                        id="fleet-title"
                        className="text-2xl font-bold text-neutral-900 dark:text-white"
                      >
                        Flota de Autocares
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {buses.length} vehículo{buses.length !== 1 ? 's' : ''} disponible{buses.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  {buses.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2 text-sm bg-coral/10 text-coral-700 dark:text-coral px-3 py-1.5 rounded-full">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span className="font-medium">Flota actualizada</span>
                    </div>
                  )}
                </div>
              </motion.header>

              {buses.length > 0 ? (
                <div className="space-y-4">
                  {buses.map((bus, index) => (
                    <motion.article
                      key={bus.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-featured card-shine group"
                      aria-label={`Autocar ${bus.name}`}
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Imagen o placeholder */}
                        <div className="w-full sm:w-44 h-36 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {bus.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={bus.imageUrl}
                              alt={bus.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Bus className="w-14 h-14 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                          )}
                        </div>

                        {/* Info del bus */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-1">
                                {bus.name}
                              </h3>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  seatTypeColors[bus.seatType] || seatTypeColors.standard
                                }`}
                              >
                                {seatTypeLabels[bus.seatType] || bus.seatType}
                              </span>
                            </div>
                            {bus.pricePerKm > 0 && (
                              <div className="text-right gradient-primary rounded-xl px-4 py-2 shadow-md">
                                <p className="text-2xl font-bold text-white">
                                  {bus.pricePerKm.toFixed(2)}€
                                </p>
                                <p className="text-xs text-white/70">por km</p>
                              </div>
                            )}
                          </div>

                          {bus.description && (
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                              {bus.description}
                            </p>
                          )}

                          {/* Características con iconos */}
                          <div className="flex flex-wrap items-center gap-2" aria-label="Características del vehículo">
                            <span className="flex items-center gap-2 bg-petroleo/10 dark:bg-petroleo/20 border border-petroleo/20 px-3 py-1.5 rounded-lg text-sm font-semibold text-petroleo dark:text-petroleo-300">
                              <Users className="w-4 h-4" aria-hidden="true" />
                              {bus.capacity} plazas
                            </span>
                            {bus.hasWifi && (
                              <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 text-sm bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-lg">
                                <Wifi className="w-4 h-4 text-petroleo" aria-hidden="true" /> WiFi
                              </span>
                            )}
                            {bus.hasAc && (
                              <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 text-sm bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-lg">
                                <Wind className="w-4 h-4 text-petroleo" aria-hidden="true" /> A/C
                              </span>
                            )}
                            {bus.hasToilet && (
                              <span className="text-neutral-700 dark:text-neutral-300 text-sm bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-lg">
                                🚻 WC
                              </span>
                            )}
                            {bus.hasUsbChargers && (
                              <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 text-sm bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-lg">
                                <Plug className="w-4 h-4 text-petroleo" aria-hidden="true" /> USB
                              </span>
                            )}
                            {bus.hasEntertainmentSystem && (
                              <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 text-sm bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-lg">
                                <Tv className="w-4 h-4 text-petroleo" aria-hidden="true" /> Entretenimiento
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-featured text-center py-16"
                >
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bus className="w-10 h-10 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Sin vehículos registrados
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                    Esta empresa aún no tiene autocares registrados en la plataforma.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar - Información de contacto con gradiente petróleo */}
            <aside className="lg:col-span-1" aria-labelledby="contact-title">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="gradient-primary rounded-2xl p-6 sticky top-24 pattern-dots shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <h3 id="contact-title" className="font-bold text-lg text-white">
                    Información de contacto
                  </h3>
                </div>

                <address className="space-y-3 not-italic">
                  {(company.address || company.city) && (
                    <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                      <MapPin className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        {company.address && (
                          <p className="text-white font-medium">
                            {company.address}
                          </p>
                        )}
                        <p className="text-white/70 text-sm">
                          {company.postalCode && `${company.postalCode} `}
                          {company.city}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors group"
                    >
                      <Phone className="w-5 h-5 text-coral flex-shrink-0" aria-hidden="true" />
                      <span className="text-white group-hover:text-coral transition-colors font-medium">
                        {company.phone}
                      </span>
                    </a>
                  )}

                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors group"
                    >
                      <Mail className="w-5 h-5 text-coral flex-shrink-0" aria-hidden="true" />
                      <span className="text-white group-hover:text-coral transition-colors truncate font-medium">
                        {company.email}
                      </span>
                    </a>
                  )}

                  {company.website && (
                    <a
                      href={
                        company.website.startsWith('http')
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-coral flex-shrink-0" aria-hidden="true" />
                      <span className="text-white group-hover:text-coral transition-colors truncate font-medium">
                        {company.website.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  )}
                </address>

                {/* CIF */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <dl>
                    <div className="flex items-center justify-between text-sm">
                      <dt className="text-white/70">CIF</dt>
                      <dd className="font-mono text-white bg-white/10 px-2 py-1 rounded">
                        {company.cif}
                      </dd>
                    </div>
                    {company.foundedYear && (
                      <div className="flex items-center justify-between text-sm mt-3">
                        <dt className="text-white/70">Fundada en</dt>
                        <dd className="font-medium text-white">
                          {company.foundedYear}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    href={`/?company=${company.id}`}
                    className="btn-cta w-full flex items-center justify-center gap-2 shadow-lg shadow-coral/30"
                  >
                    Solicitar presupuesto
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                  <p className="text-center text-xs text-white/60 mt-3">
                    Respuesta en menos de 24 horas
                  </p>
                </div>

                {/* Trust badges */}
                {company.verified && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex flex-col gap-3" aria-label="Garantías de la empresa">
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <Shield className="w-4 h-4 text-green-400" aria-hidden="true" />
                        <span>Empresa verificada</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <Star className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        <span>Documentación al día</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <Award className="w-4 h-4 text-coral" aria-hidden="true" />
                        <span>Flota inspeccionada</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CTA - Fondo OSCURO (gradiente petroleo más intenso) */}
      <section
        className="relative gradient-primary py-20 overflow-hidden"
        aria-labelledby="cta-title"
      >
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 pattern-grid opacity-50" aria-hidden="true" />

        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-coral/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-coral" aria-hidden="true" />
              Presupuesto sin compromiso
            </div>

            <h2
              id="cta-title"
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              ¿Te interesa {company.name}?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Solicita un presupuesto personalizado y recibe una respuesta en menos de 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/?company=${company.id}`}
                className="btn-cta inline-flex items-center justify-center gap-2 shadow-xl shadow-coral/30 hover:shadow-coral/40"
              >
                Solicitar presupuesto
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/empresas"
                className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 inline-flex items-center justify-center gap-2"
              >
                Ver más empresas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
