'use client';

import { busesApi } from '@/lib/api';
import { BusTypeEntity, SeatType } from '@/types';
import { AlertCircle, Filter, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import BusCard from './BusCard';

interface BusListProps {
  companyId?: number;
  onSelect?: (busId: number) => void;
}

export default function BusList({ companyId, onSelect }: BusListProps) {
  const [buses, setBuses] = useState<BusTypeEntity[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<BusTypeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [seatTypeFilter, setSeatTypeFilter] = useState<SeatType | ''>('');
  const [minCapacity, setMinCapacity] = useState<number | ''>('');
  const [hasWifi, setHasWifi] = useState<boolean | null>(null);
  const [hasAC, setHasAC] = useState<boolean | null>(null);

  const loadBuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = companyId
        ? await busesApi.getByCompany(companyId)
        : await busesApi.getAll();
      setBuses(data);
    } catch (err) {
      setError('Error al cargar los buses. Por favor, intenta de nuevo.');
      console.error('Error loading buses:', err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  useEffect(() => {
    let filtered = buses;

    if (seatTypeFilter) {
      filtered = filtered.filter((b) => b.seatType === seatTypeFilter);
    }

    if (minCapacity) {
      filtered = filtered.filter((b) => b.capacity >= minCapacity);
    }

    if (hasWifi !== null) {
      filtered = filtered.filter((b) => b.hasWifi === hasWifi);
    }

    if (hasAC !== null) {
      filtered = filtered.filter((b) => b.hasAc === hasAC);
    }

    setFilteredBuses(filtered);
  }, [buses, seatTypeFilter, minCapacity, hasWifi, hasAC]);

  const clearFilters = () => {
    setSeatTypeFilter('');
    setMinCapacity('');
    setHasWifi(null);
    setHasAC(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">
          Cargando buses...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
        <button onClick={loadBuses} className="btn-primary">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Seat Type */}
          <select
            value={seatTypeFilter}
            onChange={(e) => setSeatTypeFilter(e.target.value as SeatType | '')}
            aria-label="Filtrar por tipo de asiento"
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            <option value="">Tipo de asiento</option>
            <option value="standard">Estándar</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
            <option value="sleeper">Cama</option>
          </select>

          {/* Min Capacity */}
          <input
            type="number"
            placeholder="Capacidad mínima"
            value={minCapacity}
            onChange={(e) =>
              setMinCapacity(e.target.value ? parseInt(e.target.value) : '')
            }
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          />

          {/* Has WiFi */}
          <select
            value={hasWifi === null ? '' : hasWifi.toString()}
            onChange={(e) =>
              setHasWifi(e.target.value === '' ? null : e.target.value === 'true')
            }
            aria-label="Filtrar por WiFi"
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            <option value="">WiFi</option>
            <option value="true">Con WiFi</option>
            <option value="false">Sin WiFi</option>
          </select>

          {/* Has AC */}
          <select
            value={hasAC === null ? '' : hasAC.toString()}
            onChange={(e) =>
              setHasAC(e.target.value === '' ? null : e.target.value === 'true')
            }
            aria-label="Filtrar por aire acondicionado"
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            <option value="">Aire Acondicionado</option>
            <option value="true">Con A/C</option>
            <option value="false">Sin A/C</option>
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
        {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''}{' '}
        encontrado{filteredBuses.length !== 1 ? 's' : ''}
      </p>

      {/* Buses Grid */}
      {filteredBuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBuses.map((bus, index) => (
            <BusCard key={bus.id} bus={bus} index={index} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            No se encontraron buses con los filtros seleccionados.
          </p>
        </div>
      )}
    </section>
  );
}
