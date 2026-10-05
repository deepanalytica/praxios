# Educabot / PRAXIOS Learning

Rama de producto: `feature/educabot-prd`.

> La [estrategia de producto v2](docs/educabot/PRODUCT_STRATEGY_V2.md) propone separar Aprende, Crea e Implementa como aplicaciones independientes para sus usuarios. La interfaz de esta rama sigue siendo un prototipo integrado; sus métricas son datos demo y sus controles de veracidad aún no verifican todas las afirmaciones generadas.

Educabot es el vertical educativo construido sobre PRAXIOS + Meta-Harness. El producto conecta cuatro superficies — Docente, Alumno, Familia y Centro de Mando — sobre currículo versionado, Learning Graph, calendario, evidencia y control de autoridad.

## Qué está desarrollado en esta rama

### Landing completa

- Hero con propuesta entendible para docentes y colegios.
- Problema: el costo de operar IA generalista sin contexto pedagógico persistente.
- Teacher Wedge: **“Prepara la clase de mañana.”**
- Explicación de las cuatro superficies.
- Ciclo completo: diseñar → asignar → observar → detectar → intervenir → medir.
- Explicación pública de confiabilidad sin exponer toda la arquitectura interna.
- Educabot Studio para video, cómic, afiche e infografía.
- Centro de Mando y anticipación.
- FAQ y disclaimer de independencia respecto de Mineduc.

### Educabot Docente

- Inicio con próxima clase, pulso de cursos y siguiente decisión.
- Builder de clase con curso, asignatura, duración, intención y artefactos.
- Generación vía `/api/class-pack`.
- Fallback determinista si el backend AI no está disponible.
- Secuencia de clase.
- Materiales.
- Ticket de salida.
- Notas docentes.
- Panel **“¿Cómo sabemos?”**.
- Authority Boundary.
- Tiburón pedagógico.
- Descarga del Class Pack en Markdown.
- Studio audiovisual con pipeline objetivo → guion → storyboard → render.
- Mis cursos.
- Biblioteca reutilizable.

### Educabot Alumno

- “Hoy” con prioridades.
- Pregunta libre.
- Micromundo visual de fracciones equivalentes.
- Estados VERIFICADO / CORROBORADO / SILENCIO.
- Práctica con feedback.
- Learning Graph.
- Tareas y calendario con preparación sugerida.

### Educabot Familia

- Resumen semanal.
- Fechas con contexto.
- Recomendaciones accionables.
- Vista de progreso.
- Principio de privacidad: no exponer conversaciones completas por defecto.

### Educabot Centro

- Pulso institucional.
- Mapa curricular.
- Riesgos explicables.
- Alertas anticipatorias.
- Intervenciones.
- Historial de impacto.

## Backend

`worker/index.ts` implementa un Cloudflare Worker con:

- `POST /api/class-pack`
- `GET /api/health`
- Workers AI opcional.
- Catálogo curricular curado para los casos instrumentados del prototipo.
- Regla de autoridad: un output generado por el modelo no puede autoelevarse a VERIFICADO.
- Fallback determinista si Workers AI falla o no está enlazado.

## Ejecutar

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Deploy:

```bash
npm run deploy
```

## Cloudflare

El deploy espera:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

La configuración incluye un binding `AI` para Workers AI y assets estáticos de Vite.

## Documentación

- [PRD integral](docs/educabot/PRD.md)
- [Arquitectura v1](docs/educabot/ARCHITECTURE_V1.md)
- [Sistema de diseño v1](docs/educabot/DESIGN_SYSTEM_V1.md)

## Estado real

Esta rama es un **prototipo de producto funcional**, no una plataforma escolar de producción.

Todavía faltan, antes de pilotos con datos reales:

- autenticación;
- multi-tenant por establecimiento;
- base de datos;
- ingestión curricular nacional completa;
- persistencia real del Learning Graph;
- calendario real por usuario;
- permisos de apoderado;
- proveedor de video conectado;
- auditoría de seguridad;
- analítica validada;
- pruebas con docentes y estudiantes.

Los números de dashboards visibles en el prototipo son **datos de demostración**.

## Principio

> La IA debe trabajar más para que el alumno piense mejor, no para que piense menos.

El modelo genera. El sistema controla qué puede adquirir autoridad. El docente conserva la decisión final.
