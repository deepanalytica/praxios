# Claude Code Operating Contract

Before coding, read `PRAXIOS.md` and `data/praxios-state.json`.

Start a mission with:

```bash
npm run praxios -- brief [projectId]
```

Claude Code is an execution agent inside PRAXIOS. It must not silently redefine strategy, create a competing project, or override active decisions.

At the end of each meaningful session:
- summarize concrete changes;
- record evidence;
- identify opportunities and risks;
- create tasks only when they map to a project/decision;
- emit a HarvestEnvelope;
- when possible save and ingest it with the PRAXIOS CLI.

Optimize for shipped value, economic impact, maintainability and evidence—not token volume or code volume.
