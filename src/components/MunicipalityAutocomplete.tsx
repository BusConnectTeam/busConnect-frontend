'use client';

import { useSearchMunicipalities } from '@/hooks';
import { Municipality } from '@/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

interface MunicipalityAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (municipality: Municipality | null) => void;
  /** Variante de estilo: 'light' para fondos claros, 'dark' para glass morphism */
  variant?: 'light' | 'dark';
  /** Indica si el campo es obligatorio */
  required?: boolean;
  /** Indica si el valor es inválido */
  hasError?: boolean;
  /** ID del elemento que describe este input (para errores) */
  errorId?: string;
}

export default function MunicipalityAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  variant = 'dark',
  required = false,
  hasError = false,
  errorId,
}: MunicipalityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const { data: municipalities = [], isLoading } = useSearchMunicipalities(inputValue);

  // Debug: ver resultados de la API
  useEffect(() => {
    console.log('Municipalities from API:', { 
      inputValue, 
      count: municipalities.length, 
      isLoading, 
      isOpen,
      municipalities: municipalities.slice(0, 3) 
    });
  }, [municipalities, isLoading, inputValue, isOpen]);

  // Abrir dropdown automáticamente cuando llegan resultados
  useEffect(() => {
    if (municipalities.length > 0 && inputValue.length >= 2 && !isLoading) {
      setIsOpen(true);
    }
  }, [municipalities, inputValue, isLoading]);

  // Sincronizar valor externo
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll al elemento seleccionado
  useEffect(() => {
    if (selectedIndex >= 0 && isOpen) {
      const listbox = document.getElementById(listboxId);
      const selectedOption = listbox?.children[selectedIndex] as HTMLElement;
      selectedOption?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen, listboxId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const shouldOpen = newValue.length >= 2;
    setIsOpen(shouldOpen);
    setSelectedIndex(-1);
    if (newValue === '') {
      onChange(null);
    }
    // Debug: ver si se está abriendo el dropdown
    console.log('Input changed:', { value: newValue, shouldOpen, length: newValue.length });
  };

  const handleSelect = (municipality: Municipality) => {
    setInputValue(municipality.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onChange(municipality);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || municipalities.length === 0) {
      if (e.key === 'ArrowDown' && inputValue.length >= 2) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < municipalities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && municipalities[selectedIndex]) {
          handleSelect(municipalities[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Clases según variante
  const inputClasses = variant === 'dark'
    ? `w-full px-4 py-3.5 rounded-lg
       bg-white/10 backdrop-blur-sm
       border border-white/20
       text-white placeholder:text-white/50
       transition-all duration-200
       hover:border-white/40
       focus:border-coral focus:ring-2 focus:ring-coral/30
       focus:outline-none
       min-h-touch`
    : 'input-field';

  const dropdownClasses = variant === 'dark'
    ? 'bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl'
    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700';

  const optionBaseClasses = variant === 'dark'
    ? 'text-neutral-900 font-medium'
    : 'text-neutral-900 dark:text-white';

  const optionHoverClasses = variant === 'dark'
    ? 'hover:bg-coral/20 hover:text-neutral-900'
    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700';

  const optionSelectedClasses = variant === 'dark'
    ? 'bg-coral/30 text-neutral-900'
    : 'bg-petroleo-100 dark:bg-petroleo-900';

  return (
    <div ref={wrapperRef} className="relative z-[100]">
      {/* Solo mostrar label si hay texto */}
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-2 ${
            variant === 'dark'
              ? 'text-white'
              : 'text-neutral-700 dark:text-neutral-300'
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          className={inputClasses}
        />

        {/* Indicador de carga */}
        {isLoading && (
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              variant === 'dark' ? 'text-white/60' : 'text-neutral-400'
            }`}
            aria-hidden="true"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown - Listbox */}
      {isOpen && (
        <>
          {/* Estados de carga/vacío fuera del listbox */}
          {(isLoading || municipalities.length === 0) && (
            <div
              className={`absolute z-[9999] w-full mt-1 border rounded-lg shadow-2xl
                          px-4 py-3 ${dropdownClasses}`}
              role="status"
              aria-live="polite"
            >
              {isLoading ? (
                <span className={`flex items-center gap-2 ${
                  variant === 'dark' ? 'text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Buscando municipios...
                </span>
              ) : (
                <span className={
                  variant === 'dark' ? 'text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'
                }>
                  No se encontraron municipios
                </span>
              )}
            </div>
          )}

          {/* Listbox con opciones */}
          {!isLoading && municipalities.length > 0 && (
            <ul
              id={listboxId}
              aria-label={`Sugerencias para ${label || placeholder}`}
              className={`absolute z-[9999] w-full mt-1 border-2 rounded-lg shadow-2xl
                          max-h-60 overflow-auto ${dropdownClasses}`}
            >
              {municipalities.map((municipality, index) => (
                <li
                  key={municipality.id}
                  id={`${listboxId}-option-${index}`}
                  onClick={() => handleSelect(municipality)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between
                             transition-colors duration-150 min-h-touch
                             ${optionBaseClasses}
                             ${index === selectedIndex ? optionSelectedClasses : optionHoverClasses}`}
                >
                  <span className="font-medium">{municipality.name}</span>
                  <span
                    className={`text-sm ${
                      variant === 'dark' ? 'text-neutral-500' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {municipality.province}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Texto de ayuda para screen readers */}
      <div className="sr-only" aria-live="polite">
        {isOpen && municipalities.length > 0 && (
          <span>
            {municipalities.length} municipios encontrados. Usa las flechas para navegar.
          </span>
        )}
      </div>
    </div>
  );
}
