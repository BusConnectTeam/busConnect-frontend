'use client';

import { BusTypeEntity } from '@/types';
import { motion } from 'framer-motion';
import {
  Bus,
  Users,
  Wifi,
  Wind,
  Armchair,
  Plug,
  Tv,
  Luggage,
} from 'lucide-react';
import Image from 'next/image';

interface BusCardProps {
  bus: BusTypeEntity;
  index?: number;
  onSelect?: (busId: number) => void;
}

const seatTypeLabels: Record<string, string> = {
  standard: 'Estándar',
  premium: 'Premium',
  vip: 'VIP',
  sleeper: 'Cama',
};

const seatTypeColors: Record<string, string> = {
  standard: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
  premium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  vip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  sleeper: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

export default function BusCard({ bus, index = 0, onSelect }: BusCardProps) {
  const amenities = [
    { icon: Wifi, label: 'WiFi', active: bus.hasWifi },
    { icon: Wind, label: 'A/C', active: bus.hasAirConditioning },
    { icon: Armchair, label: 'WC', active: bus.hasToilet },
    { icon: Plug, label: 'USB', active: bus.hasUSBChargers },
    { icon: Tv, label: 'Entretenimiento', active: bus.hasEntertainment },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card hover:scale-105 transition-transform cursor-pointer overflow-hidden p-0"
    >
      {/* Image */}
      <div className="relative w-full h-40 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
        {bus.imageUrl ? (
          <Image
            src={bus.imageUrl}
            alt={bus.name}
            fill
            className="object-cover"
          />
        ) : (
          <Bus className="w-16 h-16 text-neutral-400" />
        )}
        {/* Seat Type Badge */}
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            seatTypeColors[bus.seatType] || seatTypeColors.standard
          }`}
        >
          {seatTypeLabels[bus.seatType] || bus.seatType}
        </span>
      </div>

      <div className="p-5">
        {/* Name */}
        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
          {bus.name}
        </h3>

        {/* Capacity */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          <Users className="w-4 h-4" />
          <span>{bus.capacity} pasajeros</span>
        </div>

        {/* Luggage */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          <Luggage className="w-4 h-4" />
          <span>{bus.luggageCapacityKg} kg equipaje</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities
            .filter((a) => a.active)
            .map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </span>
            ))}
        </div>

        {/* Description */}
        {bus.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
            {bus.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Precio por km
          </span>
          <span className="text-lg font-bold text-primary">
            {bus.pricePerKm.toFixed(2)}€
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => onSelect?.(bus.id)}
          className="w-full text-sm py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-all duration-300"
        >
          Seleccionar
        </button>
      </div>
    </motion.div>
  );
}
