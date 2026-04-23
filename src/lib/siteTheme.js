export const SITE_THEME_STORAGE_KEY = 'gym-os-site-theme';

export const defaultSiteTheme = {
  templateId: 'elite-fight',
  siteName: 'Profitness',
  logoUrl: 'https://cdn.shopify.com/s/files/1/0995/6432/3185/files/profitness.png?v=1776221445',
  heroImageUrl: '',
  storyImageUrl: '',
  classImageUrl: '',
  teamImageUrl: '',
  mapsUrl:
    'https://www.google.com/maps/place/Profitness/@-34.7215083,-58.7868792,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMDgj-KpIQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgeougc-cs%2FAMG9lERxX4LLbmJDlAV2Sdz1BvjdrXZ2yNwMzhjglDYf1OmXvFOKgfVe0TCDlD0Z2Y_xU8Iu6NVJxbEGIFm6nfyIRCs-RlWeJY4Met1leqvpO5DG-RO1WYRPVPLu8ITJtua4y2JcAxFx!7i4096!8i2304!4m9!1m2!2m1!1sginasios!3m5!1s0x95bceb0049fd6c73:0xc742485faf4363a4!8m2!3d-34.7215083!4d-58.7868792!16s%2Fg%2F11vql608tn?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D',
  primaryColor: '#dc2626',
  secondaryColor: '#111827',
  heroKicker: 'Entrenamiento real para personas reales',
  heroTitleLead: 'Tu mejor version',
  heroTitleAccent: 'empieza aqui',
  heroBody:
    'Profitness es un gimnasio pensado para fuerza, recomposicion corporal y constancia. Entrena con acompanamiento, clases dinamicas y una comunidad que te ayuda a sostener resultados.',
  storyTitle: 'Un espacio que mezcla entrenamiento serio, seguimiento y una experiencia moderna.',
  storyBody:
    'Aqui no vienes solo a usar maquinas. Vienes a construir habitos, mejorar tu tecnica y sentir que estas en un lugar donde entrenar de verdad es mas facil.',
  contactPhone: '+54 11 4567 1200',
  contactEmail: 'hola@profitness.fit',
  contactHeading: 'Solicita una clase de prueba y ven a conocer el gimnasio.',
  contactButtonLabel: 'Reservar clase gratis',
  plans: [
    { name: 'Essential', price: '$39', text: 'Acceso al gimnasio, vestuarios y seguimiento basico.' },
    { name: 'Performance', price: '$69', text: 'La opcion ideal para progresar con mas soporte y beneficios.' },
    { name: 'Elite', price: '$109', text: 'Plan completo con nutricion, contenido exclusivo y prioridad.' },
  ],
};

export const siteThemePresets = [
  {
    id: 'elite-fight',
    name: 'Elite Fight',
    description: 'Editorial premium, claro y agresivo.',
    theme: {
      templateId: 'elite-fight',
      primaryColor: '#dc2626',
      secondaryColor: '#111827',
      heroKicker: 'Entrenamiento real para personas reales',
      heroTitleLead: 'Tu mejor version',
      heroTitleAccent: 'empieza aqui',
      storyTitle: 'Un espacio que mezcla entrenamiento serio, seguimiento y una experiencia moderna.',
      contactHeading: 'Solicita una clase de prueba y ven a conocer el gimnasio.',
    },
  },
  {
    id: 'titan-neon',
    name: 'Titan Neon',
    description: 'Dark, alto contraste y foco en conversion.',
    theme: {
      templateId: 'titan-neon',
      primaryColor: '#ccff00',
      secondaryColor: '#040404',
      heroKicker: 'Rendimiento, energia y conversion',
      heroTitleLead: 'Menos vacios',
      heroTitleAccent: 'mas caja',
      storyTitle: 'Un gimnasio con presencia fuerte, propuesta clara y una experiencia visual mas agresiva.',
      contactHeading: 'Activa tu prueba y empieza esta semana.',
    },
  },
  {
    id: 'titan-editorial',
    name: 'Titan Editorial',
    description: 'Limpio, premium y mas institucional.',
    theme: {
      templateId: 'titan-editorial',
      primaryColor: '#e31c25',
      secondaryColor: '#1f2937',
      heroKicker: 'Orden, marca y crecimiento',
      heroTitleLead: 'Gestiona mejor',
      heroTitleAccent: 'tu gimnasio',
      storyTitle: 'Una experiencia mas confiable y ordenada para gimnasios que quieren verse premium.',
      contactHeading: 'Solicita una reunion y conoce el espacio.',
    },
  },
  {
    id: 'iron-arena',
    name: 'Iron Arena',
    description: 'Brutalista, pesado y orientado a fuerza.',
    theme: {
      templateId: 'iron-arena',
      primaryColor: '#ef4444',
      secondaryColor: '#111111',
      heroKicker: 'Fuerza, disciplina y progreso',
      heroTitleLead: 'Construye',
      heroTitleAccent: 'potencia real',
      storyTitle: 'Una plantilla intensa para gimnasios que venden entrenamiento duro y resultados visibles.',
      contactHeading: 'Coordina tu primera visita y conoce la sala.',
    },
  },
  {
    id: 'pulse-studio',
    name: 'Pulse Studio',
    description: 'Luminosa, moderna y enfocada en clases.',
    theme: {
      templateId: 'pulse-studio',
      primaryColor: '#f97316',
      secondaryColor: '#1f2937',
      heroKicker: 'Movimiento, energia y comunidad',
      heroTitleLead: 'Entrena',
      heroTitleAccent: 'con ritmo',
      storyTitle: 'Una experiencia pensada para estudios y gimnasios donde las clases son el gran producto.',
      contactHeading: 'Reserva una clase y vive la experiencia del estudio.',
    },
  },
  {
    id: 'obsidian-core',
    name: 'Obsidian Core',
    description: 'Dark premium con foco en exclusividad.',
    theme: {
      templateId: 'obsidian-core',
      primaryColor: '#a3e635',
      secondaryColor: '#020617',
      heroKicker: 'Exclusividad y performance',
      heroTitleLead: 'Sube de',
      heroTitleAccent: 'nivel',
      storyTitle: 'Visual sobrio y nocturno para marcas fitness que quieren verse premium y distintas.',
      contactHeading: 'Solicita tu acceso y conoce el espacio premium.',
    },
  },
  {
    id: 'urban-motion',
    name: 'Urban Motion',
    description: 'Editorial urbana para marcas jóvenes.',
    theme: {
      templateId: 'urban-motion',
      primaryColor: '#06b6d4',
      secondaryColor: '#0f172a',
      heroKicker: 'Marca urbana, energia y conversion',
      heroTitleLead: 'Mueve',
      heroTitleAccent: 'tu ciudad',
      storyTitle: 'Ideal para marcas con identidad visual marcada, campañas sociales y una audiencia más joven.',
      contactHeading: 'Agenda una visita y descubre el espacio.',
    },
  },
  {
    id: 'apex-strength',
    name: 'Apex Strength',
    description: 'Corporativa y sólida para fuerza y rendimiento.',
    theme: {
      templateId: 'apex-strength',
      primaryColor: '#b91c1c',
      secondaryColor: '#1e293b',
      heroKicker: 'Rendimiento, estructura y control',
      heroTitleLead: 'Entrena',
      heroTitleAccent: 'más fuerte',
      storyTitle: 'Un layout pensado para transmitir orden, método y resultados medibles.',
      contactHeading: 'Habla con el equipo y empieza tu plan.',
    },
  },
  {
    id: 'solar-fit',
    name: 'Solar Fit',
    description: 'Brillante, cálida y comercial.',
    theme: {
      templateId: 'solar-fit',
      primaryColor: '#f59e0b',
      secondaryColor: '#78350f',
      heroKicker: 'Buen clima, energia y conversion',
      heroTitleLead: 'Activa',
      heroTitleAccent: 'tu cambio',
      storyTitle: 'Una estética más cálida para gimnasios cercanos, familiares o de barrio premium.',
      contactHeading: 'Solicita una prueba y conoce el gym hoy.',
    },
  },
  {
    id: 'zen-club',
    name: 'Zen Club',
    description: 'Serena, limpia y enfocada en bienestar.',
    theme: {
      templateId: 'zen-club',
      primaryColor: '#14b8a6',
      secondaryColor: '#134e4a',
      heroKicker: 'Calma, constancia y bienestar',
      heroTitleLead: 'Entrena',
      heroTitleAccent: 'mejor',
      storyTitle: 'Pensada para estudios de yoga, recovery y espacios donde el bienestar pesa tanto como la fuerza.',
      contactHeading: 'Escríbenos y coordina una clase de prueba.',
    },
  },
  {
    id: 'forge-pro',
    name: 'Forge Pro',
    description: 'Agresiva y técnica para alto rendimiento.',
    theme: {
      templateId: 'forge-pro',
      primaryColor: '#f43f5e',
      secondaryColor: '#18181b',
      heroKicker: 'Tecnica, foco y resultados',
      heroTitleLead: 'Forja',
      heroTitleAccent: 'tu avance',
      storyTitle: 'Una plantilla que se siente intensa, atlética y lista para vender coaching de mayor ticket.',
      contactHeading: 'Solicita tu evaluación y empieza hoy.',
    },
  },
];

export function loadSiteTheme() {
  if (typeof window === 'undefined') return defaultSiteTheme;

  try {
    const raw = window.localStorage.getItem(SITE_THEME_STORAGE_KEY);
    if (!raw) return defaultSiteTheme;
    const parsed = JSON.parse(raw);
    return {
      ...defaultSiteTheme,
      ...parsed,
      plans: Array.isArray(parsed?.plans) && parsed.plans.length ? parsed.plans : defaultSiteTheme.plans,
    };
  } catch {
    return defaultSiteTheme;
  }
}

export function saveSiteTheme(nextTheme) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SITE_THEME_STORAGE_KEY, JSON.stringify(nextTheme));
}

export function applySiteThemePreset(currentTheme, presetId) {
  const preset = siteThemePresets.find((item) => item.id === presetId);
  if (!preset) return currentTheme;

  return {
    ...currentTheme,
    ...preset.theme,
    plans: currentTheme.plans,
    siteName: currentTheme.siteName,
    logoUrl: currentTheme.logoUrl,
    mapsUrl: currentTheme.mapsUrl,
    heroBody: currentTheme.heroBody,
    storyBody: currentTheme.storyBody,
    contactPhone: currentTheme.contactPhone,
    contactEmail: currentTheme.contactEmail,
    contactButtonLabel: currentTheme.contactButtonLabel,
  };
}
