# Educabot — Sistema de diseño v1

## Norte visual

**Laboratorio + mapa + cockpit + estudio creativo.**

No infantil. No LMS gris. No chat infinito.

La interfaz debe comunicar tres cosas simultáneamente:

1. calma para aprender;
2. autoridad para decidir;
3. capacidad creativa para construir.

## Invariantes

- Una acción primaria por pantalla.
- Títulos cortos, jerarquía fuerte.
- Profundidad progresiva: primero entender; después inspeccionar.
- Evidencia a un clic.
- El estado epistémico nunca depende solo del color.
- Toda predicción se rotula como estimación/hipótesis.
- Las superficies por rol comparten lenguaje visual, no densidad idéntica.

## Tokens semánticos

### Base

- Fondo: verde-negro profundo.
- Panel: verde carbón.
- Texto: blanco mineral.
- Muted: gris salvia.

### Estados

- Verificado: menta.
- Corroborado: azul.
- Conjetura: ámbar.
- Silencio/bloqueado: rojo desaturado.
- Frontera: violeta.

No usar estos colores para decoración indiscriminada.

## Tipografía

System UI en MVP para performance y portabilidad.

Escala:

- Display: 56–104 px desktop.
- H1 app: 40–52 px.
- H2: 28–36 px.
- Body: 14–18 px según superficie.
- Micro labels: 9–11 px + tracking.

## Componentes núcleo

- BrandMark.
- RoleSwitcher.
- PrimaryButton / SecondaryButton.
- MetricCard.
- TrustPill.
- ClaimCard.
- EvidenceRef.
- CurriculumBanner.
- ExperienceBlock.
- Timeline.
- KnowledgeGraph.
- CalendarEvent.
- AlertCard.
- InterventionCard.
- ArtifactCard.
- StudioPipeline.

## Superficies

### Docente

Mayor densidad. Desktop-first. Acciones de creación, revisión y asignación.

### Alumno

Mobile-first. Menos densidad. Representación visual grande y una tarea cognitiva por momento.

### Familia

Resumen y acción. Nunca dashboards técnicos innecesarios.

### Centro

Densidad alta, lectura comparativa, riesgo + explicación + acción.

## Motion

Motion explica estado, no adorna:

- transición de etapa;
- progreso de pipeline;
- actualización de grafo;
- expansión de evidencia;
- pulso discreto en elemento activo.

Respetar `prefers-reduced-motion`.

## Accesibilidad

- contraste AA como mínimo;
- foco visible en producción;
- icono + texto para estados;
- tamaño táctil mínimo 44 px en acciones principales;
- no bloquear zoom;
- lenguaje claro;
- navegación teclado para flujos docentes.

## Voz

Educabot no habla como un paper ni como una mascota.

Debe ser:

- concreto;
- respetuoso;
- pedagógico;
- explícito sobre incertidumbre.

Evitar:

- “¡Excelente!” automático;
- certeza ornamental;
- frases largas;
- antropomorfizar la verificación.

## Copy guía

Docente: **“Prepara la clase de mañana.”**  
Alumno: **“Pregunta cualquier cosa. Entiéndela de verdad.”**  
Familia: **“Sabe qué está aprendiendo y cómo ayudar.”**  
Centro: **“Detecta dónde se rompe el aprendizaje antes de que aparezca en la nota.”**
