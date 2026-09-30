import type { L, LList } from "@/lib/l10n";

/**
 * Amplía Consultoría — contenido TEXTUAL de las 18 láminas
 * (Apéndice A de ~/Developer/_material-amplia/PLAN-northa-amplia.md) y de la
 * referencia visual aprobada. Es texto de la empresa: no se parafrasea ni se
 * le agregan servicios. La versión en inglés es traducción fiel.
 *
 * OJO: es AMPLÍA, con acento.
 */

export const ampliaHero = {
  eyebrow: { es: "Aliado en gestión pública", en: "Public management partner" },
  // Frase tomada de "¿Quiénes somos?".
  title: {
    es: "Acompañamiento y fortalecimiento de la gestión pública municipal.",
    en: "Supporting and strengthening municipal public management.",
  },
  lead: {
    es: "Asesoría jurídica especializada para los Ayuntamientos del Estado de Sonora, actualización de la información de los sujetos obligados en transparencia y rendición de cuentas, y trabajo organizacional para la modernización administrativa.",
    en: "Specialized legal advisory for the municipalities of the State of Sonora, updating the information of obligated parties on transparency and accountability, and organizational work for administrative modernization.",
  },
} satisfies Record<string, L>;

export const ampliaStats: { value: string; label: L; note?: L }[] = [
  {
    value: "36 %",
    label: {
      es: "de los municipios sonorenses han recibido su acompañamiento técnico",
      en: "of Sonora's municipalities have received their technical support",
    },
    note: { es: "Dato de Amplía Consultoría", en: "Figure provided by Amplía Consultoría" },
  },
  {
    value: "16",
    label: {
      es: "ayuntamientos respaldan su labor profesional",
      en: "municipalities endorse their professional work",
    },
  },
  {
    value: "3 + 1",
    label: {
      es: "etapas de trabajo, con la transparencia como eje transversal",
      en: "work stages, with transparency as the cross-cutting axis",
    },
  },
];

export const quienesSomos: L = {
  es: "Somos un equipo de profesionales, especializados en el acompañamiento y fortalecimiento de la gestión pública municipal, enfocados en el ámbito gubernamental, así como la actualización de la información de los sujetos obligados en temas de transparencia y rendición de cuentas, siendo una consultoría enfocada en el trabajo organizacional para lograr una modernización administrativa.",
  en: "We are a team of professionals specialized in supporting and strengthening municipal public management, focused on the government sphere, as well as on updating the information of obligated parties on transparency and accountability — a consultancy focused on organizational work to achieve administrative modernization.",
};

export const mision: L = {
  es: "Somos una consultoría especializada en gestión y desarrollo estratégico, comprometidos con brindar asesoría jurídica especializada, ética y eficiente a los Ayuntamientos del Estado de Sonora. Nuestro propósito es fortalecer sus capacidades institucionales, garantizar el cumplimiento del marco normativo y promover una administración pública municipal transparente, ordenada y sustentada en los principios de la legalidad. Con un enfoque humano y cercano, buscamos acompañar a nuestros clientes en su desarrollo y transformación.",
  en: "We are a consultancy specialized in management and strategic development, committed to providing specialized, ethical and efficient legal advisory to the municipalities of the State of Sonora. Our purpose is to strengthen their institutional capacities, ensure compliance with the regulatory framework and promote a transparent, orderly municipal public administration grounded in the principles of legality. With a human, close approach, we seek to accompany our clients in their development and transformation.",
};

export const vision: L = {
  es: "Aspiramos a consolidarnos como la consultoría jurídica de referencia en Sonora, reconocida por nuestra excelencia técnica, compromiso con la mejora continua y dedicación al servicio público, contribuyendo al fortalecimiento institucional, a la democracia y al desarrollo sostenible de los gobiernos locales. Buscamos crecer junto a nuestros clientes y colaboradores, promoviendo una gestión pública transparente, innovadora y responsable.",
  en: "We aspire to become the reference legal consultancy in Sonora, recognized for our technical excellence, commitment to continuous improvement and dedication to public service, contributing to institutional strengthening, democracy and the sustainable development of local governments. We seek to grow alongside our clients and collaborators, promoting transparent, innovative and responsible public management.",
};

export const objetivos: LList = {
  es: [
    "Brindar asesoría jurídica de calidad que contribuya al buen gobierno y la transparencia en los Municipios.",
    "Fortalecer las capacidades técnicas y éticas de las instituciones públicas municipales.",
    "Promover prácticas preventivas y responsables en la gestión pública.",
    "Ser un aliado confiable para los Ayuntamientos en sus procesos de modernización y desarrollo institucional.",
  ],
  en: [
    "Provide quality legal advisory that contributes to good governance and transparency in municipalities.",
    "Strengthen the technical and ethical capacities of municipal public institutions.",
    "Promote preventive and responsible practices in public management.",
    "Be a reliable partner for municipalities in their modernization and institutional development processes.",
  ],
};

export const valores: LList = {
  es: [
    "Ética y legalidad en todas nuestras acciones",
    "Transparencia y compromiso social",
    "Calidad técnica y excelencia profesional",
    "Trabajo en equipo, empatía y respeto por las instituciones y las personas",
    "Innovación y adaptación a los cambios del entorno jurídicos y sociales",
    "Responsabilidad y confiabilidad en el servicio",
    "Orientación hacia resultados y crecimiento sostenido",
  ],
  en: [
    "Ethics and legality in all our actions",
    "Transparency and social commitment",
    "Technical quality and professional excellence",
    "Teamwork, empathy and respect for institutions and people",
    "Innovation and adaptation to legal and social changes",
    "Responsibility and reliability in service",
    "Results orientation and sustained growth",
  ],
};

/** "Nuestro enfoque" — títulos de las láminas; descripciones de la referencia aprobada. */
export const enfoque: { title: L; body: L }[] = [
  {
    title: { es: "Entrega‑recepción", en: "Administration handover" },
    body: {
      es: "Acompañamiento en la transición administrativa, el momento de mayor riesgo institucional del trienio.",
      en: "Support during the administrative transition, the moment of greatest institutional risk in the three-year term.",
    },
  },
  {
    title: { es: "Plan Municipal de Desarrollo", en: "Municipal Development Plan" },
    body: {
      es: "Elaboración del instrumento rector, con enfoque de resultados y alineación normativa.",
      en: "Drafting the guiding instrument, with a results focus and regulatory alignment.",
    },
  },
  {
    title: { es: "Normatividad vigente", en: "Current regulations" },
    body: {
      es: "Actualización del marco aplicable al Ayuntamiento: reglamentos, manuales, lineamientos.",
      en: "Updating the framework that applies to the municipality: regulations, manuals, guidelines.",
    },
  },
  {
    title: { es: "Auditorías", en: "Audits" },
    body: {
      es: "Atención y seguimiento ante los entes fiscalizadores, con evidencia documentada.",
      en: "Attention and follow-up before oversight bodies, with documented evidence.",
    },
  },
  {
    title: { es: "Transparencia", en: "Transparency" },
    body: {
      es: "Planes de trabajo en el portal municipal y en el nacional, para los sujetos obligados.",
      en: "Work plans on the municipal and national transparency portals, for obligated parties.",
    },
  },
  {
    title: { es: "Blindaje", en: "Safeguards" },
    body: {
      es: "Estrategias para las áreas de oportunidad y para los actos de autoridad.",
      en: "Strategies for areas of opportunity and for acts of authority.",
    },
  },
];

/** Metodología — lámina 7: tres círculos + Transparencia como eje transversal. */
export const metodologia: { tag: L; title: L; body: L; transversal?: boolean }[] = [
  {
    tag: { es: "Etapa 1", en: "Stage 1" },
    title: { es: "Planeación", en: "Planning" },
    body: {
      es: "Diagnóstico, diseño de estrategias y cumplimiento normativo, abarcando ámbitos relacionados con la transparencia y la normatividad.",
      en: "Assessment, strategy design and regulatory compliance, covering areas related to transparency and regulations.",
    },
  },
  {
    tag: { es: "Etapa 2", en: "Stage 2" },
    title: { es: "Implementación", en: "Implementation" },
    body: {
      es: "Ejecución técnica de los procedimientos y fortalecimiento del control interno, atendiendo las responsabilidades administrativas correspondientes.",
      en: "Technical execution of procedures and strengthening of internal control, addressing the corresponding administrative responsibilities.",
    },
  },
  {
    tag: { es: "Etapa 3", en: "Stage 3" },
    title: { es: "Seguimiento", en: "Follow-up" },
    body: {
      es: "Evaluación, observación y mejora continua, vinculándose con los procesos de entrega-recepción y la rendición de cuentas.",
      en: "Evaluation, observation and continuous improvement, linked to the handover and accountability processes.",
    },
  },
  {
    tag: { es: "Eje transversal", en: "Cross-cutting axis" },
    title: { es: "Transparencia", en: "Transparency" },
    body: {
      es: "Atraviesa las tres etapas: es el resultado que las une, no una fase aparte.",
      en: "It runs through all three stages: it's the result that binds them, not a separate phase.",
    },
    transversal: true,
  },
];

/** Pasos a seguir — en el orden de la referencia aprobada. */
export const pasos: LList = {
  es: [
    "Carta compromiso del municipio, indicando la línea o líneas de acción.",
    "Formalización del contrato de prestación de servicios.",
    "Determinación del equipo de trabajo del Ayuntamiento.",
    "Diagnóstico para determinar escenario y complejidad.",
    "Elaboración del plan de trabajo para su autorización.",
    "Inicio y seguimiento del plan, de manera conjunta.",
  ],
  en: [
    "Letter of commitment from the municipality, indicating the line or lines of action.",
    "Formalization of the service contract.",
    "Designation of the municipality's work team.",
    "Assessment to determine the scenario and complexity.",
    "Drafting of the work plan for approval.",
    "Joint start and follow-up of the plan.",
  ],
};

/** Control interno / auditoría integral — lámina 9. */
export const controlInterno: { title: L; items: LList }[] = [
  {
    title: {
      es: "Auditoría financiera — metas y declaración patrimonial",
      en: "Financial audit — goals and asset declarations",
    },
    items: {
      es: ["Fortalecimiento a la auditoría de la cuenta pública", "Auditoría presupuestal"],
      en: ["Strengthening the public account audit", "Budget audit"],
    },
  },
  {
    title: { es: "Auditoría legal y desempeño", en: "Legal and performance audit" },
    items: {
      es: [
        "Calendarización de auditorías internas",
        "Documentar las acciones y evidencias del cumplimiento de metas del ayuntamiento",
      ],
      en: [
        "Scheduling internal audits",
        "Documenting the actions and evidence of the municipality's goal compliance",
      ],
    },
  },
  {
    title: { es: "Auditoría obra pública", en: "Public works audit" },
    items: {
      es: ["Atención a observaciones realizadas", "Asesorías en proyectos de mejora"],
      en: ["Addressing audit observations", "Advisory on improvement projects"],
    },
  },
];

export const colaboracionesQuote: L = {
  es: "Actualmente, 36 % de los municipios sonorenses han recibido acompañamiento técnico de Amplía Consultoría, con resultados visibles en transparencia, rendición de cuentas y eficiencia administrativa.",
  en: "Currently, 36% of Sonora's municipalities have received technical support from Amplía Consultoría, with visible results in transparency, accountability and administrative efficiency.",
};

export const acciones: LList = {
  es: [
    "Planeación estratégica con enfoque de resultados",
    "Implementación técnica y legal",
    "Acompañamiento continuo y reportes mensuales",
  ],
  en: [
    "Strategic planning with a results focus",
    "Technical and legal implementation",
    "Continuous support and monthly reports",
  ],
};

export const resultados: LList = {
  es: [
    "36 % de los municipios del estado han trabajado con nosotros",
    "Reducción de observaciones de auditoría y cumplimiento",
    "Procesos administrativos fortalecidos y documentados",
    "Implementación exitosa de reglamentación y manuales",
  ],
  en: [
    "36% of the state's municipalities have worked with us",
    "Fewer audit and compliance observations",
    "Strengthened, documented administrative processes",
    "Successful implementation of regulations and manuals",
  ],
};

export const retos: L = {
  es: "Los Municipios de Sonora enfrentan desafíos comunes que limitan su desarrollo institucional y la eficiencia de su gestión pública. Entre los principales destacan la falta de planeación estratégica, el cumplimiento parcial de la normatividad, la ausencia de manuales y reglamentos actualizados, así como la necesidad de fortalecer la capacitación del personal y los mecanismos de evaluación de resultados. Asimismo, persisten áreas de oportunidad para incorporar la perspectiva de género, la igualdad sustantiva y los Objetivos de Desarrollo Sostenible en las políticas municipales.",
  en: "Sonora's municipalities face common challenges that limit their institutional development and the efficiency of their public management. The main ones include a lack of strategic planning, partial regulatory compliance, the absence of up-to-date manuals and regulations, and the need to strengthen staff training and results-evaluation mechanisms. There are also opportunities to incorporate a gender perspective, substantive equality and the Sustainable Development Goals into municipal policies.",
};

/** Ayuntamientos que respaldan su labor — láminas 15–17, con administraciones. */
export const ayuntamientosAmplia: { nombre: string; administraciones: string[] }[] = [
  { nombre: "Rayón", administraciones: ["2021-2024"] },
  { nombre: "Tepache", administraciones: ["2021-2024"] },
  { nombre: "San Javier", administraciones: ["2015-2018", "2018-2021", "2021-2024"] },
  { nombre: "Sahuaripa", administraciones: ["2015-2018", "2021-2024"] },
  { nombre: "Arivechi", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Soyopa", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Carbó", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "San Miguel de Horcasitas", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Granados", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Bacerac", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Bacadéhuachi", administraciones: ["2021-2024"] },
  { nombre: "Villa Pesqueira", administraciones: ["2021-2024"] },
  { nombre: "Aconchi", administraciones: ["2021-2024"] },
  { nombre: "Bacanora", administraciones: ["2018-2021", "2021-2024"] },
  { nombre: "Mazatán", administraciones: ["2018-2021"] },
  { nombre: "Arizpe", administraciones: ["2021-2024"] },
];

export const alianza = {
  eyebrow: { es: "Diez municipios en común", en: "Ten municipalities in common" },
  title: { es: "Los mismos ayuntamientos, por los dos lados.", en: "The same municipalities, from both sides." },
  lead: {
    es: "De los catorce portales que construyó Northa, diez son municipios que Amplía Consultoría ya había acompañado en su gestión. El portal publica; la consultoría ordena lo que se publica.",
    en: "Of the fourteen portals Northa built, ten are municipalities Amplía Consultoría had already supported in their management. The portal publishes; the consultancy organizes what gets published.",
  },
  note: {
    es: "Los otros cuatro portales de Northa —Banámichi, Baviácora, Cucurpe y Huachinera— aún no aparecen en la lista de ayuntamientos de Amplía.",
    en: "Northa's other four portals —Banámichi, Baviácora, Cucurpe and Huachinera— don't yet appear on Amplía's list of municipalities.",
  },
  motto: { es: "Amplía ordena la gestión, Northa la publica.", en: "Amplía organizes the administration; Northa publishes it." },
} satisfies Record<string, L>;
