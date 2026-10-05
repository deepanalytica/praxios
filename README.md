# PRAXIOS OS

PRAXIOS es el **control plane persistente para gobernar modelos de IA, memoria institucional, decisiones, oportunidades y ejecución**.

No es otro chatbot. ChatGPT, Claude Code, Codex, Gemini y futuros modelos son trabajadores reemplazables dentro del sistema.

## Estado actual — V0.2 operable

La rama `develop/value-factory-v1` ya incluye:

- Command Center
- Harvest Engine
- Session Gateway
- State Graph
- Decision Engine
- Opportunity Radar
- Execution Pipelines
- Agent Workforce
- Evidence Ledger
- Resource Engine
- Value Factory
- Meta-Harness / System
- estado persistente local
- estado portable en `data/praxios-state.json`
- CLI de PRAXIOS
- contratos para Claude Code y otros agentes
- tests + CI
- publicación automática a `gh-pages`

## La idea central

```text
session / event
      ↓
Session Gateway
      ↓
Harvest Engine
      ↓
State Graph
      ↓
Decision Engine
      ↓
AI CEO + executive agents
      ↓
Execution
      ↓
Result / Evidence
      └──────────────→ State Graph
```

Cada sesión debe aumentar el patrimonio intelectual del sistema.

## Operación inmediata

### 1. Abrir la UI

GitHub Pages se publica desde la rama `gh-pages`.

URL esperada:

`https://deepanalytica.github.io/praxios/`

### 2. Trabajar con un modelo dentro del repo

```bash
npm run praxios -- brief visual-art-ai
```

### 3. Cerrar la sesión

Guardar un HarvestEnvelope y ejecutar:

```bash
npm run praxios -- harvest harvest/session.json
```

### 4. Validar estado

```bash
npm run praxios -- validate
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run praxios -- brief [projectId]
npm run praxios -- harvest <file.json>
npm run praxios -- snapshot
npm run praxios -- validate
```

## Protocolos de agentes

- `PRAXIOS.md` — contrato general de sesión
- `CLAUDE.md` — instrucciones para Claude Code
- `AGENTS.md` — contrato para agentes repo-aware
- `examples/session-close.example.json` — ejemplo de cosecha

## Documentación

- `docs/PRAXIOS_OS.md`
- `docs/OPERATING_MANUAL.md`
- `docs/PRD.md`
- `docs/SDD.md`
- `docs/TDD.md`
- `docs/CONSTITUTION.md`
- `docs/ROADMAP.md`
- `docs/adr/`

## Gobernanza

PRAXIOS conserva el estado institucional.

Meta-Harness controla permisos, límites y autoridad.

Los modelos pueden:
- analizar;
- investigar;
- proponer;
- ejecutar trabajo autorizado.

Los modelos no pueden:
- sobrescribir silenciosamente decisiones activas;
- aprobar por sí solos acciones materiales de alto riesgo;
- convertir una idea en proyecto sin pasar por gobierno de cartera.

## Arquitectura de persistencia

V0.2 es local-first:
- navegador → localStorage;
- repo → `data/praxios-state.json`;
- sesiones repo-aware → CLI + HarvestEnvelope.

Esto permite comenzar a operar hoy.

La próxima capa será un Session Gateway persistente para sincronización automática, background agents, webhooks y conectores externos.

## CI/CD

GitHub Actions valida:
- estado PRAXIOS;
- lint;
- TypeScript;
- tests;
- production build.

El frontend compilado se publica automáticamente en la rama `gh-pages`.

Cloudflare y Vercel no son necesarios para esta V0.2.
