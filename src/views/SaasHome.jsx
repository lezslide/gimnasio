import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, FileText, Globe, LayoutDashboard,
  LoaderCircle, LogIn, LogOut, MonitorSmartphone, Palette, Plus, Search, ShieldCheck, Sparkles, Store,
} from 'lucide-react';
import { hasSupabaseEnv, supabase } from '../lib/supabase';
import { loadOwnerMetrics } from '../lib/ownerMetrics';
import { defaultSiteTheme, loadSiteTheme, saveSiteTheme } from '../lib/siteTheme';

const fallbackMonthlyStats = [
  { month: 'Nov', income: 126000, retention: 84 }, { month: 'Dic', income: 134000, retention: 86 },
  { month: 'Ene', income: 141000, retention: 87 }, { month: 'Feb', income: 149000, retention: 88 },
  { month: 'Mar', income: 156000, retention: 90 }, { month: 'Abr', income: 162000, retention: 91 },
];
const fallbackPayments = [{ amount: 28000, status: 'paid' }, { amount: 18500, status: 'paid' }, { amount: 12000, status: 'pending' }];
const fallbackRiskMembers = [{ id: 'm-14', name: 'Camila Soto' }, { id: 'm-32', name: 'Nicolas Vera' }, { id: 'm-41', name: 'Julieta Costa' }];
const themeOptions = [
  { slug: 'elite-fight', name: 'Elite Fight', description: 'Look premium editorial para gimnasios que venden status.', accent: '#dc2626', surface: 'linear-gradient(135deg, #ffffff 0%, #ffe7e7 100%)', ink: '#111827' },
  { slug: 'titan-neon', name: 'Titan Neon', description: 'Visual agresivo dark para promos y adquisicion.', accent: '#ccff00', surface: 'linear-gradient(135deg, #040404 0%, #151515 100%)', ink: '#f8fafc' },
  { slug: 'titan-editorial', name: 'Titan Editorial', description: 'Estetica limpia y confiable para marcas premium.', accent: '#e31c25', surface: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', ink: '#111827' },
];
const pageTemplates = [
  { slug: 'home', name: 'Home', description: 'Hero, beneficios, planes y CTA.' },
  { slug: 'memberships', name: 'Planes', description: 'Pagina para vender membresias y promos.' },
  { slug: 'classes', name: 'Clases', description: 'Agenda, disciplinas y profesores.' },
  { slug: 'contact', name: 'Contacto', description: 'Mapa, WhatsApp y formulario.' },
];
const onboardingCards = [
  { title: '1. Crear el gimnasio', description: 'Nombre, slug y datos basicos para tener un workspace listo en minutos.', nextStep: 'Siguiente: dejar listo el gym base para mostrarlo como demo real', tone: 'green', target: 'gyms', icon: Building2 },
  { title: '2. Elegir la plantilla', description: 'Selecciona un look inicial que el cliente entienda al instante.', nextStep: 'Siguiente: definir visual y propuesta del sitio', tone: 'blue', target: 'gyms', icon: Palette },
  { title: '3. Cargar paginas del sitio', description: 'Crea Inicio, Planes, Clases y Contacto para vender el MVP.', nextStep: 'Siguiente: publicar las paginas clave del funnel', tone: 'amber', target: 'site', icon: FileText },
];
const demoPages = [
  { id: 'demo-home', slug: 'inicio', title: 'Inicio', page_template: 'home', status: 'published', sort_order: 0, is_homepage: true, hero_title: 'Entrena mejor en Profitness' },
  { id: 'demo-plans', slug: 'planes', title: 'Planes', page_template: 'memberships', status: 'draft', sort_order: 1, is_homepage: false, hero_title: 'Elige tu plan' },
];
const fallbackMembers = [
  { id: 'm-1', name: 'Sofia Benitez', plan: 'Performance', status: 'Activa', lastVisit: 'Hoy 18:40' },
  { id: 'm-2', name: 'Martin Rojas', plan: 'Elite', status: 'Riesgo', lastVisit: 'Hace 6 dias' },
  { id: 'm-3', name: 'Camila Soto', plan: 'Essential', status: 'Pendiente', lastVisit: 'Hace 2 dias' },
];
const fallbackLeads = [
  { id: 'l-1', name: 'Valentina Ruiz', channel: 'WhatsApp', interest: 'Clase de prueba funcional', status: 'Nuevo' },
  { id: 'l-2', name: 'Nicolas Vera', channel: 'Instagram', interest: 'Plan mensual', status: 'Seguimiento' },
  { id: 'l-3', name: 'Julieta Costa', channel: 'Web', interest: 'Pase semanal', status: 'Cerrado' },
];
const fallbackAdminPayments = [
  { id: 'p-1', member: 'Sofia Benitez', amount: 28000, status: 'paid', dueLabel: 'Pagado hoy' },
  { id: 'p-2', member: 'Martin Rojas', amount: 18500, status: 'pending', dueLabel: 'Vence manana' },
  { id: 'p-3', member: 'Camila Soto', amount: 12000, status: 'paid', dueLabel: 'Pagado ayer' },
];
const gymInit = { name: '', slug: '', city: '', timezone: 'America/Argentina/Buenos_Aires' };
const brandInit = { name: '', slug: '', theme_slug: 'elite-fight', description: '', city: '', support_email: '', support_phone: '', website_url: '', logo_url: '', primary_color: '#dc2626', secondary_color: '#111827' };
const pageInit = { title: '', slug: '', page_template: 'home', hero_title: '', hero_subtitle: '', primary_cta_label: '', status: 'draft', is_homepage: false };

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
const normalizeSlug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);

function MetricLine({ label, value, accent }) {
  return <div className="saas-metric-line"><div><small>{label}</small><strong>{value}</strong></div><span className={`saas-metric-spark ${accent}`} /></div>;
}

export default function SaasHome({ onOpenMarketing, onOpenClientDemo }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [metrics, setMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [authNotice, setAuthNotice] = useState(hasSupabaseEnv ? 'Conecta una sesion real para crear gimnasios y guardar paginas del sitio.' : 'Faltan variables de Supabase. La interfaz queda en modo demo.');
  const [authForm, setAuthForm] = useState({ email: '' });
  const [authActionState, setAuthActionState] = useState({ loading: false, message: '' });
  const [gyms, setGyms] = useState([]);
  const [selectedGymId, setSelectedGymId] = useState('');
  const [gymForm, setGymForm] = useState(gymInit);
  const [gymActionState, setGymActionState] = useState({ loading: false, message: '' });
  const [brandingForm, setBrandingForm] = useState(brandInit);
  const [brandingActionState, setBrandingActionState] = useState({ loading: false, message: '' });
  const [sitePages, setSitePages] = useState(demoPages);
  const [pageForm, setPageForm] = useState(pageInit);
  const [pageActionState, setPageActionState] = useState({ loading: false, message: '' });
  const [themeEditor, setThemeEditor] = useState(() => loadSiteTheme());
  const [themeActionState, setThemeActionState] = useState({ message: '' });
  const [crmSnapshot, setCrmSnapshot] = useState({
    members: fallbackMembers,
    leads: fallbackLeads,
    payments: fallbackAdminPayments,
    source: 'demo',
  });

  useEffect(() => {
    let active = true;
    loadOwnerMetrics({ fallbackMonthlyStats, payments: fallbackPayments, riskMembers: fallbackRiskMembers }).then((result) => {
      if (active) { setMetrics(result); setIsLoadingMetrics(false); }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function init() {
      if (!hasSupabaseEnv || !supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setAuthUser(user ?? null);
      setAuthForm((current) => ({ ...current, email: user?.email || current.email }));
      if (!user) setAuthNotice('No hay sesion iniciada. Puedes mirar la maqueta y luego entrar para guardar datos reales.');
      if (user) await refreshGyms();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const nextUser = session?.user ?? null;
        setAuthUser(nextUser);
        if (!nextUser) {
          setGyms([]); setSelectedGymId(''); setSitePages(demoPages); setAuthNotice('Sesion cerrada. El panel vuelve a modo demo.');
          return;
        }
        setAuthNotice(`Sesion detectada como ${nextUser.email || 'usuario autenticado'}.`);
        await refreshGyms();
      });
      return subscription;
    }
    async function refreshGyms() {
      const { data, error } = await supabase.from('gyms').select('id,name,slug,theme_slug,description,city,status,timezone,logo_url,website_url,support_email,support_phone,primary_color,secondary_color,created_at').order('created_at', { ascending: false });
      if (!active || error) return;
      setGyms(data);
      if (data[0]?.id) setSelectedGymId((current) => current || data[0].id);
    }
    let sub;
    init().then((subscription) => { sub = subscription; });
    return () => { active = false; sub?.unsubscribe(); };
  }, []);

  const selectedGym = gyms.find((gym) => gym.id === selectedGymId) ?? null;
  useEffect(() => {
    if (!selectedGym) { setBrandingForm(brandInit); return; }
    setBrandingForm({
      name: selectedGym.name || '', slug: selectedGym.slug || '', theme_slug: selectedGym.theme_slug || 'elite-fight',
      description: selectedGym.description || '', city: selectedGym.city || '', support_email: selectedGym.support_email || '',
      support_phone: selectedGym.support_phone || '', website_url: selectedGym.website_url || '', logo_url: selectedGym.logo_url || '',
      primary_color: selectedGym.primary_color || '#dc2626', secondary_color: selectedGym.secondary_color || '#111827',
    });
  }, [selectedGym]);

  useEffect(() => {
    let active = true;
    async function loadPages() {
      if (!selectedGymId || !hasSupabaseEnv || !supabase || !authUser) { setSitePages(demoPages); return; }
      const { data, error } = await supabase.from('gym_site_pages').select('id,gym_id,slug,title,page_template,status,sort_order,is_homepage,hero_title,hero_subtitle,primary_cta_label').eq('gym_id', selectedGymId).order('sort_order', { ascending: true });
      if (!active) return;
      if (error) {
        setPageActionState({ loading: false, message: 'Falta crear la tabla gym_site_pages en Supabase para guardar esto.' });
        setSitePages(demoPages);
        return;
      }
      setSitePages(data?.length ? data : demoPages);
    }
    loadPages();
    return () => { active = false; };
  }, [selectedGymId, authUser]);

  useEffect(() => {
    let active = true;
    async function loadAdminData() {
      if (!selectedGymId || !hasSupabaseEnv || !supabase || !authUser) {
        setCrmSnapshot({ members: fallbackMembers, leads: fallbackLeads, payments: fallbackAdminPayments, source: 'demo' });
        return;
      }

      try {
        const [membersResponse, paymentsResponse] = await Promise.all([
          supabase.from('members').select('id,first_name,last_name,is_active,updated_at').eq('gym_id', selectedGymId).order('updated_at', { ascending: false }).limit(6),
          supabase.from('payments').select('id,amount,payment_status,due_at,paid_at,member_id').eq('gym_id', selectedGymId).order('created_at', { ascending: false }).limit(6),
        ]);

        if (!active) return;
        if (membersResponse.error || paymentsResponse.error) throw membersResponse.error || paymentsResponse.error;

        const members = (membersResponse.data ?? []).map((member, index) => ({
          id: member.id,
          name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || `Socio ${index + 1}`,
          plan: 'Membresia activa',
          status: member.is_active ? 'Activa' : 'Pausada',
          lastVisit: member.updated_at ? new Date(member.updated_at).toLocaleDateString('es-AR') : 'Sin actividad',
        }));

        const payments = (paymentsResponse.data ?? []).map((payment, index) => ({
          id: payment.id,
          member: members[index]?.name || `Socio ${index + 1}`,
          amount: Number(payment.amount || 0),
          status: payment.payment_status || 'pending',
          dueLabel: payment.paid_at ? 'Pagado' : payment.due_at ? `Vence ${new Date(payment.due_at).toLocaleDateString('es-AR')}` : 'Pendiente',
        }));

        setCrmSnapshot({
          members: members.length ? members : fallbackMembers,
          leads: fallbackLeads,
          payments: payments.length ? payments : fallbackAdminPayments,
          source: 'supabase',
        });
      } catch {
        setCrmSnapshot({ members: fallbackMembers, leads: fallbackLeads, payments: fallbackAdminPayments, source: 'fallback' });
      }
    }

    loadAdminData();
    return () => { active = false; };
  }, [selectedGymId, authUser]);

  const paidToday = isLoadingMetrics ? '...' : formatCurrency(metrics?.cash?.paidToday);
  const monthlyRevenue = isLoadingMetrics ? '...' : formatCurrency(metrics?.cash?.monthlyRevenue);
  const pendingToday = isLoadingMetrics ? '...' : formatCurrency(metrics?.cash?.pendingToday);
  const retentionRate = isLoadingMetrics ? '...' : `${metrics?.retention?.rate ?? 0}%`;
  const publishedPages = useMemo(() => sitePages.filter((page) => page.status === 'published').length, [sitePages]);
  const homepage = useMemo(() => sitePages.find((page) => page.is_homepage), [sitePages]);
  const activeMembersCount = crmSnapshot.members.filter((member) => member.status === 'Activa').length;

  const handleAuthChange = (event) => setAuthForm({ email: event.target.value });
  const handleGymChange = (event) => setGymForm((current) => ({ ...current, [event.target.name]: event.target.name === 'name' ? event.target.value : event.target.value, ...(event.target.name === 'name' ? { slug: normalizeSlug(event.target.value) } : {}) }));
  const handleBrandChange = (event) => setBrandingForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handlePageChange = (event) => setPageForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value, ...(event.target.name === 'title' ? { slug: normalizeSlug(event.target.value) } : {}) }));
  const handleThemeChange = (event) => setThemeEditor((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleThemePlanChange = (index, field) => (event) =>
    setThemeEditor((current) => ({
      ...current,
      plans: current.plans.map((plan, planIndex) => (planIndex === index ? { ...plan, [field]: event.target.value } : plan)),
    }));

  function handleSaveThemeEditor() {
    saveSiteTheme(themeEditor);
    setThemeActionState({ message: 'Theme guardado. Abre "Ver demo cliente" para ver la plantilla editada.' });
  }

  function handleResetThemeEditor() {
    setThemeEditor(defaultSiteTheme);
    saveSiteTheme(defaultSiteTheme);
    setThemeActionState({ message: 'Theme restaurado al preset base.' });
  }

  async function handleSignIn(event) {
    event.preventDefault();
    if (!hasSupabaseEnv || !supabase) { setAuthActionState({ loading: false, message: 'Primero configura Supabase.' }); return; }
    setAuthActionState({ loading: true, message: '' });
    const { error } = await supabase.auth.signInWithOtp({ email: authForm.email, options: { emailRedirectTo: window.location.href } });
    setAuthActionState({ loading: false, message: error ? error.message : 'Te mande un magic link al correo.' });
  }
  async function handleSignOut() {
    if (!supabase) return;
    setAuthActionState({ loading: true, message: '' });
    const { error } = await supabase.auth.signOut();
    setAuthActionState({ loading: false, message: error ? error.message : 'Sesion cerrada correctamente.' });
  }
  async function handleCreateGym(event) {
    event.preventDefault();
    if (!hasSupabaseEnv || !supabase) { setGymActionState({ loading: false, message: 'Primero conecta Supabase.' }); return; }
    if (!authUser) { setGymActionState({ loading: false, message: 'Necesitas iniciar sesion.' }); return; }
    setGymActionState({ loading: true, message: '' });
    const { data, error } = await supabase.rpc('create_gym_workspace', { gym_name: gymForm.name, gym_slug: gymForm.slug, gym_city: gymForm.city || null, gym_timezone: gymForm.timezone });
    if (error) { setGymActionState({ loading: false, message: error.message }); return; }
    const createdGym = Array.isArray(data) ? data[0] : data;
    if (createdGym?.id) { setGyms((current) => [createdGym, ...current]); setSelectedGymId(createdGym.id); }
    setGymForm(gymInit); setGymActionState({ loading: false, message: 'Gimnasio creado y asociado al owner.' }); setActiveSection('gyms');
  }
  async function handleSaveBranding(event) {
    event.preventDefault();
    if (!selectedGymId) { setBrandingActionState({ loading: false, message: 'Primero crea o selecciona un gimnasio.' }); return; }
    if (!hasSupabaseEnv || !supabase || !authUser) { setBrandingActionState({ loading: false, message: 'Modo demo: el branding se ve, pero no se guarda.' }); return; }
    setBrandingActionState({ loading: true, message: '' });
    const { data, error } = await supabase.from('gyms').update(brandingForm).eq('id', selectedGymId).select('id,name,slug,theme_slug,description,city,status,timezone,logo_url,website_url,support_email,support_phone,primary_color,secondary_color,created_at').single();
    if (error) { setBrandingActionState({ loading: false, message: error.message }); return; }
    setGyms((current) => current.map((gym) => (gym.id === selectedGymId ? data : gym)));
    setBrandingActionState({ loading: false, message: 'Branding del gimnasio guardado.' });
  }
  async function handleCreatePage(event) {
    event.preventDefault();
    if (!selectedGymId) { setPageActionState({ loading: false, message: 'Primero crea o selecciona un gimnasio.' }); return; }
    const payload = { gym_id: selectedGymId, slug: pageForm.slug, title: pageForm.title, page_template: pageForm.page_template, status: pageForm.status, sort_order: sitePages.length, is_homepage: pageForm.is_homepage, hero_title: pageForm.hero_title || null, hero_subtitle: pageForm.hero_subtitle || null, primary_cta_label: pageForm.primary_cta_label || null };
    if (!hasSupabaseEnv || !supabase || !authUser) {
      setSitePages((current) => [...current.map((page) => ({ ...page, is_homepage: pageForm.is_homepage ? false : page.is_homepage })), { id: `demo-${Date.now()}`, ...payload }]);
      setPageForm(pageInit); setPageActionState({ loading: false, message: 'Modo demo: la pagina se agrega en pantalla.' }); return;
    }
    setPageActionState({ loading: true, message: '' });
    if (pageForm.is_homepage) await supabase.from('gym_site_pages').update({ is_homepage: false }).eq('gym_id', selectedGymId);
    const { data, error } = await supabase.from('gym_site_pages').insert(payload).select('id,gym_id,slug,title,page_template,status,sort_order,is_homepage,hero_title,hero_subtitle,primary_cta_label').single();
    if (error) { setPageActionState({ loading: false, message: error.message }); return; }
    setSitePages((current) => [...current.map((page) => ({ ...page, is_homepage: pageForm.is_homepage ? false : page.is_homepage })), data]);
    setPageForm(pageInit); setPageActionState({ loading: false, message: 'Pagina creada para este gimnasio.' });
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Inicio', section: 'dashboard' },
    { icon: Building2, label: 'Gimnasios', section: 'gyms' },
    { icon: Globe, label: 'Sitio web', section: 'site' },
  ];

  return (
    <div className="saas-admin-shell">
      <header className="saas-admin-topbar"><div className="saas-admin-topbar-left"><div className="saas-admin-logo"><LayoutDashboard size={18} /><span>Gym OS Admin</span></div><label className="saas-admin-search"><Search size={18} /><input type="text" value="Buscar paginas, gimnasios o branding..." readOnly /><span>CTRL K</span></label></div><div className="saas-admin-topbar-right"><button type="button" className="saas-icon-button" onClick={onOpenMarketing}><Store size={16} /><span>Ver landing</span></button><button type="button" className="saas-icon-button dark" onClick={onOpenClientDemo}><ShieldCheck size={16} /><span>Ver demo cliente</span></button><button type="button" className="saas-circle-button" aria-label="Notificaciones"><Bell size={16} /></button>{authUser ? <button type="button" className="saas-icon-button" onClick={handleSignOut} disabled={authActionState.loading}>{authActionState.loading ? <LoaderCircle size={15} className="spin" /> : <LogOut size={15} />}<span>Salir</span></button> : null}<div className="saas-user-chip"><span>{authUser?.email?.slice(0, 2).toUpperCase() || 'JT'}</span><strong>{authUser?.email?.split('@')[0] || 'Jeremias'}</strong></div></div></header>
      <div className="saas-admin-layout">
        <aside className="saas-admin-sidebar"><div className="saas-sidebar-store"><div className="saas-sidebar-store-mark"><MonitorSmartphone size={16} /></div><div><strong>{selectedGym?.name || 'Gym OS'}</strong><span>{selectedGym ? selectedGym.slug : 'Owner workspace'}</span></div><ChevronDown size={16} /></div><div className="saas-sidebar-groups"><section className="saas-sidebar-group"><small>MVP</small><div className="saas-sidebar-list">{sidebarItems.map(({ icon: Icon, label, section }) => <button key={label} type="button" className={`saas-sidebar-item ${activeSection === section ? 'active' : ''}`} onClick={() => setActiveSection(section)}><Icon size={17} /><span>{label}</span></button>)}</div></section></div><div className="saas-sidebar-footer"><div className="saas-sidebar-note"><strong>MVP vendible ahora</strong><p>Menos features, mas claridad: branding del gym, plantilla y paginas listas para publicar.</p></div></div></aside>
        <main className="saas-admin-main">
          <section className="saas-admin-toolbar"><button type="button" className="saas-filter-button"><CalendarDays size={16} />Ultimos 30 dias<ChevronDown size={15} /></button><button type="button" className="saas-filter-button">{selectedGym ? selectedGym.name : 'Todos los gimnasios'}<ChevronDown size={15} /></button></section>
          <section className="saas-admin-metrics-card"><MetricLine label="Cobrado hoy" value={paidToday} accent="blue" /><MetricLine label="Ventas totales" value={monthlyRevenue} accent="green" /><MetricLine label="Pendiente" value={pendingToday} accent="amber" /><MetricLine label="Retencion" value={retentionRate} accent="purple" /></section>
          <section className="saas-admin-welcome"><h1>Construyamos un MVP que se venda.</h1><p>El foco ahora no es un ecosistema gigante: es lanzar la web del gimnasio con plantilla, branding y paginas editables.</p></section>
          <section className="saas-admin-question"><div><strong>{activeSection === 'gyms' ? 'Onboarding del gimnasio' : activeSection === 'site' ? 'Paginas del sitio' : 'Resumen del owner'}</strong><span>{authNotice}</span></div><button type="button" onClick={() => setActiveSection(activeSection === 'dashboard' ? 'site' : 'dashboard')}><Sparkles size={16} /></button></section>
          {activeSection === 'dashboard' ? <section className="saas-admin-content-grid"><div className="saas-admin-primary-column"><article className="saas-admin-panel"><div className="saas-admin-panel-head"><strong>{authUser ? 'Sesion activa en Supabase' : 'Activa el modo real del admin'}</strong><span>{authUser ? 'Auth conectada' : 'Magic link'}</span></div>{authUser ? <div className="saas-auth-state"><div className="saas-auth-badge success"><CheckCircle2 size={16} /><span>{authUser.email}</span></div><button type="button" className="saas-secondary-action" onClick={handleSignOut} disabled={authActionState.loading}>{authActionState.loading ? <LoaderCircle size={16} className="spin" /> : <LogOut size={16} />}Cerrar sesion</button></div> : <form className="saas-auth-form" onSubmit={handleSignIn}><label><span>Email del owner</span><input type="email" name="email" value={authForm.email} onChange={handleAuthChange} placeholder="dueno@tugym.com" required /></label><button type="submit" className="saas-primary-action" disabled={authActionState.loading}>{authActionState.loading ? <LoaderCircle size={16} className="spin" /> : <LogIn size={16} />}Entrar con magic link</button></form>}{authActionState.message ? <p className="saas-inline-feedback">{authActionState.message}</p> : null}</article><article className="saas-admin-panel"><div className="saas-admin-panel-head"><strong>Base de datos del gimnasio</strong><span>{crmSnapshot.source === 'supabase' ? 'Datos reales' : 'Demo operativa'}</span></div><div className="saas-data-strip"><div className="saas-data-card"><strong>{crmSnapshot.members.length}</strong><span>socios en base</span><small>{activeMembersCount} activos ahora</small></div><div className="saas-data-card"><strong>{crmSnapshot.leads.length}</strong><span>leads abiertos</span><small>captados desde web y redes</small></div><div className="saas-data-card"><strong>{crmSnapshot.payments.filter((item) => item.status === 'pending').length}</strong><span>cobros pendientes</span><small>seguimiento administrativo</small></div></div><div className="saas-data-grid"><article className="saas-data-panel"><div className="saas-admin-panel-head"><strong>Clientes y socios</strong><span>CRM</span></div><div className="saas-record-list">{crmSnapshot.members.map((member) => <div key={member.id} className="saas-record-row"><div><strong>{member.name}</strong><span>{member.plan}</span></div><div><em className={`saas-record-status ${member.status.toLowerCase()}`}>{member.status}</em><small>{member.lastVisit}</small></div></div>)}</div></article><article className="saas-data-panel"><div className="saas-admin-panel-head"><strong>Leads y consultas</strong><span>Ventas</span></div><div className="saas-record-list">{crmSnapshot.leads.map((lead) => <div key={lead.id} className="saas-record-row"><div><strong>{lead.name}</strong><span>{lead.interest}</span></div><div><em className={`saas-record-status ${lead.status.toLowerCase().replace(/\s+/g, '-')}`}>{lead.status}</em><small>{lead.channel}</small></div></div>)}</div></article><article className="saas-data-panel"><div className="saas-admin-panel-head"><strong>Pagos y renovaciones</strong><span>Administracion</span></div><div className="saas-record-list">{crmSnapshot.payments.map((payment) => <div key={payment.id} className="saas-record-row"><div><strong>{payment.member}</strong><span>{formatCurrency(payment.amount)}</span></div><div><em className={`saas-record-status ${String(payment.status).toLowerCase()}`}>{payment.status}</em><small>{payment.dueLabel}</small></div></div>)}</div></article></div></article>{onboardingCards.map((card) => { const Icon = card.icon; return <article key={card.title} className="saas-admin-task-card"><div className="saas-admin-task-head"><div className={`saas-task-badge ${card.tone}`} /><span>MVP vendible</span></div><div className="saas-admin-task-body"><div className="saas-admin-task-copy"><h2>{card.title}</h2><p>{card.description}</p></div><div className={`saas-admin-illustration ${card.tone}`}><div className="saas-admin-illustration-box"><Icon size={26} /></div><div className="saas-admin-illustration-box small"><ChevronRight size={18} /></div></div></div><div className="saas-admin-task-footer"><strong>{card.nextStep}</strong><button type="button" onClick={() => setActiveSection(card.target)}>Ir ahora<ChevronRight size={16} /></button></div></article>; })}</div><aside className="saas-admin-secondary-column"><article className="saas-admin-panel compact"><div className="saas-admin-panel-head"><strong>Resumen rapido</strong><span>Hoy</span></div><div className="saas-quick-stats">{[{ label: 'Paginas publicadas', value: String(publishedPages), detail: 'listas para mostrar' }, { label: 'Socios activos', value: String(activeMembersCount), detail: 'base administrativa viva' }, { label: 'Promesa MVP', value: '1', detail: 'sitio + admin + cobros' }].map((item) => <div key={item.label} className="saas-quick-stat"><strong>{item.value}</strong><span>{item.label}</span><small>{item.detail}</small></div>)}</div></article><article className="saas-admin-panel"><div className="saas-admin-panel-head"><strong>Lo que vendemos ahora</strong></div><div className="saas-admin-panel-list"><div className="saas-admin-panel-item"><span>{selectedGym ? `Gym activo: ${selectedGym.name}` : 'Todavia no hay un gimnasio seleccionado'}</span><ChevronRight size={15} /></div><div className="saas-admin-panel-item"><span>{crmSnapshot.members.length} registros en base de clientes</span><ChevronRight size={15} /></div><div className="saas-admin-panel-item"><span>{crmSnapshot.payments.length} movimientos administrativos visibles</span><ChevronRight size={15} /></div></div></article></aside></section> : null}
          {activeSection === 'gyms' ? <section className="saas-admin-triple-layout"><article className="saas-admin-panel saas-form-panel"><div className="saas-admin-panel-head"><strong>Crear gimnasio</strong><span>Onboarding inicial</span></div><form className="saas-admin-form" onSubmit={handleCreateGym}><label><span>Nombre comercial</span><input name="name" value={gymForm.name} onChange={handleGymChange} placeholder="Profitness" required /></label><label><span>Slug publico</span><input name="slug" value={gymForm.slug} onChange={handleGymChange} placeholder="profitness" required /></label><label><span>Ciudad</span><input name="city" value={gymForm.city} onChange={handleGymChange} placeholder="Buenos Aires" /></label><label><span>Timezone</span><input name="timezone" value={gymForm.timezone} onChange={handleGymChange} required /></label><button type="submit" className="saas-primary-action" disabled={gymActionState.loading}>{gymActionState.loading ? <LoaderCircle size={16} className="spin" /> : <Plus size={16} />}Crear workspace</button>{gymActionState.message ? <p className="saas-inline-feedback">{gymActionState.message}</p> : null}</form></article><article className="saas-admin-panel"><div className="saas-admin-panel-head"><strong>Gimnasios del owner</strong><span>{gyms.length} cargados</span></div><div className="saas-gym-list">{gyms.length ? gyms.map((gym) => <button key={gym.id} type="button" className={`saas-gym-row ${gym.id === selectedGymId ? 'active' : ''}`} onClick={() => setSelectedGymId(gym.id)}><div><strong>{gym.name}</strong><span>{gym.slug}</span></div><small>{gym.city || gym.timezone}</small></button>) : <div className="saas-empty-state"><Building2 size={18} /><span>Todavia no hay gimnasios reales. Crea el primero desde este formulario.</span></div>}</div></article><article className="saas-admin-panel saas-form-panel"><div className="saas-admin-panel-head"><strong>Branding y plantilla</strong><span>{selectedGym ? selectedGym.name : 'Selecciona un gym'}</span></div>{selectedGym ? <form className="saas-admin-form" onSubmit={handleSaveBranding}><div className="saas-branding-preview"><div className="saas-branding-logo" style={{ background: `linear-gradient(135deg, ${brandingForm.primary_color}, ${brandingForm.secondary_color})` }}>{brandingForm.logo_url ? <img src={brandingForm.logo_url} alt={`Logo de ${brandingForm.name || selectedGym.name}`} /> : <span>{(brandingForm.name || selectedGym.name || 'GY').slice(0, 2).toUpperCase()}</span>}</div><div><strong>{brandingForm.name || selectedGym.name}</strong><span>{brandingForm.slug || selectedGym.slug}</span></div></div><label><span>Nombre visible</span><input name="name" value={brandingForm.name} onChange={handleBrandChange} required /></label><label><span>Slug publico</span><input name="slug" value={brandingForm.slug} onChange={handleBrandChange} required /></label><div className="saas-theme-picker"><span className="saas-theme-picker-label">Plantilla base del sitio</span><div className="saas-theme-grid">{themeOptions.map((theme) => <button key={theme.slug} type="button" className={`saas-theme-card ${brandingForm.theme_slug === theme.slug ? 'active' : ''}`} onClick={() => setBrandingForm((current) => ({ ...current, theme_slug: theme.slug }))}><div className="saas-theme-preview" style={{ background: theme.surface, color: theme.ink }}><span className="saas-theme-kicker" style={{ color: theme.accent }}>{theme.name}</span><strong>Tu web lista para editar</strong><div className="saas-theme-bars"><span style={{ backgroundColor: theme.accent }} /><span /><span /></div></div><div className="saas-theme-meta"><strong>{theme.name}</strong><span>{theme.description}</span></div></button>)}</div></div><label><span>Descripcion corta</span><input name="description" value={brandingForm.description} onChange={handleBrandChange} /></label><label><span>Email de contacto</span><input type="email" name="support_email" value={brandingForm.support_email} onChange={handleBrandChange} /></label><label><span>Telefono</span><input name="support_phone" value={brandingForm.support_phone} onChange={handleBrandChange} /></label><div className="saas-color-grid"><label><span>Color principal</span><input type="color" name="primary_color" value={brandingForm.primary_color} onChange={handleBrandChange} className="saas-color-input" /></label><label><span>Color secundario</span><input type="color" name="secondary_color" value={brandingForm.secondary_color} onChange={handleBrandChange} className="saas-color-input" /></label></div><button type="submit" className="saas-primary-action" disabled={brandingActionState.loading}>{brandingActionState.loading ? <LoaderCircle size={16} className="spin" /> : <CheckCircle2 size={16} />}Guardar branding</button>{brandingActionState.message ? <p className="saas-inline-feedback">{brandingActionState.message}</p> : null}</form> : <div className="saas-empty-state"><Store size={18} /><span>Selecciona un gimnasio para editar su marca y elegir la plantilla base.</span></div>}</article></section> : null}
          {activeSection === 'site' ? <section className="saas-admin-split-layout apps"><article className="saas-admin-panel saas-form-panel"><div className="saas-admin-panel-head"><strong>Crear pagina del sitio</strong><span>{selectedGym ? selectedGym.name : 'Selecciona un gym'}</span></div><form className="saas-admin-form" onSubmit={handleCreatePage}><label><span>Titulo visible</span><input name="title" value={pageForm.title} onChange={handlePageChange} placeholder="Planes" required /></label><label><span>Slug de la pagina</span><input name="slug" value={pageForm.slug} onChange={handlePageChange} placeholder="planes" required /></label><label><span>Plantilla</span><select name="page_template" value={pageForm.page_template} onChange={handlePageChange} className="saas-select">{pageTemplates.map((template) => <option key={template.slug} value={template.slug}>{template.name}</option>)}</select></label><label><span>Hero principal</span><input name="hero_title" value={pageForm.hero_title} onChange={handlePageChange} /></label><label><span>Subtitulo</span><input name="hero_subtitle" value={pageForm.hero_subtitle} onChange={handlePageChange} /></label><label><span>CTA principal</span><input name="primary_cta_label" value={pageForm.primary_cta_label} onChange={handlePageChange} /></label><div className="saas-inline-toggle"><label className="saas-check-row"><input type="checkbox" name="is_homepage" checked={pageForm.is_homepage} onChange={handlePageChange} /><span>Usar como home del sitio</span></label><label><span>Estado</span><select name="status" value={pageForm.status} onChange={handlePageChange} className="saas-select"><option value="draft">Draft</option><option value="published">Published</option></select></label></div><button type="submit" className="saas-primary-action" disabled={pageActionState.loading}>{pageActionState.loading ? <LoaderCircle size={16} className="spin" /> : <Plus size={16} />}Crear pagina</button>{pageActionState.message ? <p className="saas-inline-feedback">{pageActionState.message}</p> : null}</form></article><article className="saas-admin-panel"><div className="saas-admin-panel-head"><strong>Paginas y plantillas</strong><span>{sitePages.length} cargadas</span></div><div className="saas-site-template-grid">{pageTemplates.map((template) => <button key={template.slug} type="button" className={`saas-site-template-card ${pageForm.page_template === template.slug ? 'active' : ''}`} onClick={() => setPageForm((current) => ({ ...current, page_template: template.slug }))}><strong>{template.name}</strong><span>{template.description}</span></button>)}</div><div className="saas-enabled-list">{sitePages.length ? sitePages.map((page) => <div key={page.id} className="saas-enabled-item"><div><strong>{page.title}{page.is_homepage ? ' · Home' : ''}</strong><span>/{page.slug} · plantilla {page.page_template}</span><small>{page.hero_title || 'Sin hero cargado todavia.'}</small></div><div className={`saas-status-pill ${page.status}`}>{page.status}</div></div>) : <div className="saas-empty-state"><FileText size={18} /><span>Todavia no hay paginas. Empieza por Inicio, Planes y Contacto.</span></div>}</div></article></section> : null}
          {activeSection === 'site' ? <section className="saas-admin-panel saas-theme-editor-standalone"><div className="saas-admin-panel-head"><strong>Editor directo del theme</strong><span>Tipo Shopify</span></div><div className="saas-admin-form"><label><span>Nombre del gimnasio</span><input name="siteName" value={themeEditor.siteName} onChange={handleThemeChange} /></label><label><span>Logo URL</span><input name="logoUrl" value={themeEditor.logoUrl} onChange={handleThemeChange} /></label><div className="saas-color-grid"><label><span>Color principal</span><input type="color" name="primaryColor" value={themeEditor.primaryColor} onChange={handleThemeChange} className="saas-color-input" /></label><label><span>Color secundario</span><input type="color" name="secondaryColor" value={themeEditor.secondaryColor} onChange={handleThemeChange} className="saas-color-input" /></label></div><label><span>Kicker hero</span><input name="heroKicker" value={themeEditor.heroKicker} onChange={handleThemeChange} /></label><label><span>Titulo principal</span><input name="heroTitleLead" value={themeEditor.heroTitleLead} onChange={handleThemeChange} /></label><label><span>Titulo destacado</span><input name="heroTitleAccent" value={themeEditor.heroTitleAccent} onChange={handleThemeChange} /></label><label><span>Texto hero</span><input name="heroBody" value={themeEditor.heroBody} onChange={handleThemeChange} /></label><label><span>Titulo de historia</span><input name="storyTitle" value={themeEditor.storyTitle} onChange={handleThemeChange} /></label><label><span>Texto de historia</span><input name="storyBody" value={themeEditor.storyBody} onChange={handleThemeChange} /></label><label><span>Telefono</span><input name="contactPhone" value={themeEditor.contactPhone} onChange={handleThemeChange} /></label><label><span>Email</span><input name="contactEmail" value={themeEditor.contactEmail} onChange={handleThemeChange} /></label><label><span>Titulo de contacto</span><input name="contactHeading" value={themeEditor.contactHeading} onChange={handleThemeChange} /></label><label><span>Texto del boton</span><input name="contactButtonLabel" value={themeEditor.contactButtonLabel} onChange={handleThemeChange} /></label><div className="saas-site-template-grid">{themeEditor.plans.map((plan, index) => <div key={`${plan.name}-${index}`} className="saas-site-template-card active"><strong>Plan {index + 1}</strong><input value={plan.name} onChange={handleThemePlanChange(index, 'name')} /><input value={plan.price} onChange={handleThemePlanChange(index, 'price')} /><input value={plan.text} onChange={handleThemePlanChange(index, 'text')} /></div>)}</div><div className="saas-editor-actions"><button type="button" className="saas-primary-action" onClick={handleSaveThemeEditor}>Guardar theme</button><button type="button" className="saas-secondary-action" onClick={handleResetThemeEditor}>Reset</button><button type="button" className="saas-icon-button dark" onClick={onOpenClientDemo}><ShieldCheck size={16} /><span>Ver demo cliente</span></button></div>{themeActionState.message ? <p className="saas-inline-feedback">{themeActionState.message}</p> : null}</div></section> : null}
        </main>
      </div>
    </div>
  );
}
