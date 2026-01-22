'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { useCalculateRoute } from '@/hooks';
import { getFriendlyErrorMessage } from '@/lib/api/client';
import { Municipality, RouteResult } from '@/types';
import { searchFormSchema, type SearchFormData } from '@/types/search';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Loader2,
  MapPin,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import MunicipalityAutocomplete from './MunicipalityAutocomplete';

interface SearchFormProps {
  className?: string;
  onSearchResults?: (result: RouteResult | null, params: { date: string; passengers: number } | null) => void;
}

export default function SearchForm({ className = '', onSearchResults }: SearchFormProps) {
  // Unique IDs para accesibilidad
  const formId = useId();
  const originId = `${formId}-origin`;
  const destinationId = `${formId}-destination`;
  const dateId = `${formId}-date`;
  const passengersId = `${formId}-passengers`;
  const errorRegionId = `${formId}-errors`;

  // Estados para municipios seleccionados
  const [originMunicipality, setOriginMunicipality] = useState<Municipality | null>(null);
  const [destinationMunicipality, setDestinationMunicipality] = useState<Municipality | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Estado para guardar los parámetros de búsqueda al hacer submit
  const [searchParams, setSearchParams] = useState<{ date: string; passengers: number } | null>(null);

  // React Hook Form con validación Zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      date: '',
      passengers: 1,
    },
  });

  const { currentUser } = useCurrentUser();
  const calculateRoute = useCalculateRoute();

  // Manejar selección de origen
  const handleOriginChange = useCallback(
    (municipality: Municipality | null) => {
      setOriginMunicipality(municipality);
      setValue('origin', municipality?.name || '', { shouldValidate: true });
    },
    [setValue]
  );

  // Manejar selección de destino
  const handleDestinationChange = useCallback(
    (municipality: Municipality | null) => {
      setDestinationMunicipality(municipality);
      setValue('destination', municipality?.name || '', { shouldValidate: true });
    },
    [setValue]
  );

  // Submit del formulario
  const onSubmit = async (formData: SearchFormData) => {
    if (!originMunicipality || !destinationMunicipality) {
      return;
    }

    // Guardar los parámetros de búsqueda
    const params = {
      date: formData.date,
      passengers: formData.passengers,
    };
    setSearchParams(params);

    calculateRoute.mutate(
      {
        data: {
          originMunicipality: originMunicipality.name,
          destinationMunicipality: destinationMunicipality.name,
        },
        userId: currentUser?.id,
      },
      {
        onSuccess: (result) => {
          // Si la API devuelve success: false, transformar el mensaje de error
          if (!result.success && result.errorMessage) {
            const friendlyMessage = getFriendlyErrorMessage({ 
              message: result.errorMessage 
            } as Error);
            
            setRouteResult({
              ...result,
              errorMessage: friendlyMessage,
            });
          } else {
            setRouteResult(result);
          }
          onSearchResults?.(result, params);
        },
        onError: (error) => {
          // Manejar errores HTTP (red, servidor, etc.)
          const friendlyMessage = getFriendlyErrorMessage(error);
          const errorResult = {
            success: false,
            errorMessage: friendlyMessage,
            origin: originMunicipality.name,
            destination: destinationMunicipality.name,
            distanceKm: 0,
            durationMinutes: 0,
            source: 'error' as const,
            calculatedAt: new Date().toISOString(),
          };
          setRouteResult(errorResult);
          onSearchResults?.(errorResult, params);
        },
      }
    );
  };

  // Limpiar resultado
  const clearResult = useCallback(() => {
    setRouteResult(null);
    setSearchParams(null);
    onSearchResults?.(null, null);
  }, [onSearchResults]);

  // Obtener fecha mínima (hoy)
  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isLoading = calculateRoute.isPending;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="backdrop-blur-md bg-black/65 rounded-2xl shadow-2xl
                   px-6 py-6 md:px-8 md:py-8
                   border border-white/10 overflow-visible"
        aria-labelledby={`${formId}-title`}
        noValidate
      >
        {/* Título accesible (oculto visualmente pero disponible para screen readers) */}
        <h2 id={`${formId}-title`} className="sr-only">
          Formulario de búsqueda de autocares
        </h2>

        {/* Campos del formulario - Layout 2x2 compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
          {/* Origen */}
          <div className="relative overflow-visible z-10">
            <label
              htmlFor={originId}
              className="text-sm font-medium text-white mb-2
                         flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-coral" aria-hidden="true" />
              <span>Origen</span>
              <span className="text-coral" aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </label>
            <MunicipalityAutocomplete
              id={originId}
              label=""
              placeholder="Barcelona"
              value={originMunicipality?.name || ''}
              onChange={handleOriginChange}
              variant="dark"
              required
              hasError={!!errors.origin}
              errorId={errors.origin ? `${originId}-error` : undefined}
            />
            {errors.origin && (
              <p
                id={`${originId}-error`}
                className="mt-1 text-sm text-coral-300 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.origin.message}
              </p>
            )}
          </div>

          {/* Destino */}
          <div className="relative overflow-visible z-10">
            <label
              htmlFor={destinationId}
              className="text-sm font-medium text-white mb-2
                         flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-coral" aria-hidden="true" />
              <span>Destino</span>
              <span className="text-coral" aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </label>
            <MunicipalityAutocomplete
              id={destinationId}
              label=""
              placeholder="Girona"
              value={destinationMunicipality?.name || ''}
              onChange={handleDestinationChange}
              variant="dark"
              required
              hasError={!!errors.destination}
              errorId={errors.destination ? `${destinationId}-error` : undefined}
            />
            {errors.destination && (
              <p
                id={`${destinationId}-error`}
                className="mt-1 text-sm text-coral-300 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="relative">
            <label
              htmlFor={dateId}
              className="text-sm font-medium text-white mb-2
                         flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-coral" aria-hidden="true" />
              <span>Fecha</span>
              <span className="text-coral" aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </label>
            <input
              id={dateId}
              type="date"
              min={getMinDate()}
              {...register('date')}
              className="w-full px-4 py-3.5 rounded-lg
                         bg-white/10 backdrop-blur-sm
                         border border-white/20
                         text-white placeholder:text-white/50
                         transition-all duration-200
                         hover:border-white/40
                         focus:border-coral focus:ring-2 focus:ring-coral/30
                         focus:outline-none
                         min-h-touch
                         [color-scheme:dark]"
              aria-required="true"
              {...(errors.date && { 'aria-invalid': 'true' })}
              aria-describedby={errors.date ? `${dateId}-error` : undefined}
            />
            {errors.date && (
              <p
                id={`${dateId}-error`}
                className="mt-1 text-sm text-coral-300 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Pasajeros */}
          <div className="relative">
            <label
              htmlFor={passengersId}
              className="text-sm font-medium text-white mb-2
                         flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-coral" aria-hidden="true" />
              <span>Pasajeros</span>
              <span className="text-coral" aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </label>
            <input
              id={passengersId}
              type="number"
              min="1"
              max="100"
              placeholder="40"
              {...register('passengers', { valueAsNumber: true })}
              className="w-full px-4 py-3.5 rounded-lg
                         bg-white/10 backdrop-blur-sm
                         border border-white/20
                         text-white placeholder:text-white/50
                         transition-all duration-200
                         hover:border-white/40
                         focus:border-coral focus:ring-2 focus:ring-coral/30
                         focus:outline-none
                         min-h-touch
                         [appearance:textfield]
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none"
              aria-required="true"
              {...(errors.passengers && { 'aria-invalid': 'true' })}
              aria-describedby={errors.passengers ? `${passengersId}-error` : undefined}
            />
            {errors.passengers && (
              <p
                id={`${passengersId}-error`}
                className="mt-1 text-sm text-coral-300 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.passengers.message}
              </p>
            )}
          </div>
        </div>

        {/* Región de errores para lectores de pantalla */}
        <div
          id={errorRegionId}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {hasErrors && (
            <span>
              Por favor corrige los errores en el formulario antes de continuar.
            </span>
          )}
        </div>

        {/* Mensaje de error inline */}
        <AnimatePresence>
          {routeResult && !routeResult.success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div
                className="bg-white/10 backdrop-blur-sm border border-amber-400/50 rounded-xl p-5"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-6 h-6 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Ruta no disponible
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {routeResult.errorMessage || 'No se pudo calcular la ruta entre estos municipios.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearResult}
                    className="flex-shrink-0 text-white/60 hover:text-white transition-colors
                               p-2 min-h-touch min-w-touch flex items-center justify-center
                               focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-amber-400/50 rounded-lg"
                    aria-label="Cerrar mensaje"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón de búsqueda */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || !originMunicipality || !destinationMunicipality}
            className="w-full bg-white/90 backdrop-blur-md hover:bg-white
                       text-petroleo font-semibold
                       px-8 py-4 rounded-xl text-lg
                       transition-all duration-200
                       shadow-lg hover:shadow-xl
                       border border-white/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:shadow-lg
                       min-h-touch
                       flex items-center justify-center gap-2
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/50 focus-visible:ring-offset-2
                       focus-visible:ring-offset-black/65"
            {...(isLoading && { 'aria-busy': 'true' })}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="w-5 h-5 animate-spin"
                  aria-hidden="true"
                />
                <span>Calculando ruta...</span>
                <span className="sr-only">Por favor espera</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" aria-hidden="true" />
                <span>Buscar autocares</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
