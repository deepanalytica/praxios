# ADR-002 — Agentes agnósticos de proveedor

Estado: Accepted

## Contexto
PRAXIOS puede requerir modelos diferentes para razonamiento, búsqueda, contenido rápido y validación.

## Decisión
Ningún agente de dominio depende directamente de una API concreta. AgentModelProvider abstrae proveedor y clase de modelo.

## Consecuencias
- cambiar modelos sin reescribir dominio;
- routing por coste/capacidad;
- posibilidad de second-opinion entre proveedores;
- pruebas por contrato;
- menor lock-in.
