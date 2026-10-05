# ADR-003 — Session Harvest Ledger

Estado: Accepted

## Contexto

Los proveedores de IA mantienen contextos separados. Confiar en la memoria de cada proveedor crea discontinuidad y lock-in.

## Decisión

Toda sesión material produce un HarvestBundle estructurado. Para coding agents, el bundle se guarda en `praxios/harvest/` y queda versionado en Git.

## Consecuencias

Positivas:
- continuidad entre modelos;
- auditabilidad;
- build reproducible;
- conocimiento desacoplado del proveedor.

Limitación V1:
- agentes externos que no operan sobre el repo necesitan pegar/importar harvest o usar un futuro API.
