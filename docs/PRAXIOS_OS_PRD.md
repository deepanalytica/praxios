# PRD — PRAXIOS OS V1

## 1. Problema

Las sesiones con modelos de IA son discontinuas. Ideas, decisiones, tareas, evidencia y oportunidades quedan atrapadas en conversaciones individuales. El usuario debe reconstruir contexto una y otra vez y los modelos no comparten un estado institucional.

## 2. Tesis

PRAXIOS no es un chatbot. Es un control plane persistente para gobernar modelos, proyectos, decisiones, recursos y ejecución.

Los modelos son trabajadores reemplazables. PRAXIOS conserva:
- estado;
- memoria institucional;
- decisiones;
- evidencia;
- portfolio;
- oportunidades;
- workflows;
- autoridad y límites.

Meta-Harness define qué pueden hacer los modelos. PRAXIOS decide qué conviene hacer. Los agentes ejecutan.

## 3. Resultado V1

El usuario puede:
1. abrir Command Center y ver el estado del sistema;
2. cosechar una sesión manualmente;
3. importar un harvest estructurado de ChatGPT/Claude/Codex/Gemini;
4. persistir objetos en el State Graph;
5. distinguir ideas, decisiones, tareas, riesgos, oportunidades y evidencia;
6. ejecutar un CEO cycle;
7. revisar decisiones abiertas;
8. validar o descartar oportunidades;
9. avanzar pipelines;
10. ver agentes, recursos, revenue y finanzas;
11. exportar/importar el estado;
12. incorporar harvests versionados del repositorio durante build.

## 4. Pantallas

- Command Center
- Session Harvest
- State Graph
- Decision Engine
- Opportunity Radar
- Pipelines
- Portfolio
- Agent Office
- Revenue
- Finance
- Resources
- Meta-Harness

## 5. Fuentes de memoria

### Navegador
localStorage permite comenzar a operar sin backend.

### Repository Harvest Ledger
`praxios/harvest/*.json` guarda sesiones versionadas de Claude Code/Codex u otros agentes que operan sobre el repo.

### Futuro
Persistencia remota transaccional para sincronización multi-dispositivo, webhooks y agentes externos.

## 6. Métricas principales

- sesiones cosechadas / sesiones materiales;
- decisiones sin evidencia;
- tiempo oportunidad → primer test;
- tiempo oportunidad → primera venta;
- caja generada por hora del founder;
- número de proyectos activos;
- ideas duplicadas detectadas;
- porcentaje de workflows completados;
- revenue atribuible a decisiones PRAXIOS.

## 7. Guardrails

- ninguna sugerencia se convierte automáticamente en decisión humana;
- acciones irreversibles requieren aprobación;
- evidencia y confianza son explícitas;
- secretos no se almacenan en harvests;
- la autonomía de ejecución es menor que la autonomía de recomendación.
