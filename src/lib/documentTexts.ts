export interface AcademyDocument {
  key: string;
  version: string; // ISO date string used as version identifier
  title: string;
  content: string;
}

export const REQUIRED_DOCUMENT_KEYS = ["compromiso_2s_2026", "codigo_etica_2026"] as const;
export type DocumentKey = (typeof REQUIRED_DOCUMENT_KEYS)[number];

export const ACADEMY_DOCUMENTS: AcademyDocument[] = [
  {
    key: "compromiso_2s_2026",
    version: "2026-08-14",
    title: "Carta Compromiso — Segundo Semestre 2026",
    content: `CARTA COMPROMISO DE PARTICIPACIÓN Y PREPARACIÓN
Academia Te Fare Mo'a — Segundo semestre 2026

Estimada bailarina:

Con gran alegría cerramos nuestra Presentación Anual 2026 "TE MANA O TE HERE – El poder del amor". Fue un proceso de mucho aprendizaje, esfuerzo compartido y crecimiento colectivo. Gracias a todas por el compromiso demostrado durante este primer semestre.

Ahora iniciamos una nueva etapa, igualmente exigente y enriquecedora. A continuación te detallamos el programa para el segundo semestre 2026.


PROGRAMA SEGUNDO SEMESTRE 2026

Agosto — Preparación física (en curso)
Durante este mes nos enfocamos en el acondicionamiento físico: trabajo de postura, resistencia, fuerza y base técnica. Esta etapa es fundamental para el nivel de exigencia que viene en los meses siguientes.

Septiembre — Ensayos para el Festival Vívelo
En septiembre realizaremos clases adicionales destinadas al montaje y preparación para nuestra participación en el Festival Vívelo. Estas instancias son clases extras sin costo adicional a la mensualidad. La asistencia será fundamental para participar en el festival.

Octubre — Festival Vívelo 2026
Fechas: viernes 10, sábado 11 y domingo 12 de octubre de 2026.
La participación en este evento es voluntaria, aunque la preparación en clases es parte del proceso formativo independiente de si participas o no en el escenario.

Diciembre — Evaluación individual de fin de año
Al igual que en años anteriores, realizaremos un proceso de evaluación individual en el que cada bailarina, junto a los directores, revisará su evolución, identificará logros y se planteará objetivos para el ciclo siguiente.


RESPECTO DE LA PARTICIPACIÓN, COMPROMISO Y PERMANENCIA

Para la Academia es fundamental el compromiso y la permanencia de sus estudiantes durante todo el proceso. Queremos enfatizar que cada etapa —preparación física, ensayos, festival, evaluación— forma parte de un proceso continuo de aprendizaje y no son actividades aisladas.


IMPORTANTE

· Toda estudiante que participe en el proceso del segundo semestre se compromete a mantener el pago de la mensualidad hasta diciembre de 2026, aun en caso de ausencias por vacaciones u otras razones laborales, académicas o familiares (salvo enfermedad u otra situación especial conversada con la dirección).

· El incumplimiento de este acuerdo dará a los directores la facultad de evaluar la reincorporación a la academia en el próximo período (marzo 2027).

· En caso de ausencias por motivos personales, se deberá avisar oportunamente. Es importante mantener una buena comunicación durante todo el proceso.

· La participación en el Festival Vívelo y en los ensayos adicionales de septiembre es voluntaria; sin embargo, la asistencia regular a clases es el compromiso central de toda estudiante.


MENSUALIDAD SEGUNDO SEMESTRE 2026

· 1 vez por semana: $42.000
· 2 veces por semana: $55.000
· 3 veces por semana: $68.000


PREGUNTAS DE CONFIRMACIÓN

Al aceptar este documento, declaras:

1. Cuáles son tus días de participación en clases (lunes, miércoles, jueves y/o viernes).
2. Si participarás en el Festival Vívelo (octubre 10–12), con qué grupo o coreografía.
3. Cuántas clases por semana realizarás de acuerdo con tu disponibilidad y presupuesto, señalando la fecha de inicio de pago.
4. Que estás de acuerdo con las condiciones de participación, incluyendo el compromiso de pago mensual hasta diciembre de 2026 y las condiciones señaladas respecto de la continuidad del proceso formativo.
5. En caso de ausentarte en alguno de los próximos meses, debes indicarlo señalando, en lo posible, fechas y motivos.

Si tienes alguna consulta respecto de las condiciones señaladas en este documento, comunícate con la dirección antes de aceptar.

Ángela Ortiz y Jorge Toledo
Directores de Te Fare Mo'a
Santiago, agosto 2026`,
  },
  {
    key: "codigo_etica_2026",
    version: "2026-08-14",
    title: "Código de Ética — Academia Te Fare Mo'a",
    content: `CÓDIGO DE ÉTICA DE LA ACADEMIA TE FARE MO'A

Carta de la Dirección

En nuestra academia concebimos la danza como un camino de transformación personal y colectiva. Creemos profundamente en el poder del arte para fortalecer la identidad, la disciplina, el respeto y la sensibilidad. Cada estudiante que ingresa a este espacio se convierte en parte de una comunidad que aprende, se apoya y crece en conjunto.

Sabemos, desde nuestra experiencia pedagógica, que el aprendizaje solo florece en un ambiente sano y respetuoso. Por eso, este Código de Ética no es solo un reglamento: es un compromiso común que nos guía, nos cuida y nos une. A través de él reafirmamos nuestro propósito de mantener una convivencia positiva, preventiva y formativa, alineada con la Política Nacional de Convivencia Educativa (PNCE 2024–2030) del Ministerio de Educación de Chile.

Confiamos en que cada integrante de esta comunidad asumirá su parte en este compromiso: prevenir, cuidar y construir juntos un entorno donde la danza se viva con alegría, respeto y propósito.

Dirección de la Academia Te Fare Mo'a
Santiago, agosto 2026


FUNDAMENTO Y VINCULACIÓN CON LA PNCE 2024–2030

Este Código de Ética se sustenta en los valores y orientaciones de la Política Nacional de Convivencia Educativa (PNCE 2024–2030) del Ministerio de Educación de Chile, que promueve comunidades educativas basadas en el respeto, la inclusión, la colaboración y la resolución pacífica de conflictos. Desde nuestra realidad como academia de danza, adaptamos estos principios para garantizar un ambiente formativo, seguro y respetuoso, donde cada integrante pueda desarrollarse plenamente en lo humano y en lo artístico. Nos alineamos especialmente con el enfoque preventivo de la PNCE, entendiendo que la mejor convivencia se construye antes de que surjan los conflictos, mediante el diálogo, la empatía y la responsabilidad compartida.


1. PRINCIPIOS FUNDAMENTALES

En nuestra academia entendemos la danza como un espacio de crecimiento personal y colectivo. Cada persona que forma parte de este lugar —estudiante, docente o colaborador— contribuye al ambiente humano y artístico que buscamos cuidar y fortalecer. Este Código de Ética establece las bases de convivencia que garantizan un entorno seguro, positivo y coherente con los valores de nuestra comunidad y con la PNCE.


2. COMPROMISO CON EL RESPETO Y LA CONVIVENCIA

· Toda persona que integre la academia debe mantener una actitud de respeto hacia sus compañeras, profesoras y equipo de trabajo, tanto dentro como fuera de las clases.
· No se tolerarán comportamientos, comentarios ni actitudes que generen conflicto, división, discriminación o mal ambiente.
· Las diferencias personales o desacuerdos deberán ser abordados con madurez, diálogo y, si es necesario, con el acompañamiento de la dirección.
· Está estrictamente prohibida cualquier forma de hostigamiento, burla, exclusión o rumor que afecte la integridad o tranquilidad de otras personas.
· Promovemos la convivencia preventiva y formativa, fortaleciendo habilidades socioemocionales como la empatía, la comunicación asertiva y la autorregulación emocional.
· La prevención de conflictos es tarea de todas y todos: cuidamos nuestras palabras, actitudes y gestos para construir un ambiente donde el respeto sea la norma cotidiana.


3. CULTURA DE COLABORACIÓN Y COMPETENCIA SANA

· En nuestra academia valoramos la competencia como un proceso de superación personal, que impulsa a cada estudiante a dar lo mejor de sí misma, reconociendo su propio ritmo y proceso.
· La competencia sana motiva, inspira y fortalece; la competitividad negativa, basada en la comparación, la envidia o el ego, no tiene cabida en este espacio.
· El progreso individual se celebra como logro colectivo, comprendiendo que el crecimiento de una compañera contribuye al fortalecimiento del grupo.
· La generosidad, la empatía, la humildad y la cooperación son pilares de nuestra formación artística y humana.


4. COMPROMISO CON EL AMBIENTE DE APRENDIZAJE

· Cada estudiante debe presentarse a clases con una actitud abierta, receptiva y respetuosa hacia las indicaciones del profesorado.
· Se espera puntualidad, compromiso y disposición activa para aprender y aportar al grupo.
· Cuidar el espacio físico, emocional y simbólico de la academia es responsabilidad compartida.
· Promovemos la prevención activa de conflictos: actuar con respeto, escuchar, anticipar tensiones y pedir apoyo cuando algo incomoda es parte del compromiso ético de cada integrante.
· Cualquier conducta que interrumpa el ambiente de aprendizaje o afecte la armonía grupal será revisada por la dirección, privilegiando siempre el diálogo y la reflexión.


5. RESPONSABILIDAD Y CONSECUENCIAS

· El incumplimiento de este código será evaluado por la dirección de la academia, pudiendo derivar en llamados de atención, suspensión o desvinculación, según la gravedad de la falta.
· De acuerdo con la PNCE, se priorizará una gestión educativa y preventiva de los conflictos, orientada a la reflexión, la reparación y el aprendizaje, más que al castigo.
· Toda medida buscará fortalecer la convivencia y el sentido de comunidad, no deteriorarlo.


6. ESPÍRITU DE COMUNIDAD

Nuestra academia existe gracias a la confianza, el respeto y la entrega de quienes la conforman. Cada integrante es parte activa de una comunidad que entiende la danza como una vía para crecer, compartir y convivir en armonía. Prevenir, cuidar y acompañar son responsabilidades compartidas que sostienen nuestro trabajo y nuestra identidad como comunidad.`,
  },
];

export function getDocument(key: string): AcademyDocument | undefined {
  return ACADEMY_DOCUMENTS.find((d) => d.key === key);
}
