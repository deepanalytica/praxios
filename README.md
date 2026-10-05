# PRAXIOS Value Factory

PRAXIOS Value Factory es la capa de gobierno económico y decisión del ecosistema PRAXIOS. Convierte proyectos, oportunidades y evidencia en decisiones de asignación de capital.

## Misión inicial

Generar $1.000.000 CLP adicionales de caja validada usando activos actuales antes de iniciar otra gran construcción.

## V1 implementada

- Command Center / CEO Daily
- Portfolio con SCALE, BUILD, TEST, HOLD y KILL
- Opportunity Score
- Decision Room
- Agent Office
- Experiment Engine
- Sales Pipeline
- Finance + Money Map
- Corporate Constitution
- interfaz de proveedores LLM desacoplada
- pruebas unitarias iniciales
- PRD, SDD, TDD y ADRs
- GitHub Actions
- despliegue estático con GitHub Pages

Proyectos cargados: Visual Art AI, Deep Living, MSJ, Clinia, Deep Geo, Educabot, Digital Product & IP Factory y PRAXIOS Core.

## Principio operativo

evidencia → oportunidad → experimento → dinero → aprendizaje → asignación de capital

El sistema debe decir qué hacer y qué no hacer. Ningún proyecto conserva prioridad por costo hundido.

## Ejecutar localmente

Requiere Node.js 22+.

```bash
npm install
npm run dev
```

Quality gate:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentación

- docs/PRD.md — producto y alcance
- docs/SDD.md — arquitectura del sistema
- docs/TDD.md — estrategia de pruebas
- docs/CONSTITUTION.md — límites de gobierno
- docs/ROADMAP.md — etapas de evolución
- docs/adr — decisiones de arquitectura

## GitHub Pages

La V1 del frontend se publica sólo con infraestructura de GitHub:

1. push a `develop/value-factory-v1` o `main`;
2. GitHub Actions ejecuta lint, typecheck y tests;
3. Vite genera `dist/`;
4. Actions sube el artifact de Pages;
5. GitHub Pages sirve la aplicación.

No se requieren secrets de Cloudflare ni Wrangler.

Si Pages todavía no está habilitado en el repositorio, en GitHub se debe seleccionar:

`Settings → Pages → Build and deployment → Source: GitHub Actions`

La URL esperada para un Project Page es:

`https://deepanalytica.github.io/praxios/`

## Rama

Trabajo actual: develop/value-factory-v1

main no se modifica hasta que CI y la revisión visual estén aprobados.

## Estado de la arquitectura

La V1 usa seed data deliberadamente. El próximo salto no es añadir pantallas: es persistencia, evidencia real, eventos y ejecución gobernada de agentes. El contrato AgentModelProvider permite conectar OpenAI, Anthropic o Google sin acoplar el dominio a un único proveedor.
