import { busesApi, catalogApi, companiesApi } from '@/lib/api';
import { BusCompany, BusTypeEntity, User } from '@/types';

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
  cacheStats?: {
    routeCacheSize: number;
    routeHitRatePercent: number;
    routeMissCount: number;
    municipalityCacheSize: number;
  };
  rateLimitStats?: {
    remainingRequests: number;
    maxRequestsPerDay: number;
    usagePercentage: number;
  };
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
        catalogApi.getCacheStats().catch(() => null),
        catalogApi.getRateLimitStats().catch(() => null),
      ]);

      // Validar que los datos existan y tengan la estructura esperada
      const hasCacheStats = cacheStats && typeof cacheStats.routeCacheSize === 'number';
      const hasRateLimitStats = rateLimitStats && typeof rateLimitStats.remainingRequests === 'number';

      if (!hasCacheStats && !hasRateLimitStats) {
        return {
          id,
          role: 'assistant',
          content: 'Los endpoints de estadísticas no están disponibles en el backend. Verifica que `/api/routes/cache-stats` y `/api/routes/rate-limit-stats` estén implementados.',
          timestamp,
        };
      }

      let content = '**📊 Estadísticas del sistema:**\n\n';

      if (hasCacheStats) {
        const totalRouteRequests = cacheStats.routeHitCount + cacheStats.routeMissCount;
        const routeMissRate = totalRouteRequests > 0 ? (cacheStats.routeMissCount / totalRouteRequests) * 100 : 0;
        content += `**Caché de rutas:**\n• Entradas: ${cacheStats.routeCacheSize}\n• Aciertos: ${cacheStats.routeHitRatePercent.toFixed(1)}%\n• Fallos: ${routeMissRate.toFixed(1)}%\n\n`;
        content += `**Caché de municipios:**\n• Entradas: ${cacheStats.municipalityCacheSize}\n\n`;
      } else {
        content += '**Caché:** No disponible\n\n';
      }

      if (hasRateLimitStats) {
        content += `**Rate Limit (API externa):**\n• Restantes hoy: ${rateLimitStats.remainingRequests}/${rateLimitStats.maxRequestsPerDay}\n• Uso: ${rateLimitStats.usagePercentage.toFixed(1)}%`;
      } else {
        content += '**Rate Limit:** No disponible';
      }

      return {
        id,
        role: 'assistant',
        content,
        timestamp,
        data: { type: 'stats', cacheStats: cacheStats || undefined, rateLimitStats: rateLimitStats || undefined },
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
          // Buscar buses disponibles para mostrar precios
          let busesContent = '';
          try {
            const [buses, companies] = await Promise.all([
              busesApi.getAll(),
              companiesApi.getAll(),
            ]);

            // Crear mapa de empresas
            const companiesMap = new Map<number, BusCompany>();
            companies.forEach((c) => companiesMap.set(c.id, c));

            // Filtrar buses activos y calcular precios
            const busesWithPrices = buses
              .filter((bus: BusTypeEntity) => bus.active)
              .map((bus: BusTypeEntity) => ({
                ...bus,
                company: companiesMap.get(bus.companyId),
                estimatedPrice: Math.round(bus.pricePerKm * result.distanceKm),
              }))
              .sort((a, b) => a.estimatedPrice - b.estimatedPrice)
              .slice(0, 3); // Top 3 más baratos

            if (busesWithPrices.length > 0) {
              busesContent = '\n\n**💰 Opciones disponibles:**\n';
              busesWithPrices.forEach((bus, index) => {
                const seatLabels: Record<string, string> = {
                  standard: 'Estándar',
                  premium: 'Premium',
                  vip: 'VIP',
                  sleeper: 'Cama',
                };
                const amenities = [];
                if (bus.hasWifi) amenities.push('WiFi');
                if (bus.hasAc) amenities.push('A/C');
                if (bus.hasToilet) amenities.push('WC');

                busesContent += `\n${index + 1}. **${bus.name}** (${seatLabels[bus.seatType] || bus.seatType})\n`;
                busesContent += `   • Capacidad: ${bus.capacity} plazas\n`;
                busesContent += `   • Precio aprox: **~${bus.estimatedPrice}€**\n`;
                if (bus.company) {
                  busesContent += `   • Empresa: ${bus.company.name}${bus.company.verified ? ' ✓' : ''}\n`;
                }
                if (amenities.length > 0) {
                  busesContent += `   • Extras: ${amenities.join(', ')}\n`;
                }
              });
              busesContent += '\n💡 *Usa el buscador principal para ver todas las opciones y solicitar presupuesto.*';
            }
          } catch {
            // Si falla la búsqueda de buses, solo mostramos la ruta
          }

          return {
            id,
            role: 'assistant',
            content: `**🚌 Ruta: ${result.origin} → ${result.destination}**\n\n• **Distancia:** ${result.distanceKm.toFixed(1)} km\n• **Duración estimada:** ${formatDuration(result.durationMinutes)}${result.source === 'cache' ? '\n\n⚡ (resultado desde caché)' : ''}${busesContent}`,
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
