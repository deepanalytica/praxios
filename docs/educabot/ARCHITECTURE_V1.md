# Educabot — Arquitectura v1

## Objetivo

Implementar el PRD como un sistema de cuatro superficies sobre un mismo núcleo: Docente, Alumno, Familia y Centro. El modelo de IA es reemplazable; el estado, currículo, evidencia, calendario y Learning Graph pertenecen al producto.

## Capas

```
UI shells por rol
      ↓
Experience Engine
      ↓
PRAXIOS mission runtime
      ↓
Euler planner
      ↓
EL PUENTE
      ↓
Meta-Harness / Authority Boundary
      ↓
Provider adapters + instrumentos
      ↓
Postgres / R2 / audit ledger
```

## 1. Frontend

React + TypeScript + Vite.

Módulos futuros:

- `apps/web`: experiencia principal.
- `packages/ui`: design system.
- `packages/contracts`: schemas compartidos.
- `packages/curriculum`: ontología y matching.
- `packages/trust`: tipos de claims y estados.
- `packages/experience`: bloques seguros.

El prototipo actual mantiene todo en `src/` para velocidad y se dividirá cuando los contratos estén estabilizados.

## 2. Experience Engine

El LLM nunca genera HTML arbitrario. Produce un documento estructurado:

```ts
type ExperienceDocument = {
  objective: LearningObjectiveRef
  blocks: ExperienceBlock[]
  claims: Claim[]
  evidence: EvidenceRef[]
  practice: PracticeItem[]
  frontier: string
}
```

Bloques permitidos:

- ExplanationBlock
- ClaimBlock
- EvidenceBlock
- NumberLineBlock
- TimelineBlock
- ConceptMapBlock
- SimulationBlock
- ExperimentBlock
- QuizBlock
- ReflectionBlock
- StoryBlock
- ComicBlock
- VideoBlock

El cliente solo renderiza componentes auditados.

## 3. PRAXIOS runtime

Cada misión conserva:

- actor;
- rol;
- objetivo;
- restricciones;
- versión curricular;
- pasos;
- herramientas;
- artefactos;
- claims;
- evidencia;
- deuda;
- logs;
- decisión final.

Estados mínimos:

```
CREATED → PLANNED → RUNNING → VERIFYING → REVIEW → EMITTED
                                      ↘ BLOCKED
```

## 4. Euler planner

Antes de generar materiales, PRAXIOS crea un plan en nueve tiempos:

1. Nombrar.
2. Observar.
3. Invariante.
4. Conjeturar.
5. Verificar.
6. Unificar.
7. Simplificar sin perder verdad.
8. Conservar proceso.
9. Declarar frontera.

El resultado del planner no es contenido final: es el plan de construcción.

## 5. Trust kernel

### Claim

```ts
type EpistemicState =
  | "VERIFICADO"
  | "CORROBORADO"
  | "CONJETURA_DECLARADA"
  | "SILENCIO"
```

### Authority Boundary

Un modelo puede proponer un estado, pero el servidor recalcula el estado permitido.

Regla v1:

- VERIFICADO requiere EvidenceRef válido + instrumento/fuente autorizada + binding a claim.
- si falta: degradar;
- si contradice instrumento: bloquear;
- si no es decidible: mantener deuda o SILENCIO.

### Tiburón

Operador adversarial independiente con cobertura explícita:

- claim sin evidencia;
- número sin procedencia;
- fuente no resoluble;
- causalidad superior a evidencia;
- contradicción;
- pregunta de evaluación ambigua;
- material visual que contradice texto;
- respuesta que resuelve por el alumno lo que debía entrenar.

No es truth oracle.

## 6. Curriculum Graph

Tablas principales:

- curriculum_versions
- levels
- grades
- subjects
- axes
- learning_objectives
- concepts
- prerequisites
- misconceptions
- resources
- oa_concept_edges

Todo OA conserva fuente, hash, versión y vigencia.

## 7. Learning Graph

Por alumno:

- concept_id
- mastery_estimate
- confidence
- evidence_count
- last_evidence_at
- misconception_flags
- forgetting_risk
- next_review_at

El dominio no aumenta por consumo. Eventos válidos deben distinguir recognition, recall, reconstruction, transfer y defense.

## 8. Calendar Engine

Une:

```
eventos futuros + OA + prerequisitos + mastery → preparación sugerida
```

Nunca presentar una predicción como certeza.

## 9. Teacher Studio

Pipeline:

```
brief pedagógico
→ plan Euler
→ guion
→ storyboard
→ claim/evidence QA
→ aprobación docente
→ provider adapter
→ render
→ post-QA
→ asignación
```

`VideoProvider` permite Seedance como primera implementación sin acoplar el producto.

## 10. Infraestructura

Preferencia:

- Cloudflare Workers/Assets;
- Supabase/Postgres;
- R2 para artefactos;
- Queues para generación pesada;
- GitHub Actions;
- Sentry/OTel o equivalente para trazas.

## 11. Seguridad y menores

- multi-tenant por institución;
- RBAC;
- guardian links explícitos;
- minimización de contexto enviado a proveedores;
- no inferir salud mental;
- no rankings públicos;
- no exponer conversaciones del alumno a familia por defecto;
- export/delete;
- audit log append-only para decisiones relevantes.

## 12. Primera implementación real

Orden:

1. auth + tenant + roles;
2. curriculum version + 20–30 OA;
3. Teacher Class Builder;
4. ExperienceDocument + renderer;
5. trust kernel;
6. Student assignment + evidence;
7. Learning Graph;
8. dashboard docente;
9. calendar;
10. familia y centro;
11. media providers.

El prototipo de esta rama valida la arquitectura de interacción antes de abrir esa inversión.
