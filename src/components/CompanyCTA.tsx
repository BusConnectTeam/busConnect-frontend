'use client';

import { motion } from 'framer-motion';
import { Building2, Sparkles, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function CompanyCTA() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent mb-4">
              ¿Eres empresa de transporte?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Únete a BusConnect y llega a miles de clientes potenciales
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Building2,
              title: 'Registro gratuito',
              description: 'Crea tu perfil de empresa sin ningún coste inicial',
            },
            {
              icon: TrendingUp,
              title: 'Aumenta tus reservas',
              description: 'Accede a una red de clientes activos buscando autocares',
            },
            {
              icon: Users,
              title: 'Gestión sencilla',
              description: 'Panel intuitivo para gestionar reservas y tu flota',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            const hasCoralAccent = index === 1; // Card del medio con acento coral
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/30 transition-all"
              >
                <div className={`w-16 h-16 ${hasCoralAccent ? 'bg-coral/10 border-2 border-coral/30' : 'bg-primary/10 border-2 border-primary/30'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${hasCoralAccent ? 'text-coral' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/registro-empresa"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Súmate gratis ahora</span>
          </Link>
          <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-sm">
            Sin comisiones durante los primeros 3 meses · <span className="text-coral font-medium">100% gratis</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}