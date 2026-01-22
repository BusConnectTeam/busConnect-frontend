'use client';

import { Driver } from '@/types';
import { motion } from 'framer-motion';
import {
  User,
  Star,
  Award,
  Languages,
  Calendar,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

interface DriverCardProps {
  driver: Driver;
  index?: number;
  onSelect?: (driverId: number) => void;
}

export default function DriverCard({ driver, index = 0, onSelect }: DriverCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card hover:scale-105 transition-transform cursor-pointer overflow-hidden p-0"
    >
      {/* Photo */}
      <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
        {driver.photoUrl ? (
          <Image
            src={driver.photoUrl}
            alt={`${driver.firstName} ${driver.lastName}`}
            fill
            className="object-cover"
          />
        ) : (
          <User className="w-20 h-20 text-neutral-400" />
        )}
        {/* Rating Badge */}
        {driver.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-white/90 dark:bg-neutral-800/90 rounded-full">
            <Star className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {driver.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Name */}
        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-1">
          {driver.firstName} {driver.lastName}
        </h3>

        {/* Experience */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          <Award className="w-4 h-4" />
          <span>{driver.yearsExperience} años de experiencia</span>
        </div>

        {/* Total Trips */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{driver.totalTrips} viajes realizados</span>
        </div>

        {/* Hire Date */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>Desde {formatDate(driver.hireDate)}</span>
        </div>

        {/* Languages */}
        {driver.languages && driver.languages.length > 0 && (
          <div className="flex items-start space-x-2 mb-4">
            <Languages className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {driver.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onSelect?.(driver.id)}
          className="w-full text-sm py-2.5 px-4 border border-primary/20 rounded-lg text-primary dark:text-primary-400 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
        >
          Ver perfil
        </button>
      </div>
    </motion.div>
  );
}
