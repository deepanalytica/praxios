# PRAXIOS OS

PRAXIOS OS es un control plane persistente para gobernar modelos de IA, proyectos, memoria institucional, decisiones, oportunidades, recursos y ejecución.

No es un chatbot.

ChatGPT, Claude, Claude Code, Codex, Gemini y futuros modelos son trabajadores reemplazables. PRAXIOS conserva el estado y Meta-Harness gobierna cómo pueden actuar.

## Misión inicial

Generar al menos $1.000.000 CLP adicionales de caja validada usando activos actuales, mientras se reduce dispersión y pérdida de contexto.

## V1 operativa

- Command Center
- Session Gateway / Harvest Engine
- State Graph + ontología
- Decision Engine / AI CEO
- Opportunity Radar
- Execution Pipelines
- Portfolio
- Agent Office
- Revenue
- Finance
- Resource Engine
- Meta-Harness
- local persistence
- JSON backup/restore
- repository Harvest Ledger
- protocol for Claude Code / Codex
- GitHub Actions
- publication to `gh-pages`

## Principio

```text
session
  ↓
harvest
  ↓
state
  ↓
decision
  ↓
execution
  ↓
evidence
  └────────► state
```

La conversación es temporal. El estado es permanente.

## Cómo empezar a operar

### 1. Command Center

Abre PRAXIOS y revisa:
- AI CEO;
- Needs Your Decision;
- Do Not Do;
- Live Activity;
- State Brief.

### 2. Después de cada chat importante

Abre **Session Harvest**.

Pega la conversación o resumen.

También acepta el formato estructurado `PRAXIOS_SESSION_HARVEST`.

PRAXIOS extrae:
- ideas;
- decisiones;
- tareas;
- riesgos;
- oportunidades;
- evidencia;
- objetivos;
- recursos;
- hallazgos.

### 3. Claude Code / Codex

Los coding agents deben leer:

- `AGENTS.md`
- `CLAUDE.md` para Claude Code
- `praxios/state/STATE_BRIEF.md`
- `docs/CONSTITUTION.md`

Al terminar trabajo material escriben un JSON en:

`praxios/harvest/`

El siguiente build incorpora ese conocimiento automáticamente.

## Desarrollo

Node.js 22+.

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

El build ejecuta primero:

```bash
npm run sync:harvest
```

y compila las cosechas versionadas.

## Documentación

- `docs/PRAXIOS_OS_PRD.md`
- `docs/PRAXIOS_OS_SDD.md`
- `docs/OPERATING_MANUAL.md`
- `docs/SESSION_PROTOCOL.md`
- `docs/CONSTITUTION.md`
- `docs/adr/`

## Despliegue

La UI se construye y publica sólo con GitHub:

```text
push
 → GitHub Actions
 → lint
 → typecheck
 → tests
 → compile harvest ledger
 → Vite build
 → gh-pages
```

No requiere Cloudflare ni Vercel.

Branch actual:

`develop/praxios-os-v1`

La rama `main` no se modifica hasta validar CI y operación visual.

## Persistencia

V1 usa dos capas:

1. **localStorage** para operar inmediatamente desde la UI.
2. **Git Harvest Ledger** para conocimiento producido por agentes que trabajan sobre el repositorio.

El próximo salto será persistencia remota multi-dispositivo y event ingestion. No se añadirá infraestructura pesada antes de validar la operación real.

## Portfolio inicial

PRAXIOS gobierna:
- Visual Art AI
- Deep Living
- MSJ
- Clinia
- Deep Geo
- Educabot
- Digital Product & IP Factory
- PRAXIOS Core

Value Factory permanece como subsistema económico dentro de PRAXIOS OS.
