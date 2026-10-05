# PRAXIOS — Integration Guide

## Objetivo

Hacer que cualquier modelo o herramienta pueda entrar al sistema, trabajar y devolver conocimiento sin convertirse en dueño del estado.

## Claude Code

Automático por repositorio:
1. Claude lee `CLAUDE.md`.
2. Ejecuta `npm run sync:harvest`.
3. Lee State Brief + Harvest Brief.
4. Trabaja.
5. Escribe un JSON en `praxios/harvest/`.
6. GitHub Actions recompila la UI.

## Codex / coding agents

Usan `AGENTS.md` con el mismo ciclo.

## ChatGPT

Cuando el chat tiene acceso al repositorio:
1. cargar contexto PRAXIOS relevante;
2. al terminar una sesión material, crear un harvest siguiendo `schemas/session-harvest.schema.json`;
3. guardarlo en `praxios/harvest/`.

Sin acceso de escritura:
- copiar el payload `PRAXIOS_SESSION_HARVEST`;
- pegarlo en Session Harvest de la UI.

## Claude / Gemini / otros chats

Usar el contrato de `docs/SESSION_PROTOCOL.md`.
El output se pega en Session Gateway o se envía a la futura API.

## Futuro endpoint

Contrato conceptual:

`POST /v1/sessions/harvest`

Body: Session Harvest 1.0.

Respuesta esperada:
- accepted items;
- duplicates;
- created node IDs;
- relation IDs;
- CEO cycle invalidation flag.

## Seguridad

Un conector puede tener permiso para escribir conocimiento sin tener permiso para:
- gastar dinero;
- firmar contratos;
- publicar externamente;
- borrar datos;
- cambiar decisiones humanas.

La autoridad se evalúa por Meta-Harness, no por el modelo proveedor.
