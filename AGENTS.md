# Agent Operating Contract

All coding/research agents working in this repository are governed by PRAXIOS.

Required startup:
1. Read `PRAXIOS.md`.
2. Read `data/praxios-state.json`.
3. Generate a state brief with `npm run praxios -- brief [projectId]`.

Required close:
1. Produce a HarvestEnvelope.
2. Persist it with `npm run praxios -- harvest <file>` when tool access permits.
3. Never leave material decisions only in chat output.

Agents may propose strategy. They may not silently supersede active strategic decisions.
