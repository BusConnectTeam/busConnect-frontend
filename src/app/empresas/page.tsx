'use client';

import { companiesApi } from '@/lib/api';
import { BusCompany } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Building2,
  Bus,
  Calendar,
  CheckCircle,
  ChevronRight,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface CompanyWithStats extends BusCompany {
  totalBuses?: number;
  totalDrivers?: number;
}

// Mapeo de nombres de empresas a sus imágenes
const getCompanyImage = (companyName: string): string | null => {
  const imageMap: Record<string, string> = {
    'Autocares Barcelona Premium': '/images/companies/autocares-barcelona-premium.png',
    'Costa Brava Tours': '/images/companies/costa-brava-tours.png',
    'Transports Modernos': '/images/companies/transports-modernos-sa.png',
    'Transports Modernos SA': '/images/companies/transports-modernos-sa.png',
    'Catalunya Express': '/images/companies/autocares-express.png',
    'Autocares Cataluña Express': '/images/companies/autocares-express.png',
    'Pirineus Bus': '/images/companies/autocares-barcelona-premium.png',
    'Girona Viatges': '/images/companies/costa-brava-tours.png',
    'Delta Ebre Transport': '/images/companies/transports-modernos-sa.png',
    'Autocars Metropolitans': '/images/companies/autocares-express.png',
  };
  
  return imageMap[companyName] || null;
};

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);

  // Estadísticas globales
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalBuses: 0,
    totalDrivers: 0,
    verifiedCompanies: 0,
  });

  // Cargar empresas
  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await companiesApi.getAll();

      // Cargar stats para cada empresa
      const companiesWithStats = await Promise.all(
        data.map(async (company) => {
          try {
            const stats = await companiesApi.getStats(company.id);
            return {
              ...company,
              totalBuses: stats.busCount,
              totalDrivers: stats.driverCount,
            };
          } catch (error) {
            console.error(`Error loading stats for company ${company.id}:`, error);
            return { ...company, totalBuses: 0, totalDrivers: 0 };
          }
        })
      );

      setCompanies(companiesWithStats);
      setFilteredCompanies(companiesWithStats);

      // Calcular estadísticas globales
      const totalBuses = companiesWithStats.reduce((acc, c) => acc + (c.totalBuses ?? 0), 0);
      const totalDrivers = companiesWithStats.reduce((acc, c) => acc + (c.totalDrivers ?? 0), 0);
      // Todas las empresas en la plataforma están verificadas
      const verifiedCompanies = companiesWithStats.length;

      setGlobalStats({
        totalCompanies: companiesWithStats.length,
        totalBuses,
        totalDrivers,
        verifiedCompanies,
      });

      // Extraer ciudades únicas
      const citiesArray = data.map((c) => c.city).filter((city): city is string => city !== null && city !== undefined);
      const uniqueCities = [...new Set(citiesArray)].sort();
      setCities(uniqueCities);
    } catch {
      setError('Error al cargar las empresas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Filtrar empresas
  useEffect(() => {
    let filtered = companies;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.legalName.toLowerCase().includes(term) ||
          c.city?.toLowerCase().includes(term)
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((c) => c.city === selectedCity);
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, selectedCity, companies]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
  };

  const hasFilters = searchTerm || selectedCity;

  return (
    <main className="min-h-screen">
      {/* SECCIÓN 1: Hero - Fondo OSCURO (gradiente petroleo) */}
      <section
        className="hero-wave gradient-primary pt-24 pb-24 pattern-dots"
        aria-labelledby="hero-title"
      >
        <div className="container-custom relative">
          <header className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-coral" />
                <span className="text-white/90 text-sm font-medium">
                  Todas las empresas verificadas en Catalunya
                </span>
              </motion.div>

              <h1
                id="hero-title"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                Encuentra tu{' '}
                <span className="text-gradient-coral">autocar ideal</span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Conectamos viajeros con las mejores empresas de transporte.
                Calidad, seguridad y confianza garantizadas.
              </p>
            </motion.div>

            {/* Stats destacados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10"
              aria-label="Estadísticas de la plataforma"
            >
              <div className="stat-card text-center">
                <div className="stat-number">{globalStats.totalCompanies}</div>
                <p className="text-white/70 text-sm mt-1">Empresas</p>
              </div>
              <div className="stat-card text-center">
                <div className="stat-number">{globalStats.totalBuses}</div>
                <p className="text-white/70 text-sm mt-1">Autocares</p>
              </div>
              <div className="stat-card text-center">
                <div className="stat-number">{globalStats.totalDrivers}</div>
                <p className="text-white/70 text-sm mt-1">Conductores</p>
              </div>
              <div className="stat-card text-center">
                <div className="stat-number">{globalStats.verifiedCompanies}</div>
                <p className="text-white/70 text-sm mt-1">Verificadas</p>
              </div>
            </motion.div>
          </header>

          {/* Buscador */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <search className="glass-dark rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <label htmlFor="search-input" className="sr-only">Buscar empresa</label>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" aria-hidden="true" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar empresa por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field-dark pl-12"
                  />
                </div>

                <div className="md:w-56">
                  <label htmlFor="city-filter" className="sr-only">Filtrar por ciudad</label>
                  <select
                    id="city-filter"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="input-field-dark"
                  >
                    <option value="">Todas las ciudades</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtros activos */}
              {hasFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 flex items-center gap-2 flex-wrap"
                  aria-live="polite"
                >
                  <span className="text-white/60 text-sm">Filtros:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm border border-white/20">
                      &quot;{searchTerm}&quot;
                      <button
                        onClick={() => setSearchTerm('')}
                        className="hover:text-coral transition-colors ml-1"
                        aria-label={`Eliminar filtro de búsqueda: ${searchTerm}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm border border-white/20">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {selectedCity}
                      <button
                        onClick={() => setSelectedCity('')}
                        className="hover:text-coral transition-colors ml-1"
                        aria-label={`Eliminar filtro de ciudad: ${selectedCity}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-coral hover:text-coral-400 text-sm transition-colors font-medium"
                  >
                    Limpiar todo
                  </button>
                </motion.div>
              )}
            </search>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 2: Beneficios - Fondo CLARO (blanco) */}
      <section
        className="py-8 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
        aria-label="Beneficios de la plataforma"
      >
        <div className="container-custom">
          <ul className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm list-none">
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Shield className="w-5 h-5 text-petroleo" aria-hidden="true" />
              <span>Empresas verificadas</span>
            </li>
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Star className="w-5 h-5 text-coral" aria-hidden="true" />
              <span>Valoraciones reales</span>
            </li>
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <TrendingUp className="w-5 h-5 text-petroleo" aria-hidden="true" />
              <span>Mejores precios</span>
            </li>
            <li className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Award className="w-5 h-5 text-coral" aria-hidden="true" />
              <span>Calidad garantizada</span>
            </li>
          </ul>
        </div>
      </section>

      {/* SECCIÓN 3: Empresas Destacadas - Fondo CLARO con acento */}
      {!loading && !error && filteredCompanies.length > 0 && !hasFilters && (
        <section
          className="py-16 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900"
          aria-labelledby="featured-title"
        >
          <div className="container-custom">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-petroleo/10 dark:bg-petroleo/20 text-petroleo dark:text-petroleo-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Lo mejor de Catalunya
              </div>
              <h2 id="featured-title" className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                Empresas Destacadas
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Las empresas más confiables y con mejor reputación en nuestra plataforma
              </p>
            </motion.header>

            {/* Grid especial para empresas destacadas (verificadas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCompanies
                .filter((c) => c.verified)
                .slice(0, 6)
                .map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FeaturedCompanyCard company={company} />
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 4: Listado de empresas - Fondo CLARO (neutral-50) */}
      <section
        className="section bg-neutral-50 dark:bg-neutral-900"
        aria-labelledby="companies-title"
      >
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-petroleo" aria-hidden="true" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-petroleo/20 rounded-full"></div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mt-4 font-medium">
                Cargando empresas...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20" role="alert">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-10 max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-red-500" aria-hidden="true" />
                </div>
                <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
                <button onClick={loadCompanies} className="btn-primary">
                  Reintentar
                </button>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Header de sección */}
              <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h2
                    id="companies-title"
                    className="text-2xl font-bold text-neutral-900 dark:text-white"
                  >
                    {hasFilters ? 'Resultados de búsqueda' : 'Todas las empresas'}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1" aria-live="polite">
                    {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''}{' '}
                    encontrada{filteredCompanies.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Chips de ciudades populares */}
                {!hasFilters && cities.length > 0 && (
                  <nav aria-label="Filtrar por ciudades populares">
                    <ul className="flex flex-wrap gap-2 list-none">
                      {cities.slice(0, 4).map((city) => (
                        <li key={city}>
                          <button
                            onClick={() => setSelectedCity(city)}
                            className="chip"
                          >
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {city}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </motion.header>

              {/* Grid de empresas */}
              {filteredCompanies.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  aria-label="Listado de empresas de autocares"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredCompanies.map((company, index) => (
                      <CompanyCard key={company.id} company={company} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    No se encontraron empresas
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                    Intenta con otros términos de búsqueda o elimina los filtros para ver todas las empresas disponibles.
                  </p>
                  {hasFilters && (
                    <button onClick={clearFilters} className="btn-secondary">
                      Limpiar filtros
                    </button>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SECCIÓN 5: CTA Mejorada - Diseño tipo tarjeta con división */}
      <section
        className="relative py-20 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
        aria-labelledby="cta-title"
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-petroleo rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Columna Izquierda - Contenido Principal */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-petroleo/10 dark:bg-petroleo/20 text-petroleo dark:text-petroleo-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <Building2 className="w-4 h-4" aria-hidden="true" />
                  PARA EMPRESAS
                </div>

                <h2
                  id="cta-title"
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight"
                >
                  Impulsa tu empresa de <span className="text-gradient-petroleo">autocares</span>
                </h2>
                
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Únete a la red de transporte más confiable de Catalunya. Conecta con miles de clientes y haz crecer tu negocio.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link 
                    href="/registro-empresa" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-petroleo to-petroleo-600 hover:from-petroleo-600 hover:to-petroleo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Registrar mi empresa
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                  <Link 
                    href="/como-funciona" 
                    className="inline-flex items-center justify-center gap-2 border-2 border-neutral-300 dark:border-neutral-600 hover:border-petroleo dark:hover:border-petroleo text-neutral-700 dark:text-neutral-300 hover:text-petroleo dark:hover:text-petroleo px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                  >
                    Más información
                  </Link>
                </div>

                {/* Stats rápidos */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <p className="text-3xl font-bold text-petroleo dark:text-petroleo-300">500+</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Clientes activos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-petroleo dark:text-petroleo-300">24h</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Tiempo respuesta</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-petroleo dark:text-petroleo-300">98%</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Satisfacción</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Columna Derecha - Beneficios con iconos grandes */}
            <div className="bg-gradient-to-br from-petroleo via-petroleo-600 to-petroleo-700 p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-8">
                  ¿Por qué elegirnos?
                </h3>

                <ul className="space-y-6 list-none">
                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Alcance Masivo</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Miles de usuarios buscan servicios de transporte cada día en nuestra plataforma
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Verificación Premium</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Sello de confianza que aumenta la credibilidad y las conversiones
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Análisis Detallados</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Herramientas profesionales para gestionar y optimizar tu negocio
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Sin Comisiones</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Modelo transparente sin costes ocultos ni comisiones por reserva
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Componente de tarjeta destacada (más compacta y elegante)
function FeaturedCompanyCard({ company }: { company: CompanyWithStats }) {
  return (
    <Link
      href={`/empresas/${company.id}`}
      className="group block relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border-2 border-petroleo/20 dark:border-petroleo/30 hover:border-petroleo dark:hover:border-petroleo transition-all duration-300 hover:shadow-2xl hover:shadow-petroleo/20 hover:-translate-y-2"
    >
      {/* Badge verificada con estilo premium */}
      <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
        <Shield className="w-3.5 h-3.5" aria-hidden="true" />
        VERIFICADA
      </div>

      {/* Header con logo */}
      <div className="relative h-40 overflow-hidden">
        {/* Logo centrado */}
        <div className="relative z-10 h-full flex items-center justify-center p-4">
          {(getCompanyImage(company.name) || company.logoUrl) ? (
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
              <Image
                src={getCompanyImage(company.name) || company.logoUrl || ''}
                alt={`Logo de ${company.name}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-12 h-12 text-petroleo" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1 group-hover:text-petroleo dark:group-hover:text-petroleo-300 transition-colors line-clamp-1">
          {company.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-1">{company.legalName}</p>

        {/* Stats en línea */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-petroleo/10 dark:bg-petroleo/20 rounded-lg flex items-center justify-center">
              <Bus className="w-4 h-4 text-petroleo" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{company.totalBuses ?? 0}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Buses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-coral/10 dark:bg-coral/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-coral" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{company.totalDrivers ?? 0}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Conductores</p>
            </div>
          </div>
        </div>

        {/* Info compacta */}
        <div className="space-y-2 text-sm mb-4">
          {company.city && (
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <MapPin className="w-4 h-4 text-petroleo/70" aria-hidden="true" />
              <span className="truncate font-medium">{company.city}</span>
            </div>
          )}
          {company.foundedYear && (
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Calendar className="w-4 h-4 text-petroleo/70" aria-hidden="true" />
              <span>Desde {company.foundedYear}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between text-petroleo dark:text-petroleo-300 font-semibold text-sm group-hover:text-petroleo-600 dark:group-hover:text-petroleo-200 transition-colors">
          <span>Ver detalles</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

// Componente de tarjeta de empresa mejorado
function CompanyCard({ company, index }: { company: CompanyWithStats; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-petroleo/30 dark:hover:border-petroleo/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      aria-label={`Empresa ${company.name}`}
    >
      {/* Badge de verificada */}
      {company.verified && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Verificada
        </div>
      )}

      <Link href={`/empresas/${company.id}`} className="block" aria-label={`Ver detalles de ${company.name}`}>
        {/* Header con imagen/logo */}
        <div className="relative h-52 overflow-hidden">
          {/* Logo o imagen de la empresa */}
          <div className="relative z-10 h-full flex items-center justify-center p-4">
            {(getCompanyImage(company.name) || company.logoUrl) ? (
              <div className="relative w-full h-full">
                <Image
                  src={getCompanyImage(company.name) || company.logoUrl || ''}
                  alt={`Logo de ${company.name}`}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-neutral-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-16 h-16 text-petroleo" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-6">
          {/* Nombre de la empresa */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-1 group-hover:text-petroleo dark:group-hover:text-petroleo-300 transition-colors line-clamp-1">
              {company.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
              {company.legalName}
            </p>
          </div>

          {/* Estadísticas destacadas */}
          <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-neutral-200 dark:border-neutral-700">
            <div className="bg-gradient-to-br from-petroleo/10 to-petroleo/5 dark:from-petroleo/20 dark:to-petroleo/10 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Bus className="w-4 h-4 text-petroleo" aria-hidden="true" />
                <p className="text-2xl font-bold text-petroleo dark:text-petroleo-300">
                  {company.totalBuses ?? 0}
                </p>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Autocares</p>
            </div>
            <div className="bg-gradient-to-br from-coral/10 to-coral/5 dark:from-coral/20 dark:to-coral/10 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-coral" aria-hidden="true" />
                <p className="text-2xl font-bold text-coral dark:text-coral-300">
                  {company.totalDrivers ?? 0}
                </p>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Conductores</p>
            </div>
          </div>

          {/* Información de contacto compacta */}
          <address className="space-y-2.5 text-sm not-italic mb-5">
            {company.city && (
              <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-petroleo" aria-hidden="true" />
                </div>
                <span className="truncate font-medium">{company.city}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-petroleo" aria-hidden="true" />
                </div>
                <span className="font-medium">{company.phone}</span>
              </div>
            )}
          </address>

          {/* Footer con badges */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 text-xs">
              {company.foundedYear && (
                <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2.5 py-1.5 rounded-lg font-medium">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {company.foundedYear}
                </span>
              )}
              {company.website && (
                <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2.5 py-1.5 rounded-lg font-medium">
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  Web
                </span>
              )}
            </div>
            <span className="text-petroleo dark:text-petroleo-300 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver más
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </footer>
        </div>
      </Link>
    </motion.article>
  );
}
