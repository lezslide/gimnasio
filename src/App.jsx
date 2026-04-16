import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bolt,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Gauge,
  HeartHandshake,
  Instagram,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Youtube,
} from 'lucide-react';
import heroImage from './assets/images/sample-gym/hero-gym.jpg';
import trainingImage from './assets/images/sample-gym/strength-training.jpg';
import coachesTeamImage from './assets/images/sample-gym/coaches-team.jpg';
import nutritionImage from './assets/images/sample-gym/nutrition-meal.jpg';
import gymSpaceImage from './assets/images/sample-gym/gym-space.jpg';
import memberSuccessImage from './assets/images/sample-gym/member-success.jpg';
import qrAccessImage from './assets/images/sample-gym/qr-access.jpg';
import { hasSupabaseEnv } from './lib/supabase';
import { loadOwnerMetrics } from './lib/ownerMetrics';

const CLIENT_NAME = 'Profitness';
const CLIENT_LOGO_URL =
  'https://cdn.shopify.com/s/files/1/0995/6432/3185/files/profitness.png?v=1776221445';
const CLIENT_MAPS_URL =
  'https://www.google.com/maps/place/Profitness/@-34.7215083,-58.7868792,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMDgj-KpIQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgeougc-cs%2FAMG9lERxX4LLbmJDlAV2Sdz1BvjdrXZ2yNwMzhjglDYf1OmXvFOKgfVe0TCDlD0Z2Y_xU8Iu6NVJxbEGIFm6nfyIRCs-RlWeJY4Met1leqvpO5DG-RO1WYRPVPLu8ITJtua4y2JcAxFx!7i4096!8i2304!4m9!1m2!2m1!1sginasios!3m5!1s0x95bceb0049fd6c73:0xc742485faf4363a4!8m2!3d-34.7215083!4d-58.7868792!16s%2Fg%2F11vql608tn?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D';

const marqueeWords = [
  { label: 'Finanzas Claras', tone: 'primary' },
  { label: 'Más Retención', tone: 'muted' },
  { label: 'Menos Ausencias', tone: 'accent' },
  { label: 'Más Ingresos', tone: 'primary' },
  { label: 'Operación Ordenada', tone: 'muted' },
];

const valueCards = [
  {
    icon: TrendingUp,
    title: 'Más ingresos por socio',
    description:
      'Activa planes, upgrades, promos y seguimiento para aumentar el ticket promedio sin depender solo de nuevos leads.',
    tone: 'red',
  },
  {
    icon: Users,
    title: 'Más retención y asistencia',
    description:
      'Detecta socios inactivos, automatiza recordatorios y crea una experiencia que hace que vuelvan más seguido.',
    tone: 'yellow',
  },
  {
    icon: LayoutDashboard,
    title: 'Menos caos operativo',
    description: 'Todo lo que hoy está repartido entre WhatsApp, Excel y recepción vive en un solo panel conectado.',
    tone: 'dark',
  },
];

const metrics = [
  { value: '+18%', label: 'mejora media en retención' },
  { value: '+11%', label: 'suba estimada de ticket' },
  { value: '-7 hs', label: 'menos gestión manual por semana' },
  { value: '24/7', label: 'visibilidad del negocio' },
];

const productBlocks = [
  {
    icon: Wallet,
    title: 'Panel financiero',
    text: 'Mira ingresos, renovaciones, bajas, upgrades y cuentas por cobrar sin armar reportes manuales.',
  },
  {
    icon: QrCode,
    title: 'Acceso y asistencia',
    text: 'Con QR y check-ins reales entiendes qué socios usan el gimnasio y quién está en riesgo de irse.',
  },
  {
    icon: CalendarCheck2,
    title: 'Clases y ocupación',
    text: 'Mide qué horarios llenan, qué clases no convierten y dónde tienes capacidad ociosa.',
  },
  {
    icon: ShieldCheck,
    title: 'Experiencia premium',
    text: 'Contenido, beneficios y app propia para justificar mejores planes y fortalecer la marca del gym.',
  },
];

const featureGroups = [
  {
    title: 'Ventas y membresías',
    items: ['Planes y paquetes', 'Promociones activas', 'Upsells de servicios', 'Seguimiento de renovaciones'],
  },
  {
    title: 'Operación diaria',
    items: ['Check-in con QR', 'Reservas de clases', 'Control de asistencia', 'Panel para staff y recepción'],
  },
  {
    title: 'Retención y experiencia',
    items: ['Alertas de inactividad', 'Contenido premium', 'Mensajes y recordatorios', 'Beneficios por tipo de cliente'],
  },
  {
    title: 'Control financiero',
    items: ['Ingresos por plan', 'Bajas y churn', 'Clases más rentables', 'Visión por sede o profesional'],
  },
];

const pricingPackages = [
  {
    name: 'Starter Pro',
    price: '$49',
    audience: 'Para personal trainers, nutricionistas y profes de yoga',
    description: 'Ideal para vender servicios, mostrar marca personal y ordenar reservas, clientes y cobros.',
    features: ['Landing profesional', 'Gestión de clientes', 'Reservas y agenda', 'Planes, promos y contenido'],
  },
  {
    name: 'Gym Growth',
    price: '$120',
    audience: 'Para gimnasios con una sede',
    description:
      'Pensado para equipos administrativos que quieren más control del negocio, mejor retención y una operación más moderna.',
    features: ['Todo Starter Pro', 'Check-in QR', 'Métricas de asistencia', 'Panel financiero del gimnasio'],
    featured: true,
  },
  {
    name: 'Multi-Sede',
    price: '$250',
    audience: 'Para marcas con 3 o más sedes conectadas',
    description:
      'Centraliza la operación, compara rendimiento entre sedes y toma decisiones con una sola vista del negocio.',
    features: ['Todo Gym Growth', 'Multi-sede', 'Comparativas por sucursal', 'Control centralizado de operación'],
  },
];

const showcaseItems = [
  {
    id: 'elite-fight',
    name: 'Elite Fight',
    label: 'Muestra 01',
    description: 'Look editorial premium para gimnasios que venden status, comunidad y entrenamiento de alto valor.',
    accent: '#dc2626',
  },
  {
    id: 'titan-neon',
    name: 'Titan Neon',
    label: 'Muestra 02',
    description: 'Versión dark de alto impacto pensada para campañas agresivas, promos y conversión rápida.',
    accent: '#ccff00',
  },
  {
    id: 'titan-editorial',
    name: 'Titan Editorial',
    label: 'Muestra 03',
    description: 'Estética limpia premium para cadenas o centros fitness que quieren comunicar orden y confianza.',
    accent: '#e31c25',
  },
];

const clientBenefits = [
  { icon: Gauge, title: 'Sala premium', text: 'Entrenamiento de fuerza, cardio y zona funcional en un mismo espacio.' },
  { icon: HeartHandshake, title: 'Acompañamiento real', text: 'Profes con seguimiento, evaluación corporal y foco en adherencia.' },
  { icon: CalendarCheck2, title: 'Clases todos los días', text: 'Horarios pensados para gente que entrena antes o después de trabajar.' },
];

const clientClasses = [
  { name: 'Funcional HIIT', time: 'Lun, Mié y Vie · 19:00', coach: 'Valentina Ruiz' },
  { name: 'Musculación Guiada', time: 'Todos los días · 07:00 a 22:00', coach: 'Mauro Sosa' },
  { name: 'Yoga Recovery', time: 'Mar y Jue · 08:00', coach: 'Carla Mendez' },
  { name: 'Box Conditioning', time: 'Sab · 11:00', coach: 'Nico Álvarez' },
];

const clientMemberships = [
  {
    name: 'Essential',
    price: '$39',
    text: 'Acceso al gimnasio, vestuarios y seguimiento básico.',
    features: ['Sala de musculación', 'App del socio', 'Reserva de clases'],
  },
  {
    name: 'Performance',
    price: '$69',
    text: 'La opción ideal para progresar con más soporte y beneficios.',
    features: ['Todo Essential', 'Rutinas premium', 'Beneficios y QR de acceso'],
    featured: true,
  },
  {
    name: 'Elite',
    price: '$109',
    text: 'Plan completo con nutrición, contenido exclusivo y prioridad.',
    features: ['Todo Performance', 'Nutrición deportiva', 'Seguimiento preferencial'],
  },
];

const clientFaqs = [
  {
    question: '¿Puedo probar una clase antes de inscribirme?',
    answer: 'Sí. Puedes solicitar una clase de prueba desde el formulario y te contactamos para coordinar horario.',
  },
  {
    question: '¿Tienen planes para principiantes?',
    answer: 'Sí. Adaptamos el ingreso según tu nivel, objetivo y frecuencia disponible.',
  },
  {
    question: '¿La app está incluida en la membresía?',
    answer: 'Sí. Todos los socios acceden a su perfil, reservas y seguimiento básico desde la app.',
  },
];

function EliteFightPreview({ onOpenClientDemo }) {
  return (
    <article className="sample-preview sample-preview-elite">
      <div className="sample-preview-shell light">
        <header className="sample-preview-topbar">
          <div className="sample-preview-brand elite">
            ELITE<span>FIGHT</span>
          </div>
          <nav>
            <span>Programas</span>
            <span>Resultados</span>
            <span>Membresías</span>
          </nav>
          <button type="button" onClick={onOpenClientDemo}>Entrar</button>
        </header>

        <div className="sample-preview-hero elite">
          <div className="sample-preview-copy">
            <span className="sample-preview-kicker red">Marca + conversión</span>
            <h3>
              SUBE TU
              <span>VALOR</span>
              PERCIBIDO
            </h3>
            <p>Una landing pensada para vender membresías premium y justificar tickets más altos.</p>
          </div>
          <div className="sample-preview-visual">
            <img src={heroImage} alt="Vista de Elite Fight" />
            <div className="sample-floating-card">
              <strong>01</strong>
              <span>Premium</span>
            </div>
          </div>
        </div>

        <div className="sample-preview-ticker red">
          <span>Marca</span>
          <span>Conversión</span>
          <span>Premium</span>
          <span>Resultados</span>
        </div>

        <div className="sample-preview-cards three">
          {['Planes premium', 'Historia visual fuerte', 'Mejor ticket promedio'].map((item) => (
            <div key={item} className="sample-info-panel">
              <strong>{item}</strong>
              <p>Diseño orientado a valor percibido y captación de socios de mayor nivel.</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function TitanNeonPreview({ onOpenClientDemo, onExploreFinancials, onOpenPricing }) {
  const stats = ['+18% retención', '+11% ticket', '24/7 control', '2500+ socios'];

  return (
    <article className="sample-preview sample-preview-neon">
      <div className="sample-preview-shell dark">
        <header className="sample-preview-topbar dark">
          <div className="sample-preview-brand neon">
            TITAN<span>FIT</span>
          </div>
          <nav>
            <span>Ingresos</span>
            <span>Asistencia</span>
            <span>Planes</span>
          </nav>
          <button type="button" className="neon-button" onClick={onOpenClientDemo}>Demo</button>
        </header>

        <div className="sample-preview-hero neon">
          <div className="sample-preview-copy">
            <span className="sample-preview-kicker lime">Rendimiento financiero</span>
            <h3>
              MENOS
              <span>VACÍOS</span>
              MÁS CAJA
            </h3>
            <p>Para gimnasios que quieren vender más, llenar mejor sus horarios y retener a los socios correctos.</p>
            <div className="sample-inline-actions">
              <button type="button" className="neon-button" onClick={onExploreFinancials}>Ver métricas</button>
              <button type="button" className="ghost-dark" onClick={onOpenPricing}>Ver planes</button>
            </div>
          </div>
        </div>

        <div className="sample-stats-grid neon">
          {stats.map((item) => (
            <div key={item} className="sample-stat-box neon">
              <strong>{item.split(' ')[0]}</strong>
              <span>{item.replace(item.split(' ')[0], '').trim()}</span>
            </div>
          ))}
        </div>

        <div className="sample-preview-cards three dark-panels">
          <div className="sample-image-panel">
            <img src={trainingImage} alt="Panel de rendimiento" />
            <div>
              <strong>Asistencia real</strong>
              <p>Descubre qué horarios y servicios sostienen tus ingresos.</p>
            </div>
          </div>
          <div className="sample-plan-panel featured">
            <small>Plan Elite</small>
            <strong>$49</strong>
            <span>/ mes</span>
          </div>
          <div className="sample-plan-panel">
            <small>Plan Black</small>
            <strong>$79</strong>
            <span>/ mes</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function TitanEditorialPreview({ onRequestDemo }) {
  const features = [
    { title: 'Ingresos visibles', text: 'Dashboard claro para administración y managers.' },
    { title: 'Clases medibles', text: 'Ocupación, asistencia y rentabilidad por bloque.' },
    { title: 'Retención activa', text: 'Detecta bajas antes de que sucedan.' },
  ];

  return (
    <article className="sample-preview sample-preview-editorial">
      <div className="sample-preview-shell editorial">
        <header className="sample-preview-topbar editorial">
          <div className="sample-preview-brand editorial">
            TITAN<span>FITNESS</span>
          </div>
          <nav>
            <span>Inicio</span>
            <span>Nosotros</span>
            <span>Clases</span>
          </nav>
          <button type="button" className="editorial-button" onClick={onRequestDemo}>Empezar</button>
        </header>

        <div className="sample-preview-hero editorial">
          <div className="sample-preview-copy">
            <span className="sample-preview-kicker accent">Orden + crecimiento</span>
            <h3>
              GESTIONA
              <span>MEJOR</span>
              TU GYM
            </h3>
            <p>Una propuesta visual más institucional para vender confianza, estructura y crecimiento predecible.</p>
          </div>
          <div className="sample-preview-side-card">
            <img src={coachesTeamImage} alt="Coaches Titan Fitness" />
          </div>
        </div>

        <div className="sample-feature-row">
          {features.map(({ title, text }) => (
            <div key={title} className="sample-feature-tile">
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="sample-preview-cards editorial-grid">
          <div className="sample-image-panel tall">
            <img src={heroImage} alt="Vista de gimnasio" />
            <div>
              <strong>Marca premium</strong>
              <p>Ideal para gimnasios que quieren subir su valor percibido.</p>
            </div>
          </div>
          <div className="sample-image-panel tall">
            <img src={trainingImage} alt="Entrenamiento" />
            <div>
              <strong>Clases vendibles</strong>
              <p>Bloques visuales que muestran oferta y ayudan a convertir.</p>
            </div>
          </div>
          <div className="sample-image-panel tall">
            <img src={nutritionImage} alt="Plan nutricional" />
            <div>
              <strong>Upsells</strong>
              <p>Nutrición, coaching y beneficios para elevar ingresos por socio.</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function renderPreviewById(id, actions) {
  if (id === 'titan-neon') return <TitanNeonPreview {...actions} />;
  if (id === 'titan-editorial') return <TitanEditorialPreview {...actions} />;
  return <EliteFightPreview {...actions} />;
}

function getCardClass(index, activeIndex, total) {
  const diff = (index - activeIndex + total) % total;
  if (diff === 0) return 'is-active';
  if (diff === 1) return 'is-right';
  return 'is-left';
}

const portalRoles = [
  {
    id: 'member',
    label: 'Socio',
    title: 'Panel del socio',
    description: 'Rutina, reservas, acceso QR y progreso desde una sola app.',
    email: 'socio@profitness.fit',
    password: 'demo123',
  },
  {
    id: 'owner',
    label: 'Administración',
    title: 'Panel administrativo',
    description: 'Operación en vivo, ingresos, perfiles y control del equipo.',
    email: 'dueno@profitness.fit',
    password: 'demo123',
  },
  {
    id: 'coach',
    label: 'Profesor',
    title: 'Panel del profesor',
    description: 'Clases del día, alumnos presentes, rutinas y seguimiento.',
    email: 'profe@profitness.fit',
    password: 'demo123',
  },
  {
    id: 'reception',
    label: 'Recepción',
    title: 'Panel de recepción',
    description: 'Ingresos QR, validación de cuota y asistencia en tiempo real.',
    email: 'recepcion@profitness.fit',
    password: 'demo123',
  },
  {
    id: 'cleaning',
    label: 'Limpieza',
    title: 'Panel de limpieza',
    description: 'Checklist del turno, incidencias y stock operativo en una sola vista.',
    email: 'limpieza@profitness.fit',
    password: 'demo123',
  },
];

const portalRoleMap = Object.fromEntries(portalRoles.map((role) => [role.id, role]));

const portalOverview = {
  member: {
  greeting: 'Hola, Martina',
  subtitle: 'Tu semana ya está organizada. Hoy tienes funcional, seguimiento y una meta de hidratación por cumplir.',
    sideLinks: ['Resumen', 'Mi semana', 'Reservas'],
  },
  owner: {
    greeting: 'Hola, Andrés',
    subtitle: 'Hoy conviene mirar primero quién está adentro, cómo vienen los ingresos en vivo y qué tareas tiene cada equipo.',
    sideLinks: ['En vivo', 'Ingresos', 'Tareas'],
  },
  coach: {
    greeting: 'Hola, Valentina',
    subtitle: 'Tu día está listo. Tienes clases activas, alumnos por recibir y rutinas para ajustar en vivo.',
    sideLinks: ['Clases', 'Asistencia', 'Rutinas'],
  },
  reception: {
    greeting: 'Hola, Sofía',
    subtitle: 'Recepción tiene foco total en ingresos QR, validación de cuota y control de personas presentes dentro del gym.',
    sideLinks: ['Ingresos', 'Presentes', 'Tareas'],
  },
  cleaning: {
    greeting: 'Hola, Daniela',
    subtitle: 'El turno ya está en marcha. Hoy toca resolver prioridades del día, cierre por zonas y reposición de insumos.',
    sideLinks: ['Resumen', 'Checklist', 'Incidencias'],
  },
};

const classTypeOptions = ['Fuerza', 'Funcional', 'Movilidad', 'Cardio', 'Yoga', 'Box', 'Recovery', 'Musculación'];

const activityOptionsByType = {
  Fuerza: [
    'Press banca plano',
    'Press inclinado',
    'Press declinado',
    'Aperturas con mancuernas',
    'Remo con barra',
    'Remo con mancuerna',
    'Peso muerto',
    'Sentadillas',
    'Zancadas',
    'Peso muerto rumano',
    'Hip Thrust',
  ],
  Funcional: [
    'Flexiones (push-ups)',
    'Flexiones con palmada',
    'Flexiones inclinadas',
    'Dominadas',
    'Remo con TRX',
    'Superman',
    'Saltos (box jump)',
    'Sentadilla con salto',
    'Burpees',
    'Circuito metabólico',
    'Entrenamiento por estaciones',
    'Full body funcional',
  ],
  Movilidad: [
    'Estiramiento de pecho en pared',
    'Postura del gato-vaca',
    'Estiramiento dorsal',
    'Estiramientos de piernas',
    'Movilidad de cadera',
    'Movilidad de hombros',
    'Movilidad de columna',
    'Activación articular',
  ],
  Cardio: ['Cardio inicial', 'Spinning express', 'Cinta intervalada', 'Escaladora', 'Remo ergómetro'],
  Yoga: [
    'Postura del perro mirando abajo',
    'Postura del gato-vaca',
    'Guerrero I',
    'Guerrero II',
    'Yoga Flow',
    'Yoga Stretch',
    'Yoga para principiantes',
    'Respiración + movilidad',
  ],
  Box: ['Box Conditioning', 'Técnica de boxeo', 'Sombra + bolsa', 'Guanteo técnico', 'Box cardio'],
  Recovery: ['Recovery post-entreno', 'Liberación miofascial', 'Stretching recovery', 'Respiración guiada', 'Descarga muscular'],
  Musculación: [
    'Press en máquina (horizontal)',
    'Press en máquina (inclinado)',
    'Peck deck (aperturas)',
    'Press en Smith',
    'Jalón al pecho',
    'Remo en máquina',
    'Pullover en máquina',
    'Prensa',
    'Extensión de cuádriceps',
    'Curl femoral',
    'Abductores',
    'Aductores',
    'Musculación Guiada',
    'Circuito de máquinas',
  ],
};

function getActivityOptions(type) {
  return activityOptionsByType[type] ?? ['Actividad general'];
}

const memberClassOptions = [
  { id: 'funcional-hiit', memberId: 'mem-1', name: 'Funcional HIIT', type: 'Funcional', schedule: 'Hoy · 19:00', coach: 'Valentina Ruiz', reserved: true, spots: 18 },
  { id: 'yoga-recovery', memberId: 'mem-1', name: 'Yoga Recovery', type: 'Recovery', schedule: 'Mañana · 08:00', coach: 'Carla Mendez', reserved: false, spots: 7 },
  { id: 'box-conditioning', memberId: 'mem-1', name: 'Box Conditioning', type: 'Box', schedule: 'Sábado · 11:00', coach: 'Nico Álvarez', reserved: false, spots: 5 },
];

const memberDirectorySeed = [
  {
    id: 'mem-1',
    name: 'Martina López',
    plan: 'Performance',
    membershipStatus: 'paid',
    qrStatus: 'enabled',
    inGym: true,
    enteredAt: '18:52',
    lastSeen: 'Sala de fuerza',
    coach: 'Valentina Ruiz',
    phone: '5491150010001',
    objective: 'Recomposición corporal',
    photo: 'https://i.pravatar.cc/120?img=32',
  },
  {
    id: 'mem-2',
    name: 'Tomás Herrera',
    plan: 'Elite',
    membershipStatus: 'overdue',
    qrStatus: 'blocked',
    inGym: false,
    enteredAt: '17:41',
    lastSeen: 'Recepción',
    coach: 'Mauro Sosa',
    phone: '5491134567802',
    objective: 'Ganar masa muscular',
    photo: 'https://i.pravatar.cc/120?img=12',
  },
  {
    id: 'mem-3',
    name: 'Lucía Fernández',
    plan: 'Performance',
    membershipStatus: 'paid',
    qrStatus: 'enabled',
    inGym: true,
    enteredAt: '18:36',
    lastSeen: 'Zona funcional',
    coach: 'Valentina Ruiz',
    phone: '5491134567801',
    objective: 'Bajar grasa',
    photo: 'https://i.pravatar.cc/120?img=47',
  },
  {
    id: 'mem-4',
    name: 'Camila Rojas',
    plan: 'Essential',
    membershipStatus: 'paid',
    qrStatus: 'enabled',
    inGym: true,
    enteredAt: '18:14',
    lastSeen: 'Clases recovery',
    coach: 'Carla Mendez',
    phone: '5491150010003',
    objective: 'Movilidad y fuerza',
    photo: 'https://i.pravatar.cc/120?img=5',
  },
  {
    id: 'mem-5',
    name: 'Sofía Díaz',
    plan: 'Elite',
    membershipStatus: 'pending',
    qrStatus: 'warning',
    inGym: false,
    enteredAt: 'Aún no ingresó',
    lastSeen: 'Sin check-in hoy',
    coach: 'Nico Álvarez',
    phone: '5491160011001',
    objective: 'Condición general',
    photo: 'https://i.pravatar.cc/120?img=56',
  },
];

const ownerPaymentsSeed = [
  { id: 'pay-1', memberId: 'mem-3', member: 'Lucía Fernández', plan: 'Performance', amount: 69, status: 'pending', dayOffset: 0, phone: '5491134567801' },
  { id: 'pay-2', memberId: 'mem-2', member: 'Tomás Herrera', plan: 'Elite', amount: 109, status: 'pending', dayOffset: 0, phone: '5491134567802' },
  { id: 'pay-3', memberId: 'mem-1', member: 'Martina López', plan: 'Performance', amount: 69, status: 'paid', dayOffset: 0, phone: '5491150010001' },
  { id: 'pay-4', memberId: 'mem-4', member: 'Camila Rojas', plan: 'Essential', amount: 39, status: 'paid', dayOffset: 1, phone: '5491150010003' },
  { id: 'pay-5', memberId: 'mem-5', member: 'Sofía Díaz', plan: 'Elite', amount: 109, status: 'pending', dayOffset: 1, phone: '5491160011001' },
  { id: 'pay-6', memberId: 'mem-6', member: 'Paula Costa', plan: 'Essential', amount: 39, status: 'paid', dayOffset: 2, phone: '5491134567806' },
];

const ownerRiskSeed = [
  { id: 'risk-1', member: 'Sofía Díaz', days: 9, plan: 'Elite', dayOffset: 0, phone: '5491160011001' },
  { id: 'risk-2', member: 'Julián Ferreyra', days: 12, plan: 'Performance', dayOffset: 0, phone: '5491160011002' },
  { id: 'risk-3', member: 'Carolina Vega', days: 7, plan: 'Essential', dayOffset: 1, phone: '5491160011003' },
  { id: 'risk-4', member: 'Nahuel Ortiz', days: 10, plan: 'Performance', dayOffset: 2, phone: '5491160011004' },
  { id: 'risk-5', member: 'Julieta Franco', days: 8, plan: 'Elite', dayOffset: 2, phone: '5491160011005' },
];

const ownerMonthlyStats = [
  { month: 'Ene', income: 72, retention: 84 },
  { month: 'Feb', income: 76, retention: 86 },
  { month: 'Mar', income: 81, retention: 88 },
  { month: 'Abr', income: 87, retention: 91 },
  { month: 'May', income: 83, retention: 89 },
  { month: 'Jun', income: 92, retention: 93 },
];

const productCatalogSeed = [
  { id: 'prod-1', name: 'Proteína Whey', price: 38, category: 'Suplementos', stock: 14, featured: true },
  { id: 'prod-2', name: 'Creatina Monohidrato', price: 24, category: 'Suplementos', stock: 22, featured: true },
  { id: 'prod-3', name: 'Shaker ProFitness', price: 12, category: 'Accesorios', stock: 31, featured: false },
  { id: 'prod-4', name: 'Barra Proteica', price: 4, category: 'Nutrición', stock: 58, featured: false },
];

const nutritionPlanSeed = [
  { id: 'nut-1', meal: 'Desayuno', detail: 'Yogur griego, avena, banana y semillas', goal: 'Energía sostenida' },
  { id: 'nut-2', meal: 'Post entrenamiento', detail: 'Proteína whey con fruta', goal: 'Recuperación muscular' },
  { id: 'nut-3', meal: 'Cena', detail: 'Pollo, arroz y verduras', goal: 'Recuperación y saciedad' },
];

const memberNutritionProfile = {
  memberName: 'Martina López',
  objective: 'Recomposición corporal',
  objectiveDescription: 'Bajar porcentaje graso sin perder masa muscular y sostener energía para entrenar 4 veces por semana.',
  startWeight: 78.4,
  currentWeight: 72.8,
  targetWeight: 68,
  startDate: '12 Feb 2026',
  coach: 'Lic. Paula Ferrero',
  calories: 2050,
  protein: 145,
  carbs: 210,
  fats: 62,
  hydration: '2.7 L diarios',
  meals: nutritionPlanSeed,
  variants: [
    {
      id: 'recomp',
      title: 'Recomposición corporal',
      description: 'Déficit suave con proteína alta para perder grasa y mantener músculo.',
      dailyTarget: '2050 kcal',
      focus: ['Proteína alta', 'Carbo moderado', 'Fuerza + pasos diarios'],
    },
    {
      id: 'fat-loss',
      title: 'Bajar grasa',
      description: 'Versión más agresiva para semanas de definición controlada.',
      dailyTarget: '1850 kcal',
      focus: ['Déficit más marcado', 'Volumen de vegetales', 'Control de snacks'],
    },
    {
      id: 'muscle',
      title: 'Ganar masa muscular',
      description: 'Superávit limpio para subir masa magra sin desordenar digestión ni energía.',
      dailyTarget: '2350 kcal',
      focus: ['Más carbohidrato', 'Post entrenamiento fuerte', 'Control semanal de peso'],
    },
  ],
};

const adminOrdersSeed = [
  { id: 'ord-1', customer: 'Martina López', product: 'Proteína Whey', total: 38, status: 'paid' },
  { id: 'ord-2', customer: 'Tomás Herrera', product: 'Creatina Monohidrato', total: 24, status: 'pending' },
  { id: 'ord-3', customer: 'Lucía Fernández', product: 'Barra Proteica x6', total: 21, status: 'paid' },
];

const cleaningTasksSeed = [
  { id: 'clean-1', zone: 'Vestuario mujeres', task: 'Reposición de jabón y papel', status: 'pending', priority: 'Alta' },
  { id: 'clean-2', zone: 'Sala de musculación', task: 'Desinfección de mancuernas y bancos', status: 'done', priority: 'Media' },
  { id: 'clean-3', zone: 'Recepción', task: 'Limpieza de mostrador y molinetes', status: 'pending', priority: 'Media' },
  { id: 'clean-4', zone: 'Zona cardio', task: 'Paños y sanitizante en cintas', status: 'pending', priority: 'Alta' },
];

const cleaningSuppliesSeed = [
  { id: 'sup-1', name: 'Desinfectante multiuso', category: 'Químicos', stock: 6, unit: 'bidones', restockSize: 4 },
  { id: 'sup-2', name: 'Paños de microfibra', category: 'Textiles', stock: 18, unit: 'unidades', restockSize: 12 },
  { id: 'sup-3', name: 'Jabón líquido', category: 'Baños', stock: 4, unit: 'envases', restockSize: 6 },
  { id: 'sup-4', name: 'Papel de manos', category: 'Baños', stock: 9, unit: 'packs', restockSize: 5 },
];

const cleaningIncidentsSeed = [
  { id: 'inc-1', area: 'Baño hombres', issue: 'Secador fuera de servicio', status: 'open' },
  { id: 'inc-2', area: 'Sala 2', issue: 'Falta rociador en estación de limpieza', status: 'open' },
  { id: 'inc-3', area: 'Recepción', issue: 'Piso mojado resuelto', status: 'resolved' },
];

const staffTasksSeed = [
  { id: 'task-1', role: 'coach', owner: 'Valentina Ruiz', area: 'Clase 19:00', title: 'Confirmar lista final de Funcional HIIT', priority: 'Alta', status: 'pending' },
  { id: 'task-2', role: 'coach', owner: 'Mauro Sosa', area: 'Sala fuerza', title: 'Subir rutina de nuevos ingresos', priority: 'Media', status: 'pending' },
  { id: 'task-3', role: 'reception', owner: 'Sofía', area: 'Molinetes', title: 'Validar cuotas vencidas antes de habilitar QR', priority: 'Alta', status: 'pending' },
  { id: 'task-4', role: 'reception', owner: 'Sofía', area: 'Front desk', title: 'Llamar a lista de espera de Yoga Recovery', priority: 'Media', status: 'done' },
  { id: 'task-5', role: 'cleaning', owner: 'Daniela', area: 'Vestuario', title: 'Revisar sanitización post pico de las 19:00', priority: 'Alta', status: 'pending' },
  { id: 'task-6', role: 'cleaning', owner: 'Daniela', area: 'Recepción', title: 'Secar molinetes y puerta de ingreso', priority: 'Media', status: 'pending' },
];

const accessEventsSeed = [
  { id: 'acc-1', memberId: 'mem-1', member: 'Martina López', result: 'allowed', method: 'QR', time: '18:52', detail: 'Ingreso habilitado', location: 'Molinetes' },
  { id: 'acc-2', memberId: 'mem-3', member: 'Lucía Fernández', result: 'allowed', method: 'QR', time: '18:36', detail: 'Ingreso habilitado', location: 'Molinetes' },
  { id: 'acc-3', memberId: 'mem-2', member: 'Tomás Herrera', result: 'blocked', method: 'QR', time: '18:28', detail: 'Cuota vencida', location: 'Recepción' },
  { id: 'acc-4', memberId: 'mem-4', member: 'Camila Rojas', result: 'allowed', method: 'QR', time: '18:14', detail: 'Ingreso habilitado', location: 'Molinetes' },
];

const classCatalogSeed = [
  { id: 'class-1', type: 'Funcional', customName: 'Funcional HIIT', coach: 'Valentina Ruiz', schedule: 'Hoy · 19:00', room: 'Sala 1', capacity: 20, enrolled: 18 },
  { id: 'class-2', type: 'Musculación', customName: 'Musculación Guiada', coach: 'Mauro Sosa', schedule: 'Todos los días · 07:00 a 22:00', room: 'Sala fuerza', capacity: 28, enrolled: 21 },
  { id: 'class-3', type: 'Recovery', customName: 'Yoga Recovery', coach: 'Carla Mendez', schedule: 'Mañana · 08:00', room: 'Studio B', capacity: 12, enrolled: 7 },
  { id: 'class-4', type: 'Box', customName: 'Box Conditioning', coach: 'Nico Álvarez', schedule: 'Sábado · 11:00', room: 'Ring', capacity: 14, enrolled: 9 },
];

function buildLinePath(values, width, height, padding) {
  if (!values.length) return '';

  const maxValue = Math.max(...values, 1);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  const points = values.map((value, index) => ({
    x: padding + stepX * index,
    y: padding + innerHeight - (value / maxValue) * innerHeight,
  }));

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function formatDayLabel(dayOffset) {
  if (dayOffset === 0) return 'Hoy';
  if (dayOffset === 1) return 'Ayer';
  return `Hace ${dayOffset} días`;
}

function buildWhatsAppUrl(phone, message) {
  const baseUrl = `https://wa.me/${phone}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

function getInitials(name) {
  return String(name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getMembershipLabel(status) {
  if (status === 'paid') return 'Cuota al día';
  if (status === 'pending') return 'Próximo vencimiento';
  return 'Cuota vencida';
}

function ProfileAvatar({ name, photo, size = 'md' }) {
  return (
    <div className={`profile-avatar ${size}`}>
      {photo ? <img src={photo} alt={`Perfil de ${name}`} /> : <span>{getInitials(name)}</span>}
    </div>
  );
}

function scrollToElementId(elementId) {
  window.requestAnimationFrame(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

const coachRosterSeed = [
  { id: 'ath-1', name: 'Martina López', goal: 'Recomposición corporal', present: true, note: 'Muy buen ritmo en sentadillas.', phone: '5491150010001', photo: 'https://i.pravatar.cc/120?img=32' },
  { id: 'ath-2', name: 'Julián Ferreyra', goal: 'Bajar grasa', present: false, note: 'Revisar adherencia semanal.', phone: '5491150010002', photo: 'https://i.pravatar.cc/120?img=14' },
  { id: 'ath-3', name: 'Camila Rojas', goal: 'Ganar fuerza', present: true, note: 'Subir carga en peso muerto.', phone: '5491150010003', photo: 'https://i.pravatar.cc/120?img=5' },
  { id: 'ath-4', name: 'Franco Sosa', goal: 'Mejorar movilidad', present: false, note: 'Hacer seguimiento post clase.', phone: '5491150010004', photo: 'https://i.pravatar.cc/120?img=22' },
];

const coachDayPlans = [
  { dayOffset: 0, label: 'Hoy', focus: 'Turno tarde', rosterIds: ['ath-1', 'ath-2', 'ath-3', 'ath-4'] },
  { dayOffset: 1, label: 'Ayer', focus: 'Funcional HIIT', rosterIds: ['ath-2', 'ath-3', 'ath-4'] },
  { dayOffset: 2, label: 'Hace 2 días', focus: 'Musculación Guiada', rosterIds: ['ath-1', 'ath-3'] },
];

const routinesSeed = {
  'ath-1': [
    { id: 'rt-1', type: 'Fuerza', exercise: 'Sentadilla Goblet', sets: '4', reps: '12', rest: '60s' },
    { id: 'rt-2', type: 'Fuerza', exercise: 'Hip Thrust', sets: '4', reps: '10', rest: '75s' },
  ],
  'ath-2': [{ id: 'rt-3', type: 'Fuerza', exercise: 'Remo con mancuerna', sets: '3', reps: '12', rest: '45s' }],
  'ath-3': [{ id: 'rt-4', type: 'Fuerza', exercise: 'Peso muerto rumano', sets: '4', reps: '8', rest: '90s' }],
  'ath-4': [{ id: 'rt-5', type: 'Movilidad', exercise: 'Movilidad de cadera', sets: '3', reps: '45s', rest: '30s' }],
};

const chatSeed = [
  { id: 'msg-1', author: 'Recepción', role: 'owner', text: 'Bienvenidos al chat del gym. Acá coordinamos clases, dudas y avisos rápidos.', time: '09:10' },
  { id: 'msg-2', author: 'Valentina Ruiz', role: 'coach', text: 'Hoy funcional de las 19:00 está casi completo. Si alguien necesita mover reserva me avisa.', time: '09:22' },
  { id: 'msg-3', author: 'Andrés', role: 'owner', text: 'Perfecto. Si se libera un cupo, avísame así lo movemos desde recepción.', time: '09:28' },
];

function PortalSummaryCards({ items }) {
  return (
    <section className="portal-summary-grid">
      {items.map(({ icon: Icon, value, label, detail }) => (
        <article key={label} className="portal-summary-card">
          <div className="portal-summary-icon">
            <Icon size={18} />
          </div>
          <strong>{value}</strong>
          <span>{label}</span>
          <small>{detail}</small>
        </article>
      ))}
    </section>
  );
}

function OwnerTrendChart({ data }) {
  const width = 640;
  const height = 240;
  const padding = 20;
  const incomeValues = data.map((item) => item.income);
  const retentionValues = data.map((item) => item.retention);
  const incomePath = buildLinePath(incomeValues, width, height, padding);
  const retentionPath = buildLinePath(retentionValues, width, height, padding);

  return (
    <div className="owner-trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Tendencia mensual de ingresos y retención">
        {[0, 1, 2, 3].map((step) => {
          const y = padding + ((height - padding * 2) / 3) * step;
          return <line key={step} x1={padding} y1={y} x2={width - padding} y2={y} className="owner-chart-grid-line" />;
        })}
        <path d={incomePath} className="owner-chart-line income" />
        <path d={retentionPath} className="owner-chart-line retention" />
        {data.map((item, index) => {
          const incomeMax = Math.max(...incomeValues, 1);
          const retentionMax = Math.max(...retentionValues, 1);
          const innerWidth = width - padding * 2;
          const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;
          const x = padding + stepX * index;
          const incomeY = padding + (height - padding * 2) - (item.income / incomeMax) * (height - padding * 2);
          const retentionY =
            padding + (height - padding * 2) - (item.retention / retentionMax) * (height - padding * 2);

          return (
            <g key={item.month}>
              <circle cx={x} cy={incomeY} r="4" className="owner-chart-point income" />
              <circle cx={x} cy={retentionY} r="4" className="owner-chart-point retention" />
            </g>
          );
        })}
      </svg>
      <div className="owner-chart-axis">
        {data.map((item) => (
          <span key={item.month}>{item.month}</span>
        ))}
      </div>
    </div>
  );
}

function PortalChat({ role, messages, draftMessage, onDraftChange, onSendMessage }) {
  const roleMeta = portalRoleMap[role];
  const visibleMessages = messages.filter((message) => message.role === 'owner' || message.role === 'coach');

  return (
    <section className="portal-panel portal-chat-panel">
      <div className="portal-panel-head">
        <strong>Chat interno del gym</strong>
        <small>{roleMeta.label}</small>
      </div>
      <div className="portal-chat-list">
        {visibleMessages.map((message) => (
          <article key={message.id} className={`portal-chat-message ${message.role === role ? 'is-self' : ''}`}>
            <div className="portal-chat-meta">
              <strong>{message.author}</strong>
              <span>{message.time}</span>
            </div>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <form
        className="portal-chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSendMessage();
        }}
      >
        <input
          type="text"
          value={draftMessage}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Escribe un mensaje para profes y administración"
        />
        <button type="submit" className="portal-mini-button">
          Enviar
        </button>
      </form>
    </section>
  );
}

function LeadRequestsPanel({ requests, title = 'Solicitudes de clase de prueba' }) {
  return (
    <article className="portal-panel">
      <div className="portal-panel-head">
        <strong>{title}</strong>
        <small>Entran desde la web por mail y WhatsApp</small>
      </div>
      {requests.length ? (
        <div className="portal-action-list">
          {requests.map((request) => (
            <div key={request.id} className="portal-action-item">
              <div>
                <strong>{request.name}</strong>
                <p>{request.goal}</p>
                <span className="portal-request-meta">
                  <Mail size={14} />
                  {request.email}
                </span>
                <span className="portal-request-meta">
                  <Phone size={14} />
                  {request.phone}
                </span>
              </div>
              <div className="portal-action-buttons">
                <span className="portal-status-badge muted">{request.preferredChannel}</span>
                <a
                  className="portal-whatsapp-button"
                  href={buildWhatsAppUrl(request.phone, `Hola ${request.name}, te escribo desde ${CLIENT_NAME} para coordinar tu clase de prueba.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                <a className="portal-mini-button-link" href={`mailto:${request.email}?subject=Clase de prueba en ${CLIENT_NAME}`}>
                  Email
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portal-empty-state">Todavía no entraron nuevas solicitudes desde la web.</div>
      )}
    </article>
  );
}

function MemberNutritionPage() {
  const [activeVariant, setActiveVariant] = useState(memberNutritionProfile.variants[0].id);
  const variant = memberNutritionProfile.variants.find((item) => item.id === activeVariant) ?? memberNutritionProfile.variants[0];
  const totalProgress = memberNutritionProfile.startWeight - memberNutritionProfile.currentWeight;
  const totalTarget = memberNutritionProfile.startWeight - memberNutritionProfile.targetWeight;
  const progressPercent = Math.max(0, Math.min(100, Math.round((totalProgress / totalTarget) * 100)));

  return (
    <>
      <header className="portal-page-hero nutrition-page-hero">
        <div>
          <span className="client-kicker">Nutrición</span>
          <h1>{memberNutritionProfile.objective}</h1>
          <p>{memberNutritionProfile.objectiveDescription}</p>
        </div>
        <div className="nutrition-hero-card">
          <small>Seguimiento activo desde {memberNutritionProfile.startDate}</small>
          <strong>{progressPercent}% del objetivo completado</strong>
          <span>Plan armado por {memberNutritionProfile.coach}</span>
        </div>
      </header>

      <section className="portal-summary-grid nutrition-summary-grid">
        <article className="portal-summary-card">
          <div className="portal-summary-icon">
            <TrendingUp size={18} />
          </div>
          <strong>{memberNutritionProfile.startWeight} kg</strong>
          <span>Peso inicial</span>
          <small>Cuando comenzó el plan</small>
        </article>
        <article className="portal-summary-card">
          <div className="portal-summary-icon">
            <Gauge size={18} />
          </div>
          <strong>{memberNutritionProfile.currentWeight} kg</strong>
          <span>Peso actual</span>
          <small>Último control</small>
        </article>
        <article className="portal-summary-card">
          <div className="portal-summary-icon">
            <HeartHandshake size={18} />
          </div>
          <strong>{memberNutritionProfile.targetWeight} kg</strong>
          <span>Peso meta</span>
          <small>Objetivo acordado</small>
        </article>
      </section>

      <section className="portal-content-grid nutrition-layout-grid">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Objetivo y progreso</strong>
            <small>Resumen corporal</small>
          </div>
          <div className="nutrition-progress-card">
            <div className="nutrition-progress-top">
              <strong>{totalProgress.toFixed(1)} kg avanzados</strong>
              <span>de {totalTarget.toFixed(1)} kg hacia tu meta</span>
            </div>
            <div className="nutrition-progress-bar">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="nutrition-stats-grid">
              <div>
                <small>Calorías</small>
                <strong>{variant.dailyTarget}</strong>
              </div>
              <div>
                <small>Proteína</small>
                <strong>{memberNutritionProfile.protein} g</strong>
              </div>
              <div>
                <small>Carbohidratos</small>
                <strong>{memberNutritionProfile.carbs} g</strong>
              </div>
              <div>
                <small>Grasas</small>
                <strong>{memberNutritionProfile.fats} g</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Variantes según tu objetivo</strong>
            <small>Elige el enfoque</small>
          </div>
          <div className="nutrition-variant-list">
            {memberNutritionProfile.variants.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nutrition-variant-card ${item.id === activeVariant ? 'active' : ''}`}
                onClick={() => setActiveVariant(item.id)}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span>{item.dailyTarget}</span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="portal-content-grid nutrition-layout-grid">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Plan diario</strong>
            <small>Comidas y foco</small>
          </div>
          <div className="portal-nutrition-list">
            {memberNutritionProfile.meals.map((item) => (
              <div key={item.id} className="portal-nutrition-item">
                <strong>{item.meal}</strong>
                <p>{item.detail}</p>
                <span>{item.goal}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Claves del enfoque</strong>
            <small>{variant.title}</small>
          </div>
          <ul className="portal-task-list">
            {variant.focus.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} />
                {item}
              </li>
            ))}
            <li>
              <CheckCircle2 size={16} />
              Hidratación diaria: {memberNutritionProfile.hydration}
            </li>
          </ul>
        </article>
      </section>
    </>
  );
}

function MemberPortalContent({ routine, onOpenNutritionPage, memberProfile = memberDirectorySeed[0], activeSection = 'dashboard' }) {
  const [classes, setClasses] = useState(memberClassOptions);
  const [products, setProducts] = useState(productCatalogSeed);
  const reservedCount = classes.filter((item) => item.reserved).length;
  const nextClass = classes.find((item) => item.reserved) ?? classes[0];
  const completion = 82 + reservedCount * 2;
  const qrEnabled = memberProfile.membershipStatus === 'paid';

  const toggleReservation = (classId) => {
    setClasses((current) =>
      current.map((item) => (item.id === classId ? { ...item, reserved: !item.reserved } : item)),
    );
  };

  const buyProduct = (productId) => {
    setProducts((current) =>
      current.map((item) => (item.id === productId && item.stock > 0 ? { ...item, stock: item.stock - 1 } : item)),
    );
  };

  const summary = [
    { icon: CalendarCheck2, value: String(reservedCount), label: 'clases reservadas', detail: 'Semana actual' },
    { icon: Gauge, value: `${completion}%`, label: 'plan completado', detail: 'Progreso mensual' },
    { icon: HeartHandshake, value: nextClass.name, label: 'próxima clase', detail: `${nextClass.type} · ${nextClass.schedule}` },
  ];

  return (
    <>
      <PortalSummaryCards items={summary} />

      {activeSection === 'dashboard' && (
      <section className="portal-content-grid" id="member-overview">
        <article className="portal-panel" id="member-reservations">
          <div className="portal-panel-head">
            <strong>Clases y reservas</strong>
            <small>Todo más claro por tipo, horario y profe</small>
          </div>
          <div className="portal-action-list">
            {classes.map((item) => (
              <div key={item.id} className="portal-action-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.type} · {item.schedule} · {item.coach}</p>
                </div>
                <button type="button" className={item.reserved ? 'portal-mini-button dark' : 'portal-mini-button'} onClick={() => toggleReservation(item.id)}>
                  {item.reserved ? 'Cancelar' : 'Reservar'}
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Acceso y perfil</strong>
            <small>Tu estado de ingreso hoy</small>
          </div>
          <div className="portal-inside-stack">
            <div className="portal-member-card">
              <ProfileAvatar name={memberProfile.name} photo={memberProfile.photo} size="lg" />
              <div>
                <strong>{memberProfile.name}</strong>
                <p>{memberProfile.plan} · {memberProfile.objective}</p>
                <span>{getMembershipLabel(memberProfile.membershipStatus)}</span>
              </div>
            </div>
            <div className="portal-qr-card">
              <QrCode size={28} />
              <div>
                <strong>{qrEnabled ? 'QR listo para ingresar' : 'QR bloqueado por cuota'}</strong>
                <p>
                  {qrEnabled
                    ? `Último check-in: hoy ${memberProfile.enteredAt}. Puedes usarlo directo en recepción.`
                    : 'Primero debes regularizar tu cuota para volver a habilitar el acceso.'}
                </p>
              </div>
            </div>
            <ul className="portal-task-list">
              <li>
                <CheckCircle2 size={16} />
                Completar rutina de tren inferior
              </li>
              <li>
                <CheckCircle2 size={16} />
                Confirmar asistencia al sábado
              </li>
              <li>
                <CheckCircle2 size={16} />
                Ver feedback corporal del coach
              </li>
            </ul>
          </div>
        </article>
      </section>
      )}

      {activeSection === 'dashboard' && (
      <section className="portal-panel">
        <div className="portal-panel-head">
          <strong>Rutina en vivo</strong>
          <small>Lo que te dejó tu profesor hoy</small>
        </div>
        <div className="portal-routine-list">
          {routine.map((exercise) => (
            <div key={exercise.id} className="portal-routine-item">
              <strong>{exercise.exercise}</strong>
              <span>
                {exercise.type} · {exercise.sets} series · {exercise.reps} reps · descanso {exercise.rest}
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      {activeSection === 'dashboard' && (
      <section className="portal-content-grid" id="coach-attendance">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Panel nutrición</strong>
            <small>Plan sugerido de hoy</small>
          </div>
          <div className="portal-nutrition-list">
            {nutritionPlanSeed.map((item) => (
              <div key={item.id} className="portal-nutrition-item">
                <strong>{item.meal}</strong>
                <p>{item.detail}</p>
                <span>{item.goal}</span>
              </div>
            ))}
          </div>
          <button type="button" className="portal-mini-button" onClick={onOpenNutritionPage}>
            Abrir página nutrición
          </button>
        </article>

        <article className="portal-panel" id="coach-followup">
          <div className="portal-panel-head">
            <strong>Tienda del gym</strong>
            <small>Productos recomendados</small>
          </div>
          <div className="portal-product-list">
            {products.filter((item) => item.featured).map((product) => (
              <div key={product.id} className="portal-product-card">
                <small>{product.category}</small>
                <strong>{product.name}</strong>
                <p>${product.price} · stock {product.stock}</p>
                <button type="button" className="portal-mini-button" onClick={() => buyProduct(product.id)} disabled={product.stock === 0}>
                  {product.stock === 0 ? 'Sin stock' : 'Comprar'}
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      )}

      {activeSection === 'dashboard' && (
      <section className="portal-role-grid">
        <article className="portal-insight-card primary">
          <small>Beneficio</small>
          <strong>Nutrición con descuento</strong>
          <p>Tu plan actual desbloquea un 20% off en consulta deportiva esta semana.</p>
        </article>
        <article className="portal-insight-card">
          <small>Meta</small>
          <strong>Próximo objetivo</strong>
          <p>Bajar 1.5% de grasa corporal manteniendo masa muscular y constancia semanal.</p>
        </article>
      </section>
      )}

      {activeSection === 'reservations' && (
        <section className="portal-panel" id="member-reservations">
          <div className="portal-panel-head">
            <strong>Clases y reservas</strong>
            <small>Todo más claro por tipo, horario y profe</small>
          </div>
          <div className="portal-action-list">
            {classes.map((item) => (
              <div key={item.id} className="portal-action-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.type} · {item.schedule} · {item.coach}</p>
                </div>
                <button type="button" className={item.reserved ? 'portal-mini-button dark' : 'portal-mini-button'} onClick={() => toggleReservation(item.id)}>
                  {item.reserved ? 'Cancelar' : 'Reservar'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function OwnerPortalContent({ leadRequests = [], activeSection = 'overview' }) {
  const [payments, setPayments] = useState(ownerPaymentsSeed);
  const [riskMembers, setRiskMembers] = useState(ownerRiskSeed);
  const [catalog, setCatalog] = useState(productCatalogSeed);
  const [orders, setOrders] = useState(adminOrdersSeed);
  const [members, setMembers] = useState(memberDirectorySeed);
  const [accessEvents, setAccessEvents] = useState(accessEventsSeed);
  const [staffTasks, setStaffTasks] = useState(staffTasksSeed);
  const [selectedProfileId, setSelectedProfileId] = useState(memberDirectorySeed[0].id);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [chartRange, setChartRange] = useState('6m');
  const [ownerMetrics, setOwnerMetrics] = useState(() =>
    ({
      source: hasSupabaseEnv ? 'loading' : 'demo',
      statusLabel: hasSupabaseEnv ? 'Conectando a Supabase...' : 'Modo demo',
      chart: ownerMonthlyStats,
      cash: {
        paidToday: payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
        pendingToday: payments.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
        monthlyRevenue: ownerMonthlyStats.reduce((sum, item) => sum + item.income, 0) * 100,
      },
      retention: {
        atRiskCount: riskMembers.length,
        rate: Math.max(82, 94 - riskMembers.length * 2),
        activeMembers: 1248 - riskMembers.length,
      },
    })
  );

  useEffect(() => {
    let active = true;

    const syncOwnerMetrics = async () => {
      const nextMetrics = await loadOwnerMetrics({
        fallbackMonthlyStats: ownerMonthlyStats,
        payments,
        riskMembers,
      });

      if (active) setOwnerMetrics(nextMetrics);
    };

    syncOwnerMetrics();

    return () => {
      active = false;
    };
  }, [payments, riskMembers]);

  const totalWeekly = 8200 + payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0);
  const pendingCount = payments.filter((item) => item.status === 'pending').length;
  const liveMembers = members.filter((member) => member.inGym);
  const blockedEntries = accessEvents.filter((event) => event.result === 'blocked');
  const selectedProfile = members.find((member) => member.id === selectedProfileId) ?? members[0];
  const activeMembers = ownerMetrics.retention.activeMembers ?? 1248 - riskMembers.length;
  const paidToday = ownerMetrics.cash.paidToday;
  const pendingToday = ownerMetrics.cash.pendingToday;
  const retentionRate = ownerMetrics.retention.rate;
  const averageTicket = Math.round(ownerMetrics.cash.monthlyRevenue / Math.max(activeMembers, 1));

  const markAsPaid = (paymentId) => {
    const payment = payments.find((item) => item.id === paymentId);
    setPayments((current) => current.map((item) => (item.id === paymentId ? { ...item, status: 'paid' } : item)));
    if (payment?.memberId) {
      setMembers((current) =>
        current.map((member) =>
          member.id === payment.memberId
            ? { ...member, membershipStatus: 'paid', qrStatus: 'enabled' }
            : member,
        ),
      );
    }
  };

  const dismissRisk = (riskId) => {
    setRiskMembers((current) => current.filter((item) => item.id !== riskId));
  };

  const markOrderAsDelivered = (orderId) => {
    setOrders((current) => current.map((item) => (item.id === orderId ? { ...item, status: 'delivered' } : item)));
  };

  const restockProduct = (productId) => {
    setCatalog((current) => current.map((item) => (item.id === productId ? { ...item, stock: item.stock + 10 } : item)));
  };

  const updateMemberPhoto = (memberId, value) => {
    setMembers((current) => current.map((member) => (member.id === memberId ? { ...member, photo: value } : member)));
  };

  const toggleTaskStatus = (taskId) => {
    setStaffTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task,
      ),
    );
  };

  const simulateQrAccess = (memberId) => {
    const member = members.find((item) => item.id === memberId);
    if (!member) return;

    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const allowed = member.membershipStatus === 'paid';

    setAccessEvents((current) => [
      {
        id: `acc-${Date.now()}`,
        memberId: member.id,
        member: member.name,
        result: allowed ? 'allowed' : 'blocked',
        method: 'QR',
        time: now,
        detail: allowed ? 'Ingreso habilitado' : 'Cuota vencida o pendiente',
        location: allowed ? 'Molinetes' : 'Recepción',
      },
      ...current,
    ]);

    if (allowed) {
      setMembers((current) =>
        current.map((item) =>
          item.id === memberId
            ? { ...item, inGym: true, enteredAt: now, lastSeen: 'Ingreso por molinete' }
            : item,
        ),
      );
    }
  };

  const dayPayments = payments.filter((item) => item.dayOffset === selectedDayOffset);
  const dayRiskMembers = riskMembers.filter((item) => item.dayOffset === selectedDayOffset);
  const visiblePayments = dayPayments.filter((item) => paymentFilter === 'all' || item.status === paymentFilter);
  const visibleRiskMembers = dayRiskMembers.filter((item) => riskFilter === 'all' || item.plan === riskFilter);
  const visibleChart = chartRange === '3m' ? ownerMetrics.chart.slice(-3) : ownerMetrics.chart;
  const groupedTasks = ['coach', 'reception', 'cleaning'].map((role) => ({
    role,
    items: staffTasks.filter((task) => task.role === role),
  }));

  const summary = [
    { icon: Users, value: String(liveMembers.length), label: 'personas en vivo', detail: 'Prioridad operativa del turno' },
    { icon: Wallet, value: `$${paidToday.toLocaleString('es-AR')}`, label: 'ingresos en vivo', detail: `${pendingCount} pagos todavía abiertos` },
    { icon: TrendingUp, value: `${blockedEntries.length}`, label: 'qr bloqueados hoy', detail: 'Controlados desde recepción' },
  ];

  return (
    <>
      <PortalSummaryCards items={summary} />

      <section className={`portal-data-status ${ownerMetrics.source}`}>
        <span>{ownerMetrics.statusLabel}</span>
        {ownerMetrics.errorMessage && <small>{ownerMetrics.errorMessage}</small>}
      </section>

      <section className="portal-toolbar">
        <div className="portal-day-switcher">
          <button type="button" className="portal-icon-button" onClick={() => setSelectedDayOffset((current) => Math.min(current + 1, 6))}>
            <ArrowLeft size={16} />
          </button>
          <div className="portal-day-label">
            <strong>{formatDayLabel(selectedDayOffset)}</strong>
            <small>Operación del día seleccionado</small>
          </div>
          <button type="button" className="portal-icon-button" onClick={() => setSelectedDayOffset((current) => Math.max(current - 1, 0))} disabled={selectedDayOffset === 0}>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="portal-filter-row">
          <label className="portal-select-field">
            <span>Pagos</span>
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagados</option>
            </select>
          </label>
          <label className="portal-select-field">
            <span>Retención</span>
            <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
              <option value="all">Todos los planes</option>
              <option value="Essential">Essential</option>
              <option value="Performance">Performance</option>
              <option value="Elite">Elite</option>
            </select>
          </label>
          <label className="portal-select-field">
            <span>Gráfico</span>
            <select value={chartRange} onChange={(event) => setChartRange(event.target.value)}>
              <option value="3m">Últimos 3 meses</option>
              <option value="6m">Últimos 6 meses</option>
            </select>
          </label>
        </div>
      </section>

      {activeSection === 'overview' && (
      <>
      <section className="portal-content-grid" id="owner-overview">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Personas dentro del gimnasio</strong>
            <small>Primero lo que está pasando ahora</small>
          </div>
          <div className="portal-action-list live-list">
            {liveMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                className={`portal-action-item selectable ${selectedProfileId === member.id ? 'selected' : ''}`}
                onClick={() => setSelectedProfileId(member.id)}
              >
                <div className="portal-person-row">
                  <ProfileAvatar name={member.name} photo={member.photo} />
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.plan} · {member.lastSeen}</p>
                  </div>
                </div>
                <span className="portal-status-badge success">En sala</span>
              </button>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Perfil del cliente</strong>
            <small>Ficha rápida para recepción y administración</small>
          </div>
          <div className="portal-profile-card">
            <div className="portal-profile-head">
              <ProfileAvatar name={selectedProfile.name} photo={selectedProfile.photo} size="lg" />
              <div>
                <strong>{selectedProfile.name}</strong>
                <p>{selectedProfile.plan} · {selectedProfile.objective}</p>
                <span>{getMembershipLabel(selectedProfile.membershipStatus)}</span>
              </div>
            </div>
            <div className="portal-profile-meta">
              <span>Coach: {selectedProfile.coach}</span>
              <span>Último movimiento: {selectedProfile.lastSeen}</span>
              <span>Ingreso de hoy: {selectedProfile.enteredAt}</span>
            </div>
            <label className="portal-note-field">
              <span>Foto de perfil (URL)</span>
              <input
                type="url"
                value={selectedProfile.photo}
                onChange={(event) => updateMemberPhoto(selectedProfile.id, event.target.value)}
                placeholder="https://..."
              />
            </label>
            <div className="portal-action-buttons">
              <a
                className="portal-whatsapp-button"
                href={buildWhatsAppUrl(selectedProfile.phone, `Hola ${selectedProfile.name}, te escribo desde ${CLIENT_NAME}.`)}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <button type="button" className="portal-mini-button" onClick={() => simulateQrAccess(selectedProfile.id)}>
                Probar QR
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="portal-owner-overview">
        <article className="portal-panel portal-owner-finance">
          <div className="portal-panel-head">
            <strong>Caja y operación viva</strong>
            <small>Ingresos y estado del turno</small>
          </div>

          <div className="portal-finance-grid">
            <div className="portal-finance-card emphasis">
              <small>Ingresos en vivo</small>
              <strong>${paidToday.toLocaleString('es-AR')}</strong>
              <span>{pendingCount} cobros pendientes por ${pendingToday.toLocaleString('es-AR')}</span>
            </div>
            <div className="portal-finance-card">
              <small>Personas presentes</small>
              <strong>{liveMembers.length}</strong>
              <span>Administración puede ver quién está entrenando ahora.</span>
            </div>
            <div className="portal-finance-card">
              <small>Retención actual</small>
              <strong>{retentionRate}%</strong>
              <span>{riskMembers.length} socios requieren seguimiento</span>
            </div>
          </div>
        </article>

        <article className="portal-panel portal-owner-chart">
          <div className="portal-panel-head">
            <strong>Gráfico mensual</strong>
            <small>Ingresos y retención del negocio</small>
          </div>
          <OwnerTrendChart data={visibleChart} />

          <div className="portal-chart-legend">
            <span>
              <i className="income" />
              Ingresos
            </span>
            <span>
              <i className="retention" />
              Retención
            </span>
          </div>
        </article>
      </section>

      <LeadRequestsPanel requests={leadRequests} title="Solicitudes web para recepción y administración" />
      </>
      )}

      {activeSection === 'cash' && (
      <section className="portal-content-grid" id="reception-intake">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Ingresos QR y molinetes</strong>
            <small>Todo lo que pasó en recepción hoy</small>
          </div>
          <div className="portal-action-list">
            {accessEvents.map((event) => (
              <div key={event.id} className="portal-action-item">
                <div>
                  <strong>{event.member}</strong>
                  <p>{event.method} · {event.time} · {event.location}</p>
                </div>
                <span className={`portal-status-badge ${event.result === 'allowed' ? 'success' : 'danger'}`}>
                  {event.detail}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel" id="owner-cash">
          <div className="portal-panel-head">
            <strong>Cobros pendientes</strong>
            <small>Mueve caja desde el panel</small>
          </div>
          <div className="portal-action-list">
            {visiblePayments.map((payment) => (
              <div key={payment.id} className="portal-action-item">
                <div>
                  <strong>{payment.member}</strong>
                  <p>
                    {payment.plan} · ${payment.amount}
                  </p>
                </div>
                <div className="portal-action-buttons">
                  <a
                    className="portal-whatsapp-button"
                    href={buildWhatsAppUrl(payment.phone, `Hola ${payment.member}, te escribo desde ${CLIENT_NAME} por tu pago del plan ${payment.plan}.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  {payment.status === 'pending' ? (
                    <button type="button" className="portal-mini-button" onClick={() => markAsPaid(payment.id)}>
                      Marcar pago
                    </button>
                  ) : (
                    <span className="portal-status-badge success">Pagado</span>
                  )}
                </div>
              </div>
            ))}
            {!visiblePayments.length && <div className="portal-empty-state">No hay cobros para ese filtro en {formatDayLabel(selectedDayOffset).toLowerCase()}.</div>}
          </div>
        </article>

        <article className="portal-panel" id="owner-retention">
          <div className="portal-panel-head">
            <strong>Retención activa</strong>
            <small>Socios a recuperar</small>
          </div>
          <div className="portal-action-list">
            {visibleRiskMembers.map((member) => (
              <div key={member.id} className="portal-action-item">
                <div>
                  <strong>{member.member}</strong>
                  <p>
                    {member.plan} · {member.days} días sin check-in
                  </p>
                </div>
                <div className="portal-action-buttons">
                  <a
                    className="portal-whatsapp-button"
                    href={buildWhatsAppUrl(member.phone, `Hola ${member.member}, te escribo desde ${CLIENT_NAME}. Vimos que hace varios días no vienes al gym y queremos ayudarte a volver.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <button type="button" className="portal-mini-button dark" onClick={() => dismissRisk(member.id)}>
                    Contactado
                  </button>
                </div>
              </div>
            ))}
            {!visibleRiskMembers.length && <div className="portal-empty-state">No hay socios en riesgo para ese filtro en {formatDayLabel(selectedDayOffset).toLowerCase()}.</div>}
          </div>
        </article>
      </section>
      )}

      {activeSection === 'tasks' && (
      <>
      <section className="portal-role-grid">
        <article className="portal-insight-card primary">
          <small>Oportunidad</small>
          <strong>Yoga Recovery tiene demanda real</strong>
          <p>Si abres un segundo bloque el jueves, puedes convertir lista de espera en ingreso adicional.</p>
        </article>
        <article className="portal-insight-card">
          <small>Equipo</small>
          <strong>Ticket promedio</strong>
          <p>Ingreso medio por socio estable: ${averageTicket.toLocaleString('es-AR')} con margen para subir upgrades.</p>
        </article>
      </section>

      <section className="portal-content-grid" id="owner-tasks">
        <article className="portal-panel" id="owner-tasks">
          <div className="portal-panel-head">
            <strong>Tareas por equipo</strong>
            <small>Profes, recepción y limpieza mejor organizados</small>
          </div>
          <div className="portal-team-task-grid">
            {groupedTasks.map((group) => (
              <div key={group.role} className="portal-team-task-column">
                <strong>{portalRoleMap[group.role]?.label ?? group.role}</strong>
                <div className="portal-task-stack">
                  {group.items.map((task) => (
                    <button key={task.id} type="button" className="portal-task-card" onClick={() => toggleTaskStatus(task.id)}>
                      <span>{task.area}</span>
                      <strong>{task.title}</strong>
                      <p>{task.owner} · prioridad {task.priority}</p>
                      <small>{task.status === 'done' ? 'Hecha' : 'Pendiente'}</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Ventas de productos</strong>
            <small>Pedidos del día</small>
          </div>
          <div className="portal-action-list">
            {orders.map((order) => (
              <div key={order.id} className="portal-action-item">
                <div>
                  <strong>{order.customer}</strong>
                  <p>
                    {order.product} · ${order.total}
                  </p>
                </div>
                <div className="portal-action-buttons">
                  {order.status === 'pending' ? (
                    <button type="button" className="portal-mini-button" onClick={() => markOrderAsDelivered(order.id)}>
                      Entregar
                    </button>
                  ) : (
                    <span className="portal-status-badge success">Entregado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Stock y nutrición</strong>
            <small>Productos de mostrador</small>
          </div>
          <div className="portal-action-list">
            {catalog.map((product) => (
              <div key={product.id} className="portal-action-item">
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.category} · stock {product.stock}
                  </p>
                </div>
                <button type="button" className="portal-mini-button dark" onClick={() => restockProduct(product.id)}>
                  Reponer
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      </>
      )}
    </>
  );
}

function ReceptionPortalContent({ leadRequests = [], activeSection = 'overview' }) {
  const [members, setMembers] = useState(memberDirectorySeed);
  const [accessEvents, setAccessEvents] = useState(accessEventsSeed);
  const [staffTasks, setStaffTasks] = useState(staffTasksSeed.filter((task) => task.role === 'reception'));
  const [trialForm, setTrialForm] = useState({
    fullName: 'Sofía Benítez',
    phone: '5491150010042',
    email: 'sofia.benitez@email.com',
    trialClass: 'Funcional HIIT',
  });
  const [trialPasses, setTrialPasses] = useState([
    {
      id: 'trial-1',
      fullName: 'Sofía Benítez',
      phone: '5491150010042',
      email: 'sofia.benitez@email.com',
      trialClass: 'Funcional HIIT',
      qrCode: 'TRIAL-2026-001',
      status: 'pending',
    },
  ]);
  const [selectedTrialId, setSelectedTrialId] = useState('trial-1');
  const [signupForm, setSignupForm] = useState({
    fullName: 'Sofía Benítez',
    dni: '35111222',
    email: 'sofia.benitez@email.com',
    phone: '5491150010042',
    birthDate: '1997-04-12',
    address: 'Av. Santa Fe 1240',
    emergencyContact: 'Marina Benítez · 5491158890011',
    plan: 'Performance',
    accessMode: 'qr',
    notes: 'Quiere empezar con clase funcional y musculación.',
  });
  const [memberFiles, setMemberFiles] = useState([]);
  const [gymLegalForm, setGymLegalForm] = useState({
    gymBrand: 'Profitness',
    legalName: 'Profitness SRL',
    cuit: '30-71234567-8',
    legalAddress: 'Av. Corrientes 1880',
    city: 'Buenos Aires',
    province: 'Buenos Aires',
    responsibleName: 'Andrés Molina',
    responsibleRole: 'Administrador',
    responsibleEmail: 'andres@profitness.fit',
    responsiblePhone: '5491150007788',
  });
  const [gymFiles, setGymFiles] = useState([]);
  const [intakeStatus, setIntakeStatus] = useState('');

  const membersInside = members.filter((member) => member.inGym);
  const blockedToday = accessEvents.filter((event) => event.result === 'blocked');
  const pendingTrialPass = trialPasses.find((item) => item.id === selectedTrialId) ?? trialPasses[0];

  const appendAccessEvent = (eventData) => {
    setAccessEvents((current) => [
      {
        id: `reception-${Date.now()}-${current.length}`,
        ...eventData,
      },
      ...current,
    ]);
  };

  const processQr = (memberId) => {
    const member = members.find((item) => item.id === memberId);
    if (!member) return;

    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const allowed = member.membershipStatus === 'paid';

    appendAccessEvent({
      memberId: member.id,
      member: member.name,
      result: allowed ? 'allowed' : 'blocked',
      method: 'QR',
      time: now,
      detail: allowed ? 'Ingreso habilitado' : 'Cuota vencida',
      location: allowed ? 'Molinetes' : 'Recepción',
    });

    if (allowed) {
      setMembers((current) =>
        current.map((item) =>
          item.id === memberId ? { ...item, inGym: true, enteredAt: now, lastSeen: 'Ingreso por QR' } : item,
        ),
      );
    }
  };

  const toggleTask = (taskId) => {
    setStaffTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task,
      ),
    );
  };

  const handleTrialFieldChange = (field) => (event) => {
    setTrialForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSignupFieldChange = (field) => (event) => {
    setSignupForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleGymLegalFieldChange = (field) => (event) => {
    setGymLegalForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleFileSelection = (setter) => (event) => {
    const fileNames = Array.from(event.target.files ?? []).map((file) => file.name);
    setter(fileNames);
  };

  const createTrialQr = () => {
    if (!trialForm.fullName.trim()) return;

    const nextPass = {
      id: `trial-${Date.now()}`,
      ...trialForm,
      qrCode: `TRIAL-${String(Date.now()).slice(-6)}`,
      status: 'pending',
    };

    setTrialPasses((current) => [nextPass, ...current]);
    setSelectedTrialId(nextPass.id);
    setIntakeStatus(`QR de prueba generado para ${nextPass.fullName}.`);
  };

  const scanTrialQr = () => {
    if (!pendingTrialPass) return;

    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setTrialPasses((current) =>
      current.map((item) =>
        item.id === pendingTrialPass.id ? { ...item, status: 'checked-in' } : item,
      ),
    );
    appendAccessEvent({
      memberId: pendingTrialPass.id,
      member: pendingTrialPass.fullName,
      result: 'allowed',
      method: 'QR prueba',
      time: now,
      detail: `Ingreso para ${pendingTrialPass.trialClass}`,
      location: 'Recepción',
    });
    setIntakeStatus(`QR de clase de prueba validado para ${pendingTrialPass.fullName}.`);
  };

  const createReceptionAccount = () => {
    if (!signupForm.fullName.trim()) return;

    const newMemberId = `mem-${Date.now()}`;
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    setMembers((current) => [
      {
        id: newMemberId,
        name: signupForm.fullName,
        plan: signupForm.plan,
        membershipStatus: 'paid',
        qrStatus: signupForm.accessMode === 'qr' ? 'enabled' : 'warning',
        inGym: false,
        enteredAt: 'Aún no ingresó',
        lastSeen: 'Alta desde recepción',
        coach: 'Valentina Ruiz',
        phone: signupForm.phone,
        objective: signupForm.notes || 'Nuevo ingreso',
        photo: '',
      },
      ...current,
    ]);

    appendAccessEvent({
      memberId: newMemberId,
      member: signupForm.fullName,
      result: 'allowed',
      method: signupForm.accessMode === 'qr' ? 'Alta + QR' : 'Alta recepción',
      time: now,
      detail: `Cuenta creada en recepción · plan ${signupForm.plan}`,
      location: 'Recepción',
    });
    setIntakeStatus(`Cuenta creada para ${signupForm.fullName} con acceso ${signupForm.accessMode.toUpperCase()}.`);
  };

  const summary = [
    { icon: QrCode, value: String(accessEvents.length), label: 'lecturas qr hoy', detail: 'Recepción en tiempo real' },
    { icon: Users, value: String(membersInside.length), label: 'personas dentro', detail: 'Visibles por recepción' },
    { icon: ShieldCheck, value: String(blockedToday.length), label: 'accesos bloqueados', detail: 'Cuotas fuera de término' },
  ];

  return (
    <>
      <PortalSummaryCards items={summary} />

      {activeSection === 'overview' && (
      <section className="portal-content-grid" id="reception-overview">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Control de ingresos</strong>
            <small>Administra QR y valida cuotas antes del ingreso</small>
          </div>
          <div className="portal-action-list">
            {members.map((member) => (
              <div key={member.id} className="portal-action-item">
                <div className="portal-person-row">
                  <ProfileAvatar name={member.name} photo={member.photo} />
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.plan} · {getMembershipLabel(member.membershipStatus)}</p>
                  </div>
                </div>
                <div className="portal-action-buttons">
                  <span className={`portal-status-badge ${member.membershipStatus === 'paid' ? 'success' : 'danger'}`}>
                    {member.membershipStatus === 'paid' ? 'QR activo' : 'QR bloqueado'}
                  </span>
                  <button type="button" className="portal-mini-button" onClick={() => processQr(member.id)}>
                    Escanear QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel" id="reception-presence">
          <div className="portal-panel-head">
            <strong>Personas presentes</strong>
            <small>Quién está entrenando ahora</small>
          </div>
          <div className="portal-action-list">
            {membersInside.map((member) => (
              <div key={member.id} className="portal-action-item">
                <div className="portal-person-row">
                  <ProfileAvatar name={member.name} photo={member.photo} />
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.lastSeen} · Ingresó {member.enteredAt}</p>
                  </div>
                </div>
                <span className="portal-status-badge success">Adentro</span>
              </div>
            ))}
          </div>
        </article>
      </section>
      )}

      {activeSection === 'intake' && (
      <>
      <LeadRequestsPanel requests={leadRequests} title="Solicitudes web para coordinar clase de prueba" />

      <section className="portal-content-grid">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Clase de prueba por QR</strong>
            <small>Genera y valida accesos para pruebas sin alta completa</small>
          </div>
          <div className="portal-class-form">
            <label className="portal-note-field">
              <span>Nombre completo</span>
              <input type="text" value={trialForm.fullName} onChange={handleTrialFieldChange('fullName')} />
            </label>
            <label className="portal-note-field">
              <span>Teléfono</span>
              <input type="text" value={trialForm.phone} onChange={handleTrialFieldChange('phone')} />
            </label>
            <label className="portal-note-field">
              <span>Email</span>
              <input type="email" value={trialForm.email} onChange={handleTrialFieldChange('email')} />
            </label>
            <label className="portal-note-field">
              <span>Clase de prueba</span>
              <select value={trialForm.trialClass} onChange={handleTrialFieldChange('trialClass')}>
                <option value="Funcional HIIT">Funcional HIIT</option>
                <option value="Musculación Guiada">Musculación Guiada</option>
                <option value="Yoga Recovery">Yoga Recovery</option>
                <option value="Box Conditioning">Box Conditioning</option>
              </select>
            </label>
            <div className="portal-action-buttons align-start">
              <button type="button" className="portal-mini-button" onClick={createTrialQr}>
                Generar QR de prueba
              </button>
            </div>
          </div>

          <div className="portal-action-list">
            {trialPasses.map((trial) => (
              <button
                key={trial.id}
                type="button"
                className={`portal-action-item selectable ${selectedTrialId === trial.id ? 'selected' : ''}`}
                onClick={() => setSelectedTrialId(trial.id)}
              >
                <div>
                  <strong>{trial.fullName}</strong>
                  <p>{trial.trialClass} · {trial.qrCode}</p>
                </div>
                <span className={`portal-status-badge ${trial.status === 'checked-in' ? 'success' : 'muted'}`}>
                  {trial.status === 'checked-in' ? 'Usado' : 'Pendiente'}
                </span>
              </button>
            ))}
          </div>

          <div className="portal-qr-card">
            <strong>Lectura QR de clase de prueba</strong>
            <p>
              {pendingTrialPass
                ? `${pendingTrialPass.fullName} · ${pendingTrialPass.trialClass} · ${pendingTrialPass.qrCode}`
                : 'No hay QR de prueba seleccionado.'}
            </p>
            <div className="portal-action-buttons align-start">
              <button type="button" className="portal-mini-button" onClick={scanTrialQr} disabled={!pendingTrialPass || pendingTrialPass.status === 'checked-in'}>
                Leer QR de prueba
              </button>
            </div>
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Alta de socio con acceso QR</strong>
            <small>Formulario completo para crear cuenta desde recepción</small>
          </div>
          <div className="portal-class-form portal-intake-grid">
            <label className="portal-note-field">
              <span>Nombre y apellido</span>
              <input type="text" value={signupForm.fullName} onChange={handleSignupFieldChange('fullName')} />
            </label>
            <label className="portal-note-field">
              <span>DNI</span>
              <input type="text" value={signupForm.dni} onChange={handleSignupFieldChange('dni')} />
            </label>
            <label className="portal-note-field">
              <span>Email</span>
              <input type="email" value={signupForm.email} onChange={handleSignupFieldChange('email')} />
            </label>
            <label className="portal-note-field">
              <span>Teléfono</span>
              <input type="text" value={signupForm.phone} onChange={handleSignupFieldChange('phone')} />
            </label>
            <label className="portal-note-field">
              <span>Fecha de nacimiento</span>
              <input type="date" value={signupForm.birthDate} onChange={handleSignupFieldChange('birthDate')} />
            </label>
            <label className="portal-note-field">
              <span>Domicilio</span>
              <input type="text" value={signupForm.address} onChange={handleSignupFieldChange('address')} />
            </label>
            <label className="portal-note-field">
              <span>Contacto de emergencia</span>
              <input type="text" value={signupForm.emergencyContact} onChange={handleSignupFieldChange('emergencyContact')} />
            </label>
            <label className="portal-note-field">
              <span>Plan</span>
              <select value={signupForm.plan} onChange={handleSignupFieldChange('plan')}>
                <option value="Essential">Essential</option>
                <option value="Performance">Performance</option>
                <option value="Elite">Elite</option>
              </select>
            </label>
            <label className="portal-note-field">
              <span>Acceso</span>
              <select value={signupForm.accessMode} onChange={handleSignupFieldChange('accessMode')}>
                <option value="qr">QR</option>
                <option value="manual">Manual</option>
              </select>
            </label>
            <label className="portal-note-field portal-span-full">
              <span>Observaciones</span>
              <textarea rows={4} value={signupForm.notes} onChange={handleSignupFieldChange('notes')} />
            </label>
            <div className="portal-upload-group portal-span-full">
              <span>Archivos del socio</span>
              <label className="portal-upload-button">
                Agregar archivo
                <input type="file" multiple onChange={handleFileSelection(setMemberFiles)} />
              </label>
              {!!memberFiles.length && (
                <div className="portal-upload-list">
                  {memberFiles.map((fileName) => (
                    <small key={fileName}>{fileName}</small>
                  ))}
                </div>
              )}
            </div>
            <div className="portal-action-buttons align-start portal-span-full">
              <button type="button" className="portal-mini-button" onClick={createReceptionAccount}>
                Crear cuenta y acceso
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="portal-panel">
        <div className="portal-panel-head">
          <strong>Datos legales del gimnasio</strong>
          <small>Alta comercial y documentación para sumarse a la plataforma</small>
        </div>
        <div className="portal-class-form portal-intake-grid">
          <label className="portal-note-field">
            <span>Nombre comercial</span>
            <input type="text" value={gymLegalForm.gymBrand} onChange={handleGymLegalFieldChange('gymBrand')} />
          </label>
          <label className="portal-note-field">
            <span>Razón social</span>
            <input type="text" value={gymLegalForm.legalName} onChange={handleGymLegalFieldChange('legalName')} />
          </label>
          <label className="portal-note-field">
            <span>CUIT</span>
            <input type="text" value={gymLegalForm.cuit} onChange={handleGymLegalFieldChange('cuit')} />
          </label>
          <label className="portal-note-field">
            <span>Domicilio legal</span>
            <input type="text" value={gymLegalForm.legalAddress} onChange={handleGymLegalFieldChange('legalAddress')} />
          </label>
          <label className="portal-note-field">
            <span>Ciudad</span>
            <input type="text" value={gymLegalForm.city} onChange={handleGymLegalFieldChange('city')} />
          </label>
          <label className="portal-note-field">
            <span>Provincia</span>
            <input type="text" value={gymLegalForm.province} onChange={handleGymLegalFieldChange('province')} />
          </label>
          <label className="portal-note-field">
            <span>Responsable</span>
            <input type="text" value={gymLegalForm.responsibleName} onChange={handleGymLegalFieldChange('responsibleName')} />
          </label>
          <label className="portal-note-field">
            <span>Cargo</span>
            <input type="text" value={gymLegalForm.responsibleRole} onChange={handleGymLegalFieldChange('responsibleRole')} />
          </label>
          <label className="portal-note-field">
            <span>Email legal</span>
            <input type="email" value={gymLegalForm.responsibleEmail} onChange={handleGymLegalFieldChange('responsibleEmail')} />
          </label>
          <label className="portal-note-field">
            <span>Teléfono legal</span>
            <input type="text" value={gymLegalForm.responsiblePhone} onChange={handleGymLegalFieldChange('responsiblePhone')} />
          </label>
          <div className="portal-upload-group portal-span-full">
            <span>Documentación</span>
            <div className="portal-upload-actions">
              <label className="portal-upload-button">
                Agregar archivo
                <input type="file" multiple onChange={handleFileSelection(setGymFiles)} />
              </label>
            </div>
            {!!gymFiles.length && (
              <div className="portal-upload-list">
                {gymFiles.map((fileName) => (
                  <small key={fileName}>{fileName}</small>
                ))}
              </div>
            )}
          </div>
        </div>
        {intakeStatus && <div className="portal-inline-feedback">{intakeStatus}</div>}
      </section>
      </>
      )}

      {activeSection === 'tasks' && (
      <section className="portal-content-grid" id="reception-tasks">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Historial de accesos</strong>
            <small>Últimos intentos por QR</small>
          </div>
          <div className="portal-action-list">
            {accessEvents.map((event) => (
              <div key={event.id} className="portal-action-item">
                <div>
                  <strong>{event.member}</strong>
                  <p>{event.time} · {event.location}</p>
                </div>
                <span className={`portal-status-badge ${event.result === 'allowed' ? 'success' : 'danger'}`}>
                  {event.detail}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel" id="reception-tasks">
          <div className="portal-panel-head">
            <strong>Tareas de recepción</strong>
            <small>Más orden para el turno</small>
          </div>
          <div className="portal-action-list">
            {staffTasks.map((task) => (
              <div key={task.id} className="portal-action-item">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.area} · prioridad {task.priority}</p>
                </div>
                <button type="button" className={task.status === 'done' ? 'portal-mini-button dark' : 'portal-mini-button'} onClick={() => toggleTask(task.id)}>
                  {task.status === 'done' ? 'Hecha' : 'Marcar hecha'}
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      )}
    </>
  );
}

function CleaningPortalContent({ activeSection = 'overview' }) {
  const [tasks, setTasks] = useState(cleaningTasksSeed);
  const [storeCatalog, setStoreCatalog] = useState(productCatalogSeed);
  const [supplies, setSupplies] = useState(cleaningSuppliesSeed);
  const [incidents, setIncidents] = useState(cleaningIncidentsSeed);

  const pendingTasks = tasks.filter((item) => item.status !== 'done');
  const openIncidents = incidents.filter((item) => item.status === 'open');
  const lowStoreStock = storeCatalog.filter((item) => item.stock <= 15);
  const lowSupplyStock = supplies.filter((item) => item.stock <= 6);

  const markTaskDone = (taskId) => {
    setTasks((current) => current.map((item) => (item.id === taskId ? { ...item, status: 'done' } : item)));
  };

  const restockStoreItem = (productId) => {
    setStoreCatalog((current) =>
      current.map((item) => (item.id === productId ? { ...item, stock: item.stock + 8 } : item)),
    );
  };

  const restockSupply = (supplyId) => {
    setSupplies((current) =>
      current.map((item) =>
        item.id === supplyId ? { ...item, stock: item.stock + item.restockSize } : item,
      ),
    );
  };

  const resolveIncident = (incidentId) => {
    setIncidents((current) =>
      current.map((item) => (item.id === incidentId ? { ...item, status: 'resolved' } : item)),
    );
  };

  const summary = [
    { icon: ShieldCheck, value: `${pendingTasks.length}`, label: 'tareas pendientes', detail: 'Checklist del turno actual' },
    { icon: Wallet, value: `${lowStoreStock.length}`, label: 'productos por reponer', detail: 'Stock de tienda bajo' },
    { icon: CheckCircle2, value: `${lowSupplyStock.length}`, label: 'insumos críticos', detail: 'Reposición de limpieza' },
  ];

  return (
    <>
      <PortalSummaryCards items={summary} />

      {activeSection === 'overview' && (
      <section className="portal-owner-overview" id="cleaning-overview">
        <article className="portal-panel portal-owner-finance">
          <div className="portal-panel-head">
            <strong>Checklist operativo</strong>
            <small>Estado general del turno</small>
          </div>

          <div className="portal-finance-grid">
            <div className="portal-finance-card emphasis">
              <small>Tareas abiertas</small>
              <strong>{pendingTasks.length}</strong>
              <span>{tasks.length - pendingTasks.length} tareas ya quedaron cerradas en este turno.</span>
            </div>
            <div className="portal-finance-card">
              <small>Incidencias activas</small>
              <strong>{openIncidents.length}</strong>
              <span>Incluye alertas de baños, recepción y estaciones de sanitización.</span>
            </div>
            <div className="portal-finance-card">
              <small>Stock total vigilado</small>
              <strong>{storeCatalog.length + supplies.length}</strong>
              <span>Tienda y limpieza centralizados en el mismo panel.</span>
            </div>
          </div>
        </article>

        <article className="portal-panel portal-owner-chart">
          <div className="portal-panel-head">
            <strong>Alertas del turno</strong>
            <small>Lo que conviene resolver hoy</small>
          </div>
          <div className="portal-action-list">
            {openIncidents.map((incident) => (
              <div key={incident.id} className="portal-action-item">
                <div>
                  <strong>{incident.area}</strong>
                  <p>{incident.issue}</p>
                </div>
                <button type="button" className="portal-mini-button dark" onClick={() => resolveIncident(incident.id)}>
                  Resolver
                </button>
              </div>
            ))}
            {!openIncidents.length && <div className="portal-empty-state">No hay incidencias abiertas en este momento.</div>}
          </div>
        </article>
      </section>
      )}

      {activeSection === 'checklist' && (
      <section className="portal-content-grid">
        <article className="portal-panel" id="cleaning-checklist">
          <div className="portal-panel-head">
            <strong>Limpieza por zonas</strong>
            <small>Checklist del día</small>
          </div>
          <div className="portal-action-list">
            {tasks.map((task) => (
              <div key={task.id} className="portal-action-item">
                <div>
                  <strong>{task.zone}</strong>
                  <p>
                    {task.task} · prioridad {task.priority}
                  </p>
                </div>
                {task.status === 'done' ? (
                  <span className="portal-status-badge success">Hecho</span>
                ) : (
                  <button type="button" className="portal-mini-button" onClick={() => markTaskDone(task.id)}>
                    Marcar hecho
                  </button>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel" id="cleaning-stock">
          <div className="portal-panel-head">
            <strong>Stock de tienda</strong>
            <small>Productos en mostrador</small>
          </div>
          <div className="portal-action-list">
            {storeCatalog.map((product) => (
              <div key={product.id} className="portal-action-item">
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.category} · stock {product.stock}
                  </p>
                </div>
                <button type="button" className="portal-mini-button dark" onClick={() => restockStoreItem(product.id)}>
                  Reponer
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      )}

      {activeSection === 'stock' && (
      <section className="portal-content-grid">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Stock de limpieza</strong>
            <small>Insumos y consumibles</small>
          </div>
          <div className="portal-action-list">
            {supplies.map((item) => (
              <div key={item.id} className="portal-action-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.category} · {item.stock} {item.unit}
                  </p>
                </div>
                <button type="button" className="portal-mini-button dark" onClick={() => restockSupply(item.id)}>
                  Reponer
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Notas del área</strong>
            <small>Resumen operativo</small>
          </div>
          <div className="portal-inside-stack">
            <div className="portal-qr-card">
              <ShieldCheck size={28} />
              <div>
                <strong>Control del cierre nocturno</strong>
                <p>Antes de cerrar, revisa vestuarios, estaciones de sanitización y reposición rápida en recepción.</p>
              </div>
            </div>
            <ul className="portal-task-list">
              <li>
                <CheckCircle2 size={16} />
                Tienda y limpieza comparten visibilidad de stock en este rol.
              </li>
              <li>
                <CheckCircle2 size={16} />
                Reponer insumos críticos evita reclamos durante clases pico.
              </li>
              <li>
                <CheckCircle2 size={16} />
                Las incidencias resueltas quedan listas para el próximo turno.
              </li>
            </ul>
          </div>
        </article>
      </section>
      )}
    </>
  );
}

function CoachPortalContent({ routinesByAthlete, onAddExercise, onUpdateExercise, onRemoveExercise, activeSection = 'overview' }) {
  const [roster, setRoster] = useState(coachRosterSeed);
  const [classes, setClasses] = useState(classCatalogSeed);
  const [selectedAthleteId, setSelectedAthleteId] = useState(() => coachRosterSeed.find((item) => item.present)?.id ?? coachRosterSeed[0].id);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [newClass, setNewClass] = useState({
    type: classTypeOptions[0],
    customName: getActivityOptions(classTypeOptions[0])[0],
    coach: 'Valentina Ruiz',
    schedule: 'Nuevo horario',
    room: 'Sala a definir',
    capacity: '12',
  });

  const selectedDayPlan = coachDayPlans.find((item) => item.dayOffset === selectedDayOffset) ?? coachDayPlans[0];
  const dayRoster = roster.filter((item) => selectedDayPlan.rosterIds.includes(item.id));
  const liveAthletes = roster.filter((item) => item.present);

  const visibleRoster = dayRoster.filter((item) => {
    if (attendanceFilter === 'present') return item.present;
    if (attendanceFilter === 'absent') return !item.present;
    return true;
  });

  const selectedAthlete = roster.find((item) => item.id === selectedAthleteId) ?? liveAthletes[0] ?? dayRoster[0] ?? roster[0];
  const presentCount = dayRoster.filter((item) => item.present).length;
  const pendingFollowUps = dayRoster.filter((item) => !item.present).length;
  const selectedRoutine = routinesByAthlete[selectedAthleteId] ?? [];
  const newClassNameOptions = getActivityOptions(newClass.type);

  useEffect(() => {
    if (liveAthletes.length && !liveAthletes.some((item) => item.id === selectedAthleteId)) {
      setSelectedAthleteId(liveAthletes[0].id);
    }
  }, [liveAthletes, selectedAthleteId]);

  const toggleAttendance = (athleteId) => {
    setRoster((current) =>
      current.map((item) => (item.id === athleteId ? { ...item, present: !item.present } : item)),
    );
  };

  const updateNote = (event) => {
    const nextNote = event.target.value;
    setRoster((current) =>
      current.map((item) => (item.id === selectedAthleteId ? { ...item, note: nextNote } : item)),
    );
  };

  const updatePhoto = (value) => {
    setRoster((current) =>
      current.map((item) => (item.id === selectedAthleteId ? { ...item, photo: value } : item)),
    );
  };

  const handleNewClassTypeChange = (value) => {
    const nextOptions = getActivityOptions(value);
    setNewClass((current) => ({
      ...current,
      type: value,
      customName: nextOptions[0] ?? '',
    }));
  };

  const handleRoutineTypeChange = (exerciseId, value) => {
    const nextOptions = getActivityOptions(value);
    onUpdateExercise(selectedAthleteId, exerciseId, 'type', value);
    onUpdateExercise(selectedAthleteId, exerciseId, 'exercise', nextOptions[0] ?? 'Actividad general');
  };

  const addClass = () => {
    if (!newClass.customName.trim()) return;
    setClasses((current) => [
      {
        id: `class-${Date.now()}`,
        ...newClass,
        capacity: Number(newClass.capacity) || 12,
        enrolled: 0,
      },
      ...current,
    ]);
    setNewClass((current) => ({
      ...current,
      customName: getActivityOptions(current.type)[0] ?? '',
      schedule: 'Nuevo horario',
      room: 'Sala a definir',
      capacity: '12',
    }));
  };

  const summary = [
    { icon: CalendarCheck2, value: String(classes.length), label: 'clases configuradas', detail: 'Tipos y nombres personalizados' },
    { icon: Users, value: String(presentCount), label: 'presentes marcados', detail: `${roster.length} alumnos cargados` },
    { icon: CheckCircle2, value: String(pendingFollowUps), label: 'seguimientos pendientes', detail: 'Necesitan contacto' },
  ];

  return (
    <>
      <PortalSummaryCards items={summary} />

      {(activeSection === 'attendance' || activeSection === 'followup') && (
      <section className="portal-toolbar">
        <div className="portal-day-switcher">
          <button type="button" className="portal-icon-button" onClick={() => setSelectedDayOffset((current) => Math.min(current + 1, 2))}>
            <ArrowLeft size={16} />
          </button>
          <div className="portal-day-label">
            <strong>{selectedDayPlan.label}</strong>
            <small>{selectedDayPlan.focus}</small>
          </div>
          <button type="button" className="portal-icon-button" onClick={() => setSelectedDayOffset((current) => Math.max(current - 1, 0))} disabled={selectedDayOffset === 0}>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="portal-filter-row single">
          <label className="portal-select-field">
            <span>Asistencia</span>
            <select value={attendanceFilter} onChange={(event) => setAttendanceFilter(event.target.value)}>
              <option value="all">Todos</option>
              <option value="present">Presentes</option>
              <option value="absent">Ausentes</option>
            </select>
          </label>
        </div>
      </section>
      )}

      {activeSection === 'attendance' && (
      <section className="portal-content-grid" id="coach-attendance">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Lista del turno</strong>
            <small>Pasa asistencia</small>
          </div>
          <div className="portal-action-list">
            {visibleRoster.map((athlete) => (
              <button
                key={athlete.id}
                type="button"
                className={`portal-action-item selectable ${selectedAthleteId === athlete.id ? 'selected' : ''}`}
                onClick={() => setSelectedAthleteId(athlete.id)}
              >
                <div className="portal-person-row">
                  <ProfileAvatar name={athlete.name} photo={athlete.photo} />
                  <div>
                    <strong>{athlete.name}</strong>
                    <p>{athlete.goal}</p>
                  </div>
                </div>
                <div className="portal-action-buttons">
                  <a
                    className="portal-whatsapp-button"
                    href={buildWhatsAppUrl(athlete.phone, `Hola ${athlete.name}, te escribo desde ${CLIENT_NAME} para revisar tu avance de ${athlete.goal.toLowerCase()}.`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    WhatsApp
                  </a>
                  <span className={`portal-status-badge ${athlete.present ? 'success' : 'muted'}`}>
                    {athlete.present ? 'Presente' : 'Ausente'}
                  </span>
                </div>
              </button>
            ))}
            {!visibleRoster.length && <div className="portal-empty-state">No hay alumnos para ese filtro en este día.</div>}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Seguimiento del alumno</strong>
            <small>{selectedAthlete.name}</small>
          </div>
          <div className="portal-inside-stack">
            <div className="portal-profile-head compact">
              <ProfileAvatar name={selectedAthlete.name} photo={selectedAthlete.photo} size="lg" />
              <div>
                <strong>{selectedAthlete.name}</strong>
                <p>{selectedAthlete.goal}</p>
              </div>
            </div>
            <div className="portal-coach-meta">
              <span>Objetivo: {selectedAthlete.goal}</span>
              <div className="portal-action-buttons">
                <a
                  className="portal-whatsapp-button"
                  href={buildWhatsAppUrl(selectedAthlete.phone, `Hola ${selectedAthlete.name}, te escribo desde ${CLIENT_NAME} para seguir tu progreso de ${selectedAthlete.goal.toLowerCase()}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                <button type="button" className="portal-mini-button" onClick={() => toggleAttendance(selectedAthlete.id)}>
                  {selectedAthlete.present ? 'Marcar ausente' : 'Marcar presente'}
                </button>
              </div>
            </div>
            <label className="portal-note-field">
              <span>Nota del coach</span>
              <textarea rows={5} value={selectedAthlete.note} onChange={updateNote} />
            </label>
            <label className="portal-note-field">
              <span>Foto de perfil (URL)</span>
              <input type="url" value={selectedAthlete.photo} onChange={(event) => updatePhoto(event.target.value)} placeholder="https://..." />
            </label>
          </div>
        </article>
      </section>
      )}

      {activeSection === 'overview' && (
      <section className="portal-content-grid" id="coach-overview">
        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Clases del gimnasio</strong>
            <small>Mejor organizadas por tipo, nombre y sala</small>
          </div>
          <div className="portal-class-list">
            {classes.map((item) => (
              <div key={item.id} className="portal-class-card">
                <small>{item.type}</small>
                <strong>{item.customName}</strong>
                <p>{item.coach} · {item.schedule}</p>
                <span>{item.room} · {item.enrolled}/{item.capacity} lugares</span>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <div className="portal-panel-head">
            <strong>Agregar clase</strong>
            <small>Guarda tipo y actividad desde opciones comunes</small>
          </div>
          <div className="portal-class-form">
            <label className="portal-note-field">
              <span>Tipo</span>
              <select value={newClass.type} onChange={(event) => handleNewClassTypeChange(event.target.value)}>
                {classTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="portal-note-field">
              <span>Nombre de la actividad</span>
              <select value={newClass.customName} onChange={(event) => setNewClass((current) => ({ ...current, customName: event.target.value }))}>
                {newClassNameOptions.map((activity) => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </label>
            <label className="portal-note-field">
              <span>Horario</span>
              <input type="text" value={newClass.schedule} onChange={(event) => setNewClass((current) => ({ ...current, schedule: event.target.value }))} />
            </label>
            <label className="portal-note-field">
              <span>Sala</span>
              <input type="text" value={newClass.room} onChange={(event) => setNewClass((current) => ({ ...current, room: event.target.value }))} />
            </label>
            <button type="button" className="portal-mini-button" onClick={addClass}>
              Guardar clase
            </button>
          </div>
        </article>
      </section>
      )}

      {activeSection === 'followup' && (
      <section className="portal-panel" id="coach-followup">
        <div className="portal-panel-head">
          <strong>Armado de rutina en vivo</strong>
          <small>{selectedAthlete.name}</small>
        </div>
        <div className="portal-class-form">
          <label className="portal-note-field">
            <span>Alumno en vivo</span>
            <select value={selectedAthleteId} onChange={(event) => setSelectedAthleteId(event.target.value)} disabled={!liveAthletes.length}>
              {liveAthletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
              ))}
            </select>
          </label>
        </div>
        {!liveAthletes.length && <div className="portal-empty-state">No hay alumnos presentes en el gimnasio ahora mismo.</div>}
        <div className="portal-routine-list editable">
          {selectedRoutine.map((exercise) => (
            <div key={exercise.id} className="portal-routine-editor">
              <select
                value={exercise.type ?? classTypeOptions[0]}
                onChange={(event) => handleRoutineTypeChange(exercise.id, event.target.value)}
              >
                {classTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={exercise.exercise}
                onChange={(event) => onUpdateExercise(selectedAthleteId, exercise.id, 'exercise', event.target.value)}
              >
                {getActivityOptions(exercise.type ?? classTypeOptions[0]).map((activity) => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
              <input
                type="text"
                value={exercise.sets}
                onChange={(event) => onUpdateExercise(selectedAthleteId, exercise.id, 'sets', event.target.value)}
                placeholder="Series"
              />
              <input
                type="text"
                value={exercise.reps}
                onChange={(event) => onUpdateExercise(selectedAthleteId, exercise.id, 'reps', event.target.value)}
                placeholder="Reps"
              />
              <input
                type="text"
                value={exercise.rest}
                onChange={(event) => onUpdateExercise(selectedAthleteId, exercise.id, 'rest', event.target.value)}
                placeholder="Descanso"
              />
              <button type="button" className="portal-mini-button dark" onClick={() => onRemoveExercise(selectedAthleteId, exercise.id)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="portal-mini-button" onClick={() => onAddExercise(selectedAthleteId)} disabled={!selectedAthlete}>
          Agregar ejercicio
        </button>
      </section>
      )}

      {activeSection === 'followup' && (
      <section className="portal-role-grid">
        <article className="portal-insight-card primary">
          <small>Atención</small>
          <strong>Adherencia a revisar</strong>
          <p>Hay {pendingFollowUps} alumnos con ausencias recientes. Conviene escribirles hoy mismo.</p>
        </article>
        <article className="portal-insight-card">
          <small>Checklist</small>
          <strong>Bloque de la tarde listo</strong>
          <p>QR activo, sala confirmada y equipamiento completo para la clase de funcional.</p>
        </article>
      </section>
      )}
    </>
  );
}

function ClientPortal({
  role,
  onLogout,
  onBackToSite,
  routinesByAthlete,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  chatMessages,
  chatDraft,
  onChatDraftChange,
  onSendChatMessage,
  leadRequests,
}) {
  const roleMeta = portalRoleMap[role];
  const overview = portalOverview[role];

  const portalLinkMap = {
    member: [
      { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, page: 'dashboard', sectionId: 'member-overview' },
      { id: 'nutrition', label: 'Nutrición', icon: HeartHandshake, page: 'nutrition' },
      { id: 'reservations', label: 'Reservas', icon: CalendarCheck2, page: 'dashboard', sectionId: 'member-reservations' },
    ],
    owner: [
      { id: 'overview', label: overview.sideLinks[0], icon: LayoutDashboard, sectionId: 'owner-overview' },
      { id: 'cash', label: overview.sideLinks[1], icon: CalendarCheck2, sectionId: 'owner-cash' },
      { id: 'tasks', label: overview.sideLinks[2], icon: Users, sectionId: 'owner-tasks' },
    ],
    coach: [
      { id: 'overview', label: overview.sideLinks[0], icon: LayoutDashboard, sectionId: 'coach-overview' },
      { id: 'attendance', label: overview.sideLinks[1], icon: CalendarCheck2, sectionId: 'coach-attendance' },
      { id: 'followup', label: overview.sideLinks[2], icon: Users, sectionId: 'coach-followup' },
    ],
    reception: [
      { id: 'overview', label: overview.sideLinks[0], icon: LayoutDashboard, sectionId: 'reception-overview' },
      { id: 'intake', label: 'Altas y pruebas', icon: CalendarCheck2, sectionId: 'reception-intake' },
      { id: 'tasks', label: overview.sideLinks[2], icon: Users, sectionId: 'reception-tasks' },
    ],
    cleaning: [
      { id: 'overview', label: overview.sideLinks[0], icon: LayoutDashboard, sectionId: 'cleaning-overview' },
      { id: 'checklist', label: overview.sideLinks[1], icon: CalendarCheck2, sectionId: 'cleaning-checklist' },
      { id: 'stock', label: overview.sideLinks[2], icon: Users, sectionId: 'cleaning-stock' },
    ],
  };
  const portalLinks = portalLinkMap[role] ?? [];
  const [memberPage, setMemberPage] = useState(() => (portalLinks[0]?.page ?? 'dashboard'));
  const [activePortalLink, setActivePortalLink] = useState(() => portalLinks[0]?.id ?? 'overview');
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(true);

  useEffect(() => {
    setActivePortalLink(portalLinks[0]?.id ?? 'overview');
    if (role === 'member') {
      setMemberPage(portalLinks[0]?.page ?? 'dashboard');
    }
  }, [role]);

  const openMemberPage = (page, activeLinkId = page) => {
    setMemberPage(page);
    setActivePortalLink(activeLinkId);
  };

  const handlePortalNavigation = (link) => {
    setActivePortalLink(link.id);
    if (role === 'member') {
      setMemberPage(link.page);
    }
    if (link.sectionId) {
      scrollToElementId(link.sectionId);
    }
  };

  const renderRoleContent = () => {
    if (role === 'member') {
      if (memberPage === 'nutrition') return <MemberNutritionPage />;
      return (
        <MemberPortalContent
          routine={routinesByAthlete['ath-1'] ?? []}
          onOpenNutritionPage={() => openMemberPage('nutrition')}
          memberProfile={memberDirectorySeed[0]}
          activeSection={activePortalLink}
        />
      );
    }
    if (role === 'owner') return <OwnerPortalContent leadRequests={leadRequests} activeSection={activePortalLink} />;
    if (role === 'reception') return <ReceptionPortalContent leadRequests={leadRequests} activeSection={activePortalLink} />;
    if (role === 'cleaning') return <CleaningPortalContent activeSection={activePortalLink} />;
    return (
      <CoachPortalContent
        routinesByAthlete={routinesByAthlete}
        onAddExercise={onAddExercise}
        onUpdateExercise={onUpdateExercise}
        onRemoveExercise={onRemoveExercise}
        activeSection={activePortalLink}
      />
    );
  };
  const showInternalChat = role === 'owner' || role === 'coach';

  return (
    <div className="client-site portal-mode">
      <div className="client-demo-bar">
        <button type="button" onClick={onBackToSite}>
          <ArrowLeft size={16} />
          Volver al sitio
        </button>
        <span>Portal interno de {CLIENT_NAME}</span>
      </div>

      <section className="portal-shell">
        <aside className="portal-sidebar">
          <div className="portal-brand-card">
            <div className="client-brand client-brand-logo">
              <img src={CLIENT_LOGO_URL} alt={`${CLIENT_NAME} logo`} />
            </div>
            <span className="portal-role-chip">{roleMeta.label}</span>
            <strong>{roleMeta.title}</strong>
            <p>{roleMeta.description}</p>
          </div>

          <div className="portal-side-group">
            <button type="button" className="portal-side-toggle" onClick={() => setSidebarMenuOpen((current) => !current)}>
              <span>Sectores del panel</span>
              <ChevronDown size={16} className={sidebarMenuOpen ? 'is-open' : ''} />
            </button>
            {sidebarMenuOpen && (
              <div className="portal-side-links">
                {portalLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.id}
                      type="button"
                      className={`portal-side-link ${activePortalLink === link.id ? 'active' : ''}`}
                      onClick={() => handlePortalNavigation(link)}
                    >
                      <Icon size={16} />
                      {link.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="portal-side-note">
            <small>Modo demo</small>
            <p>Usa otro rol para ver cómo cambia la experiencia según el tipo de usuario.</p>
          </div>

          <button type="button" className="portal-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </aside>

        <main className="portal-main">
          <header className="portal-header">
            <div>
              <span className="client-kicker">Dashboard</span>
              <h1>{role === 'member' && memberPage === 'nutrition' ? 'Tu página de nutrición' : overview.greeting}</h1>
              <p>
                {role === 'member' && memberPage === 'nutrition'
                  ? 'Revisa tu objetivo, progreso corporal, peso meta y las variantes del plan según el resultado que buscas.'
                  : overview.subtitle}
              </p>
            </div>
            <div className="portal-header-actions">
              {role === 'member' && memberPage === 'nutrition' && (
                <button type="button" className="client-secondary-button" onClick={() => openMemberPage('dashboard', portalLinks[0]?.id ?? 'dashboard')}>
                  Volver al panel
                </button>
              )}
              <button type="button" className="client-secondary-button" onClick={onBackToSite}>
                Ver sitio público
              </button>
              <button type="button" className="client-primary-button" onClick={onLogout}>
                Cambiar rol
              </button>
            </div>
          </header>
          {renderRoleContent()}
          {showInternalChat && (
            <PortalChat
              role={role}
              messages={chatMessages}
              draftMessage={chatDraft}
              onDraftChange={onChatDraftChange}
              onSendMessage={onSendChatMessage}
            />
          )}
        </main>
      </section>
    </div>
  );
}

function GymClientDemo({ onBack }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [credentials, setCredentials] = useState(() => ({
    email: portalRoles[0].email,
    password: portalRoles[0].password,
  }));
  const [loginError, setLoginError] = useState('');
  const [loggedRole, setLoggedRole] = useState(null);
  const [routinesByAthlete, setRoutinesByAthlete] = useState(routinesSeed);
  const [chatMessages, setChatMessages] = useState(chatSeed);
  const [chatDraft, setChatDraft] = useState('');
  const [leadRequests, setLeadRequests] = useState([
    {
      id: 'lead-1',
      name: 'Sofía Benítez',
      email: 'sofia.benitez@email.com',
      phone: '5491150010042',
      preferredChannel: 'WhatsApp',
      goal: 'Quiero coordinar una clase de prueba de funcional esta semana.',
    },
  ]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredChannel: 'WhatsApp',
    goal: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLeadRequests((current) => [
      {
        id: `lead-${Date.now()}`,
        ...contactForm,
      },
      ...current,
    ]);
    setSent(true);
    setSelectedPlan('');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      preferredChannel: 'WhatsApp',
      goal: '',
    });
    window.setTimeout(() => setSent(false), 4000);
  };

  const handleContactFieldChange = (field) => (event) => {
    setContactForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleClientNavigation = (sectionId) => {
    setMenuOpen(false);
    scrollToElementId(sectionId);
  };

  const handlePlanInterest = (planName) => {
    setSelectedPlan(planName);
    handleClientNavigation('client-contacto');
  };

  const handleRoleSelect = (roleId) => {
    const role = portalRoleMap[roleId];
    setSelectedRole(roleId);
    setCredentials({ email: role.email, password: role.password });
    setLoginError('');
  };

  const handlePortalInputChange = (field) => (event) => {
    setCredentials((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePortalLogin = (event) => {
    event.preventDefault();
    const role = portalRoleMap[selectedRole];
    const emailMatches = credentials.email.trim().toLowerCase() === role.email;
    const passwordMatches = credentials.password === role.password;

    if (!emailMatches || !passwordMatches) {
      setLoginError(`Usa el acceso demo de ${role.label.toLowerCase()}: ${role.email} / ${role.password}`);
      return;
    }

    setLoginError('');
    setLoggedRole(selectedRole);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentRole = portalRoleMap[selectedRole];

  const handleAddExercise = (athleteId) => {
    setRoutinesByAthlete((current) => {
      const routine = current[athleteId] ?? [];
      return {
        ...current,
        [athleteId]: [
          ...routine,
          {
            id: `rt-${Date.now()}-${routine.length}`,
            type: classTypeOptions[0],
            exercise: getActivityOptions(classTypeOptions[0])[0],
            sets: '3',
            reps: '12',
            rest: '60s',
          },
        ],
      };
    });
  };

  const handleUpdateExercise = (athleteId, exerciseId, field, value) => {
    setRoutinesByAthlete((current) => ({
      ...current,
      [athleteId]: (current[athleteId] ?? []).map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise,
      ),
    }));
  };

  const handleRemoveExercise = (athleteId, exerciseId) => {
    setRoutinesByAthlete((current) => ({
      ...current,
      [athleteId]: (current[athleteId] ?? []).filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const handleSendChatMessage = () => {
    const text = chatDraft.trim();
    if (!text || !['owner', 'coach'].includes(currentRole.id)) return;

    setChatMessages((current) => [
      ...current,
      {
        id: `msg-${Date.now()}`,
        author: currentRole.id === 'member' ? 'Martina López' : currentRole.id === 'owner' ? 'Andrés' : 'Valentina Ruiz',
        role: currentRole.id,
        text,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatDraft('');
  };

  const handlePortalLogout = () => {
    setLoggedRole(null);
  };

  const handleBackToPublicSite = () => {
    setLoggedRole(null);
    scrollToElementId('client-portal');
  };

  if (loggedRole) {
    return (
      <ClientPortal
        role={loggedRole}
        onLogout={handlePortalLogout}
        onBackToSite={handleBackToPublicSite}
        routinesByAthlete={routinesByAthlete}
        onAddExercise={handleAddExercise}
        onUpdateExercise={handleUpdateExercise}
        onRemoveExercise={handleRemoveExercise}
        chatMessages={chatMessages}
        chatDraft={chatDraft}
        onChatDraftChange={setChatDraft}
        onSendChatMessage={handleSendChatMessage}
        leadRequests={leadRequests}
      />
    );
  }

  return (
    <div className="client-site">
      <div className="client-demo-bar">
        <button type="button" onClick={onBack}>
          <ArrowLeft size={16} />
          Volver a portada
        </button>
        <span>Muestra oficial del gimnasio cliente</span>
      </div>

      <nav className="client-nav">
        <div className="client-container client-nav-inner">
          <div className="client-brand client-brand-logo">
            <img src={CLIENT_LOGO_URL} alt={`${CLIENT_NAME} logo`} />
          </div>

          <button type="button" className="client-menu-button" onClick={() => setMenuOpen((value) => !value)}>
            <Menu size={20} />
          </button>

          <div className={`client-links ${menuOpen ? 'open' : ''}`}>
            <button type="button" className="client-nav-link" onClick={() => handleClientNavigation('client-inicio')}>Inicio</button>
            <button type="button" className="client-nav-link" onClick={() => handleClientNavigation('client-clases')}>Clases</button>
            <button type="button" className="client-nav-link" onClick={() => handleClientNavigation('client-planes')}>Planes</button>
            <button type="button" className="client-nav-link" onClick={() => handleClientNavigation('client-portal')}>Portal</button>
            <button type="button" className="client-nav-link" onClick={() => handleClientNavigation('client-contacto')}>Contacto</button>
            <button type="button" className="client-nav-cta" onClick={() => handleClientNavigation('client-contacto')}>Clase gratis</button>
          </div>
        </div>
      </nav>

      <main>
        <section className="client-hero" id="client-inicio">
          <div className="client-container client-hero-grid">
            <div className="client-hero-copy">
              <span className="client-kicker">Entrenamiento real para personas reales</span>
              <h1>
                Tu mejor versión
                <span>empieza aquí</span>
              </h1>
              <p>
                {CLIENT_NAME} es un gimnasio pensado para fuerza, recomposición corporal y constancia. Entrena con acompañamiento,
                clases dinámicas y una comunidad que te ayuda a sostener resultados.
              </p>
              <div className="client-hero-actions">
                <button type="button" className="client-primary-button" onClick={() => handleClientNavigation('client-planes')}>
                  Ver planes
                </button>
                <button type="button" className="client-secondary-button" onClick={() => handleClientNavigation('client-clases')}>
                  Ver clases
                </button>
                <button type="button" className="client-secondary-button" onClick={() => handleClientNavigation('client-portal')}>
                  Ingresar al portal
                </button>
              </div>
            </div>

            <div className="client-hero-visual">
              <img src={heroImage} alt="Entrenamiento en Volt Forge" />
              <div className="client-hero-badge">
                <strong>+1200</strong>
                <span>socios activos</span>
              </div>
            </div>
          </div>
        </section>

        <section className="client-benefits">
          <div className="client-container client-benefits-grid">
            {clientBenefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="client-benefit-card">
                <Icon size={22} />
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="client-story client-container">
          <div className="client-story-copy">
            <span className="client-kicker">Por qué nos eligen</span>
            <h2>Un espacio que mezcla entrenamiento serio, seguimiento y una experiencia moderna.</h2>
            <p>
              Aquí no vienes solo a usar máquinas. Vienes a construir hábitos, mejorar tu técnica y sentir que estás
              en un lugar donde entrenar de verdad es más fácil.
            </p>
          </div>
          <div className="client-story-media">
            <img src={gymSpaceImage} alt="Espacio principal del gimnasio" />
          </div>
        </section>

        <section className="client-classes client-container" id="client-clases">
          <div className="client-section-head">
            <div>
              <span className="client-kicker">Clases y horarios</span>
              <h2>Elige cómo quieres entrenar.</h2>
            </div>
            <p>Desde sala guiada hasta recovery, con profes que te acompañan en cada etapa.</p>
          </div>

          <div className="client-classes-grid">
            <article className="client-class-feature">
              <img src={trainingImage} alt="Clase de alta intensidad" />
              <div>
                <strong>Entrenamiento funcional</strong>
                <p>Sesiones intensas para mejorar fuerza, cardio y movilidad en bloques de 45 minutos.</p>
              </div>
            </article>

            <div className="client-class-list">
              {clientClasses.map((item) => (
                <article key={item.name} className="client-class-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.coach}</span>
                  </div>
                  <small>{item.time}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="client-memberships client-container" id="client-planes">
          <div className="client-section-head">
            <div>
              <span className="client-kicker">Membresías</span>
              <h2>Planes simples para sostener resultados.</h2>
            </div>
            <p>Sin vueltas, con una propuesta clara para cada nivel de compromiso.</p>
          </div>

          <div className="client-memberships-grid">
            {clientMemberships.map((plan) => (
              <article key={plan.name} className={`client-membership-card ${plan.featured ? 'featured' : ''}`}>
                <strong>{plan.name}</strong>
                <div className="client-membership-price">
                  <span>{plan.price}</span>
                  <small>/ mes</small>
                </div>
                <p>{plan.text}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => handlePlanInterest(plan.name)}>
                  {plan.featured ? 'Quiero este plan' : 'Solicitar info'}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="client-access client-container" id="client-portal">
          <div className="client-section-head">
            <div>
              <span className="client-kicker">Portal interno</span>
              <h2>Un mismo gimnasio, cinco paneles distintos según quién entra.</h2>
            </div>
            <p>Elige un rol y verás un dashboard diferente para socio, administración, profesor, recepción o limpieza.</p>
          </div>

          <div className="client-access-grid">
            <div className="client-role-grid">
              {portalRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`client-role-card ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <small>{role.label}</small>
                  <strong>{role.title}</strong>
                  <p>{role.description}</p>
                </button>
              ))}
            </div>

            <form className="client-access-card" onSubmit={handlePortalLogin}>
              <div className="client-access-head">
                <span className="client-kicker">Login demo</span>
                <h3>{currentRole.title}</h3>
                <p>Credenciales precargadas para probar el flujo. Puedes cambiar de rol cuando quieras.</p>
              </div>

              <label>
                <span>Email</span>
                <input type="email" value={credentials.email} onChange={handlePortalInputChange('email')} required />
              </label>

              <label>
                <span>Contraseña</span>
                <input type="password" value={credentials.password} onChange={handlePortalInputChange('password')} required />
              </label>

              <div className="client-access-hint">
                <strong>Acceso demo:</strong> {currentRole.email} / {currentRole.password}
              </div>

              {loginError && <div className="client-form-error">{loginError}</div>}

              <button type="submit" className="client-primary-button full">
                Entrar como {currentRole.label.toLowerCase()}
              </button>
            </form>
          </div>
        </section>

        <section className="client-team client-container">
          <div className="client-team-grid">
            <img src={coachesTeamImage} alt="Equipo de coaches" />
            <div className="client-team-copy">
              <span className="client-kicker">Equipo</span>
              <h2>Coaches que enseñan, corrigen y sostienen el proceso.</h2>
              <p>
                Nuestro equipo combina fuerza, funcional, movilidad y nutrición para que no entrenes solo. Cada socio
                tiene una experiencia más acompañada y consistente.
              </p>
              <div className="client-rating-row">
                <div>
                  <strong>4.9/5</strong>
                  <span>reseñas promedio</span>
                </div>
                <div className="client-stars">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="client-faq client-container">
          <div className="client-section-head">
            <div>
              <span className="client-kicker">Preguntas frecuentes</span>
              <h2>Lo importante antes de sumarte.</h2>
            </div>
          </div>

          <div className="client-faq-list">
            {clientFaqs.map((item, index) => (
              <article key={item.question} className={`client-faq-item ${activeFaq === index ? 'open' : ''}`}>
                <button type="button" onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}>
                  <span>{item.question}</span>
                  <ChevronDown size={18} />
                </button>
                {activeFaq === index && <p>{item.answer}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="client-contact client-container" id="client-contacto">
          <div className="client-contact-card">
            <div className="client-contact-copy">
              <span className="client-kicker">Empieza hoy</span>
              <h2>Solicita una clase de prueba y ven a conocer Volt Forge.</h2>
              <div className="client-contact-points">
                <span>
                  <MapPin size={16} />
                  <a href={CLIENT_MAPS_URL} target="_blank" rel="noreferrer">
                    Ver ubicación en Google Maps
                  </a>
                </span>
                <span>
                  <Phone size={16} />
                  +54 11 4567 1200
                </span>
                <span>
                  <Mail size={16} />
                  hola@voltforge.fit
                </span>
              </div>
            </div>

            <form className="client-contact-form" onSubmit={handleSubmit}>
              {selectedPlan && <div className="client-form-success full">Interés actual: {selectedPlan}. Completa tus datos y coordinamos la propuesta.</div>}
              <label>
                <span>Nombre</span>
                <input type="text" value={contactForm.name} onChange={handleContactFieldChange('name')} placeholder="Tu nombre" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={contactForm.email} onChange={handleContactFieldChange('email')} placeholder="correo@ejemplo.com" required />
              </label>
              <label>
                <span>WhatsApp</span>
                <input type="text" value={contactForm.phone} onChange={handleContactFieldChange('phone')} placeholder="54911..." required />
              </label>
              <label>
                <span>Canal preferido</span>
                <select value={contactForm.preferredChannel} onChange={handleContactFieldChange('preferredChannel')}>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                </select>
              </label>
              <label className="full">
                <span>Objetivo</span>
                <textarea value={contactForm.goal} onChange={handleContactFieldChange('goal')} placeholder="¿Qué te gustaría lograr?" rows={4} required />
              </label>
              <button type="submit" className="client-primary-button full">
                Reservar clase gratis
              </button>
              {sent && <div className="client-form-success">Listo. Recibimos tu solicitud y te contactamos pronto.</div>}
            </form>
          </div>
        </section>
      </main>

      <footer className="client-footer">
        <div className="client-container client-footer-inner">
          <div>
            <div className="client-brand client-brand-logo footer">
              <img src={CLIENT_LOGO_URL} alt={`${CLIENT_NAME} logo`} />
            </div>
            <p>{CLIENT_NAME}: entrenamiento con orden, comunidad y una experiencia pensada para sostener resultados.</p>
          </div>
          <div className="client-footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram size={16} />
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook size={16} />
              Facebook
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube size={16} />
              YouTube
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MarketingHome({
  cursorPosition,
  scrolled,
  activeShowcase,
  setActiveShowcase,
  onOpenClientDemo,
  onExploreFinancials,
  onOpenPricing,
  onRequestDemo,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const goToPrev = () => setActiveShowcase((current) => (current - 1 + showcaseItems.length) % showcaseItems.length);
  const goToNext = () => setActiveShowcase((current) => (current + 1) % showcaseItems.length);
  const activeItem = showcaseItems[activeShowcase];
  const previewActions = { onOpenClientDemo, onExploreFinancials, onOpenPricing, onRequestDemo };
  const marketingNavLinks = [
    { label: 'Beneficios', sectionId: 'programas' },
    { label: 'Finanzas', sectionId: 'finanzas' },
    { label: 'Muestras', sectionId: 'muestras' },
    { label: 'Contacto', sectionId: 'contacto', className: 'nav-link-active' },
  ];

  const handleMobileNavigation = (sectionId) => {
    setMobileNavOpen(false);
    scrollToElementId(sectionId);
  };

  return (
    <>
      <div
        className="custom-cursor"
        aria-hidden="true"
        style={{ transform: `translate(${cursorPosition.x - 10}px, ${cursorPosition.y - 10}px)` }}
      />

      <div className="elite-page">
        <nav className={`elite-nav ${scrolled ? 'scrolled' : ''}`} id="navbar">
          <div className="elite-container elite-nav-inner">
            <div className="elite-brand">
              <div className="elite-brand-text">
                Gym<span>OS</span>
              </div>
              <Bolt size={18} strokeWidth={2.6} />
            </div>

            <div className="elite-links" aria-label="Navegación principal">
              {marketingNavLinks.map((link) => (
                <a key={link.sectionId} href={`#${link.sectionId}`} className={`nav-link ${link.className ?? ''}`.trim()}>
                  {link.label}
                </a>
              ))}
            </div>

            <button
              className="elite-menu-button"
              type="button"
              aria-label={mobileNavOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileNavOpen}
              aria-controls="elite-mobile-nav"
              onClick={() => setMobileNavOpen((current) => !current)}
            >
              <Menu size={20} />
            </button>

            <button className="btn-ronas nav-cta" type="button" onClick={onOpenClientDemo}>
              Ver sitio cliente
            </button>
          </div>

          <div id="elite-mobile-nav" className={`elite-mobile-panel ${mobileNavOpen ? 'open' : ''}`}>
            <div className="elite-mobile-links">
              {marketingNavLinks.map((link) => (
                <button
                  key={link.sectionId}
                  type="button"
                  className={`elite-mobile-link ${link.className ?? ''}`.trim()}
                  onClick={() => handleMobileNavigation(link.sectionId)}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              className="btn-ronas elite-mobile-cta"
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                onOpenClientDemo();
              }}
            >
              Ver sitio cliente
            </button>
          </div>
        </nav>

        <main>
          <section className="hero-section">
            <div className="elite-container hero-grid app-hero-grid">
              <div className="hero-copy">
                <div className="hero-intro">
                  <span className="hero-kicker">App web para gimnasios que quieren crecer</span>
                  <h1 className="text-huge app-hero-title">
                    MEJORA EL
                    <br />
                    <span className="outline-text">RENDIMIENTO</span>
                    <br />
                    FINANCIERO
                  </h1>
                </div>

                <div className="hero-actions app-hero-actions">
                  <p>
                    Convierte tu gimnasio en una operación más rentable: más retención, mejor ticket promedio, menos
                    horas perdidas en gestión y decisiones basadas en datos reales.
                  </p>
                  <div className="hero-divider" />
                  <div className="hero-cta-stack">
                    <button className="btn-ronas hero-main-cta" type="button" onClick={onOpenClientDemo}>
                      Ver muestra funcional
                    </button>
                    <button className="explore-button" type="button" onClick={onExploreFinancials}>
                      Ver cómo sube ingresos
                      <span className="explore-icon">
                        <ArrowRight size={18} />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="hero-proof-row">
                  <div className="proof-mini-card"><Gauge size={18} /><span>Control total del negocio</span></div>
                  <div className="proof-mini-card"><Wallet size={18} /><span>Más claridad financiera</span></div>
                  <div className="proof-mini-card"><Users size={18} /><span>Mejor experiencia para socios</span></div>
                </div>
              </div>

              <div className="hero-visual app-hero-visual">
                <div className="image-reveal hero-image-card">
                  <img src={gymSpaceImage} alt="Interior del gimnasio" />
                  <div className="hero-badge-card finance-badge">
                    <div className="hero-badge-number">+11%</div>
                    <div className="hero-badge-label">ticket promedio estimado</div>
                  </div>
                </div>
                <div className="hero-side-panel">
                  <strong>Lo que resuelve</strong>
                  <ul>
                    <li>Renovaciones</li>
                    <li>Asistencia</li>
                    <li>Clases</li>
                    <li>Promociones</li>
                    <li>Ingresos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="hero-background-word" aria-hidden="true">GROW</div>
          </section>

          <section className="marquee-section" aria-label="Resultados del negocio">
            <div className="marquee-track">
              {[0, 1].map((track) => (
                <div className="marquee-group" key={track} aria-hidden={track === 1}>
                  {marqueeWords.map((item) => (
                    <span key={`${track}-${item.label}`} className={`marquee-word ${item.tone}`}>{item.label}</span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="metrics-strip elite-container">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </section>

          <section className="services-section elite-container" id="programas">
            <div className="services-heading">
              <h2>TU GYM<br /><span>RINDE MÁS</span></h2>
              <p>
                Inspirado en productos como Viewstats, pero pensado para gimnasios: no solo muestra datos, te ayuda a
                convertirlos en decisiones que mejoran caja, retención y operación.
              </p>
            </div>
            <div className="services-grid">
              {valueCards.map(({ icon: Icon, title, description, tone }) => (
                <article key={title} className={`service-card tone-${tone}`}>
                  <div className="service-icon"><Icon size={36} strokeWidth={2.4} /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="service-plus"><Plus size={18} strokeWidth={2.4} /></div>
                </article>
              ))}
            </div>
          </section>
          <section className="financial-section elite-container" id="finanzas">
            <div className="financial-copy">
              <span className="section-tag"><BarChart3 size={14} />Qué vendemos</span>
              <h2>Una app web que ayuda al área administrativa del gimnasio a tomar mejores decisiones financieras.</h2>
              <p>
                En lugar de mirar solo altas y bajas, puedes entender qué planes sostienen el negocio, qué socios están
                por abandonar, qué clases convierten, qué promos funcionan y dónde se está perdiendo plata.
              </p>
            </div>
            <div className="financial-grid">
              {productBlocks.map(({ icon: Icon, title, text }) => (
                <article key={title} className="financial-card">
                  <Icon size={22} />
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="features-section elite-container" id="funciones">
            <div className="features-copy">
              <span className="section-tag"><LayoutDashboard size={14} />Funciones del sistema</span>
              <h2>Todo lo que necesita un profesional o gimnasio para vender mejor y operar con más claridad.</h2>
              <p>
                La plataforma está pensada para servir desde un entrenador independiente hasta una operación con varias
                sedes. Cambia el paquete, pero la lógica es la misma: más orden, más control y más rendimiento.
              </p>
            </div>
            <div className="feature-groups-grid">
              {featureGroups.map((group) => (
                <article key={group.title} className="feature-group-card">
                  <strong>{group.title}</strong>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="story-section elite-container">
            <div className="story-panel story-panel-dark">
              <div className="story-copy">
                <span className="section-tag dark"><TrendingUp size={14} />Retención y crecimiento</span>
                <h2>Si sabes quién está dejando de venir, puedes evitar la baja antes de perder el ingreso.</h2>
                <p>
                  La asistencia y el uso real del gimnasio son señales financieras. Con check-ins, alertas y
                  segmentación puedes intervenir antes y proteger ingresos recurrentes.
                </p>
              </div>
              <img src={memberSuccessImage} alt="Socio del gimnasio mostrando progreso" />
            </div>
            <div className="story-panel story-panel-light">
              <img src={qrAccessImage} alt="Acceso QR del gimnasio" />
              <div className="story-copy">
                <span className="section-tag"><QrCode size={14} />Operación conectada</span>
                <h2>Acceso, clases y experiencia premium en una sola capa digital.</h2>
                <p>
                  Cuando el gym se ve más ordenado y moderno, también puede cobrar mejor. QR, reservas, app y
                  contenido premium aumentan valor percibido y ayudan a vender mejores membresías.
                </p>
              </div>
            </div>
          </section>

          <section className="pricing-section elite-container" id="precios">
            <div className="showcase-header pricing-header">
              <div>
                <span className="section-tag"><Wallet size={14} />Paquetes</span>
                <h2>Precios simples para profesionales, gimnasios y operaciones multi-sede.</h2>
              </div>
              <p>
                La idea es que puedas entrar con una oferta accesible, crecer a una sede completa y luego escalar a una
                marca conectada en un mismo sistema.
              </p>
            </div>
            <div className="pricing-grid-app">
              {pricingPackages.map((pkg) => (
                <article key={pkg.name} className={`pricing-app-card ${pkg.featured ? 'featured' : ''}`}>
                  <div className="pricing-app-top">
                    <small>{pkg.audience}</small>
                    <strong>{pkg.name}</strong>
                    <div className="pricing-app-price"><span>{pkg.price}</span><em>/ mes</em></div>
                    <p>{pkg.description}</p>
                  </div>
                  <ul className="pricing-app-list">{pkg.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <button
                    className={pkg.featured ? 'btn-ronas pricing-app-button featured' : 'pricing-app-button'}
                    type="button"
                    onClick={onRequestDemo}
                  >
                    Elegir paquete
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="showcase-section" id="muestras">
            <div className="elite-container">
              <div className="showcase-header">
                <div>
                  <span className="section-tag"><Sparkles size={14} />Muestras de landing</span>
                  <h2>La misma app puede venderse con distintos estilos visuales según el tipo de gimnasio.</h2>
                </div>
                <p>
                  Dejamos una muestra al frente y dos detrás para mostrar que la plataforma se puede adaptar a cadenas,
                  estudios premium o gimnasios más agresivos en adquisición.
                </p>
              </div>

              <div className="showcase-toolbar">
                <div className="showcase-meta">
                  <small>{activeItem.label}</small>
                  <strong>{activeItem.name}</strong>
                  <p>{activeItem.description}</p>
                </div>
                <div className="showcase-controls">
                  <button type="button" className="showcase-arrow" onClick={goToPrev} aria-label="Muestra anterior"><ArrowLeft size={18} /></button>
                  <button type="button" className="showcase-arrow" onClick={goToNext} aria-label="Muestra siguiente"><ArrowRight size={18} /></button>
                </div>
              </div>

              <div className="showcase-stage" aria-live="polite">
                {showcaseItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`showcase-layer ${getCardClass(index, activeShowcase, showcaseItems.length)}`}
                    onClick={() => setActiveShowcase(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveShowcase(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver ${item.name}`}
                    aria-pressed={index === activeShowcase}
                  >
                    <div className="showcase-layer-inner">{renderPreviewById(item.id, previewActions)}</div>
                  </div>
                ))}
              </div>

              <div className="showcase-selector">
                {showcaseItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`showcase-chip ${index === activeShowcase ? 'active' : ''}`}
                    onClick={() => setActiveShowcase(index)}
                  >
                    <span className="showcase-chip-dot" style={{ backgroundColor: item.accent }} />
                    <span>{item.name}</span>
                    <small>{item.label}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="cta-section elite-container">
            <div className="cta-card">
              <div>
                <span className="section-tag dark"><Bolt size={14} />Resultado esperado</span>
                <h2>Más claridad, mejor retención y una forma más inteligente de hacer crecer el gimnasio.</h2>
              </div>
              <div className="cta-copy">
                <p>
                  La propuesta no es solo “tener app”. Es tener un sistema que te ayude a facturar mejor, operar con
                  menos fricción y tomar decisiones con datos.
                </p>
                <div className="hero-cta-stack">
                  <button className="btn-ronas nav-cta" type="button" onClick={onRequestDemo}>Solicitar demo</button>
                  <button className="pricing-app-button" type="button" onClick={onOpenClientDemo}>Abrir web cliente</button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="elite-footer" id="contacto">
          <div className="elite-container">
            <div className="footer-cta">
              <h2>HAZ QUE TU <span>GYM</span> CREZCA</h2>
              <div className="footer-cta-copy">
                <p>
                  Una plataforma para gimnasios que quieren vender mejor, ordenar su operación y mejorar su
                  rendimiento financiero.
                </p>
                <button className="footer-cta-button" type="button" onClick={onOpenClientDemo}>Ver demo cliente</button>
              </div>
            </div>

            <div className="footer-bottom">
              <div>© 2026 Gym OS | Plataforma para gimnasios</div>
              <div className="footer-links">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={14} />Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={14} />Facebook</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer"><Youtube size={14} />Youtube</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [appView, setAppView] = useState(() => (window.location.hash === '#cliente-demo' ? 'client' : 'marketing'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (event) => setCursorPosition({ x: event.clientX, y: event.clientY });
    const handleHashChange = () => setAppView(window.location.hash === '#cliente-demo' ? 'client' : 'marketing');
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const openClientDemo = () => {
    window.location.hash = 'cliente-demo';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    if (window.location.hash === '#cliente-demo') {
      window.location.hash = '';
    }
    scrollToElementId(sectionId);
  };

  const openMarketing = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (appView === 'client') {
    return <GymClientDemo onBack={openMarketing} />;
  }

  return (
    <MarketingHome
      cursorPosition={cursorPosition}
      scrolled={scrolled}
      activeShowcase={activeShowcase}
      setActiveShowcase={setActiveShowcase}
      onOpenClientDemo={openClientDemo}
      onExploreFinancials={() => scrollToSection('finanzas')}
      onOpenPricing={() => scrollToSection('precios')}
      onRequestDemo={() => scrollToSection('contacto')}
    />
  );
}

export default App;
