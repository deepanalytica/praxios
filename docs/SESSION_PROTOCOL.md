# PRAXIOS Session Protocol 1.0

## Propósito

Crear continuidad entre ChatGPT, Claude, Claude Code, Codex, Gemini, agentes locales y futuras herramientas sin depender de la memoria de un proveedor.

## SESSION.START

Una sesión debe recibir:
- misión actual;
- proyecto;
- decisiones vigentes;
- restricciones;
- evidencia relevante;
- tareas/bloqueos;
- presupuesto o autoridad permitida;
- qué no debe hacer.

En el repositorio, el contexto mínimo está en:
- `praxios/state/STATE_BRIEF.md`
- `docs/CONSTITUTION.md`
- ADR/PRD específico del proyecto.

## SESSION.EVENT

Eventos conceptuales que una sesión puede producir:

- session.finding
- session.idea
- session.evidence
- session.decision_candidate
- session.task
- session.risk
- session.opportunity
- session.artifact_created
- session.revenue_signal

## SESSION.CLOSE / HARVEST

Schema:

```json
{
  "schemaVersion": "1.0",
  "sessionId": "SES-20261005-example",
  "source": "claude-code",
  "title": "Implementar Session Gateway",
  "project": "PRAXIOS Core",
  "createdAt": "2026-10-05T16:00:00.000Z",
  "summary": "Qué cambió realmente",
  "items": [
    {
      "kind": "evidence",
      "title": "Session Gateway compiló",
      "summary": "CI, tests y build verdes",
      "project": "PRAXIOS Core",
      "confidence": 100,
      "tags": ["engineering","ci"]
    },
    {
      "kind": "task",
      "title": "Conectar persistencia remota",
      "summary": "Siguiente salto después de validar la UI",
      "project": "PRAXIOS Core",
      "confidence": 90,
      "tags": ["backend"]
    }
  ]
}
```

Kinds válidos:
`idea decision task risk opportunity evidence goal resource finding`

Sources válidos:
`chatgpt claude claude-code codex gemini human other`

## Reglas

- No convertir una sugerencia en decisión sin aprobación explícita.
- No tratar una hipótesis como evidencia.
- Un hallazgo debe tener suficiente contexto para sobrevivir a la conversación.
- Detectar oportunidades comerciales aunque no fueran el objetivo primario.
- Evitar duplicados; relacionar con objetos existentes cuando sea posible.
- No guardar secretos.
