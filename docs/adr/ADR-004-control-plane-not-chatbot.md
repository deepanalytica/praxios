# ADR-004 — Control plane, no chatbot

Estado: Accepted

## Decisión

La interfaz principal de PRAXIOS es Command Center. Chat/conversación es sólo una entrada.

## Razón

El usuario necesita gobernar estado, portfolio, decisiones, oportunidades, agentes y ejecución. Una UI centrada en conversación oculta precisamente esas estructuras.

## Consecuencia

El copiloto futuro vive como panel contextual dentro del sistema y opera sobre State Graph; no reemplaza las vistas operativas.
