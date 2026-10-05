# PRAXIOS OS — Manual Operativo Diario

## Al comenzar el día

1. Abre Command Center.
2. Lee AI CEO, Needs Your Decision y Do Not Do.
3. Ejecuta CEO Cycle si hubo nueva información.
4. Resuelve como máximo tres prioridades.

## Al terminar una conversación importante

Ve a Session Harvest y pega:
- conversación completa;
- resumen;
- o payload `PRAXIOS_SESSION_HARVEST`.

Selecciona fuente y proyecto.
Revisa la previsualización.
Incorpora al State Graph.

## Claude Code / Codex

Si trabajan en este repositorio, deben leer `AGENTS.md` y dejar automáticamente un JSON en `praxios/harvest/` al finalizar trabajo material.

## Cuando aparece una idea

No crear un proyecto inmediatamente.
Cosechar como `idea`.
Revisar State Graph y Opportunity Radar.
Buscar duplicados o capacidades reutilizables.
Sólo después decidir TEST / BUILD / SCALE / HOLD / KILL.

## Cuando aparece una oportunidad

Debe poder responder:
- quién paga;
- qué problema paga por resolver;
- qué oferta mínima podemos vender;
- cuánto tarda en generar caja;
- qué activos existentes reutiliza;
- qué evidencia falta;
- cuál es el test más barato.

## Cuando una tarea no contribuye

Si no afecta revenue, evidencia, riesgo, aprendizaje o capacidad estratégica, debe justificar por qué consume tiempo.

## Backup

Meta-Harness → Exportar estado JSON.

Haz backup antes de cambios estructurales o antes de migrar a persistencia remota.

## Regla de oro

La conversación es temporal.
El estado es permanente.
La ejecución debe volver al estado con evidencia.
