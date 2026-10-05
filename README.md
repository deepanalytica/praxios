# Educabot

Rama de trabajo: `feature/educabot-prd`. Prototipo funcional de PRAXIOS para probar propuestas de producto, no plataforma escolar lista para producción.

## Espacios separados

| Ruta | Producto | Estado |
| --- | --- | --- |
| `/` | Landing de Educabot | Disponible |
| `/aprende` | Aprendizaje del estudiante, vista familiar y paisaje sonoro opcional | Una actividad interactiva de demostración |
| `/crea` | Borrador de clase para docentes individuales | Funciona con Workers AI o ejemplo determinista, indicado en la interfaz |
| `/implementa` | Seguimiento institucional | Concepto sin datos reales; etapa posterior |
| `/admin` | Consola de operación interna | Salud pública y vista previa; acceso protegido para estado y controles reales |

La recomendación de lanzamiento, hipótesis de precios y plan de validación están en [LAUNCH_STRATEGY_V3.md](docs/educabot/LAUNCH_STRATEGY_V3.md). La [estrategia anterior](docs/educabot/PRODUCT_STRATEGY_V2.md) se conserva como historial de decisiones.

## Ejecutar y verificar

```bash
npm install
npm run dev
npm test
npm run build
```

La app local se abre normalmente en `http://127.0.0.1:5173/`. Vite no ejecuta el Worker localmente: Crea mostrará el borrador de demostración y Admin indicará que la API está desconectada. Para probar el Worker, compilar y usar Wrangler con las vinculaciones de Cloudflare configuradas.

## API y consola

- `POST /api/class-pack`: borrador estructurado, con `mode` para distinguir IA de fallback.
- `GET /api/health`: señal pública de disponibilidad del Worker.
- `GET /api/config`: controles públicos de disponibilidad por producto.
- `GET /api/admin/overview`: estado interno; requiere `Authorization: Bearer <ADMIN_TOKEN>`.
- `PUT /api/admin/flags`: actualiza controles de despliegue; requiere el secreto y KV.

Configurar `ADMIN_TOKEN` como secreto de Wrangler. Crear un namespace de Cloudflare KV y añadir su binding `ADMIN_KV` a `wrangler.jsonc` con el identificador real del proyecto. Nunca incluir claves en el código ni en el navegador. El formulario de la consola conserva el token solo durante la sesión de la página.

La consola no inventa costos, usuarios ni incidentes. Esas métricas requieren integraciones operativas, cuentas y almacenamiento. Antes de usar datos de menores también se necesitan consentimiento, permisos, seguridad y revisión legal.

## Confiabilidad

El modelo genera borradores revisables. El docente debe comprobar afirmaciones y OA antes de usarlos. La salida del modelo no se etiqueta como verificada por autodeclaración. La actividad de Aprende evalúa una elección simple, no certifica dominio ni atención. La música es opcional y no se presenta como tratamiento o mejora garantizada.

## Desplegar

El Worker usa assets estáticos y, si está configurado, Workers AI. El despliegue requiere `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`:

```bash
npm run deploy
```
