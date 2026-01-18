'use client';

import heroBus from '@/app/assets/hero-bus.jpg';
import { useCalculateRoute } from '@/hooks';
import { Municipality, RouteResult } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, Loader2, MapPin, Route, Search, Users, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import MunicipalityAutocomplete from './MunicipalityAutocomplete';

export default function Hero() {
  const [origin, setOrigin] = useState<Municipality | null>(null);
  const [destination, setDestination] = useState<Municipality | null>(null);
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  const calculateRoute = useCalculateRoute();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination) {
      return;
    }

    calculateRoute.mutate(
      {
        originMunicipality: origin.name,
        destinationMunicipality: destination.name,
      },
      {
        onSuccess: (result) => {
          setRouteResult(result);
        },
      }
    );
  };

  const clearResult = () => {
    setRouteResult(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroBus}
          alt="Autocar de lujo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Encuentra el autocar perfecto
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            para tu viaje, evento o excursión
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Origin */}
              <MunicipalityAutocomplete
                id="origin"
                label="Origen"
                placeholder="Barcelona"
                value={origin?.name || ''}
                onChange={setOrigin}
              />

              {/* Destination */}
              <MunicipalityAutocomplete
                id="destination"
                label="Destino"
                placeholder="Girona"
                value={destination?.name || ''}
                onChange={setDestination}
              />

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Passengers */}
              <div>
                <label
                  htmlFor="passengers"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Pasajeros
                </label>
                <input
                  id="passengers"
                  type="number"
                  min="1"
                  placeholder="40"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Route Result */}
            <AnimatePresence>
              {routeResult && routeResult.success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                        <Route className="w-5 h-5" />
                        <span className="font-semibold">Ruta calculada</span>
                      </div>
                      <button
                        type="button"
                        onClick={clearResult}
                        aria-label="Cerrar resultado"
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Origen</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {routeResult.origin}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Destino</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {routeResult.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Distancia</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {routeResult.distanceKm.toFixed(1)} km
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Duración</p>
                        <p className="font-semibold text-neutral-900 dark:text-white flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(routeResult.durationMinutes)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {routeResult && !routeResult.success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-red-700 dark:text-red-300">
                        {routeResult.errorMessage || 'Error al calcular la ruta'}
                      </p>
                      <button
                        type="button"
                        onClick={clearResult}
                        aria-label="Cerrar error"
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <button
              type="submit"
              disabled={!origin || !destination || calculateRoute.isPending}
              className="btn-primary w-full text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {calculateRoute.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Calculando ruta...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Buscar autocares</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 text-sm text-white/80 drop-shadow-md"
        >
          <p>
            947 municipios de Catalunya disponibles
          </p>
        </motion.div>
      </div>
    </section>
  );
}
