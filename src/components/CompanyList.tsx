'use client';

import { companiesApi } from '@/lib/api';
import { BusCompany } from '@/types';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import CompanyCard from './CompanyCard';

interface CompanyListProps {
  onViewFleet?: (companyId: number) => void;
}

export default function CompanyList({ onViewFleet }: CompanyListProps) {
  const [companies, setCompanies] = useState<BusCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<BusCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesApi.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Error al cargar las empresas. Por favor, intenta de nuevo.');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    let filtered = companies;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.legalName.toLowerCase().includes(term)
      );
    }

    if (cityFilter) {
      filtered = filtered.filter((c) =>
        c.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, cityFilter]);

  const uniqueCities = Array.from(new Set(companies.map((c) => c.city).filter((city): city is string => city !== null))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">
          Cargando empresas...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
        <button
          onClick={loadCompanies}
          className="btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          aria-label="Filtrar por ciudad"
          className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todas las ciudades</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} encontrada{filteredCompanies.length !== 1 ? 's' : ''}
      </p>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              index={index}
              onViewFleet={onViewFleet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            No se encontraron empresas con los filtros seleccionados.
          </p>
        </div>
      )}
    </section>
  );
}
