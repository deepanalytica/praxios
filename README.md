# Educabot

Rama de trabajo: `feature/educabot-prd`. Demo pública funcional de PRAXIOS. Puede desplegarse en Cloudflare, pero todavía no admite cuentas, datos escolares reales ni uso institucional.

Demo publicada: **https://educabot.deepanalytica.workers.dev/**.

## Espacios separados

| Ruta | Producto | Estado |
| --- | --- | --- |
| `/` | Landing de Educabot | Disponible |
| `/aprende` | Sesiones de aprendizaje, calendario y progreso del estudiante | Cuatro actividades interactivas de fracciones |
| `/familia` | Fechas y orientación para acompañar desde casa | Vista separada; solo señales generales |
| `/crea` | Borrador de clase para docentes individuales | Funciona con Workers AI o ejemplo determinista, indicado en la interfaz |
| `/implementa` | Seguimiento institucional | Concepto sin datos reales; etapa posterior |
| `/admin` | Consola de operación interna | Salud pública, estado autenticado y controles de módulos en Cloudflare KV |

### Calendario compartido de la demo

Aprende incluye **Hoy**, **Calendario**, **Mi aprendizaje** y **Practicar**. La sesión hace construir una representación, escribir una explicación antes de mostrar el modelo y resolver un caso nuevo. Muestra pistas ante errores. El progreso distingue representación y aplicación; no infiere dominio, atención ni calidad de la explicación. El calendario muestra clases, prácticas y pruebas con contenido y preparación. En móvil, la agenda semanal aparece antes del mes.

Crea incluye **Resumen**, **Planificación**, **Crear material** y **Evaluaciones**. El docente puede programar clases o pruebas; aparecen en Aprende dentro del mismo navegador. El borrador muestra secuencia completa, materiales, ticket de salida, límites y referencia curricular. Programarlo requiere tres comprobaciones declaradas por el docente y una nota sobre la fuente consultada. La aplicación no comprueba automáticamente la veracidad de cada afirmación. Los temas curados de la demo son fracciones de 5° básico y tectónica de placas de 7° básico; otros temas reciben una estructura general sin OA inventado. Familia está en `/familia` y no muestra explicaciones privadas.

Las vistas pueden abrirse directamente con `?vista=calendario`, `?vista=progreso` o `?vista=planificacion`, según el producto. El plan añadido por el docente y las señales de práctica se guardan en `localStorage`; el texto de la explicación no se guarda en el registro de progreso. No hay cuentas, sincronización entre dispositivos ni datos escolares reales. Los eventos iniciales son ejemplos relativos a la semana actual.

La recomendación de lanzamiento, hipótesis de precios y plan de validación están en [LAUNCH_STRATEGY_V3.md](docs/educabot/LAUNCH_STRATEGY_V3.md). La [estrategia anterior](docs/educabot/PRODUCT_STRATEGY_V2.md) se conserva como historial de decisiones.

## Ejecutar y verificar

```bash
npm install
npm run dev
npm test
npm run build
```

La app local se abre normalmente en `http://127.0.0.1:5173/`. Vite no ejecuta el Worker localmente: Crea mostrará el borrador determinista y Admin indicará que la API está desconectada. Para probar el Worker, compilar y usar Wrangler con las vinculaciones de Cloudflare configuradas.

## API y consola

- `POST /api/class-pack`: borrador estructurado, con `mode` para distinguir IA de fallback.
- `GET /api/health`: señal pública de disponibilidad del Worker.
- `GET /api/config`: controles públicos de disponibilidad por producto.
- `GET /api/admin/overview`: estado interno; requiere `Authorization: Bearer <ADMIN_TOKEN>`.
- `PUT /api/admin/flags`: actualiza controles de despliegue; requiere el secreto y KV.

El entorno publicado ya tiene `ADMIN_TOKEN` como secreto de Wrangler y el binding `ADMIN_KV` en `wrangler.jsonc`. La clave de esta instalación se entregó en el archivo local `.admin-token.local`, ignorado por Git; debe guardarse en un gestor de secretos antes de eliminar ese checkout. Nunca incluir claves en el código ni en el navegador público. El formulario de la consola conserva el token solo durante la sesión de la página. En otros entornos, si faltan estos recursos, la consola ofrece salud pública y deja desactivados los controles de lanzamiento.

La consola no inventa costos, usuarios ni incidentes. Esas métricas requieren integraciones operativas, cuentas y almacenamiento. Antes de usar datos de menores también se necesitan consentimiento, permisos, seguridad y revisión legal.

## Confiabilidad

El modelo genera borradores revisables. El docente debe comprobar afirmaciones y OA antes de usarlos. La salida del modelo no se etiqueta como verificada por autodeclaración. La actividad de Aprende evalúa una elección simple, no certifica dominio ni atención. La música es opcional y no se presenta como tratamiento o mejora garantizada.

## Desplegar

El Worker usa assets estáticos y declara el binding de Workers AI. La demo pública fija `AI_ENABLED=false` en `wrangler.jsonc`: `POST /api/class-pack` devuelve contenido determinista sin llamar al modelo ni generar costo variable de inferencia. Habilitar IA pública requiere autenticación, límites de uso, telemetría y revisión de costos. La CI valida la rama y solo despliega automáticamente si se configuran `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Con una sesión autorizada de Wrangler puede desplegarse manualmente:

```bash
npm run deploy
```
