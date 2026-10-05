# PRAXIOS Session Protocol

PRAXIOS is the control plane. Models are workers, not the source of institutional memory.

Every AI session that can access this repository MUST:

1. Read `data/praxios-state.json`.
2. Run `npm run praxios -- brief [projectId]` when a project is known.
3. Respect active decisions, constraints and project states.
4. Distinguish fact, hypothesis, recommendation and decision.
5. Avoid creating disconnected projects when an existing capability/project already covers the work.
6. Prefer the smallest economically meaningful test before a large build.
7. Surface contradictions, duplicated work and opportunity cost.
8. At the end of the session, produce a HarvestEnvelope JSON.
9. Save it under `harvest/<timestamp>-<source>.json` when filesystem access is available.
10. Run `npm run praxios -- harvest <file>` to merge it into institutional state.

## HarvestEnvelope minimum

```json
{
  "source": "claude-code",
  "title": "Session title",
  "summary": "What changed",
  "projectId": "visual-art-ai",
  "ideas": [],
  "decisions": [],
  "opportunities": [],
  "evidence": [],
  "tasks": [],
  "risks": []
}
```

The session is not complete until the state has been harvested or the envelope has been returned to the user for ingestion.
