'use client';

import { getPostBySlug, getRelatedPosts } from '@/data/blog-posts';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const hasContent = post.sections.length > 0;

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Spacer para el navbar fijo */}
      <div className="h-16" aria-hidden="true" />

      {/* Hero Section */}
      <section className="gradient-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Botón volver */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver al blog</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{post.author.name}</p>
                  <p className="text-white/70 text-xs">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min de lectura
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-petroleo/10 to-coral/10"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasContent ? (
            <div className="space-y-10">
              {post.sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-neutral-700 dark:text-neutral-300 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Placeholder cuando no hay contenido */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-petroleo-50 dark:bg-petroleo-950/50 mb-6">
                <BookOpen className="w-10 h-10 text-petroleo" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Artículo en preparación
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-2">
                {post.author.name} está escribiendo este artículo.
              </p>
              <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                ¡Vuelve pronto para leerlo!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-highlight py-12 md:py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-petroleo/10 dark:bg-petroleo/20 text-petroleo dark:text-petroleo-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Sigue leyendo
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                Artículos relacionados
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${related.slug}`}
                    className="block card-featured card-shine overflow-hidden hover:-translate-y-1 group"
                  >
                    <div className="relative h-36 bg-gradient-to-br from-petroleo/10 to-coral/10 overflow-hidden">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="w-8 h-8 text-petroleo/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {related.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="badge text-xs px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-petroleo dark:group-hover:text-petroleo-300 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        {related.author.name} · {related.readingTime} min
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
