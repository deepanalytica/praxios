# PRAXIOS OS — Operating Manual

## Objetivo diario

Abrir PRAXIOS antes de comenzar trabajo importante con IA.

La secuencia operativa es:

1. Command Center — revisar misión, dinero, tareas y oportunidades.
2. Decisions — confirmar qué decisiones siguen vigentes.
3. Harvest / Session Gateway — generar el contrato para el modelo que trabajará.
4. Ejecutar la sesión en Claude Code, Codex, ChatGPT, Gemini u otro agente.
5. Cerrar con HarvestEnvelope.
6. Harvest — ingerir la cosecha.
7. Execution — convertir resultados en tareas verificables.
8. Revisar Opportunity Radar y Evidence antes de asignar más recursos.

## Regla de sesión

Una sesión importante no termina cuando el modelo deja de responder.

Termina cuando:
- el trabajo está registrado;
- las decisiones están explícitas;
- la evidencia quedó asociada;
- las oportunidades fueron capturadas;
- los riesgos quedaron visibles;
- las tareas tienen owner;
- el estado fue cosechado.

## Uso con Claude Code / Codex en el repo

Antes de trabajar:

```bash
npm run praxios -- brief visual-art-ai
```

Al terminar, guardar un HarvestEnvelope en `harvest/` y ejecutar:

```bash
npm run praxios -- harvest harvest/<session>.json
```

Validar:

```bash
npm run praxios -- validate
```

Luego hacer commit del trabajo y del estado actualizado cuando corresponda.

## Uso con chats externos

1. En PRAXIOS → Harvest selecciona el proyecto.
2. Copia el SESSION.START contract.
3. Pégalo al comienzo del chat externo.
4. Al finalizar, pide el HarvestEnvelope JSON.
5. Pega ese JSON en Harvest y pulsa “Cosechar sesión”.

## Qué mirar cada mañana

### Mission
¿Sigue siendo correcta la misión principal?

### Today
¿Las tareas prioritarias realmente mueven caja, evidencia o capacidad estratégica?

### Portfolio
¿Hay más de tres apuestas demandando ejecución intensa?

### Opportunity Radar
¿Apareció una oportunidad con mejor score que el trabajo actual?

### Decisions
¿Alguna decisión debería revisarse por evidencia nueva?

### Evidence
¿Qué estamos asumiendo sin respaldo?

## Qué mirar cada semana

- caja generada;
- MRR;
- pipeline ponderado;
- cash generated / founder hour;
- experimentos cerrados;
- decisiones revertidas;
- ideas repetidas;
- proyectos HOLD/KILL;
- nuevas capacidades reutilizables;
- oportunidades detectadas y descartadas.

## V0.2 — limitación deliberada

La UI es local-first y persiste en el navegador.

Esto permite operar inmediatamente, pero no significa que ya exista sincronización automática entre dispositivos o ingestión permanente desde todos los chats.

La siguiente capa será un Session Gateway remoto con API, autenticación, base de datos y workers para:
- recibir eventos de distintas sesiones;
- sincronizar estado;
- ejecutar agentes en background;
- escanear oportunidades;
- conectar CRM, mensajería, calendario y finanzas.

El dominio actual está diseñado para agregar esa capa sin rehacer la UI ni la ontología.
