# VOLUMEN V — Especificaciones Técnicas Profundas

## 1. Stack Tecnológico Base

### Frontend

```
React 18+ (Hooks, Concurrent Mode)
TypeScript 5+ (strict mode)
Vite 5+ (build tooling)
TailwindCSS (utility-first CSS)
shadcn/ui (component library)
React Router 6+ (routing)
TanStack Query (data fetching)
Zustand (state management)
Zod (validation)
Framer Motion (animations)
```

### 3D/XR

```
Three.js (3D engine)
@react-three/fiber (React renderer)
@react-three/drei (helpers)
WebGPU (future rendering)
WebXR (VR/AR support)
```

### Backend (Lovable Cloud)

```
Supabase (Postgres, Auth, Storage, Realtime)
Edge Functions (Deno)
Row Level Security (RLS) obligatorio
```

---

## 2. Zero-Trust Security Layer

### Sesión Autenticada

```typescript
interface ZeroTrustSession {
  client_did: string;        // DID del cliente
  session_nonce: string;     // Nonce único anti-replay
  signature: string;         // Firma del cliente
  timestamp: number;         // Timestamp de creación
  expires_at: number;        // Expiración
}
```

### Reglas de Seguridad

1. Toda conexión requiere DID + firma
2. Anti-replay con nonce único
3. Sesión ligada a identidad
4. Sin confianza implícita
5. Canal autenticado mTLS

---

## 3. Low-Latency Data Fabric

### Objetivo

< 30ms latencia percibida global

### Componentes

```
WebSocket + UDP Edge Relay
Compresión delta binaria
Protocolo binario (no JSON para datos críticos)
Interest management
Predicción cliente (Isabella pulses)
Tick rate: 60hz
WebTransport + QUIC (futuro)
```

### Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cliente   │◄───►│  Edge Node  │◄───►│   Central   │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │    < 30ms         │    < 50ms          │
     │                    │                    │
```

---

## 4. Bias & Consistency Control

### Normalización de Métricas

```typescript
// Evita amplificación visual falsa
function normalizeMetric(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Aplicar a: tráfico, entropía, peso de gobernanza
```

### Controles Anti-Manipulación

- Normalización matemática obligatoria
- Entropía visual controlada
- Balance cognitivo automático
- Auditoría perceptual pública

---

## 5. Redundancy & Failover Model

### Arquitectura de Alta Disponibilidad

```
Múltiples edge nodes (mínimo 3)
Quórum mínimo: 3 nodos
Replicación de estado de escena
Cold backups geopolíticos
Hot-shadow scene (failover caliente)
```

### Estados AST (Autonomous Survival Engine)

```typescript
type ASTState = 
  | 'NORMAL'    // Operación estándar
  | 'OBLIVION'  // Caída cloud, fog/edge promueven
  | 'BUNKER'    // Ataque legal/digital, congelación selectiva
  | 'ORPHAN'    // Nodo aislado, modo autónomo
  | 'PHOENIX';  // Rehidratación desde BookPI
```

---

## 6. Integrity Monitor

### Eventos de Integridad

```typescript
interface IntegrityEvent {
  type: 'CORRUPTION_DETECTED' | 'SAFE_MODE_ENTERED' | 'INTEGRITY_RESTORED';
  node_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
  msr_hash: string;
  timestamp: string;
}
```

### Capacidades

- Detectar corrupción lógica
- Emitir evento MSR
- Entrar en safe-mode automático
- Alertar a Guardianes

---

## 7. BookPI Ledger (Edge Function)

### Esquema de Entrada

```typescript
interface BookPIWriteRequest {
  event_type: string;
  metadata?: Record<string, any>;
}

interface BookPIEntry {
  id: string;
  event_type: string;
  user_id: string;
  hash: string;           // SHA-256
  prev_hash: string | null;
  metadata: Record<string, any>;
  created_at: string;
}
```

### Flujo de Escritura

1. Recibir evento
2. Obtener prev_hash del último evento del usuario
3. Calcular nuevo hash: `SHA256(prev_hash + event_type + metadata + timestamp)`
4. Insertar en identity_events
5. Retornar hash verificable

---

## 8. Isabella AI Pipeline (Edge Function)

### Request/Response

```typescript
interface IsabellaRequest {
  intent: string;
  context: Record<string, any>;
  user_id: string;
}

interface IsabellaResponse {
  decision: 'approve' | 'deny' | 'escalate';
  explanation: string;
  confidence: number;
  ethical_flags: string[];
  requires_hitl: boolean;
}
```

---

## 9. Esquema de Base de Datos

### Tablas Existentes

- `profiles` — Perfiles de usuario
- `posts` — Publicaciones
- `comments` — Comentarios
- `likes` — Likes
- `follows` — Relaciones de seguimiento
- `identity_events` — Eventos BookPI
- `user_roles` — Roles de usuario

### Tablas Por Crear

#### guardian_actions

```sql
CREATE TABLE guardian_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  status TEXT DEFAULT 'pending',
  guardian_id UUID REFERENCES profiles(id),
  isabella_recommendation TEXT,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
```

#### economic_transactions

```sql
CREATE TABLE economic_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID,
  to_user_id UUID,
  amount DECIMAL(18,8),
  currency TEXT DEFAULT 'TAMV-T',
  transaction_type TEXT,
  fee_percentage DECIMAL(5,2),
  fee_amount DECIMAL(18,8),
  msr_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### federated_nodes

```sql
CREATE TABLE federated_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_name TEXT NOT NULL,
  node_type TEXT,
  status TEXT DEFAULT 'active',
  ast_state TEXT DEFAULT 'NORMAL',
  last_heartbeat TIMESTAMPTZ,
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. Observabilidad

### Stack

```
OpenTelemetry (instrumentación)
Métricas: Prometheus/Mimir
Trazas: Jaeger/Tempo
Logs: Loki
Dashboards: Grafana
```

### Telemetría TAMV

```typescript
interface TAMVCrum {
  trace_id: string;
  span_id: string;
  event_type: string;
  user_id?: string;
  device_info: DeviceInfo;
  ui_context: UIContext;
  policy_applied: string[];
  timestamp: string;
}
```

---

## 11. CI/CD

### Pipeline

```yaml
stages:
  - lint
  - typecheck
  - test
  - build
  - deploy

pre-commit:
  - husky
  - lint-staged
  - eslint
  - prettier
  - tsc --noEmit
```

### Reglas de Merge

- Todos los checks deben pasar
- Review de al menos 1 Guardián para cambios críticos
- Cobertura mínima de tests: 70%
- Sin warnings de TypeScript
