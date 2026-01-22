'use client';

import heroBus from '@/app/assets/hero-bus.jpg';
import type { RouteResult } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

export default function HeroSection() {
  const [searchResults, setSearchResults] = useState<RouteResult | null>(null);
  const [searchParams, setSearchParams] = useState<{ date: string; passengers: number } | null>(null);

  const handleSearchResults = (result: RouteResult | null, params: { date: string; passengers: number } | null) => {
    setSearchResults(result);
    setSearchParams(params);
  };

  // Scroll automático a resultados cuando se cargan exitosamente
  useEffect(() => {
    if (searchResults && searchResults.success && searchParams) {
      // Esperar a que el DOM se actualice
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchResults, searchParams]);

  const handleScrollDown = () => {
    // Scroll a la siguiente sección (después del hero)
    const heroSection = document.getElementById('main-content');
    if (heroSection) {
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll una pantalla completa
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }
  };
  return (
    <>
      <section
        id="main-content"
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        aria-labelledby="hero-title"
        role="region"
      >
      {/* Imagen de fondo con optimización LCP */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroBus}
          alt="Vista interior de un autocar de lujo moderno con asientos confortables,
               iluminación cálida y amplios ventanales mostrando un paisaje catalán"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          placeholder="blur"
          sizes="100vw"
        />
        {/* Overlay con gradiente para mejorar legibilidad */}
        <div
          className="absolute inset-0 bg-gradient-to-t
                     from-black/70 via-black/40 to-black/20"
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full">
        {/* Spacer para compensar el navbar fijo */}
        <div className="h-16" aria-hidden="true" />

        {/* Contenedor principal */}
        <div
          className="min-h-[calc(100vh-4rem)] flex flex-col
                     pt-8 md:pt-12 lg:pt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">

            {/* Título y subtítulo - Arriba centrado */}
            <header className="text-center animate-fade-in mb-8 md:mb-12">
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl md:text-6xl
                           font-bold text-white mb-4 md:mb-6
                           drop-shadow-lg tracking-tight"
              >
                Encuentra el autocar perfecto
              </h1>
              <p
                className="text-xl sm:text-2xl
                           text-white/90 max-w-2xl mx-auto
                           drop-shadow-md font-light"
              >
                para tu viaje, evento o excursión
              </p>
            </header>

            {/* Formulario compacto - A la izquierda */}
            <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-start mt-2 lg:mt-4">
              <div
                className="w-full lg:w-auto lg:min-w-[420px] lg:max-w-md
                           animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <SearchForm 
                  className="mx-4 md:mx-0" 
                  onSearchResults={handleSearchResults}
                />

                {/* Trust indicators - Debajo del formulario en desktop */}
                <div
                  className="hidden lg:flex flex-wrap items-center gap-4 mt-6 ml-1
                             text-white/70 text-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sin comisiones
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Empresas verificadas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Soporte 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* Trust indicators - Solo móvil/tablet */}
            <div
              className="lg:hidden text-center mt-8 mb-12 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <p className="text-white/80 text-sm md:text-base drop-shadow-sm mb-4">
                <span className="font-semibold text-coral">947</span> municipios de Catalunya disponibles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-xs md:text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sin comisiones ocultas
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Empresas verificadas
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Soporte 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de scroll funcional */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                   hidden lg:flex flex-col items-center gap-2
                   animate-bounce opacity-60 hover:opacity-100
                   transition-opacity duration-200
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-white/50 focus-visible:ring-offset-2
                   focus-visible:ring-offset-transparent rounded-lg
                   p-2 min-h-touch min-w-touch cursor-pointer
                   bg-transparent border-none"
        aria-label="Desplazarse hacia abajo para ver más contenido"
      >
        <span className="text-white/60 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>

    {/* Sección de resultados - Separada del hero con gradiente petroleo */}
    {searchResults && searchResults.success && searchParams && (
      <section id="search-results" className="gradient-primary py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchResults
            routeResult={searchResults}
            passengers={searchParams.passengers}
            date={searchParams.date}
            onSelectBus={(bus, company, price) => {
              console.log('Bus seleccionado:', bus, company, price);
              // TODO: Implementar flujo de solicitud de presupuesto
            }}
          />
        </div>
      </section>
    )}
    </>
  );
}
