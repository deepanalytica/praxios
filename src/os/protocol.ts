export const sessionStartProtocol=`PRAXIOS_SESSION_START

Antes de trabajar:
1. Lee PRAXIOS/STATE_BRIEF y la Corporate Constitution.
2. Identifica proyecto, objetivo, decisión vigente y restricciones.
3. No abras un proyecto nuevo si la capacidad pertenece a uno existente.
4. Toda afirmación material debe distinguir evidencia de hipótesis.
5. Si detectas una oportunidad, estima comprador, problema, oferta, velocidad a caja y prueba mínima.
6. Si ejecutas código o contenido, vincúlalo a una misión y métrica.
7. No cambies decisiones estratégicas silenciosamente: propón una Decision Candidate.

Tu trabajo debe aumentar estado institucional, no sólo producir una respuesta.`;

export const sessionCloseProtocol=`PRAXIOS_SESSION_HARVEST
{
  "schemaVersion": "1.0",
  "sessionId": "SES-...",
  "source": "claude-code | codex | chatgpt | gemini | other",
  "title": "Título concreto de la sesión",
  "project": "Proyecto principal",
  "createdAt": "ISO-8601",
  "summary": "Qué cambió realmente como resultado de la sesión",
  "items": [
    {
      "kind": "idea | decision | task | risk | opportunity | evidence | goal | resource | finding",
      "title": "Objeto atómico",
      "summary": "Contexto suficiente para reutilizarlo",
      "project": "Proyecto",
      "confidence": 0,
      "severity": "low | medium | high | critical",
      "tags": ["..."],
      "relatesTo": ["IDs si se conocen"]
    }
  ]
}

Reglas de cierre:
- no inventes decisiones que el usuario no tomó;
- separa hallazgo, hipótesis y evidencia;
- captura tareas abiertas y riesgos;
- registra oportunidades comerciales incluso si no fueron el objetivo inicial;
- evita duplicar conceptos: referencia un objeto existente cuando sea posible;
- incluye artefactos, rutas, PRs o resultados en evidence/finding.`;

export const metaHarnessRules=[
  "Modelos proponen; el sistema gobierna.",
  "Ningún agente aprueba unilateralmente su propia acción de alto riesgo.",
  "Pagos, contratos y acciones irreversibles requieren aprobación humana.",
  "Toda recomendación material identifica evidencia y confianza.",
  "El tiempo del founder es capital y se contabiliza.",
  "No se construye completo si se puede validar antes.",
  "Una idea repetida no crea automáticamente un proyecto nuevo.",
  "La memoria institucional vive en PRAXIOS, no en el proveedor de IA.",
];
