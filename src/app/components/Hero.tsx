'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: '',
    passengers: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando...', searchData);
    // Aquí se implementará la lógica de búsqueda
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232563EB" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
            Encuentra el autocar perfecto
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
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
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Origen
                </label>
                <input
                  id="origin"
                  type="text"
                  placeholder="Barcelona"
                  value={searchData.origin}
                  onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destino
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Sitges"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  id="date"
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Passengers */}
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Pasajeros
                </label>
                <input
                  id="passengers"
                  type="number"
                  min="1"
                  placeholder="40"
                  value={searchData.passengers}
                  onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="btn-primary w-full text-lg flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Buscar autocares</span>
            </button>
          </form>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 text-sm text-neutral-600 dark:text-neutral-400"
        >
          <p>✓ Más de 150 empresas verificadas • ✓ Reserva segura • ✓ Atención 24/7</p>
        </motion.div>
      </div>
    </section>
  );
}