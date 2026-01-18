'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, HeadphonesIcon, Lock, Shield, Zap } from 'lucide-react';

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
    <section className="relative py-20 overflow-hidden">
      {/* Gradiente de fondo similar al Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-700 to-primary-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-900/20 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Por qué elegir BusConnect?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            La forma más segura y confiable de reservar tu autocar
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            // Añadir acento coral a algunos elementos
            const hasCoralAccent = index % 3 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 hover:border-coral/40 transition-all"
              >
                <div className={`w-16 h-16 ${hasCoralAccent ? 'bg-coral/20 border-2 border-coral/40' : 'bg-white/20'} rounded-full flex items-center justify-center mb-4 transition-all`}>
                  <Icon className={`w-8 h-8 ${hasCoralAccent ? 'text-coral' : 'text-white'}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/80">
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