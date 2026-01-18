import { catalogApi } from '@/lib/api';
import { User } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: RouteData | UserData | StatsData;
}

export interface RouteData {
  type: 'route';
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface UserData {
  type: 'user';
  user: User;
}

export interface StatsData {
  type: 'stats';
  cacheStats?: { size: number; hitRate: number; missRate: number };
  rateLimitStats?: { remaining: number; limit: number; resetAt: string };
}

// Patrones para detectar intenciones
const ROUTE_PATTERNS = [
  /(?:cu[aá]nto|qu[eé])\s+(?:tarda|tiempo|dura|distancia|hay|lejos).*?(?:de|desde)\s+([a-záéíóúñ\s]+)\s+(?:a|hasta|hacia)\s+([a-záéíóúñ\s]+)/i,
  /(?:distancia|tiempo|duraci[oó]n|ruta).*?(?:entre|de)\s+([a-záéíóúñ\s]+)\s+(?:y|a|hasta)\s+([a-záéíóúñ\s]+)/i,
  /(?:ir|viajar|llegar).*?(?:de|desde)\s+([a-záéíóúñ\s]+)\s+(?:a|hasta|hacia)\s+([a-záéíóúñ\s]+)/i,
  /(?:de)\s+([a-záéíóúñ\s]+)\s+(?:a)\s+([a-záéíóúñ\s]+)/i,
];

const MUNICIPALITY_PATTERNS = [
  /(?:municipios?|pueblos?|ciudades?).*?(?:de|en)\s+(?:la\s+)?(?:provincia\s+(?:de\s+)?)?([a-záéíóúñ\s]+)/i,
  /(?:qu[eé]|cu[aá]les?).*?municipios?.*?([a-záéíóúñ\s]+)/i,
];

const USER_PATTERNS = [
  /(?:qui[eé]n\s+soy|mi\s+perfil|mis\s+datos|mi\s+informaci[oó]n|mi\s+cuenta)/i,
];

const STATS_PATTERNS = [
  /(?:estad[ií]sticas?|stats?|cach[eé]|b[uú]squedas?\s+(?:quedan|restantes?|disponibles?)|rate\s*limit)/i,
];

const GREETING_PATTERNS = [
  /^(?:hola|hey|buenas|buenos?\s+(?:d[ií]as?|tardes?|noches?)|saludos?|qu[eé]\s+tal)/i,
];

const HELP_PATTERNS = [
  /(?:ayuda|help|qu[eé]\s+puedes?\s+hacer|c[oó]mo\s+funciona|comandos?|opciones?)/i,
];

function cleanMunicipalityName(name: string): string {
  return name
    .trim()
    .replace(/[?.!,;:]+$/, '')
    .replace(/^\s+|\s+$/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} minutos`;
  if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
  return `${hours}h ${mins}min`;
}

export async function processMessage(
  message: string,
  currentUser: User | null
): Promise<ChatMessage> {
  const id = crypto.randomUUID();
  const timestamp = new Date();

  // Saludos
  if (GREETING_PATTERNS.some(p => p.test(message))) {
    const greeting = currentUser
      ? `¡Hola ${currentUser.firstName}! 👋`
      : '¡Hola! 👋';
    return {
      id,
      role: 'assistant',
      content: `${greeting} Soy tu asistente de BusConnect. Puedo ayudarte con:\n\n• **Calcular rutas**: "¿Cuánto tarda de Barcelona a Girona?"\n• **Buscar municipios**: "Municipios de Tarragona"\n• **Tu perfil**: "¿Quién soy?"\n${currentUser?.role === 'ADMIN' ? '• **Estadísticas**: "¿Cómo va el caché?"' : ''}\n\n¿En qué puedo ayudarte?`,
      timestamp,
    };
  }

  // Ayuda
  if (HELP_PATTERNS.some(p => p.test(message))) {
    return {
      id,
      role: 'assistant',
      content: `Puedo ayudarte con lo siguiente:\n\n🚌 **Rutas**\n• "¿Cuánto tarda de Barcelona a Girona?"\n• "Distancia entre Tarragona y Lleida"\n• "De Sabadell a Terrassa"\n\n🏘️ **Municipios**\n• "Municipios de Barcelona"\n• "Pueblos de la provincia de Girona"\n\n👤 **Tu perfil**\n• "¿Quién soy?"\n• "Mi información"\n\n${currentUser?.role === 'ADMIN' ? '📊 **Estadísticas** (Admin)\n• "Estadísticas del caché"\n• "¿Cuántas búsquedas quedan?"' : ''}`,
      timestamp,
    };
  }

  // Consulta de usuario
  if (USER_PATTERNS.some(p => p.test(message))) {
    if (!currentUser) {
      return {
        id,
        role: 'assistant',
        content: 'No has iniciado sesión. Usa el selector de usuario en la barra de navegación para simular un usuario.',
        timestamp,
      };
    }

    const roleLabels: Record<string, string> = {
      ADMIN: '🛡️ Administrador',
      CUSTOMER: '👤 Cliente',
      COMPANY: '🏢 Empresa',
    };

    return {
      id,
      role: 'assistant',
      content: `**Tu perfil:**\n\n• **Nombre:** ${currentUser.firstName} ${currentUser.lastName}\n• **Email:** ${currentUser.email}\n• **Teléfono:** ${currentUser.phone || 'No especificado'}\n• **Rol:** ${roleLabels[currentUser.role] || currentUser.role}\n• **Estado:** ${currentUser.active ? '✅ Activo' : '❌ Inactivo'}`,
      timestamp,
      data: { type: 'user', user: currentUser },
    };
  }

  // Estadísticas (solo admin)
  if (STATS_PATTERNS.some(p => p.test(message))) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return {
        id,
        role: 'assistant',
        content: 'Las estadísticas del sistema solo están disponibles para administradores.',
        timestamp,
      };
    }

    try {
      const [cacheStats, rateLimitStats] = await Promise.all([
        catalogApi.getCacheStats(),
        catalogApi.getRateLimitStats(),
      ]);

      return {
        id,
        role: 'assistant',
        content: `**📊 Estadísticas del sistema:**\n\n**Caché:**\n• Entradas: ${cacheStats.size}\n• Aciertos: ${(cacheStats.hitRate * 100).toFixed(1)}%\n• Fallos: ${(cacheStats.missRate * 100).toFixed(1)}%\n\n**Rate Limit (API externa):**\n• Restantes hoy: ${rateLimitStats.remaining}/${rateLimitStats.limit}\n• Se reinicia: ${new Date(rateLimitStats.resetAt).toLocaleString('es-ES')}`,
        timestamp,
        data: { type: 'stats', cacheStats, rateLimitStats },
      };
    } catch {
      return {
        id,
        role: 'assistant',
        content: 'No pude obtener las estadísticas. Verifica que el servicio de catálogo esté funcionando.',
        timestamp,
      };
    }
  }

  // Calcular ruta
  for (const pattern of ROUTE_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const origin = cleanMunicipalityName(match[1]);
      const destination = cleanMunicipalityName(match[2]);

      try {
        const result = await catalogApi.calculateRoute(
          { originMunicipality: origin, destinationMunicipality: destination },
          currentUser?.id
        );

        if (result.success) {
          return {
            id,
            role: 'assistant',
            content: `**🚌 Ruta: ${result.origin} → ${result.destination}**\n\n• **Distancia:** ${result.distanceKm.toFixed(1)} km\n• **Duración estimada:** ${formatDuration(result.durationMinutes)}\n\n${result.source === 'cache' ? '⚡ (resultado desde caché)' : ''}`,
            timestamp,
            data: {
              type: 'route',
              origin: result.origin,
              destination: result.destination,
              distanceKm: result.distanceKm,
              durationMinutes: result.durationMinutes,
            },
          };
        } else {
          return {
            id,
            role: 'assistant',
            content: `No pude calcular la ruta entre **${origin}** y **${destination}**. ${result.errorMessage || 'Verifica que los nombres de los municipios sean correctos.'}`,
            timestamp,
          };
        }
      } catch {
        return {
          id,
          role: 'assistant',
          content: `Ocurrió un error al calcular la ruta. Verifica que los municipios "${origin}" y "${destination}" existan en Catalunya.`,
          timestamp,
        };
      }
    }
  }

  // Municipios por provincia
  for (const pattern of MUNICIPALITY_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const provinceName = cleanMunicipalityName(match[1]);
      const validProvinces = ['Barcelona', 'Girona', 'Lleida', 'Tarragona'];
      const province = validProvinces.find(
        p => p.toLowerCase() === provinceName.toLowerCase()
      );

      if (province) {
        try {
          const municipalities = await catalogApi.getMunicipalitiesByProvince(
            province as 'Barcelona' | 'Girona' | 'Lleida' | 'Tarragona'
          );
          const sample = municipalities.slice(0, 10);
          const remaining = municipalities.length - sample.length;

          return {
            id,
            role: 'assistant',
            content: `**🏘️ Municipios de ${province}** (${municipalities.length} total):\n\n${sample.map(m => `• ${m.name}`).join('\n')}${remaining > 0 ? `\n\n...y ${remaining} más` : ''}`,
            timestamp,
          };
        } catch {
          return {
            id,
            role: 'assistant',
            content: `No pude obtener los municipios de ${province}. Verifica que el servicio esté funcionando.`,
            timestamp,
          };
        }
      } else {
        return {
          id,
          role: 'assistant',
          content: `"${provinceName}" no es una provincia válida de Catalunya. Las provincias disponibles son: **Barcelona**, **Girona**, **Lleida** y **Tarragona**.`,
          timestamp,
        };
      }
    }
  }

  // Respuesta por defecto
  return {
    id,
    role: 'assistant',
    content: `No estoy seguro de cómo ayudarte con eso. Prueba a preguntarme:\n\n• "¿Cuánto tarda de Barcelona a Girona?"\n• "Municipios de Tarragona"\n• "¿Quién soy?"\n\nO escribe **"ayuda"** para ver todas las opciones.`,
    timestamp,
  };
}
