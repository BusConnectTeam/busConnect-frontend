'use client';

import { mockCompanies } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';

export default function VerifiedCompanies() {
  return (
    <section className="py-16 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent mb-4">
            Empresas verificadas
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Trabajamos solo con las mejores empresas de transporte de Catalunya
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:scale-105 transition-transform cursor-pointer overflow-hidden p-0"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-700">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                {/* Name and Verified Badge */}
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-1">
                    {company.name}
                  </h3>
                  {company.verified && (
                    <div className="flex items-center justify-center space-x-1 text-accent-green text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verificada</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {company.rating}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    ({company.reviewCount} reseñas)
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center line-clamp-2">
                  {company.description}
                </p>

                {/* CTA */}
                <button className="mt-4 w-full text-sm py-2.5 px-4 border border-primary/20 rounded-lg text-primary dark:text-primary-400 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                  Ver flota
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/empresas"
            className="inline-flex items-center text-primary hover:text-primary-600 font-medium transition-colors"
          >
            Ver todas las empresas
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}