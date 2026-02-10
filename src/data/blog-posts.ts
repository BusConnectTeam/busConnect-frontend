export interface BlogPostAuthor {
  name: string;
  role: string;
  image: string;
}

export interface BlogPostSection {
  title: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  author: BlogPostAuthor;
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
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'arquitectura-microservicios-busconnect',
    title: 'Arquitectura de Microservicios en BusConnect',
    author: authors.irina,
    date: '2025-06-15',
    coverImage: '/images/blog/microservicios.jpg',
    summary: 'Cómo diseñamos la arquitectura de microservicios de BusConnect para escalar y mantener un sistema distribuido robusto.',
    tags: ['Arquitectura', 'Microservicios', 'Backend'],
    readingTime: 12,
    sections: [],
  },
  {
    slug: 'spring-webflux-programacion-reactiva',
    title: 'Spring WebFlux: Programación Reactiva en Java',
    author: authors.gabriela,
    date: '2025-06-10',
    coverImage: '/images/blog/webflux.jpg',
    summary: 'Nuestra experiencia implementando programación reactiva con Spring WebFlux para manejar peticiones de forma eficiente.',
    tags: ['Java', 'Spring Boot', 'Programación Reactiva'],
    readingTime: 15,
    sections: [],
  },
  {
    slug: 'nextjs-frontend-moderno',
    title: 'Construyendo un Frontend Moderno con Next.js',
    author: authors.irina,
    date: '2025-06-05',
    coverImage: '/images/blog/nextjs.jpg',
    summary: 'Por qué elegimos Next.js para el frontend de BusConnect y las lecciones aprendidas durante el desarrollo.',
    tags: ['Next.js', 'React', 'Frontend'],
    readingTime: 10,
    sections: [],
  },
  {
    slug: 'docker-despliegue-contenedores',
    title: 'Docker y Despliegue con Contenedores',
    author: authors.ainoha,
    date: '2025-05-28',
    coverImage: '/images/blog/docker.jpg',
    summary: 'Cómo containerizamos nuestros microservicios con Docker para facilitar el despliegue y la consistencia entre entornos.',
    tags: ['Docker', 'DevOps', 'Despliegue'],
    readingTime: 8,
    sections: [],
  },
  {
    slug: 'api-gateway-eureka-service-discovery',
    title: 'API Gateway y Service Discovery con Eureka',
    author: authors.gabriela,
    date: '2025-05-20',
    coverImage: '/images/blog/api-gateway.jpg',
    summary: 'Implementación de API Gateway y descubrimiento de servicios con Eureka en nuestro ecosistema de microservicios.',
    tags: ['Microservicios', 'API Gateway', 'Eureka'],
    readingTime: 11,
    sections: [],
  },
  {
    slug: 'openroute-api-calculo-rutas',
    title: 'Cálculo de Rutas con OpenRoute API',
    author: authors.irina,
    date: '2025-05-12',
    coverImage: '/images/blog/rutas.jpg',
    summary: 'Cómo integramos OpenRoute API para calcular rutas entre municipios de Catalunya con caché inteligente.',
    tags: ['API', 'Rutas', 'Integración'],
    readingTime: 9,
    sections: [],
  },
  {
    slug: 'testing-microservicios-java',
    title: 'Testing en Microservicios con Java',
    author: authors.ainoha,
    date: '2025-05-05',
    coverImage: '/images/blog/testing.jpg',
    summary: 'Estrategias de testing que aplicamos en BusConnect: unitarios, integración y end-to-end en un entorno de microservicios.',
    tags: ['Testing', 'Java', 'Backend'],
    readingTime: 13,
    sections: [],
  },
  {
    slug: 'cicd-pipeline-automatizacion',
    title: 'CI/CD: Automatizando Nuestro Pipeline',
    author: authors.gabriela,
    date: '2025-04-28',
    coverImage: '/images/blog/cicd.jpg',
    summary: 'El pipeline de integración y despliegue continuo que creamos para automatizar pruebas y releases en BusConnect.',
    tags: ['CI/CD', 'DevOps', 'Automatización'],
    readingTime: 10,
    sections: [],
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
