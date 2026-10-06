# Educabot — evaluación UX/UI y dirección v4

Fecha: 6 de octubre de 2026. Alcance: prototipo de `feature/educabot-prd`, principalmente Aprende y Crea. Esta es una revisión experta de pantallas y código; todavía no equivale a investigación con estudiantes, docentes y apoderados.

**Estado de implementación:** la demo pública incorpora sesiones por actividad, explicación antes del modelo, transferencia, progreso sin atribuir dominio, agenda móvil, Familia separada y revisión docente declarada con fuente. Quedan pendientes para uso con personas reales: autenticación, autorización familiar, sincronización, revisión por afirmación con evidencias auditables, editor y versiones de materiales, telemetría y evaluación de aprendizaje con usuarios.

## Dictamen

La versión actual logró una identidad visual ordenada y una separación inicial entre Aprende y Crea. Aún se percibe como una demostración de producto: el estudiante ve un panel antes de entrar al contenido; el docente revisa un borrador sin herramientas concretas para comprobarlo; «progreso» cuenta una actividad, no aprendizaje. La siguiente iteración debe cambiar el centro de gravedad desde el panel hacia la tarea real.

**Tesis de producto:** Educabot es un espacio donde una persona aprende una idea, demuestra qué entendió y sabe qué hacer después. Para el docente es un taller donde prepara, comprueba y publica una experiencia con trazabilidad. La estética fría y ligera permanece, subordinada a lectura, manipulación y confianza.

## Matriz de criterios

| Criterio | Evidencia del prototipo | Diagnóstico | Decisión v4 |
|---|---|---|---|
| Claridad de roles | Aprende tiene «Para mi familia» en la navegación del estudiante; las vistas comparten un shell casi idéntico. | Parcial | Aprende, Crea y Familia tendrán entradas y navegación propias. El dashboard de infraestructura seguirá siendo interno. |
| Siguiente acción | «Tu plan de hoy» destaca un tema, pero su botón siempre abre el ejercicio fijo de equivalencias, aunque la actividad siguiente cambie. | Crítico | Cada actividad enlaza a su propia experiencia o indica claramente que aún no hay práctica disponible. |
| Aprendizaje | Una elección correcta y una explicación de longitud mínima marcan `completada`; el significado de la explicación no se comprueba. | Crítico | Separar «realizado», «explicado», «aplicado en otro caso» y «retenido días después». Sin evidencia suficiente, usar «practicado», nunca «dominado». |
| Trabajo docente | Crea reúne intención, borrador y calendario, pero la revisión es una casilla y no muestra fuentes ni afirmaciones por comprobar. | Crítico | Flujo: intención → generación → comprobación por afirmación/OA → vista del estudiante → publicación. |
| Jerarquía visual | Hay una acción principal clara y una paleta coherente, pero ambas apps repiten la composición de dashboard y contienen mucha superficie decorativa. | Parcial | En Aprende, el objeto visual dominante será el contenido manipulable. En Crea, el material y sus decisiones de revisión. |
| Lectura y accesibilidad | Muchos textos funcionales están entre `0.51rem` y `0.8rem`; colores como `#92aab3` sobre blanco tienen contraste calculado ≈2.44:1. El calendario no expone su selección mediante un estado accesible. | Crítico | Aumentar escala de texto, contrastes y objetivos táctiles; teclado, foco, lector de pantalla y zoom forman parte del criterio de aceptación. |
| Calendario móvil | En el CSS móvil, las etiquetas de actividad se reducen a puntos de 6 px y la leyenda se oculta. | Parcial | En teléfono, vista de agenda de 7 días con tipo, contenido y fecha explícitos; el mes queda como navegación secundaria. |
| Confianza | La demo declara límites y deja la música apagada; el material generado no tiene procedencia por afirmación ni estado de validación comprobable. | Parcial | Mostrar origen, fecha, fuente, versión y estado de revisión junto al contenido relevante. |
| Rendimiento | La compilación funciona; no hay medición de campo de carga, respuesta y estabilidad visual. | Sin validar | Medir LCP, INP y CLS en dispositivos y red de piloto, no inferir calidad por el build. |

Los términos son juicios heurísticos, no resultados de pruebas con usuarios. «Crítico» significa que el problema afecta la promesa principal o la legibilidad; no equivale a afirmar un fallo legal o una tasa de abandono medida.

## Arquitectura de experiencia

### Aprende: entrar directamente en el aprendizaje

1. **Hoy:** una sola tarea recomendada con objetivo, duración aproximada, relación con la próxima prueba y botón «Continuar». Una agenda compacta muestra qué viene. El botón abre la actividad correcta.
2. **Sesión:** observar o manipular → intentar → explicar → recibir una pista específica → reintentar → aplicar en un caso nuevo. El tutor no entrega la respuesta antes del intento.
3. **Calendario:** la vista predeterminada en móvil es semanal. Cada fecha une prueba, contenidos, preparación y actividad disponible; mes y filtros son secundarios.
4. **Mi aprendizaje:** conceptos con evidencia y fecha de última comprobación. Separar práctica hecha de comprensión demostrada. Mostrar el siguiente paso, no solo un porcentaje.
5. **Familia:** experiencia independiente y autorizada con hitos, una pregunta concreta para conversar y límites de privacidad; fuera de la navegación del estudiante.

### Crea: un taller de decisiones pedagógicas

1. **Plan semanal** con curso, fecha, objetivo, evaluación y estado de publicación.
2. **Crear material** desde objetivo y contexto, con plantillas útiles y un borrador editable.
3. **Comprobar:** hechos, cálculo, referencia curricular, edad y pertinencia. Cada observación enlaza al pasaje exacto y permite corregir o marcar «sin evidencia».
4. **Vista del estudiante** para comprobar claridad, dificultad, accesibilidad y la relación entre la clase y la práctica.
5. **Publicar** con versión y autor; edición posterior muestra qué cambió y a quién afecta.

La gestión de infraestructura conserva su propio acceso interno: salud de servicios, gasto, fallos de generación, versiones, permisos y alertas. No forma parte del flujo diario de aprendizaje.

## Dirección visual y de interacción

- **Aprende:** un «laboratorio sereno» de matemáticas. Fondo claro frío, tinta azul y un acento turquesa. Las representaciones de fracciones, líneas numéricas y ejercicios son el foco visual; los anillos y gráficos abstractos salen del centro de la pantalla.
- **Crea:** mesa de trabajo editorial. Plan, borrador y comprobación tienen jerarquía clara. Las superficies translúcidas se reservan para contexto o superposición; los textos largos se leen sobre fondos opacos.
- **Tipografía:** cuerpo de 16 px como punto de partida en Aprende y 14–16 px en Crea; texto auxiliar nunca depende de 8–10 px para transmitir información necesaria. Usar peso y espacio antes que mayúsculas pequeñas.
- **Estados:** preparado, en revisión, publicado; sin actividad; sin fuente; error recuperable. No mostrar controles decorativos que aparenten funcionar, como un selector o campana sin destino.
- **Movimiento:** transiciones breves solo cuando explican cambio de estado. Respetar preferencia de movimiento reducido. Música opcional, silencio inicial y sin prometer un efecto de concentración todavía no demostrado para este contexto.

### Pantalla norte: Aprende / Hoy

```text
Curso · Matemática                              Próxima prueba: 15 oct

Fracciones equivalentes
Hoy vas a demostrar por qué 1/2 y 2/4 representan la misma cantidad.

┌──────────────────────────────────────────┬──────────────────────────┐
│ Barra de fracciones manipulable           │ Tu objetivo              │
│ [ mitad ]   [ cuatro partes ]             │ 1. Representar          │
│ Intenta → Explica → Comprueba              │ 2. Explicar             │
│                                          │ 3. Aplicar en otro caso  │
└──────────────────────────────────────────┴──────────────────────────┘

Después: practicar una equivalencia nueva · Preparación para la prueba
```

En móvil, la actividad ocupa toda la anchura, el objetivo queda antes de la interacción y la agenda se consulta al terminar. El calendario mensual no obliga a leer puntos de color diminutos.

## Cómo comprobar que sea buena

Piloto formativo con estudiantes de 5.º básico, docentes independientes y apoderados. Tareas observables:

1. El estudiante identifica qué debe aprender y encuentra la práctica correcta sin ayuda.
2. Explica una equivalencia y aplica la idea a un caso nuevo; se repite una comprobación días después.
3. El docente crea una actividad, detecta una afirmación dudosa, la corrige y la publica con fecha.
4. El apoderado entiende cómo ayudar sin acceder a razonamientos privados.

Registrar éxito de tarea, errores críticos, tiempo hasta la primera actividad, comprensión de estados de confianza, correcciones docentes, transferencia y retención. Probar teclado y lector de pantalla, zoom al 200 %, teléfonos reales y conexiones lentas. Como umbrales técnicos de campo, apuntar a LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.1 en el percentil 75; son objetivos de Web Vitals, no mediciones actuales de Educabot.

## Orden de trabajo recomendado

1. Corregir la relación actividad → práctica y separar Familia de la navegación de Aprende.
2. Diseñar una sesión de aprendizaje completa sobre equivalencias antes de añadir más dashboards o asignaturas.
3. Rehacer legibilidad, contraste, foco y calendario móvil; eliminar controles sin función.
4. Construir la revisión docente por evidencia y su publicación versionada.
5. Solo entonces medir aprendizaje y probar la propuesta con usuarios reales.

## Fuentes consultadas

- [Nielsen Norman Group, 10 heurísticas de usabilidad](https://www.nngroup.com/articles/ten-usability-heuristics/): estado del sistema, reconocimiento, prevención de errores y minimalismo orientado a tareas.
- [Nielsen Norman Group, divulgación progresiva](https://www.nngroup.com/articles/progressive-disclosure/): la primera vista debe exponer las opciones frecuentes y dejar las avanzadas para cuando se necesiten.
- [CAST, UDL 3.0: feedback orientado a la acción](https://udlguidelines.cast.org/engagement/effort-persistence/feedback/): retroalimentación específica, oportuna y vinculada al objetivo.
- [Education Endowment Foundation, feedback para mejorar el aprendizaje](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback): instrucción y evaluación formativa antes de la retroalimentación.
- [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/): contraste, foco, zoom y tamaño mínimo de objetivos.
- [Brilliant, rutas de aprendizaje](https://brilliant.org/help/features/what-are-learning-paths/): secuencia guiada que combina explicación, interacción y comprobaciones.
- [Khan Academy, seguimiento de dominio](https://support.khanacademy.org/hc/en-us/articles/360031123551-How-can-I-view-my-students-progress-towards-their-Mastery-goals): separar metas de dominio y seguimiento de tareas.
- [Linear, principios de una interfaz más calmada](https://linear.app/now/behind-the-latest-design-refresh): el área de trabajo debe tener más peso que la navegación.
- [web.dev, umbrales de Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds): metas de carga, respuesta y estabilidad en uso real.
