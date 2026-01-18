import { z } from 'zod';

// Schema de validación con Zod
export const searchFormSchema = z.object({
  origin: z.string().min(1, 'El origen es obligatorio'),
  destination: z.string().min(1, 'El destino es obligatorio'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  passengers: z
    .number({ invalid_type_error: 'Introduce un número válido' })
    .min(1, 'Mínimo 1 pasajero')
    .max(100, 'Máximo 100 pasajeros'),
});

// Tipo derivado del schema
export type SearchFormData = z.infer<typeof searchFormSchema>;

// Estado del formulario con datos extendidos
export interface SearchFormState {
  origin: string;
  originMunicipality: {
    id: string;
    name: string;
    province: string;
  } | null;
  destination: string;
  destinationMunicipality: {
    id: string;
    name: string;
    province: string;
  } | null;
  date: string;
  passengers: number | '';
}

// Props para el componente SearchForm
export interface SearchFormProps {
  onSearch?: (data: SearchFormData) => void;
  isLoading?: boolean;
  className?: string;
}

// Resultado de búsqueda de ruta
export interface SearchRouteResult {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  success: boolean;
  errorMessage?: string | null;
}

// Opciones de pasajeros para el selector
export const passengerOptions = [
  { value: 10, label: '1-10 pasajeros' },
  { value: 20, label: '11-20 pasajeros' },
  { value: 30, label: '21-30 pasajeros' },
  { value: 40, label: '31-40 pasajeros' },
  { value: 50, label: '41-50 pasajeros' },
  { value: 60, label: '51-60 pasajeros' },
] as const;
