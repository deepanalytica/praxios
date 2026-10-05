# Harvest inbox

When an agent has filesystem access, save the final PRAXIOS HarvestEnvelope here and ingest it:

```bash
npm run praxios -- harvest harvest/<file>.json
```

After ingestion, commit both the envelope and `data/praxios-state.json` when the session produced durable institutional knowledge.

Do not store secrets, credentials or sensitive customer data in harvest files.
