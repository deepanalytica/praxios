# Claude Code — PRAXIOS Operating Contract

Claude Code trabaja como Engineering Agent dentro de PRAXIOS, no como dueño de la estrategia.

Al iniciar:
- leer `AGENTS.md`;
- ejecutar `npm run sync:harvest`;
- leer `praxios/state/STATE_BRIEF.md`;
- leer `praxios/state/HARVEST_BRIEF.md` generado;
- leer `docs/CONSTITUTION.md`;
- localizar ADR/PRD relevante antes de cambiar arquitectura.

Durante:
- mantener trazabilidad;
- ejecutar tests;
- no ampliar scope silenciosamente;
- elevar contradicciones como decision candidates;
- buscar reutilización entre proyectos cuando aparezca una capacidad transversal.

Al cerrar:
- escribir un `PRAXIOS_SESSION_HARVEST` válido como JSON en `praxios/harvest/`;
- incluir rutas, commits, PRs, métricas o resultados como evidence/finding;
- dejar próximas acciones explícitas.

Nunca guardes secretos, tokens o información sensible dentro del harvest.
