'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, HeadphonesIcon, Zap, Award, Lock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Reserva segura',
    description: 'Sistema de pago encriptado y protección completa de tus datos personales.',
  },
  {
    icon: CheckCircle,
    title: 'Empresas verificadas',
    description: 'Todas las empresas están verificadas y cumplen con los estándares de calidad.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Atención 24/7',
    description: 'Equipo de soporte disponible las 24 horas para resolver cualquier duda.',
  },
  {
    icon: Zap,
    title: 'Reserva instantánea',
    description: 'Confirma tu reserva en minutos y recibe la confirmación al instante.',
  },
  {
    icon: Award,
    title: 'Mejor precio garantizado',
    description: 'Compara precios y encuentra siempre las mejores ofertas del mercado.',
  },
  {
    icon: Lock,
    title: 'Transparencia total',
    description: 'Sin costes ocultos. El precio que ves es el precio que pagas.',
  },
];

export default function Benefits() {
  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            ¿Por qué elegir BusConnect?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            La forma más segura y confiable de reservar tu autocar
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}