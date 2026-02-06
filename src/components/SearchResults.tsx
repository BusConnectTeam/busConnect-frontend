'use client';

import { busesApi, companiesApi } from '@/lib/api';
import { BusCompany, BusTypeEntity, RouteResult } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Bus,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Plug,
  Tv,
  Users,
  Wifi,
  Wind,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchResultsProps {
  routeResult: RouteResult;
  passengers: number;
  date: string;
  onSelectBus?: (bus: BusTypeEntity, company: BusCompany, estimatedPrice: number) => void;
}

interface BusWithCompany extends BusTypeEntity {
  company?: BusCompany;
  estimatedPrice: number;
}

const seatTypeLabels: Record<string, string> = {
  standard: 'Estándar',
  premium: 'Premium',
  vip: 'VIP',
  sleeper: 'Cama',
};

const seatTypeColors: Record<string, string> = {
  standard: 'bg-petroleo-50 text-petroleo-700 dark:bg-petroleo-950/50 dark:text-petroleo-300',
  premium: 'bg-coral-50 text-coral-700 dark:bg-coral-950/50 dark:text-coral-300',
  vip: 'bg-gradient-to-r from-petroleo-500 to-coral-500 text-white shadow-lg',
  sleeper: 'bg-petroleo-100 text-petroleo-800 dark:bg-petroleo-900/50 dark:text-petroleo-200',
};

export default function SearchResults({
  routeResult,
  passengers,
  date,
  onSelectBus,
}: SearchResultsProps) {
  const [buses, setBuses] = useState<BusWithCompany[]>([]);
  const [companies, setCompanies] = useState<Map<number, BusCompany>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Cambiado de 3 a 6 para mostrar 2 filas de 3 columnas

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar buses y empresas en paralelo
      const [busesData, companiesData] = await Promise.all([
        busesApi.getAll({ minCapacity: passengers }),
        companiesApi.getAll(),
      ]);

      // Crear mapa de empresas por ID
      const companiesMap = new Map<number, BusCompany>();
      companiesData.forEach((company) => {
        companiesMap.set(company.id, company);
      });
      setCompanies(companiesMap);

      // Filtrar buses activos con capacidad suficiente y calcular precio estimado
      const busesWithPrice: BusWithCompany[] = busesData
        .filter((bus) => bus.active && bus.capacity >= passengers)
        .map((bus) => ({
          ...bus,
          company: companiesMap.get(bus.companyId),
          estimatedPrice: Math.round(bus.pricePerKm * routeResult.distanceKm * 100) / 100,
        }))
        .sort((a, b) => a.estimatedPrice - b.estimatedPrice); // Ordenar por precio

      setBuses(busesWithPrice);
    } catch (err) {
      setError('Error al cargar los buses disponibles. Por favor, intenta de nuevo.');
      console.error('Error loading search results:', err);
    } finally {
      setLoading(false);
    }
  }, [passengers, routeResult.distanceKm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Resetear página cuando cambian los buses
  useEffect(() => {
    setCurrentPage(1);
  }, [buses.length]);

  // Calcular datos de paginación
  const totalPages = Math.ceil(buses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBuses = buses.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <div className="glass-container p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-coral mb-4" />
            <span className="text-white text-lg font-medium">Buscando buses disponibles...</span>
            <span className="text-white/60 text-sm mt-2">Estamos consultando las mejores opciones para ti</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <div className="glass-container p-8 border-coral/30">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-coral" />
            </div>
            <p className="text-white text-lg font-medium mb-2">Ups, algo salió mal</p>
            <p className="text-white/70 mb-6">{error}</p>
            <button
              onClick={loadData}
              className="btn-cta"
            >
              Reintentar búsqueda
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      {/* Header con info de ruta */}
      <div className="glass-container p-6 mb-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Ruta principal */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">
                {routeResult.origin} → {routeResult.destination}
              </h2>
              <div className="flex items-center gap-3 text-white/60 text-sm mt-1">
                <span className="font-medium">{routeResult.distanceKm.toFixed(0)} km</span>
                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(routeResult.durationMinutes)}
                </span>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="flex items-center gap-4 text-white/80">
            <div className="text-right">
              <p className="text-xs text-white/50 uppercase tracking-wide">Fecha</p>
              <p className="font-medium">{formatDate(date)}</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-right">
              <p className="text-xs text-white/50 uppercase tracking-wide">Pasajeros</p>
              <p className="font-medium flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {passengers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de buses en Grid */}
      {buses.length > 0 ? (
        <div>
          {/* Header con contador y paginación */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center">
                <Bus className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {buses.length} bus{buses.length !== 1 ? 'es' : ''}
                </p>
                <p className="text-white/50 text-xs">Disponibles para tu ruta</p>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-lg glass-container hover:border-coral/50 text-white
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all
                           hover:scale-105 disabled:hover:scale-100"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-white font-medium text-sm px-4 py-2 rounded-lg glass-container">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-lg glass-container hover:border-coral/50 text-white
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all
                           hover:scale-105 disabled:hover:scale-100"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Grid de 3 columnas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {currentBuses.map((bus, index) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-shine glass-container p-5 cursor-pointer group
                           flex flex-col h-full hover:border-coral/50 transition-all duration-300
                           hover:-translate-y-1 hover:shadow-2xl hover:shadow-coral/20"
                  onClick={() => bus.company && onSelectBus?.(bus, bus.company, bus.estimatedPrice)}
                >
                  {/* Header de la card con icono más grande */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl gradient-coral flex items-center justify-center
                                  flex-shrink-0 shadow-lg shadow-coral/30 group-hover:scale-110 transition-transform">
                      <Bus className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base truncate mb-2">{bus.name}</h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          seatTypeColors[bus.seatType] || seatTypeColors.standard
                        }`}
                      >
                        {seatTypeLabels[bus.seatType] || bus.seatType}
                      </span>
                    </div>
                  </div>

                  {/* Empresa con badge verificado mejorado */}
                  {bus.company && (
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                      <Building2 className="w-4 h-4 text-white/60" />
                      <span className="text-white/90 text-sm truncate font-medium">{bus.company.name}</span>
                      {bus.company.verified && (
                        <span className="badge-verified ml-auto">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Verificada</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Amenities con mejor espaciado */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-white/80">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">{bus.capacity}</span>
                    </div>
                    {bus.hasWifi && (
                      <div className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                        <Wifi className="w-4 h-4" aria-label="WiFi" />
                      </div>
                    )}
                    {bus.hasAc && (
                      <div className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                        <Wind className="w-4 h-4" aria-label="Aire acondicionado" />
                      </div>
                    )}
                    {bus.hasToilet && (
                      <div className="px-2 py-1 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                        <span className="text-xs font-medium">WC</span>
                      </div>
                    )}
                    {bus.hasUsbChargers && (
                      <div className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                        <Plug className="w-4 h-4" aria-label="Cargadores USB" />
                      </div>
                    )}
                    {bus.hasEntertainmentSystem && (
                      <div className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                        <Tv className="w-4 h-4" aria-label="Sistema de entretenimiento" />
                      </div>
                    )}
                  </div>

                  {/* Precio y botón mejorado */}
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Precio estimado</p>
                        <p className="text-2xl font-bold text-white mb-0.5">
                          ~{bus.estimatedPrice.toFixed(0)}€
                        </p>
                        <p className="text-white/40 text-xs">
                          {bus.pricePerKm.toFixed(2)}€/km
                        </p>
                      </div>
                      <button
                        className="btn-cta px-4 py-2.5 text-sm whitespace-nowrap
                                 flex items-center gap-1.5 group-hover:scale-105 transition-transform"
                      >
                        Solicitar
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Indicadores de página (puntos) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-full transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-coral w-8 h-2 shadow-lg shadow-coral/50'
                      : 'bg-white/30 hover:bg-white/50 w-2 h-2 hover:scale-125'
                  }`}
                  aria-label={`Ir a página ${page}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-container p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Bus className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">
              No hay buses disponibles
            </h3>
            <p className="text-white/70 mb-2">
              No encontramos buses con capacidad para {passengers} pasajeros en esta ruta.
            </p>
            <p className="text-white/50 text-sm mb-6">
              Intenta reducir el número de pasajeros o contacta con nosotros para opciones personalizadas.
            </p>
            <button className="btn-secondary">
              Contactar con soporte
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
