'use client';

import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CompanyCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Eres empresa de transporte?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
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
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-primary-100">{item.description}</p>
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
            className="inline-flex items-center space-x-2 bg-white text-primary hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Súmate gratis ahora</span>
          </Link>
          <p className="text-primary-100 mt-4 text-sm">
            Sin comisiones durante los primeros 3 meses
          </p>
        </motion.div>
      </div>
    </section>
  );
}