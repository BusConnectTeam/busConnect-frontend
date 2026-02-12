export interface BlogPostAuthor {
  name: string;
  role: string;
  image: string;
}

export interface BlogPostSection {
  title: string;
  paragraphs: string[];
  code?: string;
  link?: { text: string; href: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  author: BlogPostAuthor;
  coAuthor?: BlogPostAuthor;
  date: string;
  coverImage: string;
  summary: string;
  tags: string[];
  readingTime: number;
  sections: BlogPostSection[];
}

const authors: Record<string, BlogPostAuthor> = {
  irina: {
    name: 'Irina',
    role: 'Full Stack Developer',
    image: '/images/team/Irina-Ichim.jpg',
  },
  gabriela: {
    name: 'Gabriela',
    role: 'Backend Developer',
    image: '/images/team/Gabriela.jpg',
  },
  ainoha: {
    name: 'Ainoha',
    role: 'Backend Developer',
    image: '/images/team/Ainoha.png',
  },
  equipo: {
    name: 'Equipo BusConnect',
    role: 'El equipo detrás del proyecto',
    image: '/images/blog/busConnect.png',
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'testing-microservicios-busconnect',
    title: 'Testing en Microservicios: Cómo Probamos BusConnect Sin Romper el Banco',
    author: authors.gabriela,
    coAuthor: authors.irina,
    date: '2026-02-12',
    coverImage: '/images/blog/testing.png',
    summary:
      'Cuando empezamos con BusConnect, teníamos un dilema: cómo testear 4 microservicios sin que cada test tarde minutos en levantar Docker, PostgreSQL y todas las dependencias. La respuesta: tests inteligentes y estratificados.',
    tags: ['Testing', 'Microservicios', 'Spring Boot', 'WebFlux'],
    readingTime: 8,
    sections: [
      {
        title: 'La Estrategia: Tests en Capas',
        paragraphs: [
          'Cuando empezamos con BusConnect, teníamos un dilema: ¿cómo testear 4 microservicios sin que cada test tarde minutos en levantar Docker, PostgreSQL y todas las dependencias?',
          'La respuesta: tests inteligentes y estratificados.',
        ],
      },
      {
        title: 'Capa 1: Tests Unitarios Reactivos',
        paragraphs: [
          'Usando @WebFluxTest, probamos cada controlador de forma aislada. No levantamos la aplicación completa, solo el controlador que nos interesa. Es como probar una pieza de Lego sin construir el castillo entero.',
          'Ventaja: Un test tarda 200ms en lugar de 30 segundos.',
        ],
      },
      {
        title: 'Capa 2: Mocking Inteligente',
        paragraphs: [
          'Con @MockBean simulamos todo: la base de datos, OpenRouteService, Eureka, incluso otros microservicios. No necesitamos infraestructura real.',
          '¿Por qué funciona? Porque estamos probando comportamiento, no tecnología. Si el controlador responde correctamente cuando el servicio devuelve un usuario, eso es lo que importa.',
        ],
      },
      {
        title: 'Capa 3: Security Testing',
        paragraphs: [
          'Aquí no hay margen de error. En el User Service tenemos 8 tests dedicados solo a autenticación y JWT:',
          '¿Funciona el login sin token? ¿Rechaza tokens inválidos? ¿Acepta tokens válidos? ¿Protege endpoints correctos?',
          'Objetivo: Cero vulnerabilidades en producción.',
        ],
      },
      {
        title: 'El Secreto: Profile "test"',
        paragraphs: [
          'Creamos un perfil de Spring Boot específico para tests. Sin Docker, sin PostgreSQL, sin APIs externas. Los mocks reemplazan todo.',
          'Resultado: Los tests ejecutan en CI/CD en menos de 10 segundos. Deploy rápido, feedback instantáneo.',
        ],
      },
      {
        title: 'Tests Reactivos: El Desafío WebFlux',
        paragraphs: [
          'No puedes testear código reactivo con herramientas tradicionales. Usamos WebTestClient para simular requests HTTP y Reactor-test para validar flujos Mono/Flux.',
          '¿Qué probamos? Que los endpoints respondan sin bloquear threads, que el backpressure funcione correctamente y que los errores se propaguen reactivamente.',
          'Sin estos tests, desplegar WebFlux es como conducir con los ojos cerrados.',
        ],
      },
      {
        title: 'Lo Que NO Testeamos (Y Por Qué)',
        paragraphs: [
          'No testeamos Spring Boot: Ya está probado por millones de developers.',
          'No testeamos librerías externas: OpenRouteService tiene sus propios tests.',
          'Testeamos la integración: ¿Llamamos correctamente a la API? ¿Parseamos bien la respuesta? Eso sí importa.',
        ],
      },
      {
        title: 'El Impacto Real',
        paragraphs: [
          'Antes de implementar esta estrategia, teníamos miedo de hacer cambios. Ahora: Deploy diario sin ansiedad, Refactors seguros, Bugs detectados en segundos, no en producción y Documentación viva (los tests muestran cómo usar cada endpoint).',
        ],
      },
      {
        title: 'La Lección',
        paragraphs: [
          'Tests no son "nice to have", son el contrato de calidad de tu sistema.',
          'En microservicios, donde cada servicio puede fallar independientemente, tener tests rápidos y confiables es la diferencia entre dormir tranquilo o recibir llamadas a las 3AM.',
        ],
      },
    ],
  },
  {
    slug: 'monolito-a-microservicios-user-service',
    title: 'De Monolito a Microservicios: Construyendo los cimientos de User-Service',
    author: authors.gabriela,
    date: '2026-01-12',
    coverImage: '/images/blog/user-service.png',
    summary:
      'Cómo nació user-service, nuestro primer microservicio independiente: la decisión de separar responsabilidades, la contenedorización con Docker, PostgreSQL reactivo con R2DBC y calidad desde el inicio.',
    tags: ['Microservicios', 'Backend', 'Docker', 'Spring Boot'],
    readingTime: 5,
    sections: [
      {
        title: 'La decisión estratégica',
        paragraphs: [
          'Cuando iniciamos el proyecto BusConnect, la tentación de construirlo todo en un solo bloque (un monolito) era grande por su sencillez inicial. Sin embargo, pensando en el futuro y en la escalabilidad, tomamos una decisión estratégica: separar las responsabilidades. Así nació user-service, nuestro primer microservicio independiente.',
        ],
      },
      {
        title: 'Por qué microservicios',
        paragraphs: [
          'En lugar de tener una aplicación gigante donde todo depende de todo, decidimos que la gestión de usuarios debía ser un módulo autónomo. Esto nos permite escalar de forma independiente: si miles de personas se registran a la vez, solo necesitamos dar más recursos a este servicio.',
          'También ganamos mantenimiento ágil. Podemos actualizar la seguridad o la base de datos de usuarios sin riesgo de romper otras partes del sistema.',
        ],
      },
      {
        title: 'Docker: tu código funciona en mi máquina (y en la de todos)',
        paragraphs: [
          'Uno de los hitos de este trabajo fue la contenedorización. Gracias a Docker, logramos empaquetar todo el entorno de user-service, incluyendo su base de datos PostgreSQL, en contenedores.',
          'Esto significa que cualquier desarrollador puede levantar el proyecto completo con un solo comando, garantizando que el entorno de desarrollo sea idéntico al de producción. Se acabaron las excusas de "en mi ordenador sí funcionaba".',
        ],
      },
      {
        title: 'El corazón de los datos: PostgreSQL y R2DBC',
        paragraphs: [
          'Para persistir la información, elegimos PostgreSQL por su robustez. Pero como queríamos una aplicación totalmente reactiva, no podíamos usar conexiones tradicionales (JDBC). Implementamos R2DBC, permitiendo que la comunicación con la base de datos sea asíncrona y aproveche al máximo los recursos del servidor.',
        ],
      },
      {
        title: 'Calidad desde el inicio',
        paragraphs: [
          'Para asegurar que esta estructura fuera sólida, implementamos un sistema de pruebas en dos niveles. Primero, tests unitarios para verificar la lógica interna de cada componente. Segundo, una estructura de microservicios con una jerarquía de paquetes clara (controller, service, repository, model) que sigue las mejores prácticas de la industria, facilitando que el código sea autodocumentado y fácil de seguir.',
        ],
      },
      {
        title: 'Reflexión',
        paragraphs: [
          'Crear un microservicio desde cero no es solo escribir código; es diseñar un ecosistema donde la infraestructura, la base de datos y la lógica conviven en perfecta armonía.',
        ],
      },
    ],
  },
  {
    slug: 'chatbot-inteligente-busconnect',
    title: 'Construyendo un chatbot inteligente para BusConnect',
    author: authors.irina,
    date: '2026-01-05',
    coverImage: '/images/blog/chatbot.png',
    summary:
      'Cómo creamos paso a paso un asistente conversacional que calcula rutas reales, muestra precios de autobuses y responde en castellano, conectado directamente con nuestros microservicios.',
    tags: ['Frontend', 'Chatbot', 'Next.js', 'Arquitectura'],
    readingTime: 7,
    sections: [
      {
        title: 'La idea: un asistente que hable con el backend',
        paragraphs: [
          'Cuando empezamos BusConnect, la búsqueda de rutas funcionaba exclusivamente a través de formularios. Pero nos preguntamos: y si el usuario pudiera simplemente escribir "cuánto tarda de Barcelona a Girona" y obtener una respuesta inmediata? Así nació la idea de un chatbot integrado en la plataforma.',
          'No queríamos un chatbot genérico que respondiera con frases enlatadas. Queríamos uno que consultara datos reales de nuestros microservicios: rutas calculadas por OpenRoute API, precios de autobuses del catálogo y estadísticas del sistema para administradores.',
        ],
      },
      {
        title: 'Detección de intenciones con regex',
        paragraphs: [
          'El primer reto fue entender qué quiere el usuario cuando escribe un mensaje. Implementamos un sistema de detección de intenciones basado en patrones regex en castellano. Cada tipo de consulta tiene sus propios patrones.',
          'Para las rutas definimos cuatro patrones que capturan variaciones como "de Barcelona a Girona", "distancia entre Lleida y Tarragona" o "cuánto tarda de Sabadell a Terrassa". Los grupos de captura extraen automáticamente el municipio de origen y el de destino.',
          'También hay patrones para consultas de municipios por provincia, información del perfil del usuario, estadísticas del sistema (solo para administradores) e incluso preguntas sobre el equipo de BusConnect. La función cleanMunicipalityName normaliza la entrada del usuario para que coincida con los nombres de la base de datos.',
        ],
      },
      {
        title: 'Conectando con los microservicios',
        paragraphs: [
          'La parte más interesante fue conectar el chatbot con las APIs reales. Cuando el usuario pregunta por una ruta, el chatbot llama a catalogApi.calculateRoute() y obtiene la distancia y duración reales calculadas por OpenRoute. Pero no se queda ahí: también consulta busesApi.getAll() para mostrar los tres autobuses más económicos disponibles para esa ruta.',
          'La respuesta incluye la distancia en kilómetros, la duración formateada en horas y minutos, los precios estimados por autobús y sus equipamientos (WiFi, aire acondicionado, WC). Si el resultado viene de la caché del backend, el chatbot lo indica para que el usuario sepa que los datos pueden no estar actualizados al segundo.',
          'Para los administradores, el chatbot puede mostrar métricas del sistema en tiempo real: tamaño de la caché, tasa de aciertos, peticiones restantes del límite diario de 2000 llamadas a OpenRoute y porcentaje de uso.',
        ],
      },
      {
        title: 'Personalización y contexto del usuario',
        paragraphs: [
          'El chatbot sabe quién eres. Si estás logueado, los saludos incluyen tu nombre. La consulta "quién soy" o "mi perfil" muestra tu email, teléfono, rol y estado de la cuenta, todo obtenido de la sesión activa.',
          'Cada respuesta puede incluir datos estructurados además del texto. Cuando calculas una ruta, el componente del chat recibe un objeto RouteData con los valores numéricos para poder renderizar una tarjeta visual, no solo texto plano. Lo mismo ocurre con UserData y StatsData.',
        ],
      },
      {
        title: 'Lecciones aprendidas',
        paragraphs: [
          'Construir un chatbot que funcione bien en castellano tiene sus retos. Los acentos, las variaciones en la forma de escribir los nombres de municipios y las múltiples formas de hacer la misma pregunta obligan a ser generoso con los patrones regex.',
          'La decisión de no usar inteligencia artificial para la detección de intenciones fue deliberada. Con regex tenemos control total sobre qué entiende el chatbot, respuestas predecibles y cero dependencias externas. Para el alcance de BusConnect, es la solución correcta. Si en el futuro necesitamos más flexibilidad, la arquitectura está preparada para sustituir el motor de regex por un modelo de NLP sin tocar el resto del sistema.',
        ],
      },
    ],
  },
  {
    slug: 'calidad-testing-entornos-reactivos',
    title: 'Calidad sin compromiso: El arte de testear en entornos reactivos',
    author: authors.gabriela,
    date: '2025-12-28',
    coverImage: '/images/blog/manual-test.png',
    summary:
      'Nuestra experiencia implementando tests unitarios y de integración en un entorno reactivo con Spring WebFlux: JUnit 5, Mockito, WebTestClient y 8 escenarios críticos en verde.',
    tags: ['Testing', 'Spring WebFlux', 'Backend', 'Java'],
    readingTime: 5,
    sections: [
      {
        title: 'Los tests como aliados, no como carga',
        paragraphs: [
          'A menudo se piensa que hacer tests es "perder el tiempo" o una tarea aburrida que se deja para el final. Sin embargo, en nuestra experiencia desarrollando user-service, los tests han sido nuestros mejores aliados. No solo sirven para encontrar errores; sirven para darnos la libertad de mejorar el código sin miedo.',
          'Un código bien testeado es un código que se puede refactorizar con confianza. Cada vez que cambiamos algo, los tests nos dicen en segundos si hemos roto algo o si todo sigue funcionando como esperamos.',
        ],
      },
      {
        title: 'Testear lo atómico: Unit Testing',
        paragraphs: [
          'Empezamos por la base. Con JUnit 5 y Mockito, aislamos cada componente (servicios, controladores, repositorios) para asegurar que hacían exactamente lo que se esperaba de ellos.',
          '¿Qué pasa si un usuario intenta registrarse con un email que ya existe? ¿Cómo reacciona el sistema si la base de datos está temporalmente fuera de servicio? Todas esas preguntas se responden en los tests unitarios. Cada caso límite, cada excepción, cada flujo alternativo queda cubierto.',
        ],
      },
      {
        title: 'El reto de la integración: WebFluxTest',
        paragraphs: [
          'El verdadero desafío vino al probar la seguridad. Como estamos en un entorno reactivo con Spring WebFlux, los tests tradicionales no son suficientes. Tuvimos que implementar tests de integración capaces de simular flujos asíncronos.',
          'Utilizamos WebTestClient para "bombardear" nuestros propios endpoints y verificar que el JwtAuthenticationFilter bloqueaba a los intrusos y dejaba pasar a los usuarios legítimos. Ver esos 8 escenarios críticos pasar en verde tras cada refactorización fue la mejor recompensa.',
        ],
      },
      {
        title: 'Automatización y confianza',
        paragraphs: [
          'Gracias a esta robusta suite de pruebas, pudimos integrar cambios complejos, como el sistema de encriptación de contraseñas o el filtrado de tokens JWT, con la total seguridad de que el resto del sistema seguía intacto.',
          'Los tests no son un gasto de tiempo, son una inversión en tranquilidad. Un código bien testeado es un código preparado para el futuro. Cada nuevo feature que añadimos empieza con un test que define qué esperamos, y termina con ese test en verde.',
        ],
      },
    ],
  },
  {
    slug: 'arquitectura-frontend-nextjs-busconnect',
    title:
      'Arquitectura Frontend en BusConnect: API, Hooks, Lib y Types',
    author: authors.irina,
    date: '2025-12-20',
    coverImage: '/images/blog/arquitectura-frontend.png',
    summary:
      'Cómo organizamos el frontend de BusConnect con Next.js: un cliente HTTP propio, custom hooks con React Query, utilidades centralizadas y un sistema de tipos estricto con TypeScript y Zod.',
    tags: ['Next.js', 'Frontend', 'TypeScript', 'Arquitectura'],
    readingTime: 8,
    sections: [
      {
        title: 'Un frontend que habla con microservicios',
        paragraphs: [
          'BusConnect no es una aplicación frontend cualquiera. Detrás de cada búsqueda de rutas, cada login y cada panel de gestión hay un ecosistema de microservicios reactivos. El reto fue diseñar una arquitectura frontend que pudiera comunicarse con todos ellos de forma ordenada, tipada y mantenible.',
          'Para conseguirlo, organizamos el código en cuatro capas bien definidas: una capa de API para la comunicación HTTP, custom hooks para la gestión del estado del servidor, utilidades compartidas en lib y un sistema de tipos estricto que actúa como contrato entre frontend y backend.',
        ],
      },
      {
        title: 'La capa de API: un cliente HTTP sin dependencias externas',
        paragraphs: [
          'En lugar de usar Axios o cualquier otra librería de terceros, construimos nuestro propio cliente HTTP sobre la Fetch API nativa. Esto reduce el tamaño del bundle y nos da control total sobre el comportamiento de cada petición.',
          'El cliente centraliza la inyección automática del token JWT en las cabeceras, el manejo de errores con mensajes en castellano y la detección de respuestas 401 para cerrar sesión automáticamente. Cada servicio del backend tiene su propio módulo: authApi para autenticación, catalogApi para rutas y municipios, companiesApi, busesApi y driversApi para el catálogo de empresas.',
          'Un detalle importante es el sistema de errores. Creamos una clase ApiException que traduce los códigos HTTP a mensajes comprensibles para el usuario. Un 429 se convierte en "Demasiadas peticiones", un 503 en "Servicio no disponible". El usuario nunca ve un error técnico crudo.',
        ],
      },
      {
        title: 'Custom Hooks: React Query como corazón del estado',
        paragraphs: [
          'Toda la gestión del estado del servidor pasa por TanStack React Query. Cada dominio tiene sus propios hooks: useAuth para login y registro, useUsers para la gestión de usuarios, y useCatalog para municipios y cálculo de rutas.',
          'La clave está en los tiempos de caché. Los municipios de Catalunya (947 en total) casi nunca cambian, así que configuramos un staleTime de 60 minutos. Las búsquedas de texto se mantienen frescas 5 minutos. El health check del backend se refresca cada 30 segundos. Cada tipo de dato tiene su propia estrategia.',
          'Las mutaciones (crear, actualizar, eliminar) invalidan automáticamente las queries relacionadas. Si actualizas un usuario, React Query sabe que debe refrescar tanto la lista general como el detalle de ese usuario concreto. No hay estados desincronizados.',
        ],
      },
      {
        title: 'Lib: utilidades y la lógica que lo conecta todo',
        paragraphs: [
          'La carpeta lib contiene las piezas transversales de la aplicación. La función cn() combina clsx con tailwind-merge para resolver conflictos de clases CSS de Tailwind. Las funciones formatCurrency y formatDate localizan números y fechas al formato español.',
          'El providers.tsx configura el QueryClient con opciones globales: un staleTime por defecto de un minuto, un solo reintento en caso de fallo y refetch desactivado cuando la ventana recupera el foco. Estos valores se pueden sobrescribir en cada hook individual.',
          'Aquí también vive el chatbot, un asistente inteligente basado en patrones regex que detecta intenciones del usuario en castellano. Puede calcular rutas reales llamando a la API, mostrar estadísticas del sistema para administradores o presentar al equipo de BusConnect. No es un simple FAQ: consulta datos en tiempo real.',
        ],
      },
      {
        title: 'Types: el contrato entre frontend y backend',
        paragraphs: [
          'TypeScript nos da seguridad en tiempo de compilación, pero eso no basta. Usamos Zod para validar datos en tiempo de ejecución, especialmente en formularios. El schema de registro, por ejemplo, exige contraseñas con mayúsculas, minúsculas, números y caracteres especiales, y valida que la confirmación coincida.',
          'Los tipos están organizados en tres archivos. El index.ts define las entidades principales: User, Municipality, RouteResult, BusCompany, Driver y sus filtros. El auth.ts contiene los schemas Zod para login y registro. El search.ts define la estructura del formulario de búsqueda de rutas con validación integrada.',
          'Un patrón que nos funciona bien es la separación entre tipos de UI y tipos de API. Un Bus en la interfaz tiene campos como pricePerDay y amenities como array de strings. Un BusTypeEntity del backend tiene campos como hasWifi, hasAc y hasToilet como booleanos individuales. Cada capa trabaja con su propio modelo.',
        ],
      },
      {
        title: 'Conclusión',
        paragraphs: [
          'La arquitectura frontend de BusConnect no surgió de la noche a la mañana. Es el resultado de iterar sobre decisiones prácticas: un cliente HTTP propio porque no necesitábamos Axios, React Query porque resuelve el estado del servidor mejor que cualquier store global, Zod porque los tipos de TypeScript no validan en runtime.',
          'El resultado es un frontend donde cada capa tiene una responsabilidad clara. La API habla con el backend, los hooks gestionan el estado, lib proporciona las herramientas compartidas y los types garantizan que todo encaje. Cuando algo falla, sabemos exactamente dónde buscar.',
        ],
      },
    ],
  },
  {
    slug: 'jwt-seguridad-reactiva-spring-webflux',
    title: 'JWT y Seguridad Reactiva: El Guardián Silencioso en Spring WebFlux',
    author: authors.gabriela,
    date: '2025-12-15',
    coverImage: '/images/blog/token-jwt.png',
    summary:
      'Cómo implementamos un sistema de seguridad reactivo basado en JWT en nuestro user-service, protegiendo los datos sin romper la naturaleza no bloqueante de Spring WebFlux.',
    tags: ['JWT', 'Seguridad', 'Spring WebFlux', 'Backend'],
    readingTime: 6,
    sections: [
      {
        title: 'El problema de la seguridad tradicional',
        paragraphs: [
          'En el desarrollo de microservicios modernos, la seguridad no puede ser un "añadido" que penalice el rendimiento. Cuando decidimos que user-service sería el corazón de nuestra identidad, nos enfrentamos a un reto: ¿cómo proteger los datos sin romper la naturaleza no bloqueante y ultra-rápida de Spring WebFlux?',
          'En las aplicaciones clásicas, el servidor suele guardar una "sesión" del usuario. Pero en un mundo de microservicios, las sesiones son un estorbo: nos obligan a que el usuario siempre hable con el mismo servidor. Queríamos algo Stateless, sin estado. La respuesta fue implementar un sistema de seguridad reactivo basado en JWT (JSON Web Tokens).',
        ],
      },
      {
        title: 'La solución: El Token como Pasaporte',
        paragraphs: [
          'Elegimos JWT porque funciona como un pasaporte digital. Cuando un usuario hace login, le entregamos un token firmado. En cada petición posterior, el usuario nos enseña ese token. Nosotros no tenemos que preguntar a ninguna base de datos de sesiones; simplemente validamos la firma del token y, si es correcta, le dejamos pasar.',
          'Este enfoque encaja perfectamente con nuestra arquitectura de microservicios: cada servicio puede verificar el token de forma independiente, sin necesidad de compartir estado entre servidores. El resultado es un sistema verdaderamente distribuido y escalable.',
        ],
      },
      {
        title: 'Cómo lo construimos',
        paragraphs: [
          'Para que esto funcione en un entorno reactivo, implementamos tres piezas clave que trabajan juntas como un mecanismo de relojería.',
          'JwtUtil es nuestra "navaja suiza". Se encarga de generar tokens, incluir los roles del usuario (como CUSTOMER o ADMIN) y verificar que el token no haya expirado. Es el componente central que todos los demás utilizan para interactuar con los tokens.',
          'JwtAuthenticationFilter actúa como un portero. Intercepta cada petición HTTP, extrae el token del header Authorization y, si es válido, inyecta la identidad del usuario en el contexto de seguridad de forma completamente reactiva. Este filtro es transparente para el resto de la aplicación.',
          'SecurityConfig es el cerebro de la configuración. Aquí definimos qué puertas están abiertas (como el registro y el login) y cuáles requieren obligatoriamente este pasaporte digital. Es donde se orquesta toda la política de acceso del servicio.',
        ],
      },
      {
        title: 'Calidad garantizada',
        paragraphs: [
          'No podíamos dar el trabajo por terminado sin pruebas. Desarrollamos una suite de tests de integración que simulan ataques, tokens expirados y accesos sin permiso. Lograr que los 8 escenarios críticos pasaran en un entorno reactivo fue uno de los retos más gratificantes del proyecto.',
          'Los tests cubren desde el flujo completo de autenticación hasta intentos de acceso con tokens manipulados, garantizando que cada endpoint responde exactamente como esperamos ante cualquier situación.',
        ],
      },
      {
        title: 'Conclusión',
        paragraphs: [
          'Implementar seguridad reactiva requiere un cambio de mentalidad respecto al flujo de datos, pero el resultado es un sistema robusto, escalable y, sobre todo, seguro. El patrón de JWT encaja naturalmente con la filosofía stateless de los microservicios y con la programación reactiva de Spring WebFlux.',
          'En BusConnect, la seguridad no es un añadido que frena el sistema, sino una parte integral que fluye con el mismo rendimiento que el resto de la aplicación.',
        ],
      },
    ],
  },
  {
    slug: 'nacimiento-busconnect',
    title: 'BusConnect: Cómo nació el proyecto y hacia dónde vamos',
    author: authors.equipo,
    date: '2025-12-01',
    coverImage: '/images/blog/busConnect.png',
    summary:
      'La historia detrás de BusConnect: de una necesidad real en el sector del transporte discrecional en Catalunya a una plataforma modular con microservicios reactivos.',
    tags: ['BusConnect', 'Proyecto', 'Equipo', 'Arquitectura'],
    readingTime: 7,
    sections: [
      {
        title: 'Una necesidad real',
        paragraphs: [
          'BusConnect nace de una necesidad concreta. Conocemos de primera mano las dificultades del sector del transporte discrecional en Catalunya — la falta de digitalización, la gestión manual de rutas y la desconexión entre empresas y usuarios — y la idea surgió de forma natural: ¿por qué no construir una plataforma que resuelva todo esto?',
          'Lo que empezó como una propuesta para una sola empresa creció rápidamente en ambición. Nos dimos cuenta de que el problema no era de una empresa, sino de todo el sector. Así decidimos crear una plataforma donde todas las empresas de autobuses discrecionales pudieran unirse, ofreciendo a los usuarios un único punto de búsqueda y reserva de rutas.',
        ],
      },
      {
        title: 'La visión',
        paragraphs: [
          'BusConnect es una plataforma modular para la gestión y búsqueda de rutas de autobuses discrecionales en Catalunya. Pero no se queda solo en el usuario final: también ofrece herramientas de gestión interna para las propias empresas de transporte.',
          'La idea es que un usuario pueda buscar rutas entre municipios, comparar opciones de diferentes empresas y reservar su viaje. Al mismo tiempo, las empresas pueden gestionar sus flotas, rutas, conductores y horarios desde un panel centralizado. Un ecosistema completo para ambos lados.',
        ],
      },
      {
        title: 'Arquitectura y tecnología',
        paragraphs: [
          'El backend está construido con una arquitectura de microservicios reactivos usando Spring Cloud y Java 21. Contamos con varios servicios independientes: user-service para gestión de usuarios, catalog-service para el catálogo de rutas y empresas, eureka-service para el descubrimiento de servicios y un api-gateway como punto de entrada unificado.',
          'Usamos programación reactiva con Spring WebFlux, lo que nos permite manejar un gran número de peticiones concurrentes de forma eficiente. Flyway gestiona las migraciones de base de datos con PostgreSQL, y todo está containerizado con Docker para garantizar consistencia entre entornos de desarrollo y producción.',
          'El frontend está desarrollado con Next.js y Tailwind CSS, aprovechando server-side rendering para SEO y rendimiento. TypeScript nos da la seguridad de tipos que necesitamos en un proyecto de esta escala. Todo el pipeline de CI/CD está automatizado para que cada cambio pase por pruebas antes de llegar a producción.',
        ],
      },
      {
        title: 'El equipo detrás',
        paragraphs: [
          'Irina es Full Stack Developer y cofundadora del proyecto. Lidera el desarrollo técnico tanto en frontend como en backend, desde el diseño de la arquitectura de microservicios hasta la interfaz de usuario con Next.js. Su enfoque es construir sistemas que funcionen bien y que sean mantenibles a largo plazo.',
          'Gabriela es Backend Developer y cofundadora. Experta en Spring Boot y programación reactiva, es la responsable de que los microservicios sean robustos y escalables. Su capacidad para resolver problemas complejos de arquitectura distribuida ha sido clave para el proyecto.',
          'Ainoha es Backend Developer y cofundadora. Su conexión directa con el sector del transporte discrecional fue clave para dar forma a BusConnect. Especializada en Java y Spring Boot, ha contribuido al desarrollo del backend y la containerización con Docker.',
        ],
      },
      {
        title: 'Mirando al futuro',
        paragraphs: [
          'BusConnect es un proyecto en constante evolución. Nuestra hoja de ruta incluye integración con sistemas de pago, notificaciones en tiempo real, un panel de analytics para empresas y expansión a más regiones. Cada iteración nos acerca más a una solución completa para el sector.',
          'Este blog será nuestro espacio para compartir decisiones técnicas, retos que enfrentamos y soluciones que encontramos. Si eres una empresa de transporte discrecional y quieres saber más sobre cómo BusConnect puede ayudarte, no dudes en contactarnos.',
        ],
      },
    ],
  },
  {
    slug: 'arquitectura-microservicios-busconnect',
    title: 'Arquitectura de Microservicios en BusConnect: Decisiones Técnicas y Lecciones Aprendidas',
    author: authors.irina,
    coAuthor: authors.gabriela,
    date: '2025-06-15',
    coverImage: '/images/blog/arquitectura-microservicios.png',
    summary: 'Cómo diseñamos la arquitectura de microservicios de BusConnect con Spring Boot, Spring Cloud, programación reactiva y patrones de resiliencia para escalar y mantener un sistema distribuido robusto.',
    tags: ['Arquitectura', 'Microservicios', 'Backend', 'Spring Boot'],
    readingTime: 12,
    sections: [
      {
        title: 'Introducción: El Desafío',
        paragraphs: [
          'Cuando comenzamos a desarrollar BusConnect, una plataforma para gestión y búsqueda de rutas de autobuses en Catalunya, nos enfrentamos a una decisión crucial: ¿Monolito o Microservicios?',
          'Con 947 municipios en Catalunya, múltiples tipos de usuarios (pasajeros, conductores, empresas, administradores) y la necesidad de integrar APIs externas para cálculo de rutas, la respuesta fue clara: necesitábamos escalabilidad, resiliencia y separación de responsabilidades.',
          'Este post detalla nuestras decisiones arquitectónicas, los patrones que implementamos y las lecciones aprendidas en el camino.',
        ],
      },
      {
        title: 'Arquitectura General',
        paragraphs: [
          'BusConnect está construido como un ecosistema de microservicios usando Spring Boot 3.3.13 con Spring Cloud 2023.0.3, ejecutándose en contenedores Docker orquestados con Docker Compose.',
          'Eureka Server (Puerto 8761) es nuestro Service Discovery. ¿Por qué Eureka? Necesitábamos descubrimiento dinámico de servicios para evitar configuraciones estáticas. Los servicios se registran automáticamente. Si levantamos una nueva instancia de Catalog Service, el API Gateway la descubre sin configuración manual.',
          'El API Gateway (Puerto 8080) es nuestro punto de entrada único, construido con Spring Cloud Gateway. Tres decisiones clave lo definen: Circuit Breaker con Resilience4j (si un servicio falla en el 50% de 10 llamadas, el circuit se abre y respondemos con fallback inmediato), CORS centralizado (configurado una sola vez en el gateway, no en cada servicio) y Path Rewriting (los clientes llaman a /api/users/123, pero internamente se reescribe a /users/123).',
          'User Service (Puerto 8082) gestiona usuarios con Spring WebFlux + R2DBC (PostgreSQL reactivo). Implementa Soft Delete (no eliminamos usuarios, los marcamos como isActive=false), caché con Caffeine (500 usuarios en memoria con TTL de 1 hora) y cuatro roles: ADMIN, USER, DRIVER y COMPANY.',
          'Catalog Service (Puerto 8083) es responsable de la gestión de 947 municipios de Catalunya y el cálculo de rutas con OpenRouteService. Usa caché multinivel: municipios con 24 horas de TTL (raramente cambian) y rutas calculadas con 1 hora para reducir llamadas a la API externa.',
        ],
      },
      {
        title: '¿Por qué Programación Reactiva? (WebFlux + R2DBC)',
        paragraphs: [
          'Decidimos usar Spring WebFlux en lugar del tradicional Spring MVC. Las razones: no bloqueante (cuando esperamos una respuesta de OpenRouteService de 500-2000ms, el hilo no se bloquea), mejor uso de recursos (con WebFlux podemos manejar miles de requests concurrentes con pocos threads) y backpressure (control automático de flujo cuando hay sobrecarga).',
          'El trade-off es mayor complejidad en el código (Mono<>, Flux<>), pero el rendimiento lo justifica.',
        ],
        code: '// Tradicional (bloqueante)\npublic User getUser(Long id) {\n    return userRepository.findById(id); // Thread bloqueado\n}\n\n// Reactivo (no bloqueante)\npublic Mono<User> getUser(Long id) {\n    return userRepository.findById(id); // Thread libre\n}',
      },
      {
        title: 'Estrategia de Caché: ¿Por qué Caffeine en lugar de Redis?',
        paragraphs: [
          'Optamos por caché local con Caffeine en lugar de caché distribuida (Redis). Las razones: simplicidad (no necesitamos sincronización entre instancias todavía), latencia ultra-baja (~1ms vs ~5-10ms de Redis) y coste cero en infraestructura adicional.',
          'Migraríamos a Redis cuando tengamos múltiples instancias del mismo servicio, necesidad de invalidación de caché distribuida o caché compartida entre servicios.',
        ],
      },
      {
        title: 'Circuit Breaker: Patrón de Resiliencia',
        paragraphs: [
          'Si OpenRouteService está caído, ¿arrastramos todo el sistema? La solución: Circuit Breaker con Resilience4j.',
          'Funciona con tres estados: CLOSED (funcionamiento normal), OPEN (servicio caído, respuesta de fallback inmediata sin intentar llamar) y HALF_OPEN (probando recuperación con 5 llamadas de prueba).',
        ],
        code: 'resilience4j:\n  circuitbreaker:\n    instances:\n      catalogService:\n        slidingWindowSize: 10\n        failureRateThreshold: 50  # 50% de fallos → abrir\n        waitDurationInOpenState: 10s\n        permittedNumberOfCallsInHalfOpenState: 5',
      },
      {
        title: 'Base de Datos: Una PostgreSQL, Múltiples Schemas',
        paragraphs: [
          'Una instancia de PostgreSQL con schemas separados: user_service (usuarios, roles, autenticación), catalog (municipios, empresas, autobuses, conductores, rutas) y auth en el futuro (tokens, sesiones, OAuth).',
          '¿Por qué no una DB por servicio? Estamos en fase de desarrollo y queremos iterar rápidamente. Por ahora evitamos la complejidad de transacciones distribuidas. Flyway gestiona cada schema independientemente. El plan futuro: cuando escalemos, cada servicio tendrá su propia instancia.',
        ],
      },
      {
        title: 'Soft Delete: No Eliminamos, Desactivamos',
        paragraphs: [
          'Usamos un flag isActive en lugar de DELETE FROM users. Las razones: GDPR Compliance (podemos mantener histórico con datos anonimizados), Recovery (si un usuario se elimina por error, restauración instantánea) y Auditoría (mantenemos trazabilidad completa).',
        ],
        code: '-- No hacemos esto:\nDELETE FROM users WHERE id = 1;\n\n-- Hacemos esto:\nUPDATE users SET is_active = false WHERE id = 1;',
      },
      {
        title: 'Flujo Completo de una Request',
        paragraphs: [
          'Veamos qué pasa cuando un cliente solicita calcular una ruta:',
          'El cliente envía un POST al API Gateway. El Gateway pregunta a Eureka: "¿Dónde está CATALOG-SERVICE?" y Eureka responde: "catalog-service:8083 está UP". El Gateway reescribe la ruta (/api/catalog/calculate → /calculate) y reenvía la petición con Circuit Breaker activo.',
          'Catalog Service busca los municipios en caché: municipio 08001 → HIT (~1ms), municipio 08015 → HIT (~1ms). Luego busca la ruta "08001_08015_driving" → MISS. Llama a OpenRouteService (~800ms), guarda el resultado en caché (1h TTL), lo persiste en PostgreSQL y responde al cliente.',
          'Tiempos totales: best case (ruta en caché) ~5-10ms, partial hit (municipios en caché) ~500-800ms, complete miss ~1500-2000ms.',
        ],
        code: 'POST http://localhost:8080/api/catalog/calculate\n{\n  "originId": "08001",      // Barcelona\n  "destinationId": "08015"   // Badalona\n}',
      },
      {
        title: 'Dockerización: Orquestación Multi-Container',
        paragraphs: [
          'docker-compose.yml define 5 servicios con healthchecks para garantizar el orden correcto de arranque.',
          'Orden de arranque: Eureka (debe estar UP primero), PostgreSQL (con healthcheck), User & Catalog Services (dependen de Eureka + Postgres) y API Gateway (depende de Eureka).',
        ],
        code: 'services:\n  eureka-service:     # Puerto 8761\n  api-gateway:        # Puerto 8080 (público)\n  postgres:           # Puerto 5432 (interno)\n  user-service:       # Puerto 8082 (interno)\n  catalog-service:    # Puerto 8083 (interno)\n\nhealthcheck:\n  test: ["CMD", "wget", "--spider",\n         "http://localhost:8761/actuator/health"]\n  interval: 30s\n  timeout: 10s\n  retries: 5',
      },
      {
        title: 'Métricas y Observabilidad',
        paragraphs: [
          'Aunque todavía no tenemos Prometheus/Grafana en producción, todos los servicios exponen Actuator:',
          'Próximos pasos: centralizar logs con ELK (Elasticsearch, Logstash, Kibana), monitoreo con Prometheus + Grafana y distributed tracing con Spring Cloud Sleuth + Zipkin.',
        ],
        code: '/actuator/health    # Estado del servicio\n/actuator/info      # Versión, Git commit\n/actuator/metrics   # JVM, HTTP requests, cache hits',
      },
      {
        title: 'Desafíos y Lecciones Aprendidas',
        paragraphs: [
          'Complejidad vs Beneficios: los microservicios añaden complejidad (múltiples repos, orquestación, debugging distribuido). Lección: solo vale la pena si tienes necesidades reales de escalabilidad o equipos separados.',
          'Testing en Entorno Distribuido: probar que el Circuit Breaker funciona requiere simular fallos. Solución: TestContainers + chaos engineering con herramientas como ToxiProxy (pendiente).',
          'Rate Limiting de APIs Externas: OpenRouteService tiene límite de 2000 llamadas/día. Solución: caché agresivo (1h para rutas) + plan de upgrade cuando escalemos.',
          'Transacciones Distribuidas: si necesitamos crear un usuario Y asignarle una ruta en una transacción, la complejidad crece. Solución actual: evitar escenarios cross-service. Plan futuro: Saga Pattern.',
        ],
      },
      {
        title: 'El equipo detrás de la arquitectura',
        paragraphs: [
          'Cada decisión técnica que hemos contado en este post fue discutida y validada por todo el equipo. Si quieres conocer a las personas detrás de BusConnect, visita nuestra página de equipo.',
        ],
        link: { text: 'Conoce al equipo', href: '/equipo' },
      },
    ],
  },
  {
    slug: 'openroute-api-calculo-rutas',
    title: 'Cálculo de Rutas en BusConnect: Integrando OpenRouteService con Estrategia',
    author: authors.irina,
    date: '2025-05-12',
    coverImage: '/images/blog/calculo-rutas.png',
    summary: 'Cómo integramos OpenRouteService para calcular rutas entre 947 municipios de Catalunya: caché multinivel, rate limiting thread-safe, resiliencia ante fallos y monitoreo en tiempo real.',
    tags: ['API', 'Rutas', 'Backend', 'Spring Boot'],
    readingTime: 10,
    sections: [
      {
        title: 'El Desafío',
        paragraphs: [
          'Cuando empezamos a construir BusConnect, nos enfrentamos a un problema complejo: cómo calcular rutas eficientes entre 947 municipios de Catalunya.',
          'Hacer el cálculo nosotros mismos era inviable. Necesitábamos red de carreteras actualizada, algoritmos de routing optimizados (Dijkstra, A*), geometría de rutas (polylines para mapas) y tiempos estimados considerando velocidades reales. La solución: integrar una API externa especializada.',
        ],
      },
      {
        title: 'Por qué OpenRouteService',
        paragraphs: [
          'Evaluamos tres servicios principales: Google Maps ($5/1000 calls, mejor precisión pero muy caro), Mapbox ($5/1000 calls, UI excelente pero caro a escala) y OpenRouteService (gratis con 2000 calls/día, open source basado en OpenStreetMap).',
          'Elegimos OpenRouteService por varias razones: 2000 requests gratuitos al día (suficiente para fase MVP), open source basado en OpenStreetMap, sin tarjeta de crédito requerida, plan premium disponible cuando escalemos y una API REST simple y bien documentada.',
        ],
      },
      {
        title: 'De Nombres a Coordenadas',
        paragraphs: [
          'Los usuarios introducen nombres de municipios ("Barcelona", "Girona"), pero OpenRouteService necesita coordenadas GPS. Nuestra estrategia: tenemos una tabla PostgreSQL con 947 municipios de Catalunya, cada uno con latitud y longitud precargadas. Cuando un usuario pide una ruta, primero buscamos las coordenadas en nuestra base de datos.',
        ],
      },
      {
        title: 'Caché Inteligente: La Clave del Ahorro',
        paragraphs: [
          'Con un límite de 2000 calls/día, no podemos desperdiciar ni una llamada. Implementamos caché multinivel.',
          'Nivel 1: Caché de Municipios (24 horas). Los 947 municipios se cachean en memoria con Caffeine. TTL de 24 horas (los municipios no se mueven). Hit rate esperado: mayor al 95%. Ahorro: ~10ms por request.',
          'Nivel 2: Caché de Rutas (1 hora). Cada ruta calculada se guarda en memoria. La clave es algo como "barcelona_girona_driving". TTL de 1 hora (suficiente para rutas populares). Hit rate esperado: 70-80%. Ahorro: ~1500ms + 1 API call.',
          'Resultado: manejamos 3.3x más tráfico con el mismo límite de API.',
        ],
        code: 'Simulación con 1000 requests/día:\n\nSin caché:\n- 1000 llamadas API -> Límite excedido en 2 días\n\nCon caché (70% hit rate):\n- Solo 300 llamadas API -> 6.6 días de margen\n- Respuesta promedio: 100ms vs 1500ms',
      },
      {
        title: 'Rate Limiting Thread-Safe',
        paragraphs: [
          'Si múltiples usuarios solicitan rutas simultáneamente, podríamos exceder el límite diario sin darnos cuenta.',
          'Solución implementada: ConcurrentLinkedQueue para tracking thread-safe, cada request registra su timestamp, limpieza automática de requests mayores a 24 horas y si alcanzamos 2000 calls, respondemos con error 429 inmediatamente.',
          'Beneficio: nunca bloqueamos la cuenta ni perdemos llamadas en requests que fallarían.',
        ],
      },
      {
        title: 'Resiliencia: Qué pasa si la API falla',
        paragraphs: [
          'OpenRouteService puede estar caído, tener latencia alta o devolver errores 5xx. Nuestra estrategia tiene tres niveles.',
          'Circuit Breaker (implementado en API Gateway): en estado CLOSED todo funciona con tráfico normal, en estado OPEN la API está caída y damos respuesta de fallback inmediata sin intentar llamar, en estado HALF_OPEN probamos recuperación con llamadas limitadas.',
          'Retry Strategy (en el servicio): 3 reintentos con backoff exponencial (2s, 4s, 8s). Solo reintentamos errores 5xx del servidor. Timeout de 20 segundos por llamada. Error 429 (rate limit) no se reintenta, se propaga inmediatamente.',
          'Fallback con distancia "en línea recta": si todo falla, calculamos distancia euclidiana aproximada. No es la ruta real, pero da una estimación. Marcamos claramente que es "distancia aproximada". Mejor que devolver error 500.',
        ],
      },
      {
        title: 'Métricas de Rendimiento',
        paragraphs: [
          'Caso 1 - Ruta Popular (Barcelona a Girona): primera vez ~1800ms (API call + procesamiento). Siguientes 59 minutos ~5ms (caché hit). Ahorro: 360x más rápido, 0 API calls.',
          'Caso 2 - Ruta Poco Común (Riudellots a Verges): municipios en caché ~2ms (lookup BD), ruta no cacheada ~1500ms (API call). Total ~1500ms. Se cachea para próxima hora.',
          'Caso 3 - API Caída: circuit breaker detecta fallo, fallback con distancia aproximada ~10ms. Usuario ve mensaje: "Distancia aproximada, servicio en mantenimiento".',
        ],
      },
      {
        title: 'Monitoreo en Tiempo Real',
        paragraphs: [
          'Exponemos endpoints de métricas para operaciones. Con estos datos podemos alertar si nos acercamos al límite diario, optimizar TTL del caché según hit rates y detectar patrones de uso (rutas más populares).',
        ],
        code: 'GET /api/routes/rate-limit-stats\n{\n  "requestsLast24h": 1247,\n  "maxRequestsPerDay": 2000,\n  "remainingRequests": 753,\n  "totalRequestsAllTime": 45621,\n  "usagePercentage": 62.35\n}\n\nGET /api/routes/cache-stats\n{\n  "routeCacheSize": 342,\n  "routeHitCount": 8934,\n  "routeMissCount": 2156,\n  "routeHitRatePercent": 80.5,\n  "municipalityCacheSize": 947,\n  "municipalityHitCount": 11090,\n  "municipalityHitRatePercent": 98.2\n}',
      },
      {
        title: 'Arquitectura Reactiva: Sin Bloquear Threads',
        paragraphs: [
          'Usamos Spring WebFlux + R2DBC en lugar de Spring MVC tradicional. Resultado: manejamos 10x más requests concurrentes con los mismos recursos.',
        ],
        code: 'Enfoque Bloqueante Tradicional:\nRequest 1  -> Thread 1 (bloqueado 1500ms esperando OpenRouteService)\nRequest 2  -> Thread 2 (bloqueado 1500ms esperando OpenRouteService)\nRequest 10 -> Thread Pool agotado, requests en cola\n\nEnfoque Reactivo (WebFlux):\nRequest 1   -> Thread 1 inicia llamada -> Thread liberado\nRequest 2   -> Thread 1 (mismo!) inicia llamada -> Thread liberado\nRequest 100 -> Mismos threads manejando todo sin bloquearse',
      },
      {
        title: 'Costos y Escalabilidad',
        paragraphs: [
          'Fase Actual (MVP): plan gratuito con 2000 requests/día. Con 80% hit rate soportamos ~10,000 requests efectivos/día. Costo: $0/mes.',
          'Fase Crecimiento (1000 usuarios activos): estimado 5000 requests/día. Con caché solo 1000 API calls/día. Plan gratuito suficiente. Costo: $0/mes.',
          'Fase Escalada (10,000 usuarios): estimado 50,000 requests/día. Con caché 10,000 API calls/día. Necesitamos plan premium (~79 euros/mes para 40,000 calls/día). Alternativa: en este punto evaluaremos self-hosted OSRM (Open Source Routing Machine) para eliminar dependencia externa.',
        ],
      },
      {
        title: 'Conclusión',
        paragraphs: [
          'Integrar OpenRouteService en BusConnect nos enseñó que una API externa no es solo hacer un HTTP call. Requiere estrategia de caché inteligente, rate limiting proactivo, resiliencia ante fallos, monitoreo constante y gestión de costos desde día 1.',
          'Con estas estrategias, convertimos un límite de 2000 calls/día en capacidad para 10,000 requests efectivos, manteniendo tiempos de respuesta de menos de 10ms en el 80% de los casos.',
          'La moraleja: no importa qué API uses. Lo que importa es cómo la usas.',
        ],
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  return blogPosts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
