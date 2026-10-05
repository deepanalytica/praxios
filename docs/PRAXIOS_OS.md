# PRAXIOS OS — Operating Architecture

## Purpose

PRAXIOS is the persistent control plane for an AI-augmented organization.

Models are replaceable workers. PRAXIOS owns:
- institutional state;
- decisions;
- opportunities;
- evidence;
- project priorities;
- execution;
- session continuity;
- governance.

Meta-Harness defines what models are allowed to do. PRAXIOS decides what is worth doing.

## Core loop

Session / event
→ Session Gateway
→ Harvest Engine
→ State Graph
→ Decision Engine
→ AI CEO / executive agents
→ execution pipeline
→ result / evidence
→ State Graph

## Operating principle

Every meaningful interaction with AI must increase the quality of institutional state.

A session that ends only as prose is incomplete.

## V0.2 implemented

### Control Plane UI
- Command Center
- Harvest Engine
- Session Gateway
- State Graph
- Decision Engine
- Opportunity Radar
- Execution Pipelines
- Agent Workforce
- Evidence Ledger
- Resource Engine
- Value Factory
- Meta-Harness/System

### Persistent local state
The browser stores an operational copy in localStorage.

This allows daily use before a remote database is introduced.

### Repository state
`data/praxios-state.json` is the portable canonical seed/state file for agents working in the repository.

### CLI
```bash
npm run praxios -- brief visual-art-ai
npm run praxios -- harvest examples/session-close.example.json
npm run praxios -- snapshot
npm run praxios -- validate
```

### Model protocols
- `PRAXIOS.md`
- `CLAUDE.md`
- `AGENTS.md`

Claude Code, Codex or another repo-aware agent should read these files before doing work.

## Harvest Contract

Every session close should capture:
- source;
- title;
- summary;
- project;
- ideas;
- decisions;
- opportunities;
- evidence;
- tasks;
- risks.

PRAXIOS converts these into operational entities.

## Authority model

### Owner
Can approve material allocation and irreversible actions.

### AI CEO
Can recommend portfolio changes and initiate low-risk analysis.

### CFO
Calculations and financial challenge.

### CRO
Revenue execution and pipeline.

### Market Intelligence
Research and opportunity discovery.

### Risk / QA
Can block high-risk proposals.

### Builder
Can execute scoped code work.

No high-risk agent may approve its own proposal.

## Current limitation

GitHub Pages is a static frontend. Therefore V0.2 is local-first.

Automatic cross-device ingestion, webhook intake, background agents and continuous opportunity scanning require a small persistent service/API in the next phase.

The domain model and UI do not depend on a specific hosting provider, so adding that service does not require rebuilding PRAXIOS.
