# Educabot — secuencia de lanzamiento v3

Fecha: 2026-10-05. Decisiones de producto e hipótesis de precio; no representan ventas ni mejoras medidas.

## Decisión

Empezar por **Aprende**, en un dominio estrecho: fracciones de 5º básico para familias que quieren que sus hijos usen IA para pensar, practicar y explicar. Dar a un grupo pequeño de docentes **Crea** como herramienta individual para preparar y revisar materiales de ese mismo dominio. No vender Implementa ni un tablero UTP en el primer ciclo. La consola `/admin` sirve al equipo operador, no al colegio.

La razón: el aprendizaje del estudiante es la promesa distintiva, pero su uso recurrente y su efecto todavía deben probarse. Crea permite que docentes motivados participen sin esperar una compra escolar y produzcan actividades revisadas. El colegio se aborda después con evidencias de aprendizaje y adopción, no con una presentación de dashboards.

## Escalera de valor a probar

| Etapa | Usuario y valor | Oferta de prueba | Señal decisiva |
| --- | --- | --- | --- |
| 1. Aprende abierto | Estudiante comprende una idea, practica y explica | Módulo gratuito acotado | Completa una tarea y vuelve por iniciativa propia |
| 2. Aprende Familia | Apoderado acompaña sin recibir la conversación privada | Probar CLP 5.900, 7.900 y 9.900 por alumno/mes con ofertas reales; no publicar aún | Pago, retención a 4 semanas y avance en una tarea nueva |
| 3. Crea individual | Docente prepara un borrador y lo revisa | Gratis acotado; probar Pro CLP 8.900–11.900/mes | Material usado en aula y tiempo de preparación reducido |
| 4. Piloto escolar | Una cohorte utiliza Aprende y docentes usan Crea | Contrato piloto de 6–8 semanas, alcance y precio negociados | Renovación propuesta por un comprador con resultados verificables |
| 5. Implementa | Directivos observan implementación y deciden apoyo | Solo después de instrumentar plan → uso → respuesta → aprendizaje | Decisión institucional tomada con datos confiables |

Referencias de precio públicas: [Umáximo Familias](https://www.umaximo.com/familias), [MagicSchool Plus](https://www.magicschool.ai/pricing) y [Diffit individual](https://web.diffit.me/individual-teacher-subscription). No prueban nuestra disposición a pagar. Medir costo de IA, soporte y adquisición antes de ofrecer uso ilimitado.

## Experimento de 6 semanas

1. Reclutar 20–30 familias de 5º básico y 5–8 docentes que enseñen fracciones. Consentimiento de apoderados y política de datos antes de registrar información infantil.
2. Aplicar una tarea base breve, con respuestas razonadas y un problema de transferencia. Evaluación humana ciega con rúbrica.
3. Ofrecer 8–12 actividades de 10 minutos. Pedir predicción, explicación y nueva aplicación; no resolver todo al primer intento. Los docentes revisan los contenidos antes de asignar.
4. Repetir una tarea equivalente a las 2 y 6 semanas. Medir precisión, calidad de explicación, transferencia y retención. Para atención, observar abandono, tiempo por intento y pausas, sin etiquetarlos como diagnóstico de concentración.
5. Separar tres grupos para el paisaje sonoro: silencio elegido, música elegida y uso mixto. Registrar preferencia y finalización; no atribuir mejoras a la música sin un diseño experimental suficiente.
6. Presentar ofertas reales de precio a familias y docentes. Registrar compra o rechazo, no solo intención declarada.

**Criterios para ampliar:** mejora en una tarea nueva frente a la línea base y a un grupo de comparación apropiado; ausencia de errores graves en contenido revisado; retorno semanal suficiente para sostener el aprendizaje; costos variables conocidos; pago repetido o compromiso firme. Los umbrales numéricos se fijarán antes del piloto.

## Confiabilidad y límites del prototipo

El generador de Crea produce borradores. Si Workers AI no está disponible, entrega un ejemplo determinista identificado como demostración. Ninguna salida del modelo se certifica sola. La revisión docente es un paso explícito, pero la casilla actual no constituye una auditoría real. Para publicar materiales se requieren catálogo curricular versionado, fuentes trazables, verificadores independientes, registro de aprobaciones y evaluación de errores por severidad.

Aprende contiene una actividad interactiva de ejemplo. La elección de una respuesta correcta no demuestra comprensión: hace falta revisar explicaciones, transferencia y tareas repetidas. El progreso familiar del prototipo solo se guarda en este navegador. No hay cuentas ni datos escolares conectados.

La música es un paisaje sonoro original generado por la aplicación, sin letra, voluntario y sin reproducción automática. La evidencia sobre música de fondo y comprensión es mixta: [ensayo sobre música autoseleccionada](https://pubmed.ncbi.nlm.nih.gov/36717669/) y [estudio sobre música de fondo y lectura](https://pubmed.ncbi.nlm.nih.gov/38646111/). No se promete que mejore la atención o el rendimiento de todos los estudiantes.

La consola administrativa muestra salud de la API y estados de integraciones. Requiere `ADMIN_TOKEN` para consultar estado interno y `ADMIN_KV` para guardar controles de despliegue. Uso, costos e incidentes aparecen como pendientes hasta integrar telemetría real. Los controles de módulos aplican a `/aprende`, `/crea` y `/implementa` mediante `/api/config`; la música se controla en Aprende. La vista pública del prototipo permanece accesible por defecto para revisión.
