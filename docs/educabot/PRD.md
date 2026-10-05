# PRD — Educabot
## Centro de mando de aprendizaje confiable sobre PRAXIOS + Meta-Harness

**Versión:** 1.0  
**Estado:** Product definition / ready for implementation planning  
**Dominio:** educabot.cl  
**Repositorio:** deepanalytica/praxios  
**Rama:** feature/educabot-prd  
**Producto:** Educabot  
**Motor interno:** PRAXIOS + Meta-Harness + EL PUENTE + Súper Prompt Euler + Tiburón  
**Mercado inicial:** Chile — educación escolar, docentes, estudiantes, apoderados y equipos directivos  

---

# 1. Resumen ejecutivo

Educabot no será un chatbot escolar ni un generador genérico de guías.

Será un **sistema operativo de aprendizaje y centro de mando educativo** que usa IA para:

1. ayudar a docentes a diseñar clases, experiencias, guías, experimentos, evaluaciones, afiches, cómics y videos;
2. ayudar a estudiantes a aprender mediante interfaces, simulaciones, mapas, ejercicios, calendarios, alertas y rutas personalizadas;
3. entregar a apoderados una capa de confianza y visibilidad sobre el aprendizaje, sin convertir el sistema en vigilancia;
4. entregar a profesores, UTP y dirección un **Decision Room educativo** capaz de observar, medir, anticipar dificultades y recomendar intervenciones;
5. reducir el riesgo de que estudiantes, docentes o apoderados confundan una respuesta fluida de IA con conocimiento verificado.

La tesis del producto es:

> **La IA debe trabajar más para que el alumno piense mejor, no para que piense menos.**

Educabot debe transformar el uso de IA desde consumo de respuestas hacia **entrenamiento cognitivo, diseño pedagógico, verificación, práctica, reconstrucción, medición y anticipación**.

---

# 2. Problema

## 2.1 Problema del estudiante

Hoy un estudiante puede preguntar cualquier tema a un LLM y recibir una respuesta convincente sin saber:

- si está correcta;
- si está alineada con el nivel o currículo;
- si está simplificada en exceso;
- si contiene una alucinación;
- si las referencias existen;
- si una afirmación es un hecho, una interpretación o una hipótesis;
- si realmente comprendió o solo reconoció el texto;
- qué conocimientos previos le faltan;
- qué debe estudiar después;
- cuándo tiene pruebas, tareas o fechas relevantes.

El problema no es solo acceso a información.

Es **falta de dirección, trazabilidad y autoridad epistemológica**.

## 2.2 Problema del docente

Los profesores ya usan IA, pero pierden tiempo operando herramientas generalistas:

- repetir prompts para obtener una planificación útil;
- corregir guías que no respetan el nivel;
- rehacer cómics por inconsistencia de personajes;
- pelear con una IA para crear un afiche;
- adaptar textos a NEE o diferentes ritmos;
- generar preguntas que realmente midan el OA;
- preparar una clase para el día siguiente;
- producir material audiovisual;
- copiar y pegar entre Claude, ChatGPT, Canva, documentos y LMS;
- comprobar que el contenido generado no tenga errores;
- analizar resultados de evaluaciones manualmente.

El profesor no quiere convertirse en prompt engineer.

Quiere decir:

> “Mañana tengo 7° básico, 90 minutos, quiero enseñar tectónica de placas y sé que a este curso le cuesta pensar con modelos.”

y recibir un paquete pedagógico listo para revisar y usar.

## 2.3 Problema del apoderado

El apoderado no sabe necesariamente:

- qué está aprendiendo su hijo;
- qué tiene pendiente;
- qué conceptos están débiles;
- si el contenido generado por IA es confiable;
- cómo ayudar sin enseñar mal;
- qué fecha próxima importa;
- cuándo conviene intervenir.

Necesita orientación breve, confiable y accionable.

## 2.4 Problema del colegio

Los datos educativos suelen llegar tarde y fragmentados:

- notas después de la evaluación;
- asistencia;
- tareas entregadas;
- promedios;
- reportes finales.

Falta una capa que responda:

> “¿Dónde se está rompiendo el aprendizaje ahora y qué deberíamos hacer antes de la próxima unidad?”

Ese es el espacio del **Centro de Mando Educativo**.

---

# 3. Visión

Educabot debe convertirse en la capa de coordinación del aprendizaje de una comunidad educativa.

No organiza solo contenido.

Organiza:

- conocimiento;
- evidencia;
- calendario;
- tareas;
- experiencias;
- habilidades;
- progreso;
- intervenciones;
- riesgos;
- materiales;
- decisiones pedagógicas.

## 3.1 Visión de sistema

```
                           EDUCABOT
                Sistema operativo de aprendizaje
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
      DOCENTE                ALUMNO               FAMILIA
         │                     │                     │
         └──────────────┬──────┴──────┬──────────────┘
                        │             │
                 CURRÍCULUM      CALENDARIO VIVO
                        │             │
                        └──────┬──────┘
                               │
                         LEARNING GRAPH
                               │
                            PRAXIOS
                     ejecución + estado
                               │
                    SÚPER PROMPT EULER
                               │
                          EL PUENTE
   soñar → descomponer → instrumentar → refutar → anotar → emitir
                               │
                           TIBURÓN
                               │
                        META-HARNESS
        evidencia · procedencia · deuda · autoridad · Stop
                               │
                 EXPERIENCE / DECISION ENGINE
                               │
                     CENTRO DE MANDO
              observar → anticipar → intervenir
```

---

# 4. Principios de producto

## P1. No construir otro chatbot

El chat puede existir como entrada, pero nunca como modelo mental del producto.

La respuesta puede convertirse en:

- mapa conceptual;
- simulación;
- línea de tiempo;
- recta numérica;
- laboratorio;
- diagrama;
- tabla;
- práctica;
- historia;
- comic;
- video;
- cuestionario;
- explicación;
- debate;
- actividad física;
- experimento.

La interfaz es parte de la respuesta.

## P2. No confundir fluidez con verdad

Un LLM no obtiene autoridad por escribir con seguridad.

Cada claim importante debe poder tener:

- estado;
- fuente;
- EvidenceRef;
- fecha;
- versión;
- contradicciones;
- deuda;
- instrumento;
- frontera.

## P3. No reemplazar el trabajo cognitivo del alumno

Educabot debe diseñar la situación para que el alumno:

- observe;
- compare;
- explique;
- reconstruya;
- aplique;
- transfiera;
- detecte errores;
- defienda una respuesta.

No debe limitarse a entregar la solución.

## P4. El profesor conserva autoridad

La IA propone.

El profesor puede:

- editar;
- bloquear;
- aprobar;
- asignar;
- versionar;
- reutilizar;
- adaptar.

El sistema nunca presenta una decisión pedagógica automática como irrevocable.

## P5. La complejidad técnica queda debajo

El profesor no debe aprender términos como:

- vector store;
- RAG;
- prompt chaining;
- function calling;
- LoRA;
- agent orchestration.

Debe operar con lenguaje pedagógico.

## P6. Toda predicción es una predicción, no un hecho

“Riesgo de dificultad” y “dominio estimado” deben mostrar:

- confianza;
- evidencia;
- variables;
- posibilidad de corrección humana.

---

# 5. Arquitectura epistemológica

## 5.1 PRAXIOS

PRAXIOS es el organismo operativo.

Responsabilidades:

- ejecutar misiones;
- mantener estado;
- coordinar modelos, herramientas y skills;
- administrar sesiones;
- planificar pasos;
- crear artefactos;
- generar experiencias;
- gestionar reintentos;
- registrar decisiones;
- persistir aprendizaje.

## 5.2 Meta-Harness

Meta-Harness es el plano de aseguramiento.

Responsabilidades:

- claim typing;
- evidence ledger;
- procedencia;
- verificación;
- deuda epistemológica;
- contradicciones;
- gates;
- Authority Boundary;
- control de emisión;
- Stop Gate.

## 5.3 EL PUENTE

Ciclo principal:

```
SOÑAR
  ↓
DESCOMPONER
  ↓
INSTRUMENTAR
  ↓
REFUTAR
  ↓
ANOTAR
  ↓
EMITIR
  ↓
DECLARAR FRONTERA
```

Órganos:

1. Soñador.
2. Descompositor.
3. Instrumentista.
4. Escéptico.
5. Libro de Audacias.
6. Eco.
7. Afuera.

## 5.4 Súper Prompt Euler

Euler se usa como **operador de diseño cognitivo**:

1. nombrar antes de operar;
2. observar antes de teorizar;
3. demoler hasta el invariante;
4. conjeturar con audacia declarada;
5. verificar en territorio conocido;
6. unificar;
7. elegir la exposición más breve que no pierda verdad;
8. mostrar proceso y caminos fallidos;
9. cerrar en la frontera.

Aplicación:

- al diseño de una clase;
- al diseño de una experiencia;
- a la explicación para un estudiante;
- a una investigación escolar;
- a una guía;
- a una evaluación;
- al análisis de resultados.

## 5.5 Tiburón

El Tiburón es un operador adversarial.

Debe buscar:

- números sin procedencia;
- referencias inexistentes;
- causalidad injustificada;
- afirmaciones fuertes con evidencia débil;
- contradicciones internas;
- respuestas memorizadas disfrazadas de comprensión;
- actividades que no miden el OA declarado;
- material visual que contradiga la explicación;
- preguntas con más de una respuesta correcta accidental;
- evaluación no alineada con la experiencia.

Estados operativos sugeridos:

- SOBREVIVE;
- MORDIDO;
- DEVORADO.

Importante:

> Sobrevivir al Tiburón no significa ser verdadero.

Solo significa que esa capa adversarial no encontró un fallo dentro de su cobertura.

---

# 6. Modelo de autoridad

Estados visibles:

## VERIFICADO

El claim posee evidencia instrumentada suficiente dentro del alcance declarado.

## CORROBORADO

Existe evidencia razonable, pero no se ha cerrado la verificación requerida.

## CONJETURA DECLARADA

Hipótesis útil o interpretación que debe viajar como hipótesis.

## SILENCIO

El sistema no posee derecho suficiente para emitir la afirmación.

## Regla central

```
LLM output ≠ verified knowledge
```

Authority Boundary debe degradar cualquier claim que intente autoasignarse VERIFICADO sin evidencia válida.

---

# 7. Productos / superficies

# 7.1 Educabot Docente

## Objetivo

Reducir radicalmente el tiempo de preparación sin reducir control ni rigor.

## Home docente

Debe responder:

- ¿qué clases tengo mañana?
- ¿qué debo preparar?
- ¿qué OA estoy trabajando?
- ¿qué materiales ya tengo?
- ¿qué dificultades mostró este curso?
- ¿qué recomienda revisar antes de la próxima clase?

## Acción primaria

> **Preparar mi clase**

Inputs mínimos:

- curso;
- asignatura;
- OA o tema;
- duración;
- contexto;
- objetivo del profesor.

Inputs opcionales:

- número de alumnos;
- dificultades del curso;
- recursos disponibles;
- tipo de experiencia;
- nivel de lectura;
- modalidad;
- adaptaciones;
- material previo.

## Salida: Class Pack

Un paquete puede incluir:

- planificación;
- inicio;
- desarrollo;
- cierre;
- guía del docente;
- guía alumno;
- presentación;
- actividad;
- experimento;
- simulación;
- quiz;
- evaluación de salida;
- rúbrica;
- pauta;
- tarea;
- recursos;
- fuentes;
- OA;
- adaptaciones;
- versión imprimible;
- versión para asignar en Educabot.

## One-click modes

- “Clase de mañana”.
- “Crear guía”.
- “Crear evaluación”.
- “Crear experimento”.
- “Crear cómic”.
- “Crear afiche”.
- “Crear presentación”.
- “Crear video”.
- “Crear actividad de 15 min”.
- “Adaptar para reforzamiento”.
- “Hacer más visual”.
- “Bajar dificultad”.
- “Subir desafío”.
- “Convertir en trabajo grupal”.

---

# 7.2 Educabot Studio

Subproducto dentro de Docente para artefactos.

## Tipos

- guía;
- afiche;
- infografía;
- comic;
- storyboard;
- presentación;
- fichas;
- mapa;
- línea temporal;
- diagrama;
- cuestionario;
- video;
- audio/narración;
- laboratorio interactivo.

## Regla

El docente no escribe prompts técnicos.

Describe intención pedagógica.

Educabot construye:

```
brief pedagógico
→ guion
→ estructura
→ assets
→ generación
→ verificación
→ revisión humana
→ exportación / asignación
```

## Video educativo

Flow:

```
OA
→ objetivo cognitivo
→ guion
→ storyboard
→ escenas
→ voz
→ prompts visuales
→ generación por proveedor
→ subtítulos
→ preguntas posteriores
→ QA pedagógico
```

Seedance debe implementarse detrás de un **Media Provider Adapter**.

El producto no dependerá estructuralmente de un proveedor.

## Skills

Debe existir un **Skill Registry** para incorporar skills pedagógicas especializadas.

Ejemplos:

- diseño de clases;
- tutoría;
- evaluación;
- storytelling;
- cómic;
- alfabetización;
- matemática;
- experimentos;
- video.

Las skills de terceros, incluidas las que el equipo quiera integrar de Tudor Morari u otros especialistas, deben entrar como módulos versionados, auditables y activables por contexto.

---

# 7.3 Educabot Aprende

## Objetivo

Convertirse en el entorno personal del aprendizaje del estudiante.

## Home alumno

Debe mostrar:

- “Hoy”.
- próximas fechas;
- sesiones pendientes;
- temas débiles;
- tema recomendado;
- progreso real;
- calendario;
- alertas;
- tareas;
- desafíos;
- preguntas guardadas.

Ejemplo:

```
HOY

Matemática
Fracciones equivalentes
Dominio: 61 %
12 min sugeridos

Ciencias
Prueba en 3 días
Reforzar: subducción

Historia
Trabajo: viernes
1 tarea pendiente
```

## Pregunta libre

El estudiante escribe o habla:

> “No entiendo por qué 2/4 es igual a 1/2.”

PRAXIOS identifica:

- nivel;
- asignatura;
- OA;
- concepto;
- prerequisitos;
- error probable;
- representación apropiada.

Luego crea una experiencia.

## Modos de experiencia

- Explorar.
- Ver.
- Manipular.
- Probar.
- Explicar.
- Practicar.
- Enseñárselo a otro.
- Resolver un caso nuevo.

## Regla de dominio

Un concepto no cambia a “dominado” solo porque:

- abrió una página;
- vio un video;
- completó un chat;
- respondió una pregunta con apoyo.

Debe requerir evidencia de reconstrucción y/o transferencia.

---

# 7.4 Educabot Familia

## Objetivo

Dar contexto y confianza sin invadir la privacidad cognitiva del alumno.

## Home familia

- progreso semanal;
- próximos hitos;
- 1–3 alertas importantes;
- fortalezas;
- conceptos en dificultad;
- recomendación para apoyar;
- estado de confiabilidad del contenido;
- comunicación autorizada del docente.

Ejemplo:

> “Esta semana avanzó bien en equivalencia de fracciones. Aún le cuesta explicar por qué funciona. Puedes ayudar pidiéndole que lo muestre con un dibujo.”

## No mostrar por defecto

- conversación completa;
- prompts;
- errores sensibles individuales;
- inferencias psicológicas;
- vigilancia de cada acción.

---

# 7.5 Educabot Centro

## Usuarios

- profesor jefe;
- coordinador;
- UTP;
- dirección;
- sostenedor, si corresponde.

## Objetivo

Centro de mando y decisión.

No solo reporting.

Debe permitir:

```
OBSERVAR
→ DIAGNOSTICAR
→ ANTICIPAR
→ PROPONER
→ INTERVENIR
→ MEDIR EFECTO
```

## Vistas principales

### Mapa curricular

- OA trabajados;
- OA por comenzar;
- OA débiles;
- cobertura;
- evidencia.

### Mapa conceptual

- dependencia;
- nodos sólidos;
- cuellos de botella;
- conceptos precursores.

### Alertas anticipatorias

Ejemplo:

> 38 % del curso aún no consolida equivalencia de fracciones. El próximo OA depende directamente de esa habilidad. Riesgo de dificultad: alto.

### Intervenciones

- crear refuerzo;
- formar grupo;
- generar actividad;
- recomendar material;
- cambiar secuencia;
- crear evaluación diagnóstica;
- avisar al profesor;
- sugerir trabajo hogar.

### Impacto

Después de una intervención:

- ¿mejoró dominio?
- ¿para quién?
- ¿qué representación funcionó mejor?
- ¿persistió el error?
- ¿apareció otro cuello de botella?

---

# 8. Calendario vivo

## Objetos

- clase;
- evaluación;
- tarea;
- entrega;
- proyecto;
- unidad;
- sesión recomendada;
- recordatorio;
- revisión;
- intervención.

## Funciones

- vista diaria;
- semanal;
- mensual;
- countdown;
- alertas;
- “qué estudiar hoy”;
- relación fecha ↔ OA ↔ dominio.

## Anticipación

El calendario no debe limitarse a recordar fechas.

Debe cruzar:

```
fecha futura
+
dependencias curriculares
+
estado actual del estudiante
=
plan de preparación
```

Ejemplo:

> “Prueba de fracciones en 5 días. Para llegar preparado necesitas reforzar primero equivalencia. Se recomiendan 2 sesiones de 12 minutos.”

---

# 9. Ontología curricular

## Entidades mínimas

```
CurriculumVersion
Level
Grade
Subject
Axis
LearningObjective
Indicator
Skill
Attitude
Concept
Prerequisite
Misconception
Activity
Assessment
Resource
Claim
EvidenceRef
StudentEvidence
MasteryState
CalendarEvent
Intervention
```

## Relaciones

Ejemplos:

```
LearningObjective REQUIRES Concept
Concept DEPENDS_ON Concept
Activity TRAINS Concept
Assessment MEASURES Concept
Resource SUPPORTS LearningObjective
Claim SUPPORTED_BY EvidenceRef
StudentEvidence UPDATES MasteryState
MasteryState AFFECTS Recommendation
CalendarEvent TARGETS LearningObjective
Intervention TARGETS Concept
```

## Versionado

Toda entidad curricular debe conservar:

- fuente;
- versión;
- fecha;
- vigencia;
- hash;
- origen;
- relación con versión anterior.

Nunca reescribir silenciosamente un OA histórico.

---

# 10. Learning Graph

Cada alumno posee un grafo individual.

## Nodo

```
ConceptNode {
  concept_id
  mastery_estimate
  evidence_count
  last_evidence_at
  confidence
  forgetting_risk
  misconception_flags
  prerequisites
  next_review_at
}
```

## Actualización

Fuentes:

- respuesta;
- explicación propia;
- transferencia;
- evaluación;
- actividad;
- ejercicio;
- evidencia docente.

## Estados UX sugeridos

- sólido;
- en aprendizaje;
- débil;
- no medido;
- en riesgo de olvido.

---

# 11. Experience Engine

La IA selecciona el tipo de representación según:

- concepto;
- curso;
- error;
- dominio;
- dispositivo;
- tiempo;
- objetivo.

## Bloques seguros

El LLM no debe generar HTML libre.

Debe generar un schema de bloques:

```
ExplanationBlock
ClaimBlock
EvidenceBlock
TimelineBlock
NumberLineBlock
MapBlock
GraphBlock
SimulationBlock
ExperimentBlock
QuizBlock
ReflectionBlock
CompareBlock
StoryBlock
ComicBlock
VideoBlock
```

El frontend renderiza componentes auditados.

---

# 12. Teacher Copilot sin prompt engineering

## Input

Lenguaje natural.

## PRAXIOS debe transformar el pedido en

- objetivo;
- restricciones;
- OA;
- skills;
- tipo de evidencia;
- artefactos;
- evaluación;
- tiempo.

## Ejemplo

Input:

> “Mañana tengo 34 alumnos de 7° y 90 minutos. Tectónica de placas. Se desconcentran rápido.”

Output:

- apertura visual de 5 min;
- simulación de 12 min;
- explicación guiada;
- actividad en parejas;
- error conceptual objetivo;
- 4 preguntas de chequeo;
- ticket de salida;
- guía imprimible;
- versión proyectable;
- OA y fuentes;
- alternativa si no hay internet.

---

# 13. Evaluación

Educabot debe diferenciar:

## Recognition

“Me suena.”

## Recall

“Puedo recuperarlo.”

## Reconstruction

“Puedo explicarlo.”

## Transfer

“Puedo aplicarlo a un caso nuevo.”

## Defense

“Puedo justificar por qué.”

La métrica de dominio debe ponderar más reconstruction/transfer que consumo.

---

# 14. Analytics y anticipación

## Métricas del alumno

- dominio por concepto;
- retención;
- transferencia;
- calibración;
- tasa de error;
- errores persistentes;
- tiempo de recuperación;
- cumplimiento calendario.

## Métricas del curso

- OA;
- distribución de dominio;
- conceptos débiles;
- clusters de error;
- alumnos en riesgo;
- intervención recomendada;
- respuesta a intervención.

## Métricas del docente

- tiempo ahorrado;
- materiales creados;
- materiales reutilizados;
- clases asignadas;
- intervención aplicada;
- resultado posterior.

## Métricas de confianza

- evidence coverage;
- unsupported claim rate;
- hallucination acceptance rate;
- correct abstention rate;
- contradiction detection rate;
- authority downgrade count;
- claims bloqueados antes de emisión.

---

# 15. IA / modelos

## Regla

Proveedor agnóstico.

Crear abstracción:

```
LLMProvider
VisionProvider
ImageProvider
VideoProvider
SpeechProvider
EmbeddingProvider
```

## Casos

LLM:
- planificación;
- explicación;
- descomposición;
- clasificación;
- adaptación.

Image:
- afiche;
- comic;
- ilustración;
- diagrama asistido.

Video:
- Seedance vía adapter inicial;
- futuros proveedores intercambiables.

Speech:
- pregunta oral;
- lectura;
- narración.

## Routing

Tareas simples → modelo rápido/barato.  
Tareas complejas → modelo de razonamiento.  
Verificación → instrumento externo cuando exista.

---

# 16. Arquitectura tecnológica propuesta

## Frontend

- React + TypeScript.
- PWA responsive.
- Design system propio.
- una app web con shells por rol;
- posibilidad de apps móviles posteriores.

## Edge / API

Preferencia:

- Cloudflare Workers;
- Cloudflare Pages/Workers Assets;
- Queues;
- R2;
- KV cuando corresponda;
- Durable Objects solo para estados que lo justifiquen.

## Datos

Postgres/Supabase para:

- usuarios;
- colegios;
- roles;
- currículo;
- grafo;
- evaluaciones;
- calendario;
- artefactos;
- auditoría.

R2:

- PDFs;
- imágenes;
- videos;
- exportables.

## CI/CD

- GitHub;
- GitHub Actions;
- tests;
- preview;
- deploy Cloudflare.

## Observabilidad

- trazas;
- costos por generación;
- latencia;
- error por provider;
- tokens;
- fallos de gates;
- auditoría de claims.

---

# 17. Modelo de datos mínimo

## User

- id
- role
- tenant_id
- profile
- permissions

## StudentProfile

- user_id
- grade
- courses
- learning_preferences explícitas
- guardian_links

## TeacherProfile

- user_id
- subjects
- grades
- classes

## Class

- id
- teacher_id
- students
- schedule
- active_curriculum_version

## LearningObjective

- id
- code
- source_text
- source_url
- version
- hash

## Concept

- id
- label
- description

## Claim

- id
- text
- epistemic_state
- source
- confidence
- created_at

## EvidenceRef

- id
- claim_id
- provider
- uri
- digest
- checked_at
- supports

## LearningEvidence

- id
- student_id
- concept_id
- activity_id
- evidence_type
- score
- metadata

## MasteryState

- student_id
- concept_id
- estimate
- confidence
- updated_at

## Artifact

- id
- type
- owner
- source_request
- curriculum_links
- version
- review_state

## CalendarEvent

- id
- actor
- date
- type
- curriculum_links

## Intervention

- id
- target_scope
- reason
- proposed_action
- approved_by
- impact

---

# 18. Roles y permisos

## Alumno

Puede:

- aprender;
- preguntar;
- practicar;
- ver su mapa;
- calendario;
- evidencia;
- guardar material.

No puede:

- autoaprobar evaluaciones;
- modificar OA;
- elevar claims a VERIFICADO.

## Docente

Puede:

- crear;
- editar;
- aprobar;
- asignar;
- revisar;
- ver analytics de sus cursos;
- intervenir.

## Apoderado

Puede:

- ver progreso autorizado;
- fechas;
- alertas;
- recomendaciones.

No ve por defecto conversaciones completas.

## UTP / dirección

Puede:

- ver analytics agregados;
- cobertura;
- riesgo;
- intervenciones;
- adopción.

## Admin

Gestión técnica, permisos y configuración.

---

# 19. Privacidad y seguridad

Educabot trabajará con menores, por lo tanto la privacidad debe ser arquitectura, no checkbox.

## Reglas

- minimización de datos;
- role-based access;
- tenant isolation;
- logs auditables;
- no usar datos del alumno para fines ajenos al aprendizaje;
- retención configurable;
- export/delete workflows;
- consentimiento y autorizaciones donde correspondan;
- cifrado en tránsito y reposo;
- secrets solo backend;
- rate limits;
- content safety;
- no inferir diagnósticos médicos o psicológicos;
- no ranking público entre alumnos;
- no surveillance-by-default.

## IA

No enviar más contexto personal del necesario al proveedor.

Pseudonimizar cuando sea posible.

---

# 20. UX / sistema de diseño

## Idea visual

No infantil.

No LMS administrativo gris.

No “chatbot con burbujas”.

Debe sentirse como:

> laboratorio + mapa + cockpit + estudio creativo.

## Principios

- autoridad;
- calma;
- claridad;
- profundidad progresiva;
- visualización antes que texto largo;
- evidencia a un clic;
- estado comprensible;
- acciones grandes y concretas;
- accesibilidad;
- mobile-first para alumno/familia;
- desktop power-user para docente/centro.

## Paleta semántica

No fijar aquí colores finales, pero sí semántica:

- verificado;
- corroborado;
- conjetura;
- silencio;
- riesgo;
- progreso.

Nunca depender solo de color: usar icono + texto.

---

# 21. Navegación

## Docente

```
Inicio
Preparar clase
Studio
Mis cursos
Evaluaciones
Biblioteca
Calendario
Centro de mando
```

## Alumno

```
Hoy
Preguntar
Aprender
Mi mapa
Tareas
Calendario
Guardados
```

## Familia

```
Resumen
Próximas fechas
Progreso
Cómo apoyar
Mensajes
```

## Centro

```
Pulso
Currículo
Riesgos
Intervenciones
Cursos
Profesores
Resultados
```

---

# 22. Flujos críticos

## F1 — Clase de mañana

1. Docente abre “Preparar clase”.
2. Educabot conoce curso/calendario.
3. Propone OA.
4. Docente escribe intención.
5. Euler estructura la experiencia.
6. PRAXIOS genera.
7. Meta-Harness clasifica claims.
8. Tiburón intenta romper materiales.
9. Docente revisa.
10. Exporta o asigna.
11. Alumnos interactúan.
12. Learning Graph se actualiza.
13. Dashboard muestra resultado.
14. Educabot recomienda siguiente intervención.

## F2 — Pregunta alumno

1. alumno pregunta;
2. detectar OA/concepto;
3. comprobar prerequisitos;
4. seleccionar interfaz;
5. guiar;
6. comprobar comprensión;
7. guardar evidencia;
8. actualizar grafo;
9. programar siguiente revisión si corresponde.

## F3 — Video educativo

1. profesor define objetivo;
2. Educabot genera guion;
3. storyboard;
4. Tiburón pedagógico;
5. profesor aprueba;
6. generación Seedance;
7. subtítulos;
8. QA;
9. preguntas posteriores;
10. asignación.

## F4 — Anticipación

1. calendario detecta OA futuro;
2. grafo analiza prerequisitos;
3. riesgo estimado;
4. explica razón;
5. propone intervención;
6. docente decide;
7. medir resultado.

---

# 23. MVP

El MVP debe demostrar el sistema, no simular que ya contiene Chile completo.

## Alcance curricular

Inicial:

- 5° básico Matemática;
- 7° básico Ciencias;
- un set de Historia.

Objetivo: 20–30 OA completamente instrumentados.

## Funciones MVP

### Docente

- crear clase;
- crear guía;
- crear quiz;
- generar experiencia;
- guardar;
- asignar;
- dashboard básico.

### Alumno

- home;
- pregunta libre;
- 3–4 tipos de interfaz;
- práctica;
- mapa;
- calendario;
- estado de evidencia.

### Familia

- resumen semanal;
- fechas;
- concepto débil;
- recomendación.

### Centro

- mapa OA;
- distribución de dominio;
- alertas simples;
- recomendación de intervención.

### Trust

- Claim / EvidenceRef;
- Authority Boundary;
- Tiburón;
- deuda;
- frontera;
- fuente curricular.

### Media

- storyboard y guion;
- adapter Seedance;
- generación de video detrás de crédito/confirmación.

---

# 24. Fuera del MVP

No construir inicialmente:

- SIS completo;
- libro de clases oficial completo;
- reemplazo de todos los LMS;
- videollamadas;
- mensajería social abierta;
- marketplace público;
- gamificación compleja;
- generación de video ilimitada;
- cobertura curricular total automática sin QA;
- predicciones de alto impacto sin revisión humana.

---

# 25. Roadmap

## Fase 0 — Foundation

- PRD;
- design system;
- arquitectura;
- esquema;
- auth;
- roles;
- versionado curricular;
- provider abstraction;
- trust kernel.

## Fase 1 — Teacher Wedge

Objetivo:

> “Prepara la clase de mañana.”

- Class Builder;
- guide generator;
- quiz;
- Studio;
- biblioteca;
- export;
- 20–30 OA.

## Fase 2 — Student Loop

- Aprende;
- question-to-experience;
- learning graph;
- mastery;
- calendar;
- assignments.

## Fase 3 — Teacher Decision Room

- analytics;
- misconceptions;
- risk;
- intervention;
- before/after.

## Fase 4 — Family

- summary;
- alerts;
- recommendations;
- dates.

## Fase 5 — Media Factory

- comics;
- video;
- audio;
- visual assets;
- Seedance pipeline;
- credit accounting.

## Fase 6 — School Platform

- multi-tenant;
- UTP/director;
- curriculum planning;
- integrations;
- import/export.

---

# 26. Go-to-market

## Wedge

No vender primero:

> “plataforma integral de inteligencia educativa”.

Vender:

> **“Prepara la clase de mañana en minutos, con materiales alineados y revisables.”**

Es un problema inmediato.

## Expansion loop

```
Profesor crea material
→ lo asigna
→ alumnos entran
→ Educabot mide
→ profesor ve resultados
→ usa intervención
→ apoderado recibe resumen
→ colegio obtiene señal
```

Cada paso aumenta el costo de volver a una IA genérica sin estado.

---

# 27. Diferenciación

## ChatGPT / Claude

Excelentes generadores.

Pero normalmente no poseen de forma nativa:

- currículo versionado del colegio;
- estado persistente del aprendizaje;
- calendario académico;
- evidencia del alumno;
- Learning Graph;
- intervención;
- Centro de Mando;
- pipeline audiovisual pedagógico;
- Authority Boundary del producto;
- auditoría claim-evidence;
- ciclo profesor → alumno → resultado → intervención.

## LMS tradicional

Organiza contenido y tareas.

Educabot organiza:

- conocimiento;
- generación;
- evidencia;
- aprendizaje;
- anticipación;
- intervención.

## Generadores de planificaciones

Generan documentos.

Educabot debe cerrar el ciclo con estudiantes y resultados.

---

# 28. Moat

El moat no es el modelo.

Debe construirse en:

1. **Learning Graph longitudinal.**
2. **Curriculum Knowledge Graph versionado.**
3. **Evidencia de qué estrategias funcionan.**
4. **Skill Registry pedagógico.**
5. **Biblioteca de experiencias estructuradas.**
6. **Trust / Meta-Harness.**
7. **Workflow integrado profesor-alumno-familia-centro.**
8. **Datos de intervención y resultado.**

A largo plazo:

> “Para este OA, con este tipo de dificultad, esta experiencia tuvo mejor resultado en este contexto.”

Ese conocimiento acumulado es mucho más difícil de copiar que un prompt.

---

# 29. Hipótesis a validar

## H1 — Tiempo docente

Educabot reduce significativamente el tiempo de preparación de una clase utilizable.

## H2 — Calidad

Profesores prefieren el Class Pack de Educabot a un output directo de un LLM generalista.

## H3 — Confiabilidad

Usuarios distinguen mejor entre contenido verificado, corroborado y no verificado.

## H4 — Aprendizaje

Alumnos con experiencia PRAXIOS muestran mejor reconstrucción y transferencia que alumnos que solo reciben una respuesta LLM.

## H5 — Retención docente

El workflow preparación → asignación → resultado → intervención genera retorno semanal.

## H6 — Anticipación

Las alertas basadas en dependencias encuentran dificultades antes de que aparezcan en la nota final.

---

# 30. Experimentos de producto

## Experimento A — Docente

Control:
Claude/ChatGPT libre.

Tratamiento:
Educabot.

Tarea:
preparar una clase completa.

Medir:

- minutos;
- iteraciones;
- correcciones;
- alineación;
- satisfacción;
- uso real en aula.

## Experimento B — Alumno

A:
material estándar.

B:
LLM libre.

C:
Educabot + PRAXIOS.

Medir:

- recall;
- reconstruction;
- transfer;
- error detection;
- confidence calibration;
- unsupported belief adoption.

## Experimento C — Veracidad

Incluir preguntas con:

- fuentes falsas;
- claims ambiguos;
- números;
- causalidad;
- temas disputados.

Medir:

- Hallucination Acceptance Rate;
- Unsupported Claim Rate;
- Correct Abstention Rate.

---

# 31. Métricas North Star

## Teacher

**Weekly classes prepared and actually used.**

No contar solo generaciones.

## Student

**Concepts demonstrated through reconstruction/transfer.**

No contar solo sesiones.

## School

**Detected learning gap → intervention → measured improvement.**

---

# 32. Métricas de negocio

- WAU docente;
- weekly assigned experiences;
- activation teacher;
- activation student;
- teacher D30 retention;
- student weekly learning sessions;
- school expansion;
- media credits;
- cost per active class;
- gross margin AI;
- conversion free → paid;
- seats per school.

---

# 33. Monetización — hipótesis

No fijar pricing final sin validación.

## Teacher Free

- límite de clases/mes;
- guía;
- quiz;
- demo Student.

## Teacher Pro

- más generaciones;
- Studio;
- biblioteca;
- analytics;
- video con créditos.

## School

- alumnos;
- profesores;
- centro de mando;
- administración;
- integración;
- soporte;
- política de datos.

## Media credits

Video, imagen o voz de alto costo debe medirse por crédito, no esconderse como ilimitado.

---

# 34. Criterios de aceptación del MVP

## Docente

- puede crear una experiencia en menos de 5 minutos de interacción;
- el OA usado es trazable;
- puede editar todo antes de asignar;
- puede exportar;
- puede asignar al alumno;
- puede ver resultados básicos.

## Alumno

- puede preguntar;
- recibe una experiencia distinta al chat;
- puede abrir “¿Cómo sabemos?”;
- puede practicar;
- su evidencia se guarda;
- su mapa cambia;
- ve próximas fechas.

## Trust

- ningún output del modelo puede elevarse unilateralmente a VERIFICADO;
- claims sin evidencia quedan degradados;
- toda evidencia tiene procedencia;
- la UI declara frontera;
- acciones críticas tienen log.

## Centro

- puede ver al menos un cuello de botella;
- puede crear una intervención;
- puede medir el resultado después.

---

# 35. Riesgos

## R1 — Producto demasiado grande

Mitigación:

Teacher Wedge primero.

## R2 — Intentar cubrir todo el currículo

Mitigación:

20–30 OA instrumentados antes de escala.

## R3 — La IA genera materiales visualmente buenos pero pedagógicamente malos

Mitigación:

skill pedagógica + QA + Tiburón + revisión docente.

## R4 — Confundir verificación de fuente con verdad

Mitigación:

claim-evidence binding explícito; source existence no basta.

## R5 — Costos audiovisuales

Mitigación:

storyboard primero; confirmación antes de render; créditos; caché/reuso.

## R6 — Sobrevigilancia

Mitigación:

familia recibe señales, no historial cognitivo completo.

## R7 — Predicciones erróneas

Mitigación:

confidence + explanation + human review + no acciones irreversibles.

## R8 — Lock-in a proveedor

Mitigación:

provider adapters.

---

# 36. Principio de diseño final

Toda pantalla debe responder una de estas preguntas:

### Alumno

> ¿Qué debo comprender ahora y cómo puedo demostrar que lo comprendí?

### Docente

> ¿Qué debo hacer mañana para que este grupo aprenda mejor?

### Apoderado

> ¿Qué necesita mi hijo y cómo puedo ayudar sin estorbar?

### Centro

> ¿Dónde se está formando el problema y qué intervención conviene antes de que sea tarde?

Si una pantalla no ayuda a responder una de esas preguntas, probablemente sobra.

---

# 37. Definición del producto en una frase

> **Educabot es un sistema operativo de aprendizaje que permite a docentes diseñar experiencias, a estudiantes aprender con IA de forma confiable, a familias acompañar con claridad y a colegios observar, anticipar e intervenir sobre el aprendizaje mediante PRAXIOS y Meta-Harness.**

---

# 38. Posicionamiento

## Hero

**Enseña mejor. Aprende mejor. Usa IA sin entregar el pensamiento.**

## Subhero

Educabot convierte el currículo, las preguntas de tus alumnos y tus objetivos de clase en experiencias de aprendizaje verificables, materiales listos y decisiones pedagógicas accionables.

## Promesa docente

> **Prepara la clase de mañana sin pelear una hora con la IA.**

## Promesa alumno

> **Pregunta cualquier cosa. Entiéndela de verdad.**

## Promesa familia

> **Sabe qué está aprendiendo y cómo ayudar.**

## Promesa institución

> **Detecta dónde se rompe el aprendizaje antes de que aparezca en la nota.**

---

# 39. Decisión de implementación

**No construir “Claude para colegios”.**

Construir:

```
currículo
+ estado
+ experiencia
+ verificación
+ memoria
+ calendario
+ contenido
+ analytics
+ anticipación
+ intervención
```

sobre una arquitectura donde el modelo es un componente reemplazable.

El valor central de Educabot no debe desaparecer cuando aparezca un LLM mejor.

---

# 40. Próximo entregable

Después de aprobar este PRD:

1. arquitectura técnica v1;
2. data model y migrations;
3. design system Educabot;
4. wireframes de las cuatro superficies;
5. prototipo Teacher Wedge;
6. ingestión inicial de currículo;
7. trust kernel;
8. landing educabot.cl;
9. test con 5–10 profesores;
10. experimento comparativo contra LLM libre.

