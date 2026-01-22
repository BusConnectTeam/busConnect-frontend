'use client';

import { Driver } from '@/types';
import { driversApi } from '@/lib/api';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import DriverCard from './DriverCard';

interface DriverListProps {
  companyId?: number;
  onSelect?: (driverId: number) => void;
}

export default function DriverList({ companyId, onSelect }: DriverListProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minExperience, setMinExperience] = useState<number | ''>('');
  const [languageFilter, setLanguageFilter] = useState('');

  const loadDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = companyId
        ? await driversApi.getByCompany(companyId)
        : await driversApi.getAll();
      setDrivers(data);
    } catch (err) {
      setError('Error al cargar los conductores. Por favor, intenta de nuevo.');
      console.error('Error loading drivers:', err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  useEffect(() => {
    let filtered = drivers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.firstName.toLowerCase().includes(term) ||
          d.lastName.toLowerCase().includes(term)
      );
    }

    if (minExperience) {
      filtered = filtered.filter((d) => d.yearsExperience >= minExperience);
    }

    if (languageFilter) {
      filtered = filtered.filter((d) =>
        d.languages?.some((lang) =>
          lang.toLowerCase().includes(languageFilter.toLowerCase())
        )
      );
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchTerm, minExperience, languageFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setMinExperience('');
    setLanguageFilter('');
  };

  // Get unique languages from all drivers
  const allLanguages = Array.from(
    new Set(drivers.flatMap((d) => d.languages || []))
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">
          Cargando conductores...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
        <button onClick={loadDrivers} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* Filters */}
      <div className="mb-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <span className="font-medium text-neutral-900 dark:text-white">
            Filtros
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search by name */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Min Experience */}
          <input
            type="number"
            placeholder="Experiencia mínima (años)"
            value={minExperience}
            onChange={(e) =>
              setMinExperience(e.target.value ? parseInt(e.target.value) : '')
            }
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          />

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Filtrar por idioma"
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            <option value="">Todos los idiomas</option>
            {allLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="mt-4 text-sm text-primary hover:text-primary-600"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        {filteredDrivers.length} conductor{filteredDrivers.length !== 1 ? 'es' : ''}{' '}
        encontrado{filteredDrivers.length !== 1 ? 's' : ''}
      </p>

      {/* Drivers Grid */}
      {filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrivers.map((driver, index) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            No se encontraron conductores con los filtros seleccionados.
          </p>
        </div>
      )}
    </section>
  );
}
