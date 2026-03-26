# VOLUMEN IX — Preproducción, Hardening y Despliegue Operativo

## Diagnóstico Ejecutivo

El ecosistema se encuentra en una fase **MVP avanzado / beta privada dura**: arquitectura, base de datos, gateway, módulos troncales y documentación canónica están en pie. Lo pendiente para salida a producción pública es principalmente de **endurecimiento operativo, cierre de UX, gobierno y QA intensivo**.

---

## Estado de Madurez por Frentes

### 1) Producción y Seguridad

**Pendientes críticos:**

- [ ] Auditoría integral de RLS y políticas de seguridad tabla por tabla (idealmente con tercero externo).
- [ ] Política institucional de secretos y rotación de claves/tokens (GitHub, Supabase, IA, correo/SMS, proveedores).
- [ ] Observabilidad operativa completa en edge functions: logs centralizados, métricas, trazas y alertas accionables.

### 2) Producto y UX

**Pendientes críticos:**

- [ ] Cierre UX de onboarding civilizatorio: registro ciudadano, verificación de identidad, asignación de roles y mensajes de error.
- [ ] UI final de **Atlas** (monitor civilizatorio): estados vacíos, errores, ayudas contextuales y visualización estable.
- [ ] UI final de **Guardian** (panel de guardianes): cola de decisiones, historial, filtros avanzados y trazabilidad.
- [ ] Afinación UX de **RDM**: Realito AI (prompt, límites, tono, disclaimers), rendimiento de mapa y responsive extremo.

### 3) Conectores Externos e Infraestructura

**Pendientes críticos:**

- [ ] Integraciones de correo transaccional, SMS/MFA real y webhooks de auditoría externa.
- [ ] Backups multi-región y validación de restauración alineados al manual **MD-X4**.
- [ ] Definición final de topología de despliegue (dominios/subdominios, TLS, rutas dev/stage/prod).

### 4) Operación, Gobierno y Cumplimiento

**Pendientes críticos:**

- [ ] Runbooks formales para operación diaria de guardianes, incidentes, protocolo de bans y actualizaciones.
- [ ] Traducción operativa/legal de volúmenes Legal, Economía y Seguridad en políticas ejecutables.
- [ ] Instrumentación del modelo **Economía Fénix** con parámetros y reportes auditables.

### 5) Calidad Técnica

**Pendientes críticos:**

- [ ] Suite automatizada de pruebas unitarias e integración para flujos críticos (auth, BookPI, Isabella, Phoenix, RDM, gateway DM-X7).
- [ ] Pruebas de estrés y hardening XR/Three.js en dispositivos débiles y redes degradadas.
- [ ] Fallbacks sin WebGL/WebGPU y degradación progresiva funcional.

---

## Fase Actual y Recomendación de Despliegue

### Fase técnica

**MVP avanzado / beta privada dura**: base tecnológica sólida, con deuda operativa y de calidad pendiente para producción abierta.

### Fase de despliegue

**Listo para stage semi-real** con usuarios controlados, guardianes internos y piloto de RDM antes de producción pública.

### Fase civilizatoria

**Apto para piloto territorial** (RDM Digital + núcleo TAMV OS), aún no para federación masiva multi-ciudad.

---

## Mensaje de Marketing (Versión Corta Reutilizable)

> “TAMV OS es un Sistema Operativo Civilizatorio: identidad ciudadana verificable, ledger inmutable y gobernanza algorítmica para proteger la dignidad humana en entornos digitales.”
>
> “Sobre ese núcleo, RDM Digital convierte Real del Monte en un Territorio Soberano Inteligente: mapa vivo, economía local aumentada y un asistente AI (Realito) entrenado sólo en la memoria del propio territorio.”
>
> “La plataforma combina autenticación real, economía programmable, consola de guardianes y visualización 4D del ecosistema, lista para escalar de un pueblo a una red de ciudades federadas.”

---

## Checklist Maestro de Cierre a Producción

### Infraestructura y seguridad

- [ ] Definir topología final (dominios, subdominios, regiones) y pipeline CI/CD multi-entorno.
- [ ] Ejecutar auditoría de RLS y políticas de acceso tabla por tabla.
- [ ] Activar logs + métricas + alertas para todas las edge functions.
- [ ] Formalizar política de secretos/tokens y rotación periódica.

### Producto TAMV OS

- [ ] Completar onboarding de ciudadanía (registro, verificación, rolado) con UX final.
- [ ] Cerrar UI de Atlas con paneles de nodos, amenazas y economía.
- [ ] Cerrar UI de Guardian con flujo operacional completo.
- [ ] Publicar subconjunto curado de endpoints DM-X7 con documentación v1.0 estable.

### XR / visualización 3D-4D

- [ ] Validar rendimiento de TAMVScene y PhoenixWorldShader en móviles/equipos modestos.
- [ ] Implementar fallback 2D ante ausencia de WebGL/WebGPU.
- [ ] Definir métricas visuales oficiales mapeadas a la escena (nodos, economía, decisiones Isabella).

### RDM Digital

- [ ] Curaduría final de contenidos con actores locales (lugares, comercios, eventos, narrativa).
- [ ] Afinar Realito AI (límites, tono, disclaimers legales, errores).
- [ ] Definir KPIs territoriales (visitantes, engagement, comercios activos) y tablero para ayuntamiento.

### Legal, economía y operación

- [ ] Convertir volúmenes Legal/Economía/Seguridad en contratos, políticas y protocolos ejecutables.
- [ ] Implementar reportes automáticos de Economía Fénix y distribución 75/25 para auditoría.
- [ ] Publicar runbooks de operación diaria, incidentes y actualización de versiones ligados a MD-X4.
