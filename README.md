# BusConnect Frontend

![CI/CD](https://github.com/BusConnectTeam/busConnect-frontend/workflows/CI%2FCD%20Pipeline/badge.svg)
![PR Checks](https://github.com/BusConnectTeam/busConnect-frontend/workflows/PR%20Checks/badge.svg)

> Plataforma de reservas de autocares para Catalunya

## 📋 Descripción

BusConnect es una plataforma moderna y accesible tipo Booking.com especializada en reservas de autobuses y autocares. Diseñada para un público amplio (18-70 años), ofrece una experiencia intuitiva tanto para usuarios que buscan reservar como para empresas de transporte que desean ofrecer sus servicios.

## 🎯 Características principales

- **Búsqueda intuitiva**: Sistema de búsqueda por origen, destino, fecha y número de pasajeros
- **Empresas verificadas**: Catálogo de empresas de transporte verificadas con valoraciones y reseñas
- **Diseño accesible**: Interfaz clara y profesional optimizada para todas las edades
- **Modo oscuro**: Soporte automático para tema claro/oscuro
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Asistente IA**: Chat flotante con asistente virtual para ayudar en la búsqueda
- **Multiidioma**: Preparado para español, catalán e inglés

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form + Zod
- **Estado**: Zustand
- **Data Fetching**: TanStack Query
- **Iconos**: Lucide React

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BusConnectTeam/busConnect-frontend.git

# Entrar al directorio
cd busConnect-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del proyecto

```
busconnect-frontend/
├── src/
│   ├── app/              # Rutas y páginas (App Router)
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Página de inicio
│   │   └── globals.css   # Estilos globales
│   ├── components/       # Componentes reutilizables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── VerifiedCompanies.tsx
│   │   ├── Benefits.tsx
│   │   ├── CompanyCTA.tsx
│   │   └── AIChat.tsx
│   ├── lib/              # Utilidades y datos
│   │   ├── utils.ts
│   │   └── mock-data.ts
│   └── types/            # Tipos TypeScript
│       └── index.ts
├── public/               # Archivos estáticos
├── tailwind.config.ts    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── package.json
```

## 🎨 Paleta de colores

- **Primary**: `#2563EB` (Azul confianza)
- **Accent Yellow**: `#FBBF24` (Acentos cálidos)
- **Accent Green**: `#10B981` (Confirmaciones)
- **Neutral**: Escala de grises para textos y fondos

## 🧩 Componentes principales

### Hero
Sección principal con buscador central que permite búsqueda por origen, destino, fecha y número de pasajeros.

### VerifiedCompanies
Grid de empresas verificadas con logo, valoración y descripción.

### Benefits
Sección que destaca las ventajas de usar BusConnect (seguridad, empresas verificadas, atención 24/7, etc.).

### CompanyCTA
Call-to-action para empresas de transporte que deseen registrarse en la plataforma.

### AIChat
Chat flotante con asistente virtual para ayudar a los usuarios en su búsqueda.

## 📱 Próximas funcionalidades

- [ ] Página de resultados de búsqueda con filtros
- [ ] Página de detalle de empresa
- [ ] Flujo completo de reserva (wizard)
- [ ] Sistema de autenticación (Google OAuth + Email)
- [ ] Panel de usuario con historial de reservas
- [ ] Panel de empresa para gestión de flota
- [ ] Blog con artículos sobre movilidad
- [ ] Sistema de pagos (Stripe/Redsys)
- [ ] Integración con backend (API REST)

## 🤝 Equipo

- **Irina** - Full Stack Developer (Lead Frontend)
- **2 Desarrolladores Junior** - Backend
- **1 Desarrollador Mid-Senior** - Backend

## 📝 Scripts disponibles

```bash
npm run dev      # Iniciar en modo desarrollo
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 🌐 Despliegue

El proyecto está configurado para desplegarse en **Render** con integración continua mediante **GitHub Actions**.

### GitHub Actions
- ✅ CI/CD automático en push a `main` o `develop`
- ✅ Verificaciones en Pull Requests
- ✅ Deploy automático a Render (opcional)

Ver [documentación completa de GitHub Actions](.github/GITHUB_ACTIONS.md) para configuración detallada.

### Configurar Auto-Deploy
1. Obtén el Deploy Hook desde Render Dashboard
2. Añade el secret `RENDER_DEPLOY_HOOK_URL` en GitHub
3. Descomenta el job `deploy` en `.github/workflows/ci.yml`

## 📄 Licencia

Este proyecto es privado y pertenece a BusConnectTeam.

---

Desarrollado con ❤️ por el equipo de BusConnect
