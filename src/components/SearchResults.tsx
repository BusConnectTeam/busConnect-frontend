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
  standard: 'bg-neutral-100 text-neutral-700',
  premium: 'bg-blue-100 text-blue-700',
  vip: 'bg-amber-100 text-amber-700',
  sleeper: 'bg-purple-100 text-purple-700',
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
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-coral mb-3" />
            <span className="text-white/80">Buscando buses disponibles...</span>
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
        <div className="bg-white/10 backdrop-blur-sm border border-red-400/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-white/80">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
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
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-coral" />
              <span className="text-white font-medium">
                {routeResult.origin} → {routeResult.destination}
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span>{routeResult.distanceKm.toFixed(0)} km</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(routeResult.durationMinutes)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{formatDate(date)}</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {passengers} pasajeros
            </span>
          </div>
        </div>
      </div>

      {/* Lista de buses en Grid */}
      {buses.length > 0 ? (
        <div>
          {/* Header con contador y paginación */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/60 text-sm">
              {buses.length} bus{buses.length !== 1 ? 'es' : ''} disponible{buses.length !== 1 ? 's' : ''}
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-white/70 text-sm px-3">
                  {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentBuses.map((bus) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4
                           hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer group
                           flex flex-col h-full"
                  onClick={() => bus.company && onSelectBus?.(bus, bus.company, bus.estimatedPrice)}
                >
                  {/* Header de la card */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-coral" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{bus.name}</h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          seatTypeColors[bus.seatType] || seatTypeColors.standard
                        }`}
                      >
                        {seatTypeLabels[bus.seatType] || bus.seatType}
                      </span>
                    </div>
                  </div>

                  {/* Empresa */}
                  {bus.company && (
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 text-xs truncate">{bus.company.name}</span>
                      {bus.company.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="flex items-center gap-1 text-white/60 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      {bus.capacity}
                    </span>
                    {bus.hasWifi && <Wifi className="w-3.5 h-3.5 text-white/60" />}
                    {bus.hasAirConditioning && <Wind className="w-3.5 h-3.5 text-white/60" />}
                    {bus.hasToilet && (
                      <span className="text-white/60 text-xs">WC</span>
                    )}
                    {bus.hasUSBChargers && <Plug className="w-3.5 h-3.5 text-white/60" />}
                    {bus.hasEntertainment && <Tv className="w-3.5 h-3.5 text-white/60" />}
                  </div>

                  {/* Precio y botón */}
                  <div className="mt-auto pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-white">
                          ~{bus.estimatedPrice.toFixed(0)}€
                        </p>
                        <p className="text-white/50 text-xs">
                          {bus.pricePerKm.toFixed(2)}€/km
                        </p>
                      </div>
                      <button
                        className="px-3 py-1.5 bg-coral hover:bg-coral-600
                                   text-white text-sm rounded-lg font-medium transition-colors
                                   group-hover:bg-coral-500 flex items-center gap-1"
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
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    page === currentPage
                      ? 'bg-coral w-6'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Ir a página ${page}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
          <div className="text-center">
            <Bus className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/70">
              No hay buses disponibles con capacidad para {passengers} pasajeros.
            </p>
            <p className="text-white/50 text-sm mt-1">
              Intenta reducir el número de pasajeros o contacta con nosotros para opciones personalizadas.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
