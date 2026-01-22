'use client';

import { BusCompany } from '@/types';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, Globe, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

interface CompanyCardProps {
  company: BusCompany;
  index?: number;
  onViewFleet?: (companyId: number) => void;
}

export default function CompanyCard({ company, index = 0, onViewFleet }: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card hover:scale-105 transition-transform cursor-pointer overflow-hidden p-0"
    >
      {/* Logo/Image */}
      <div className="relative w-full h-40 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
        {company.logoUrl ? (
          <Image
            src={company.logoUrl}
            alt={company.name}
            fill
            className="object-cover"
          />
        ) : (
          <Building2 className="w-16 h-16 text-neutral-400" />
        )}
      </div>

      <div className="p-5">
        {/* Name and Verified Badge */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-1">
            {company.name}
          </h3>
          {company.verified && (
            <div className="flex items-center space-x-1 text-accent-green text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Verificada</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{company.city}, {company.country}</span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Phone className="w-4 h-4" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{company.email}</span>
          </div>
          {company.website && (
            <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Globe className="w-4 h-4" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
            {company.description}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => onViewFleet?.(company.id)}
          className="w-full text-sm py-2.5 px-4 border border-primary/20 rounded-lg text-primary dark:text-primary-400 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
        >
          Ver flota
        </button>
      </div>
    </motion.div>
  );
}
