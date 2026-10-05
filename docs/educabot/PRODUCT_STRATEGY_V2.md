# Educabot — decisión de producto y mercado (v2)

Fecha: 2026-10-05. Estado: hipótesis para validar, no pricing publicado.

## Decisión

La demo actual mezcla tareas, compradores y pruebas de valor. Se proponen tres aplicaciones con entradas, navegación, métricas y permisos separados. Comparten identidad institucional, catálogo curricular, servicio de generación y registro de evidencias; no necesitan tres repositorios ni tres motores de IA.

| Aplicación | Persona y trabajo principal | Primera promesa | Evidencia de valor |
| --- | --- | --- | --- |
| **Aprende** | Estudiante: practicar y demostrar comprensión | «Entiende el concepto y úsalo en un problema nuevo» | Explicación, práctica y transferencia observables; mejora frente a una línea base |
| **Crea** | Docente: preparar material revisable | «Una clase utilizable en minutos, con fuentes y puntos por revisar» | Tiempo hasta material aprobado, tasa de correcciones y uso real en aula |
| **Implementa** | UTP, dirección y sostenedor: observar ejecución curricular | «Qué se planificó, qué se usó y qué aprendieron los alumnos» | Cobertura de evidencia, intervenciones decididas y resultados posteriores |

Familia no necesita una cuarta aplicación en esta etapa. Si se valida una necesidad propia, puede recibir un resumen de progreso con permisos específicos dentro de Aprende. Studio es una capacidad de Crea, con medios costosos cobrados por créditos.

La pantalla institucional debe distinguir **planificado → generado → aprobado → asignado → utilizado → respondido → aprendido**. La generación de una guía no demuestra implementación en aula, y abrirla no demuestra aprendizaje. Sin actividades instrumentadas y evidencias de estudiantes, Implementa solo puede informar preparación y uso; no debe presentar porcentajes de dominio.

## Mercado y competencia

El [Centro de Estudios del Mineduc](https://centroestudios.mineduc.cl/2025/01/27/cem-interactivo-publica-nueva-informacion/) reportó más de 11 mil establecimientos escolares y alrededor de 3,6 millones de estudiantes en Chile. Es el tamaño del sistema, no el mercado obtenible de una nueva empresa. La primera venta debería concentrarse en un tramo de cursos y asignaturas y en colegios dispuestos a pilotear con docentes reales.

| Referencia pública consultada | Señal de mercado |
| --- | --- |
| [MagicSchool](https://www.magicschool.ai/pricing): gratis; Plus USD 8,33/usuario/mes anual o USD 12,99 mensual; institución a cotización | La generación docente genérica tiene competencia barata y gratuita. |
| [Diffit](https://web.diffit.me/individual-teacher-subscription): USD 14,99/mes o USD 149,99/año | Hay pago individual por materiales y exportación, pero el beneficio debe ser visible en minutos. |
| [Khan Academy Districts](https://www.khanacademy.org/schools/pricing): Enterprise Starter USD 10/alumno/año en EE. UU. | Un colegio puede comprar conjuntamente aprendizaje, herramientas docentes e informes por alumno. No es un precio chileno comparable de forma directa. |
| [Brisk](https://www.briskteaching.com/plans): venta escolar medida por estudiante y pilotos | El comprador escolar prefiere una métrica presupuestaria simple y evidencia de adopción. |
| [Umáximo Familias](https://www.umaximo.com/familias): CLP 7.900/estudiante/mes Premium | Existe una referencia local de pago familiar por aprendizaje, distinta de una licencia institucional. |
| [Microsoft Education](https://learn.microsoft.com/en-us/microsoft-365/education/guide/1-reference/manage-microsoft-365-education-ai-features): Teach incluido en ciertas licencias | Crear guías con IA por sí solo difícilmente sostendrá una prima. |

La diferenciación a probar es **currículo chileno acotado + material editable + verificación visible de afirmaciones + evidencia de implementación y aprendizaje**. El nombre de una tecnología interna no es una propuesta de valor para el comprador.

## Escalera de valor y precio de prueba

Estos importes son **hipótesis comerciales**, no estimaciones de disposición a pagar ni precios publicados. Deben probarse con ofertas reales y costos medidos.

1. **Crea Gratis:** tres paquetes de clase al mes, exportación básica y revisión docente obligatoria. Capta docentes y permite medir si el resultado se usa.
2. **Crea Pro:** probar CLP 8.900/mes con pago anual y CLP 11.900 mes a mes. Incluye biblioteca, variantes y exportación. Video, imagen y voz se cobran por créditos.
3. **Piloto de colegio:** 6–8 semanas con una asignatura, dos niveles, 8–12 docentes y una cohorte de estudiantes. Precio de piloto pagado o descontable de la licencia anual; acordar métricas y responsable institucional antes de empezar.
4. **Crea + Implementa para colegio:** probar CLP 6.000–10.000 por estudiante matriculado al año, con mínimo de CLP 2,4 millones por establecimiento. Un colegio de 500 alumnos sería CLP 3–5 millones/año. Incluye docentes, biblioteca compartida, asignación, trazas de uso y tablero que indica el estado de cada evidencia. No incluye un tutor de IA ilimitado para alumnos.
5. **Aprende, cohorte institucional:** probar adicionalmente CLP 12.000–24.000 por estudiante activo al año, con límites de uso explícitos. Ofrecerlo solo tras demostrar calidad, seguridad y mejora medible en un conjunto acotado de conceptos. Una cohorte de 100 alumnos equivaldría a CLP 1,2–2,4 millones/año.

El colegio sí puede ser el comprador principal. Crea individual es un canal de entrada y aprendizaje del producto; no exige que el docente pague indefinidamente de su bolsillo. El tablero y Aprende justifican una compra institucional solo cuando producen evidencia que el colegio puede usar para tomar decisiones. Antes de fijar precios, medir costo variable por paquete y por sesión, soporte, revisión humana y adquisición comercial. Rechazar planes «ilimitados» mientras esos costos no estén acotados.

## Confiabilidad: qué se puede prometer

No se puede garantizar que un modelo generativo jamás se equivoque. Se puede limitar dónde genera, impedir que una salida se certifique a sí misma, medir fallas y bloquear la publicación de material no revisado. [NIST](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) describe las respuestas falsas presentadas con seguridad como un riesgo propio de la IA generativa. Los [Objetivos de Aprendizaje oficiales](https://www.curriculumnacional.cl/node/45704) ofrecen una referencia versionable, pero citar un OA existente no prueba que toda la clase sea correcta ni que lo cubra.

Flujo mínimo para Crea:

1. Comenzar con 20–30 OA de uno o dos dominios. Guardar texto, curso, asignatura, versión y enlace oficial. Fuera de ese catálogo, mostrar «OA pendiente».
2. Generar un borrador estructurado a partir de fuentes permitidas. Separar cada afirmación factual y su tramo de fuente; ninguna cita inventada cuenta como evidencia.
3. Aplicar validadores independientes: coincidencia curso/asignatura/OA, duración de la secuencia, consistencia de respuestas, cálculos deterministas donde proceda, fuentes accesibles y lenguaje adecuado al nivel.
4. Marcar como **verificado** solo el hecho concreto que pasa una comprobación reproducible. El resto queda «por revisar» o se omite. La revisión de otro modelo puede encontrar errores, pero no constituye verificación por sí sola.
5. Exigir aprobación docente antes de asignar. Conservar versión, cambios, fuente y quién aprobó. Probar el sistema con un banco de casos revisado por especialistas y auditorías de salidas reales; publicar tasas de error por tipo de material y gravedad, no una promesa de cero alucinaciones.

El prototipo anterior asignaba el estado «VERIFICADO» a una referencia curricular obtenida mediante dos reglas de palabras clave. La corrección inmediata de esta rama restringe esas reglas por curso y asignatura, impide aceptar un OA inventado por el modelo y rebaja sus autoetiquetas de certeza. **Todavía no hay verificación de afirmaciones, aprendizaje o uso en aula en producción.**

## Validación antes de ampliar la app

- Entrevistar al menos 12 docentes, 8 responsables UTP/dirección y 4 sostenedores o compradores. Observar cómo preparan, aprueban y asignan una clase; pedir una cotización aceptable por escrito, no solo interés verbal.
- Ejecutar el piloto con comparación antes/después en conceptos concretos. Registrar minutos hasta paquete aprobado, correcciones por paquete, porcentaje efectivamente asignado, errores factuales severos, estudiantes que explican y transfieren, y decisiones tomadas desde el tablero.
- Probar tres precios de Crea y dos precios institucionales con ofertas reales. Una suscripción individual confirma utilidad; una renovación escolar confirma valor institucional.
- Decidir el siguiente desarrollo según evidencia: primero Crea si ahorra trabajo y supera revisión; luego Aprende en un dominio acotado; Implementa crece solo con datos de ejecución verificables.

## Implicación para la siguiente versión visual

Una página corporativa breve puede presentar las tres aplicaciones y dirigir a tres landings independientes. Cada app abre en su propio espacio, con navegación, vocabulario y métricas de su usuario. El prototipo actual conserva valor como laboratorio de interacciones, pero no debe presentarse como un producto escolar integrado ya medido.
