# TDD — PRAXIOS Value Factory

## Objetivo de pruebas

Validar que el sistema de gobierno sea determinista donde corresponde y observable donde intervienen modelos probabilísticos.

## V1

### Unit tests
- Opportunity Score.
- mapping score → SCALE / BUILD / TEST / HOLD / KILL.
- cálculos de ROI, CAC, margen y pipeline ponderado cuando se incorporen al dominio.

### Static checks
- TypeScript strict.
- Biome lint.
- Vite production build.

## V2

### Contract tests de agentes
Cada adapter debe respetar AgentInput y AgentOutput. Un modelo no puede devolver acciones fuera del enum autorizado.

### Decision policy tests
- decisión HIGH risk requiere Risk/QA;
- agente proponente no puede ser el único aprobador;
- experimento sin kill criteria no puede pasar a RUNNING;
- SCALE exige evidencia mínima configurable;
- gasto sobre umbral exige aprobación humana.

### Integration tests
- event → relevant agent → structured output → decision proposal;
- payment.received actualiza métricas;
- deal.won actualiza revenue attribution;
- experiment threshold genera revisión CEO.

### End-to-end
Command Center debe cargar portfolio, navegar módulos y mostrar decisiones sin errores.

## Estrategia para LLM

No probar texto exacto. Probar:
- schema;
- límites;
- evidencia;
- confidence;
- action type;
- políticas de seguridad;
- reproducibilidad de inputs.

Los outputs reales de modelos deberán almacenarse como fixtures sólo cuando sirvan para regresión de contrato.
