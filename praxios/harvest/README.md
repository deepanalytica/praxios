# PRAXIOS Harvest Ledger

Este directorio es la bandeja de entrada versionada para sesiones externas.

Cada sesión material de Claude Code, Codex u otro agente que trabaje sobre el repositorio debe terminar creando un archivo JSON aquí.

Convención sugerida:

`YYYYMMDD-HHMM-source-project-short-title.json`

El build ejecuta `scripts/compile-harvest.mjs`, valida los payloads y genera `src/generated/harvest.generated.ts`. La UI los incorpora al State Graph sin borrar el estado local del navegador.

No guardar conversaciones completas con secretos. El harvest debe contener conocimiento operativo y referencias a artefactos, no credenciales.
