'use client';

import { motion } from 'framer-motion';
import { Box, Code, Database, Globe, Layers, Linkedin, Mail, Server, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  name: string;
  slug: string;
  role: string;
  description: string;
  quote: string;
  expertise: string[];
  image: string;
  email: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Irina',
    slug: 'irina',
    role: 'Full Stack Developer & Co-fundadora',
    description: 'Apasionada por crear soluciones tecnológicas innovadoras. Con experiencia tanto en frontend como backend, lidera el desarrollo técnico de BusConnect.',
    quote: 'La tecnología debe simplificar la vida de las personas, no complicarla.',
    expertise: ['React & Next.js', 'TypeScript', 'Java & Spring Boot', 'API REST', 'Microservicios', 'Programación Reactiva', 'Eureka Service', 'API Gateway', 'OpenRoute API', 'Docker', 'CI/CD'],
    image: '/images/team/Irina-Ichim.jpg',
    email: 'onlyirina7@gmail.com',
    linkedin: 'https://www.linkedin.com/in/irina-ichim-desarrolladora/',
  },
  {
    name: 'Gabriela',
    slug: 'gabriela',
    role: 'Backend Developer & Co-fundadora',
    description: 'Experta en arquitectura de microservicios y programación reactiva. Construye sistemas robustos y escalables que potencian BusConnect.',
    quote: 'El código limpio es el reflejo de un pensamiento claro.',
    expertise: ['API REST', 'Java & Spring Boot', 'Microservicios', 'Programación Reactiva', 'Eureka Service', 'API Gateway', 'OpenRoute API', 'Docker', 'CI/CD'],
    image: '/images/team/Gabriela.jpg',
    email: 'geb.beg.73@gmail.com',
    linkedin: 'https://www.linkedin.com/in/gabriela-bustamante-/',
  },
  {
    name: 'Ainoha',
    slug: 'ainoha',
    role: 'Backend Developer & Co-fundadora',
    description: 'Especializada en desarrollo backend y programación reactiva. Garantiza la fiabilidad y rendimiento de los sistemas de BusConnect.',
    quote: 'La excelencia técnica es un viaje, no un destino.',
    expertise: ['Java', 'Spring Boot', 'Maven', 'Docker'],
    image: '/images/team/Ainoha.png',
    email: 'ainoha.barcia@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ainoha-barcia/',
  },
];

const techStack = [
  { name: 'Java 21', icon: Code, category: 'Backend', color: 'from-petroleo to-petroleo-700' },
  { name: 'Spring Boot', icon: Server, category: 'Framework', color: 'from-petroleo-600 to-petroleo-800' },
  { name: 'TypeScript', icon: Code, category: 'Lenguaje', color: 'from-coral to-coral-600' },
  { name: 'Next.js', icon: Code, category: 'Frontend', color: 'from-petroleo to-petroleo-700' },
  { name: 'Microservicios', icon: Layers, category: 'Arquitectura', color: 'from-coral-500 to-coral-700' },
  { name: 'Maven', icon: Database, category: 'Build Tool', color: 'from-petroleo-600 to-petroleo-800' },
  { name: 'Docker', icon: Box, category: 'DevOps', color: 'from-coral to-coral-600' },
  { name: 'React', icon: Code, category: 'Frontend', color: 'from-petroleo to-petroleo-700' },
];

export default function EquipoPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Spacer para el navbar fijo */}
      <div className="h-16" aria-hidden="true" />

      {/* Hero Section */}
      <section className="gradient-primary py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-coral" />
              <span className="text-white/90 text-sm font-medium">
                Profesionales apasionadas por la tecnología
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg tracking-tight">
              Conoce a nuestro{' '}
              <span className="text-gradient-coral">equipo</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
              Tres profesionales apasionadas por la tecnología, unidas por el objetivo de
              transformar el sector del transporte en autocar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {teamMembers.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card-featured card-shine overflow-hidden hover:-translate-y-1">
                  {/* Imagen */}
                  <div className="relative h-80 bg-gradient-to-br from-petroleo/10 via-transparent to-coral/10 dark:from-petroleo/20 dark:to-coral/20 overflow-hidden">
                    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={member.image}
                        alt={`Foto de ${member.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Nombre y Rol */}
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                        {member.name}
                      </h2>
                      <p className="text-coral dark:text-coral-400 font-semibold">
                        {member.role}
                      </p>
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-4 pl-4 border-l-3 border-petroleo/30 dark:border-petroleo/40">
                      <p className="text-neutral-600 dark:text-neutral-400 italic text-sm">
                        "{member.quote}"
                      </p>
                    </blockquote>

                    {/* Descripción */}
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-5">
                      {member.description}
                    </p>

                    {/* Expertise - Scroll Infinito Vertical */}
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                        Especialización
                      </h3>
                      <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-b from-transparent via-neutral-50/50 to-transparent dark:via-neutral-800/50">
                        {/* Gradientes de fade */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-neutral-800 to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-neutral-800 to-transparent z-10 pointer-events-none" />

                        {/* Contenedor de scroll infinito */}
                        <motion.div
                          className="flex flex-col gap-2 py-2"
                          animate={{
                            y: [0, -((member.expertise.length * 36) / 2)],
                          }}
                          transition={{
                            duration: member.expertise.length * 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          {/* Primera copia de los badges */}
                          {member.expertise.map((skill, idx) => (
                            <span
                              key={`${skill}-1-${idx}`}
                              className="badge text-center flex-shrink-0"
                            >
                              {skill}
                            </span>
                          ))}
                          {/* Segunda copia para el loop infinito */}
                          {member.expertise.map((skill, idx) => (
                            <span
                              key={`${skill}-2-${idx}`}
                              className="badge text-center flex-shrink-0"
                            >
                              {skill}
                            </span>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    {/* Sobre mí */}
                    <div className="mb-4 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                      <Link
                        href={`/equipo/${member.slug}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-petroleo hover:bg-petroleo-800 text-white rounded-lg transition-smooth hover:-translate-y-0.5 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleo/50"
                        aria-label={`Conocer más sobre ${member.name}`}
                      >
                        <User className="w-4 h-4" />
                        <span>Sobre mí</span>
                      </Link>
                    </div>

                    {/* Contacto */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`mailto:${member.email}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-petroleo/10 hover:bg-petroleo/20 dark:bg-petroleo/20 dark:hover:bg-petroleo/30 text-petroleo dark:text-petroleo-300 rounded-lg transition-smooth hover:-translate-y-0.5 font-medium text-sm group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleo/50"
                        aria-label={`Enviar email a ${member.name}`}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </Link>
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-coral/10 hover:bg-coral/20 dark:bg-coral/20 dark:hover:bg-coral/30 text-coral dark:text-coral-300 rounded-lg transition-smooth hover:-translate-y-0.5 font-medium text-sm group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
                        aria-label={`Ver perfil de LinkedIn de ${member.name}`}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Mejorado */}
      <section className="section-highlight py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-petroleo/10 dark:bg-petroleo/20 text-petroleo dark:text-petroleo-300 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg"
            >
              <Code className="w-4 h-4 floating-icon" />
              Tecnología de vanguardia
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-petroleo to-petroleo-600 bg-clip-text text-transparent mb-4">
              Nuestro Stack Tecnológico
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Utilizamos las tecnologías más modernas y robustas para construir una plataforma escalable y confiable
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="card-featured card-shine group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center relative">
                  {/* Icono con gradiente */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <tech.icon className="w-8 h-8 text-white floating-icon" />
                  </div>

                  {/* Nombre de la tecnología */}
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-1 group-hover:text-gradient transition-all">
                    {tech.name}
                  </h3>

                  {/* Categoría */}
                  <span className="badge text-xs px-2 py-1">
                    {tech.category}
                  </span>

                  {/* Brillo decorativo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/0 group-hover:to-white/10 dark:group-hover:to-white/5 rounded-2xl transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decoración adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
              <div className="w-2 h-2 bg-accent-green rounded-full pulse-soft" />
              <span className="font-medium">Stack en constante evolución</span>
              <div className="w-2 h-2 bg-coral rounded-full pulse-soft" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-coral" />
              <span className="text-white/90 text-sm font-medium">
                Únete a nosotras
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Quieres trabajar con{' '}
              <span className="text-gradient-coral">nosotras</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Estamos siempre abiertas a colaboraciones y nuevas oportunidades.
              No dudes en contactarnos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="mailto:viorateamhackbarna@gmail.com"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-3.5 text-base rounded-lg transition-all duration-200 border border-white/30 inline-flex items-center justify-center gap-2 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Mail className="w-4 h-4" />
                Email
              </Link>
              <Link
                href="https://github.com/BusConnectTeam"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-3.5 text-base rounded-lg transition-all duration-200 border border-white/30 inline-flex items-center justify-center gap-2 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Code className="w-4 h-4" />
                GitHub
              </Link>
              <Link
                href="https://busconnect-frontend-ja4x.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-3.5 text-base rounded-lg transition-all duration-200 border border-white/30 inline-flex items-center justify-center gap-2 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Globe className="w-4 h-4" />
                Web
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
