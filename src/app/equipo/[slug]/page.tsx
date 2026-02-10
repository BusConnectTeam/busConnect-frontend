'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Code, Coffee, Heart, Linkedin, Mail, Quote, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

interface TeamMemberProfile {
  name: string;
  role: string;
  image: string;
  email: string;
  linkedin: string;
  github?: string;
  headline: string;
  intro: string;
  sections: {
    title: string;
    icon: React.ElementType;
    items: string[];
  }[];
  quote: string;
  cta: {
    text: string;
    linkedinLabel: string;
    githubLabel?: string;
    emailLabel: string;
  };
}

const teamProfiles: Record<string, TeamMemberProfile> = {
  gabriela: {
    name: 'Gabriela',
    role: 'Backend Developer & Co-fundadora',
    image: '/images/team/Gabriela.jpg',
    email: 'geb.beg.73@gmail.com',
    linkedin: 'https://www.linkedin.com/in/gabriela-bustamante-/',
    github: 'https://github.com/GabyB73',
    headline: 'Perseverante',
    intro: 'Mi relación con el código nace de la curiosidad. Me gusta entender cómo funcionan las cosas, aunque eso signifique pasar horas investigando por qué Java se comporta de una forma u otra en un microservicio. No pretendo saberlo todo, pero tengo la disciplina necesaria para no soltar un problema hasta que encuentro la solución.',
    sections: [
      {
        title: 'Mi enfoque técnico',
        icon: Code,
        items: [
          'Me siento cómoda trabajando con el ecosistema Spring (Boot, WebFlux).',
          'La resolución de problemas: Ese momento en el que, tras mucho esfuerzo y pruebas en Postman, el sistema responde correctamente.',
          'El aprendizaje continuo: Soy consciente de todo lo que me queda por aprender y afronto cada nueva tecnología con respeto y muchas ganas de entenderla bien.',
          'La constancia: Prefiero un código bien probado y estructurado que uno brillante pero frágil.',
        ],
      },
      {
        title: 'Fuera de la terminal',
        icon: Coffee,
        items: [
          'Me gusta disfrutar de un buen café para empezar el día.',
          'Aunque el tiempo para mis proyectos me ha quitado horas de gimnasio, trato de mantener esa disciplina siempre que puedo.',
          'Lo que nunca falta en mi jornada son mis gatos, que comparten conmigo el espacio de trabajo (y a veces el teclado) mientras busco la solución a algún bug.',
        ],
      },
    ],
    quote: 'El código limpio es el reflejo de un pensamiento claro.',
    cta: {
      text: '¿Buscas a alguien con ganas de aprender y que no se rinde ante los retos? ¡Conectemos!',
      linkedinLabel: 'LinkedIn',
      githubLabel: 'GitHub',
      emailLabel: 'Email',
    },
  },
  irina: {
    name: 'Irina',
    role: 'Full Stack Developer & Co-fundadora',
    image: '/images/team/Irina-Ichim.jpg',
    email: 'onlyirina7@gmail.com',
    linkedin: 'https://www.linkedin.com/in/irina-ichim-desarrolladora/',
    github: 'https://github.com/Irina-Ichim',
    headline: 'Resolutiva',
    intro: 'Mi relación con el código nace de la necesidad de convertir ideas desordenadas en sistemas que funcionan. Me interesa entender el problema completo, no solo resolver una parte. Por eso pienso en arquitectura, flujo y uso real desde el inicio.\n\nNo me limito a escribir código: me encargo de que lo que construyo llegue a producción, sea mantenible y tenga sentido para quien lo usa. Para mí, desarrollar es asumir responsabilidad de principio a fin.',
    sections: [
      {
        title: 'Mi enfoque profesional',
        icon: Code,
        items: [
          'Trabajo como Full-Stack Developer, con una visión global del producto. Me muevo con soltura entre frontend y backend, cuidando tanto la experiencia de usuario como la lógica que la sostiene.',
          'Integro herramientas de Inteligencia Artificial y automatizaciones cuando aportan eficiencia real: para optimizar procesos, escalar soluciones o reducir fricción en el día a día de un proyecto.',
          'También me ocupo de la parte técnica que suele quedar en segundo plano: deploys, entornos, DevOps y mantenimiento, porque ahí es donde se decide si un proyecto es sólido o frágil.',
          'Valoro el código claro, bien estructurado y pensado para crecer. Prefiero soluciones comprensibles y estables a desarrollos complejos que dependen de quien los escribió.',
        ],
      },
      {
        title: 'Más allá del código',
        icon: Heart,
        items: [
          'Trabajo con criterio, foco y visión a largo plazo.',
          'Me implico en los proyectos como si fueran propios, porque creo que el buen software no solo resuelve problemas: genera confianza.',
        ],
      },
    ],
    quote: 'El valor de un producto no está solo en lo que hace hoy, sino en lo bien preparado que está para mañana.',
    cta: {
      text: '¿Buscas a alguien con visión global y compromiso de principio a fin? ¡Conectemos!',
      linkedinLabel: 'LinkedIn',
      githubLabel: 'GitHub',
      emailLabel: 'Email',
    },
  },
  ainoha: {
    name: 'Ainoha',
    role: 'Backend Developer & Co-fundadora',
    image: '/images/team/Ainoha.png',
    email: 'ainoha.barcia@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ainoha-barcia/',
    headline: 'Dedicada',
    intro: 'Próximamente...',
    sections: [],
    quote: 'La excelencia técnica es un viaje, no un destino.',
    cta: {
      text: '¡Conectemos!',
      linkedinLabel: 'LinkedIn',
      githubLabel: 'GitHub',
      emailLabel: 'Email',
    },
  },
};

export default function TeamMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const profile = teamProfiles[slug];

  if (!profile) {
    notFound();
  }

  const isPlaceholder = profile.intro === 'Próximamente...';

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Spacer para el navbar fijo */}
      <div className="h-16" aria-hidden="true" />

      {/* Hero Section */}
      <section className="gradient-primary py-16 md:py-24 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 pattern-dots opacity-30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Botón volver */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/equipo"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver al equipo</span>
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Foto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="relative"
            >
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src={profile.image}
                  alt={`Foto de ${profile.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 208px"
                />
              </div>
              {/* Badge decorativo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-2 -right-2 bg-coral text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                {profile.headline}
              </motion.div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span className="text-white/90 text-sm font-medium">Sobre mí</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl text-coral-300 font-semibold">
                {profile.role}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isPlaceholder ? (
            /* Placeholder para perfiles que aún no tienen contenido */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-petroleo-50 dark:bg-petroleo-950/50 mb-6">
                <Heart className="w-10 h-10 text-petroleo" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Próximamente
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                {profile.name} está preparando su perfil. ¡Vuelve pronto para conocerla mejor!
              </p>

              {/* Quote */}
              <div className="max-w-lg mx-auto">
                <blockquote className="relative p-6 bg-petroleo-50/50 dark:bg-petroleo-950/30 rounded-2xl">
                  <Quote className="w-6 h-6 text-petroleo/30 absolute top-4 left-4" />
                  <p className="text-neutral-700 dark:text-neutral-300 italic text-lg pl-6">
                    &ldquo;{profile.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-sm font-medium text-petroleo dark:text-petroleo-300 pl-6">
                    — {profile.name}
                  </footer>
                </blockquote>
              </div>
            </motion.div>
          ) : (
            /* Perfil completo */
            <div className="space-y-12">
              {/* Introducción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {profile.intro}
                </p>
              </motion.div>

              {/* Secciones */}
              {profile.sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-petroleo to-petroleo-700 shadow-lg">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 pl-13">
                    {section.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="mt-2 w-2 h-2 rounded-full bg-coral flex-shrink-0" />
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Quote destacada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="relative p-8 bg-gradient-to-br from-petroleo-50 to-coral-50/30 dark:from-petroleo-950/30 dark:to-coral-950/10 rounded-2xl border border-petroleo/10 dark:border-petroleo/20">
                  <Quote className="w-8 h-8 text-petroleo/20 absolute top-6 left-6" />
                  <p className="text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 italic leading-relaxed pl-8">
                    &ldquo;{profile.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm font-semibold text-petroleo dark:text-petroleo-300 pl-8">
                    — {profile.name}
                  </footer>
                </blockquote>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="gradient-primary py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              {profile.cta.text}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 border border-white/30 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label={`Enviar email a ${profile.name}`}
              >
                <Mail className="w-4 h-4" />
                {profile.cta.emailLabel}
              </Link>
              <Link
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 border border-white/30 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label={`Ver perfil de LinkedIn de ${profile.name}`}
              >
                <Linkedin className="w-4 h-4" />
                {profile.cta.linkedinLabel}
              </Link>
              {profile.github && profile.cta.githubLabel && (
                <Link
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 border border-white/30 min-h-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-label={`Ver perfil de GitHub de ${profile.name}`}
                >
                  <Code className="w-4 h-4" />
                  {profile.cta.githubLabel}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
