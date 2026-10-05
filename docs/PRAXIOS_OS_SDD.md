# SDD — PRAXIOS OS V1

## Arquitectura

```text
Owner
  │
  ▼
PRAXIOS Control Plane
  ├── State Graph
  ├── Session Gateway
  ├── Harvest Engine
  ├── Decision Engine / AI CEO
  ├── Opportunity Radar
  ├── Resource Engine
  ├── Revenue / Finance
  └── Observability
           │
           ▼
      Meta-Harness
  policies · authority · evidence
           │
           ▼
      Agent Runtime
           │
     models/tools/pipelines
           │
           ▼
        Harvest
           └──────► State Graph
```

## State model

`PraxiosState` contiene:
- sessions;
- knowledge nodes;
- graph edges;
- events;
- workflows;
- resources;
- CEO brief.

Knowledge kinds:
- idea
- decision
- task
- risk
- opportunity
- evidence
- goal
- resource
- finding

## Persistence V1

### localStorage
La UI persiste el estado operativo del navegador.

### Git ledger
Los agentes que trabajan sobre el repo dejan `HarvestBundle` JSON en `praxios/harvest/`.

### Build compiler
`scripts/compile-harvest.mjs` valida esos archivos y genera `src/generated/harvest.generated.ts`.

Al cargar, la UI fusiona cosechas del repo con el estado local por ID.

## Decision Engine

V1 es determinista y transparente:
- cuenta decisiones, riesgos, tareas y oportunidades;
- usa scores existentes del portfolio;
- prioriza oportunidad con mayor confidence;
- penaliza health por deuda decisional y riesgo;
- produce prioridades, avoid list y needs-decision.

Un modelo de razonamiento puede reemplazar o complementar esta capa en V2, pero nunca debe eliminar trazabilidad determinista.

## Session protocol

`SESSION.START` entrega contexto y límites.
`SESSION.CLOSE` devuelve un `HarvestBundle 1.0`.

Claude Code usa `CLAUDE.md`.
Codex/otros coding agents usan `AGENTS.md`.

## Deployment

- React + TypeScript + Vite
- GitHub repository
- GitHub Actions
- `gh-pages` publication branch
- no Cloudflare
- no Vercel

## Próximo backend

La V1 deliberadamente evita infraestructura pesada. El backend remoto se añade cuando la operación real valide:
- entidades necesarias;
- frecuencia de eventos;
- sincronización;
- conectores;
- políticas de autoridad.

Objetivo futuro: Postgres + event ingestion + API tipada + job runner, manteniendo la UI y contratos actuales.
