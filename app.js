// ===== SERVICE DATA =====
const services=[
{id:"PR-01",title:"Estrategia de Comunicación Digital",area:"Marketing de Producto",phase:"EXplorar+",priority:"Alta",
 desc:"Definición del marco lógico y operativo para la presencia digital de la startup, alineando los objetivos de negocio con la ejecución en canales.",
 kpis:["Nivel de alineación de mensajes en canales","Incremento en la tasa de engagement orgánico inicial"],
 components:["Manual de tono y voz de marca","Matrices de mensajes clave por segmento","Matriz de selección de canales","Definición de Buyer Persona"]},
{id:"PR-02",title:"Gestión de Redes Sociales",area:"Operaciones Digitales",phase:"EXpandir+",priority:"Alta",
 desc:"Ejecución táctica y operativa de la presencia de la marca en plataformas sociales para mantener visibilidad constante.",
 kpis:["Crecimiento de la audiencia (Followers)","Alcance total de las publicaciones","Frecuencia de publicación"],
 components:["Calendario editorial mensual","Producción de piezas gráficas y video","Protocolos de publicación y monitoreo"]},
{id:"PR-03",title:"Narrativa de Marca y Storytelling",area:"Branding y Relaciones",phase:"EXplorar+",priority:"Alta",
 desc:"Estructuración del relato corporativo para optimizar la comunicación de la propuesta de valor ante stakeholders críticos.",
 kpis:["Tasa de retención de audiencia en presentaciones de Pitch","Menciones de mensajes clave en medios"],
 components:["Estructura del Elevator Pitch","Documento de narrativa transmedia","Diferencial competitivo narrado"]},
{id:"PR-04",title:"Campañas de Lanzamiento",area:"Marketing de Producto",phase:"EXpandir+",priority:"Crítica",
 desc:"Planificación y ejecución de acciones de comunicación de alto impacto orientadas a la validación de mercado o introducción de nuevos productos.",
 kpis:["Número de Leads/Registros generados","Costo de Adquisición de Cliente (CAC) proyectado"],
 components:["Plan de campaña (Pre-launch, Launch, Post-launch)","Set de activos publicitarios","Protocolo de medición de impacto"]},
{id:"PR-05",title:"Construcción de Comunidad Online",area:"Fidelización y CRM",phase:"EXpandir+",priority:"Media",
 desc:"Implementación de mecanismos de interacción bidireccional para fomentar la lealtad y el crecimiento orgánico.",
 kpis:["Tasa de apertura en newsletters","Nivel de participación activa en grupos","Tasa de recomendación (NPS)"],
 components:["Canales de comunicación directa (Newsletters, grupos)","Eventos digitales o webinars","Estrategia de moderación"]},
{id:"EC-01",title:"Dirección Estratégica Digital",area:"Estrategia Corporativa",phase:"EXplorar+",priority:"Alta",
 desc:"Marco de planificación y gobernanza para la ejecución de iniciativas digitales omnicanal y el escalamiento del modelo de negocio.",
 kpis:["Costo de Adquisición de Cliente (CAC)","ROAS","Valor de Vida del Cliente (LTV)"],
 components:["Plan digital 360°","Funnels de conversión","Estrategia omnicanal","Roadmap de escalamiento"]},
{id:"EC-02",title:"Growth & Performance",area:"Marketing de Resultados",phase:"EXpandir+",priority:"Alta",
 desc:"Ejecución de tácticas digitales orientadas a la captación de tráfico calificado y la optimización de la tasa de conversión.",
 kpis:["Tasa de conversión en landings y PDPs","Volumen de tráfico orgánico y pagado","Eficiencia de pauta en marketplaces"],
 components:["Gestión de SEM y SEO","CRO mediante A/B Testing","Automatización de marketing","Estrategias Go-To-Market"]},
{id:"EC-03",title:"Data Analytics & Business Intelligence",area:"Inteligencia de Negocios",phase:"EXpandir+",priority:"Media-Alta",
 desc:"Infraestructura de medición y análisis avanzado de datos para la optimización de la rentabilidad y el comportamiento del usuario.",
 kpis:["Precisión en forecasting de demanda","Margen de contribución","Performance de catálogo"],
 components:["Dashboards ejecutivos","Modelado de atribución","Análisis de cohortes y churn","Análisis de unit economics"]},
{id:"EC-04",title:"Inteligencia Artificial Aplicada",area:"Innovación Tecnológica",phase:"EXpandir+",priority:"Media",
 desc:"Integración de modelos predictivos y procesos automatizados mediante IA para mejorar la experiencia de usuario y la eficiencia operativa.",
 kpis:["Reducción en tasa de abandono","Precisión en forecasting de inventario","Incremento en conversión por personalización"],
 components:["Modelos predictivos de lead scoring","Chatbots inteligentes para ventas","Recomendadores dinámicos","Precios dinámicos"]},
{id:"EC-05",title:"Operación de Ecommerce",area:"Gestión Operativa",phase:"EXpandir+",priority:"Crítica",
 desc:"Administración integral de la cadena de suministro digital, plataformas de venta y procesos de cumplimiento.",
 kpis:["Tiempos de entrega y tasa de error","NPS operativo","Optimización de costos logísticos"],
 components:["Gestión de plataformas (Shopify, VTEX)","Sincronización multicanal de inventario","Coordinación logística","Pasarelas de pago y OMS"]},
{id:"EC-06",title:"Estrategia Comercial Ecommerce",area:"Revenue Management",phase:"EXplorar+",priority:"Alta",
 desc:"Diseño de planes de ingresos y tácticas comerciales para maximizar la rentabilidad del catálogo digital.",
 kpis:["Revenue Growth","Customer Lifetime Value (LTV)","Margen de rentabilidad comercial"],
 components:["Calendario comercial (Cyber Days, Black Friday)","Bundling, cross-selling y upselling","Estrategia de surtido","Programas de membresía"]},
{id:"ARQ-01",title:"Desarrollo de Marcas",area:"Identidad Visual",phase:"EXplorar+",priority:"Alta",
 desc:"Creación de sistemas visuales integrales diseñados para proporcionar un lenguaje visual escalable y coherente en múltiples plataformas.",
 kpis:["Reducción de costos por estandarización visual","Longevidad de marca (evitar rebranding 6 meses)"],
 components:["Sistema de lenguaje visual adaptable","Estándares de calidad para ejecución rápida","Estructura anti-rebrandings prematuros"]},
{id:"ARQ-02",title:"Branding Estratégico",area:"Estrategia de Marca",phase:"EXplorar+",priority:"Alta",
 desc:"Definición del ADN competitivo y comportamiento de marca para establecer diferenciación en mercados saturados.",
 kpis:["Capacidad de atracción de Venture Capital","Justificación de Premium pricing desde lanzamiento"],
 components:["Definición de narrativa y tono","Estructuración del comportamiento visual y estratégico"]},
{id:"ARQ-03",title:"Web Design",area:"Arquitectura Digital",phase:"EXpandir+",priority:"Alta",
 desc:"Diseño de interfaces de usuario optimizadas para la conversión, enfocadas en guiar al usuario hacia acciones de compra o registro.",
 kpis:["ROI en pauta publicitaria","Tasa de conversión de tráfico a registros/ventas"],
 components:["Optimización de UX","Flujos de navegación orientados a conversión"]},
{id:"ARQ-04",title:"High-Conversion UX/UI Systems",area:"Diseño de Producto",phase:"EXpandir+",priority:"Crítica",
 desc:"Desarrollo de ecosistemas de marca diseñados específicamente para el posicionamiento premium y el levantamiento de capital.",
 kpis:["Valor intangible generado desde el día cero","Tasa de conversión del portafolio de la aceleradora"],
 components:["Arquitectura web de alta conversión","Herramientas para validación de mercado"]},
{id:"ARQ-05",title:"Brand Engineering & Equity",area:"Gestión de Activos",phase:"EXcalar+",priority:"Crítica",
 desc:"Transformación del diseño gráfico tradicional en un activo financiero que facilita la escalabilidad y validación de la startup.",
 kpis:["Incremento del valor de mercado de la startup","Precios competitivos basados en valor intangible"],
 components:["Herramientas de validación y escalabilidad","Ingeniería estratégica de marca"]},
{id:"ARQ-06",title:"Design Due Diligence",area:"Auditoría y Riesgos",phase:"EXplorar+",priority:"Media-Alta",
 desc:"Servicio de consultoría técnica que audita la viabilidad estética y comunicativa de proyectos prospectos para la aceleradora.",
 kpis:["Ahorro financiero por prevención de inversión","Horas de desarrollo recuperadas"],
 components:["Filtro de calidad visual y comunicativa","Análisis de escalabilidad global","Curaduría de proyectos para inversión"]},
{id:"IE-01",title:"Consultoría y Asistencia Técnica Inicial",area:"Comercio Exterior",phase:"EXplorar+",priority:"Alta",
 desc:"Evaluación técnica preliminar para determinar la viabilidad regulatoria y financiera de una operación de comercio exterior.",
 kpis:["Precisión en costeo proyectado vs real","Tasa de cumplimiento documental en pre-inspección"],
 components:["Clasificación arancelaria técnica","Auditoría de restricciones legales","Revisión de normas técnicas","Proyección de costeo"]},
{id:"IE-02",title:"Gestión de Resultados y Operaciones",area:"Comercio Exterior",phase:"EXpandir+",priority:"Crítica",
 desc:"Ejecución y supervisión de la cadena de suministro internacional, desde la validación del origen hasta el ingreso legal al país.",
 kpis:["Lead Time de importación","Reducción de costos logísticos por Incoterm","Confiabilidad de proveedores"],
 components:["Sourcing y validación de proveedores en China","Gestión documental aduanera","Coordinación logística multimodal","Supervisión de nacionalización"]},
{id:"IT-01",title:"Marca Digital y Landing Page",area:"Crecimiento y Conversión",phase:"EXpandir+",priority:"Alta",
 desc:"Implementación de activos web responsivos para la captación de leads y validación comercial de ofertas digitales.",
 kpis:["Tasa de conversión visitantes a leads","Tiempo de carga (LCP)"],
 components:["Diseño de interfaz responsiva","Configuración de hosting y dominio","Píxeles de seguimiento","Formularios integrados"]},
{id:"IT-02",title:"Chatbot de Ventas (Fase Beta)",area:"Crecimiento y Conversión",phase:"EXpandir+",priority:"Alta",
 desc:"Sistema de automatización para atención primaria y calificación de prospectos vía WhatsApp y Web.",
 kpis:["% de leads filtrados sin intervención humana","Tiempo medio de respuesta inicial"],
 components:["Árbol de decisión lógico","Módulo de captura de datos","Protocolo de escalamiento a agente humano"]},
{id:"IT-03",title:"Chatbot de Asesoría Avanzada",area:"Crecimiento y Conversión",phase:"EXcalar+",priority:"Media-Alta",
 desc:"Implementación de un LLM especializado en cierre de ventas mediante persuasión basada en datos técnicos y comparativos.",
 kpis:["Tasa de cierre de ventas asistida por IA","Precisión de información vs matriz de competencia"],
 components:["Integración con base de datos de productos","Matriz comparativa de competidores","Modelo NLP"]},
{id:"IT-04",title:"Automatización 360°",area:"Eficiencia Operativa",phase:"EXpandir+",priority:"Crítica",
 desc:"Integración técnica de flujos de trabajo para eliminar carga operativa manual y error humano en procesos administrativos.",
 kpis:["Reducción de horas hombre en tareas repetitivas","Disminución de errores en registros"],
 components:["Conexión API entre CRM y contable","Integración plataformas publicitarias","Sincronización de flujos contables"]},
{id:"IT-05",title:"Carga Masiva de Productos",area:"Eficiencia Operativa",phase:"EXpandir+",priority:"Alta",
 desc:"Herramienta de sincronización masiva para la actualización de catálogos entre almacén físico y tienda virtual.",
 kpis:["Tiempo de procesamiento de carga","Índice de discrepancia de stock"],
 components:["Script para procesamiento CSV/Excel","Sincronización bidireccional de fotos, precios y stock"]},
{id:"IT-06",title:"Infraestructura para Legalización",area:"Eficiencia Operativa",phase:"EXplorar+",priority:"Media-Alta",
 desc:"Ecosistema digital para agilizar la formalización técnica y financiera de nuevas unidades de negocio.",
 kpis:["Tiempo promedio de habilitación técnica","Cumplimiento de hitos legales en fechas programadas"],
 components:["Repositorio documental centralizado","Alertas de cumplimiento legal/tributario","Configuración de pasarelas de pago"]},
{id:"IT-07",title:"Data Analytics para Ventas",area:"Inteligencia de Negocios",phase:"EXpandir+",priority:"Alta",
 desc:"Centralización y visualización de indicadores críticos de marketing y ventas para decisiones basada en evidencia.",
 kpis:["Disponibilidad de datos en tiempo real","Incremento en precisión de pronósticos"],
 components:["Dashboards de visualización ejecutiva","ETL de plataformas de marketing y ventas"]},
{id:"IT-08",title:"Web Scraping de Competencia",area:"Inteligencia de Negocios",phase:"EXplorar+",priority:"Media",
 desc:"Sistema automatizado de extracción de datos de competidores para ajustar estrategias de precios dinámicos.",
 kpis:["Frecuencia de actualización de matriz de precios","Margen de competitividad de precios"],
 components:["Scripts de extracción automatizada","Datos en formatos estructurados (BD o CSV)"]},
{id:"IT-09",title:"Chatbot de Conocimiento (RAG)",area:"Inteligencia de Negocios",phase:"EXcalar+",priority:"Media",
 desc:"Implementación de IA basada en RAG para soporte interno en procesos de RRHH y operativos.",
 kpis:["Reducción de consultas manuales a RRHH y soporte técnico"],
 components:["Base de datos vectorial con documentos empresariales","Restricción de respuestas a información oficial"]},
{id:"IT-10",title:"Tracking Hub (Seguimiento)",area:"Logística e Importaciones",phase:"EXpandir+",priority:"Crítica",
 desc:"Interfaz de transparencia logística que permite el rastreo en tiempo real de mercancías desde origen hasta destino final.",
 kpis:["Reducción de tickets de soporte por estado de pedido","NPS logístico"],
 components:["Conexión con APIs de aduanas y transportistas","Interfaz de rastreo por guía","Visualización de estados en tiempo real"]}
];

// ===== STATE =====
let activePhase="all",activePriority="all",activeArea="all",searchText="",sortCol="id",sortDir="asc";

// ===== DOM =====
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const tbody=$("#tableBody"),tableEmpty=$("#tableEmpty"),resultsCount=$("#resultsCount");
const searchInput=$("#searchInput"),searchClear=$("#searchClear");
const modalOverlay=$("#modalOverlay"),modalPanel=$("#modalPanel");

// ===== INIT =====
document.addEventListener("DOMContentLoaded",()=>{
  setupAuth();populateAreaFilter();renderTable();setupFilters();setupSearch();setupSort();setupModal();setupNav();setupAnimations();animateStats();
});

// ===== AUTH =====
function setupAuth(){
  const loginScreen=$("#loginScreen"),loginBtn=$("#loginBtn"),passwordInput=$("#passwordInput"),loginError=$("#loginError");
  if(!loginScreen) return;
  
  if(sessionStorage.getItem("sh_auth")==="true"){
    loginScreen.style.display="none";
    return;
  }
  
  document.body.style.overflow="hidden";
  
  function attemptLogin(){
    if(passwordInput.value==="StartHubEstrategia.*"){
      sessionStorage.setItem("sh_auth","true");
      loginScreen.style.opacity="0";
      setTimeout(()=>{
        loginScreen.style.display="none";
        document.body.style.overflow="";
      },500);
    }else{
      loginError.style.display="block";
      passwordInput.value="";
      passwordInput.focus();
    }
  }
  
  loginBtn.onclick=attemptLogin;
  passwordInput.addEventListener("keypress",e=>{if(e.key==="Enter")attemptLogin()});
}

// ===== AREA FILTER =====
function populateAreaFilter(){
  const areas=[...new Set(services.map(s=>s.area))].sort();
  const dd=$("#areaDropdown");
  dd.innerHTML=`<div class="select-option active" data-value="all">Todas las Áreas</div>`+areas.map(a=>`<div class="select-option" data-value="${a}">${a}</div>`).join("");
  const trigger=$("#areaTrigger");
  trigger.onclick=()=>dd.classList.toggle("open");
  dd.querySelectorAll(".select-option").forEach(o=>{
    o.onclick=()=>{
      dd.querySelectorAll(".select-option").forEach(x=>x.classList.remove("active"));
      o.classList.add("active");
      activeArea=o.dataset.value;
      trigger.querySelector("span").textContent=activeArea==="all"?"Todas las Áreas":activeArea;
      dd.classList.remove("open");
      renderTable();
    };
  });
  document.addEventListener("click",e=>{if(!$("#areaSelect").contains(e.target))dd.classList.remove("open")});
}

// ===== FILTERS =====
function setupFilters(){
  $$(".filter-chip").forEach(chip=>{
    chip.onclick=()=>{
      const type=chip.dataset.filter,val=chip.dataset.value;
      chip.closest(".filter-chips").querySelectorAll(".filter-chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      if(type==="phase")activePhase=val;
      if(type==="priority")activePriority=val;
      renderTable();
    };
  });
  $("#resetFilters").onclick=resetAllFilters;
}
function resetAllFilters(){
  activePhase="all";activePriority="all";activeArea="all";searchText="";searchInput.value="";searchClear.classList.remove("visible");
  $$(".filter-chip").forEach(c=>{c.classList.remove("active");if(c.dataset.value==="all")c.classList.add("active")});
  $("#areaDropdown").querySelectorAll(".select-option").forEach(o=>{o.classList.remove("active");if(o.dataset.value==="all")o.classList.add("active")});
  $("#areaTrigger").querySelector("span").textContent="Todas las Áreas";
  renderTable();
}
window.resetAllFilters=resetAllFilters;

// ===== SEARCH =====
function setupSearch(){
  searchInput.oninput=()=>{searchText=searchInput.value.toLowerCase();searchClear.classList.toggle("visible",searchText.length>0);renderTable()};
  searchClear.onclick=()=>{searchInput.value="";searchText="";searchClear.classList.remove("visible");renderTable()};
}

// ===== SORT =====
function setupSort(){
  $$(".data-table th").forEach(th=>{
    th.onclick=()=>{
      const col=th.dataset.sort;
      if(sortCol===col)sortDir=sortDir==="asc"?"desc":"asc";else{sortCol=col;sortDir="asc"}
      $$(".data-table th").forEach(t=>t.classList.remove("sorted"));
      th.classList.add("sorted");
      renderTable();
    };
  });
}

// ===== RENDER TABLE =====
function getPhaseClass(p){return p==="EXplorar+"?"explorar":p==="EXpandir+"?"expandir":"excalar"}
function getPriorityClass(p){return p==="Crítica"?"critica":p==="Alta"?"alta":p==="Media-Alta"?"media-alta":"media"}

function renderTable(){
  let data=services.filter(s=>{
    if(activePhase!=="all"&&s.phase!==activePhase)return false;
    if(activePriority!=="all"&&s.priority!==activePriority)return false;
    if(activeArea!=="all"&&s.area!==activeArea)return false;
    if(searchText){const t=searchText;return s.id.toLowerCase().includes(t)||s.title.toLowerCase().includes(t)||s.area.toLowerCase().includes(t)||s.phase.toLowerCase().includes(t)}
    return true;
  });
  const priorityOrder={Crítica:0,Alta:1,"Media-Alta":2,Media:3};
  data.sort((a,b)=>{
    let va,vb;
    if(sortCol==="priority"){va=priorityOrder[a.priority];vb=priorityOrder[b.priority]}
    else{va=a[sortCol==="title"?"title":sortCol==="area"?"area":sortCol==="phase"?"phase":"id"];vb=b[sortCol==="title"?"title":sortCol==="area"?"area":sortCol==="phase"?"phase":"id"]}
    if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase()}
    if(va<vb)return sortDir==="asc"?-1:1;if(va>vb)return sortDir==="asc"?1:-1;return 0;
  });
  tbody.innerHTML=data.map(s=>`
    <tr data-id="${s.id}">
      <td class="td-id">${s.id}</td>
      <td class="td-title">${s.title}</td>
      <td class="td-area">${s.area}</td>
      <td><span class="phase-badge ${getPhaseClass(s.phase)}"><span class="chip-dot phase-${getPhaseClass(s.phase)}"></span>${s.phase}</span></td>
      <td><span class="priority-badge ${getPriorityClass(s.priority)}">${s.priority}</span></td>
    </tr>`).join("");
  resultsCount.textContent=`Mostrando ${data.length} servicio${data.length!==1?"s":""}`;
  tableEmpty.style.display=data.length===0?"block":"none";
  tbody.querySelectorAll("tr").forEach(tr=>{tr.onclick=()=>openModal(tr.dataset.id)});
}

// ===== MODAL =====
function setupModal(){
  modalOverlay.onclick=e=>{if(e.target===modalOverlay)closeModal()};
  $("#modalClose").onclick=closeModal;
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
}
function openModal(id){
  const s=services.find(x=>x.id===id);if(!s)return;
  $("#modalId").textContent=s.id;
  $("#modalPhaseBadge").className="phase-badge "+getPhaseClass(s.phase);
  $("#modalPhaseBadge").textContent=s.phase;
  $("#modalTitle").textContent=s.title;
  $("#modalArea").textContent=s.area;
  const mp=$("#modalPriority");mp.textContent=s.priority;mp.className="meta-value priority-badge "+getPriorityClass(s.priority);
  $("#modalDescription").textContent=s.desc;
  const justEl=$("#modalJustification"),justSection=$("#modalJustificationSection");
  if(s.justification&&s.justification.trim()){justEl.textContent=s.justification;justSection.style.display="";}
  else{justEl.textContent="";justSection.style.display="none";}
  $("#modalKpis").innerHTML=s.kpis.map(k=>`<li>${k}</li>`).join("");
  $("#modalComponents").innerHTML=s.components.map(c=>`<li>${c}</li>`).join("");
  modalOverlay.classList.add("open");document.body.style.overflow="hidden";
}
function closeModal(){modalOverlay.classList.remove("open");document.body.style.overflow=""}

// ===== NAV =====
function setupNav(){
  const nav=$("#navbar");
  window.addEventListener("scroll",()=>{nav.classList.toggle("scrolled",window.scrollY>50)});
  $("#navToggle").onclick=()=>$("#navLinks").classList.toggle("open");
  $$(".nav-link").forEach(link=>{
    link.onclick=()=>{$$(".nav-link").forEach(l=>l.classList.remove("active"));link.classList.add("active");$("#navLinks").classList.remove("open")};
  });
  window.addEventListener("scroll",()=>{
    const sections=["hero","methodology","pillars","resources","dashboard","evaluate-module","consolidate-module","blueprint-editor","diagnostico"];
    let current="";
    sections.forEach(id=>{const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-200)current=id});
    $$(".nav-link").forEach(l=>{l.classList.toggle("active",l.getAttribute("href")==="#"+current)});
  });
}

// ===== ANIMATIONS =====
function setupAnimations(){
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")})},{threshold:0.1});
  $$(".method-card,.pillar-card,.section-header,.video-container,.download-card,.eval-identity-card,.eval-section .table-wrapper,.drop-zone,.editor-card-list,.editor-section .results-bar,.diag-card").forEach(el=>{el.classList.add("fade-in");obs.observe(el)});
}
function animateStats(){
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){
    e.target.querySelectorAll(".stat-number").forEach(el=>{
      const target=+el.dataset.target;let current=0;
      const step=()=>{current+=Math.ceil(target/30);if(current>=target){el.textContent=target;return}el.textContent=current;requestAnimationFrame(step)};step();
    });obs.unobserve(e.target);
  }})},{threshold:0.5});
  const stats=$(".hero-stats");if(stats)obs.observe(stats);
}
