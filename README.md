# TAMV Online / Civilizational Core

Plataforma civilizatoria digital orientada a identidad soberana, gobernanza operativa y despliegue territorial (RDM Digital) sobre el núcleo TAMV OS.

## Estado del proyecto

- **Fase actual:** MVP avanzado / beta privada dura.
- **Meta inmediata:** stage semi-real con usuarios controlados y guardianes internos.
- **Meta de salida:** producción pública con hardening técnico, legal y operativo.

## Módulos principales

- **Atlas**: monitor federado de nodos, seguridad y economía Fénix.
- **Guardian Console**: circuito HITL para revisión y resolución de acciones críticas.
- **RDM Digital**: capa territorial (mapa vivo, contenidos, experiencias y Realito AI).
- **DevHub / DM-X7**: gateway unificado para integración de servicios y módulos.

## Novedad operativa incluida

Se integró un **Centro de Preparación Operativa** en la UI para alinear equipos técnicos y de gobierno con una ejecución real hacia stage/producción:

- Checklist tipado por dominios (infra/seguridad, producto, XR/RDM, operación/gobernanza).
- Progreso global y por hito (`stage` y `production`).
- Visualización compartida en Atlas y Guardian para seguimiento continuo.

## Documentación canónica

Revisa `docs/README.md` para el índice completo de volúmenes (I-IX) y análisis operativo complementario.

## Desarrollo local

```bash
npm install
npm run dev
```

### Comandos útiles

```bash
npm run build
npm run preview
npm run lint
npm test
```

> Nota: si `npm run lint` falla por dependencias de ESLint, instala primero las dependencias del proyecto.

## Stack

- React + TypeScript
- Vite
- Tailwind + shadcn/ui
- Supabase (auth, datos y funciones)
