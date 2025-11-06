'use client';

import heroBus from '@/app/assets/hero-bus.jpg';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroBus}
          alt="Autocar de lujo"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 pt-8"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
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
          className="text-center mt-8 text-sm text-white/80 drop-shadow-md"
        >
          <p>✓ Más de 150 empresas verificadas • ✓ Reserva segura • ✓ Atención 24/7</p>
        </motion.div>
      </div>
    </section>
  );
}