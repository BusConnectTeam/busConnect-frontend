'use client';

import { useSearchMunicipalities } from '@/hooks';
import { Municipality } from '@/types';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MunicipalityAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (municipality: Municipality | null) => void;
}

export default function MunicipalityAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
}: MunicipalityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: municipalities = [], isLoading } = useSearchMunicipalities(inputValue);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length >= 2);
    setSelectedIndex(-1);
    if (newValue === '') {
      onChange(null);
    }
  };

  const handleSelect = (municipality: Municipality) => {
    setInputValue(municipality.name);
    onChange(municipality);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || municipalities.length === 0) return;

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
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
      >
        <MapPin className="w-4 h-4 inline mr-1" />
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
        className="input-field"
      />

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <li className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
              Buscando...
            </li>
          ) : municipalities.length === 0 ? (
            <li className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
              No se encontraron municipios
            </li>
          ) : (
            municipalities.map((municipality, index) => (
              <li
                key={municipality.id}
                onClick={() => handleSelect(municipality)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between
                  ${index === selectedIndex
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {municipality.name}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {municipality.province}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
