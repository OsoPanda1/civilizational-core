// TAMV DM-X7 API Specification — 160 Operations across 13 Domains

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type TamvDomain =
  | 'auth' | 'identity' | 'security' | 'economy' | 'xr'
  | 'quantum' | 'governance' | 'utamv' | 'bookpi'
  | 'kernel' | 'ops' | 'social' | 'devtools';

export interface TamvOperationSpec {
  id: string;
  domain: TamvDomain;
  method: HttpMethod;
  path: string;
  authRequired: boolean;
  roles?: string[];
  description: string;
  category?: 'user' | 'admin' | 'internal';
}

export type TamvSpec = Record<string, TamvOperationSpec>;

const op = (o: TamvOperationSpec): TamvOperationSpec => o;

export const DOMAIN_META: Record<TamvDomain, { label: string; icon: string; color: string }> = {
  auth:       { label: 'Auth',             icon: 'KeyRound',     color: 'hsl(var(--primary))' },
  identity:   { label: 'Identity',         icon: 'Fingerprint',  color: 'hsl(var(--accent))' },
  security:   { label: 'Security/Sentinel',icon: 'Shield',       color: 'hsl(0 72% 51%)' },
  economy:    { label: 'Economy',          icon: 'Coins',        color: 'hsl(142 76% 36%)' },
  xr:         { label: 'XR/Dreamspace',    icon: 'Globe',        color: 'hsl(262 83% 58%)' },
  quantum:    { label: 'Quantum',          icon: 'Atom',         color: 'hsl(199 89% 48%)' },
  governance: { label: 'Governance',       icon: 'Landmark',     color: 'hsl(25 95% 53%)' },
  utamv:      { label: 'UTAMV',            icon: 'GraduationCap',color: 'hsl(340 75% 55%)' },
  bookpi:     { label: 'BookPI',           icon: 'BookOpen',     color: 'hsl(47 96% 53%)' },
  kernel:     { label: 'Kernel/IA',        icon: 'Brain',        color: 'hsl(280 68% 60%)' },
  ops:        { label: 'Ops/Iron-Gate',    icon: 'Server',       color: 'hsl(210 40% 50%)' },
  social:     { label: 'Social',           icon: 'Users',        color: 'hsl(173 58% 39%)' },
  devtools:   { label: 'DevTools',         icon: 'Terminal',     color: 'hsl(0 0% 45%)' },
};

export const tamvSpec: TamvSpec = {
  // ═══════════════════ AUTH (10) ═══════════════════
  'auth.genesis': op({
    id: 'auth.genesis', domain: 'auth', method: 'POST',
    path: '/v7/auth/genesis', authRequired: false,
    description: 'Registro inicial de identidad TAMV (ID-NVIDA).',
    category: 'user',
  }),
  'auth.login': op({
    id: 'auth.login', domain: 'auth', method: 'POST',
    path: '/v7/auth/login', authRequired: false,
    description: 'Inicio de sesión clásico + PQC.',
    category: 'user',
  }),
  'auth.logout': op({
    id: 'auth.logout', domain: 'auth', method: 'POST',
    path: '/v7/auth/logout', authRequired: true,
    description: 'Cierra la sesión activa del usuario.',
    category: 'user',
  }),
  'auth.refresh': op({
    id: 'auth.refresh', domain: 'auth', method: 'POST',
    path: '/v7/auth/refresh', authRequired: false,
    description: 'Renueva el token de acceso.',
    category: 'user',
  }),
  'auth.pqcHandshake': op({
    id: 'auth.pqcHandshake', domain: 'auth', method: 'POST',
    path: '/v7/auth/pqc/handshake', authRequired: true,
    description: 'Negociación de llaves PQC (Kyber/Dilithium lógico).',
    category: 'user',
  }),
  'auth.device.register': op({
    id: 'auth.device.register', domain: 'auth', method: 'POST',
    path: '/v7/auth/device/register', authRequired: true,
    description: 'Registra un dispositivo de confianza.',
    category: 'user',
  }),
  'auth.device.list': op({
    id: 'auth.device.list', domain: 'auth', method: 'GET',
    path: '/v7/auth/device/list', authRequired: true,
    description: 'Lista de dispositivos confiables asociados al usuario.',
    category: 'user',
  }),
  'auth.device.revoke': op({
    id: 'auth.device.revoke', domain: 'auth', method: 'DELETE',
    path: '/v7/auth/device/revoke', authRequired: true,
    description: 'Revoca un dispositivo de confianza.',
    category: 'user',
  }),
  'auth.session.list': op({
    id: 'auth.session.list', domain: 'auth', method: 'GET',
    path: '/v7/auth/session/list', authRequired: true,
    description: 'Lista sesiones activas del usuario.',
    category: 'user',
  }),
  'auth.session.terminate': op({
    id: 'auth.session.terminate', domain: 'auth', method: 'POST',
    path: '/v7/auth/session/terminate', authRequired: true,
    description: 'Termina una sesión específica.',
    category: 'user',
  }),

  // ═══════════════════ IDENTITY (12) ═══════════════════
  'identity.profile.get': op({
    id: 'identity.profile.get', domain: 'identity', method: 'GET',
    path: '/v7/identity/profile', authRequired: true,
    description: 'Obtiene el perfil completo del usuario.',
    category: 'user',
  }),
  'identity.profile.update': op({
    id: 'identity.profile.update', domain: 'identity', method: 'PATCH',
    path: '/v7/identity/profile', authRequired: true,
    description: 'Actualiza campos del perfil.',
    category: 'user',
  }),
  'identity.dignity.pulse': op({
    id: 'identity.dignity.pulse', domain: 'identity', method: 'GET',
    path: '/v7/identity/dignity-pulse', authRequired: true,
    description: 'Consulta el Dignity Score dinámico.',
    category: 'user',
  }),
  'identity.roles.list': op({
    id: 'identity.roles.list', domain: 'identity', method: 'GET',
    path: '/v7/identity/roles', authRequired: true,
    description: 'Roles asignados al usuario actual.',
    category: 'user',
  }),
  'identity.role.grant': op({
    id: 'identity.role.grant', domain: 'identity', method: 'POST',
    path: '/v7/identity/role/grant', authRequired: true,
    roles: ['admin', 'guardian'],
    description: 'Concede un rol a un usuario.',
    category: 'admin',
  }),
  'identity.role.revoke': op({
    id: 'identity.role.revoke', domain: 'identity', method: 'POST',
    path: '/v7/identity/role/revoke', authRequired: true,
    roles: ['admin', 'guardian'],
    description: 'Revoca un rol de un usuario.',
    category: 'admin',
  }),
  'identity.sovereign.transfer': op({
    id: 'identity.sovereign.transfer', domain: 'identity', method: 'POST',
    path: '/v7/identity/sovereign-transfer', authRequired: true,
    description: 'Migra identidad entre nodos federados.',
    category: 'user',
  }),
  'identity.history': op({
    id: 'identity.history', domain: 'identity', method: 'GET',
    path: '/v7/identity/history', authRequired: true,
    description: 'Historial de eventos de identidad.',
    category: 'user',
  }),
  'identity.lock': op({
    id: 'identity.lock', domain: 'identity', method: 'POST',
    path: '/v7/identity/lock', authRequired: true,
    roles: ['admin', 'guardian'],
    description: 'Bloquea temporalmente una identidad.',
    category: 'admin',
  }),
  'identity.unlock': op({
    id: 'identity.unlock', domain: 'identity', method: 'POST',
    path: '/v7/identity/unlock', authRequired: true,
    roles: ['admin', 'guardian'],
    description: 'Desbloquea una identidad.',
    category: 'admin',
  }),
  'identity.trust.metrics': op({
    id: 'identity.trust.metrics', domain: 'identity', method: 'GET',
    path: '/v7/identity/trust-metrics', authRequired: true,
    description: 'Métricas de confianza asociadas a la identidad.',
    category: 'user',
  }),
  'identity.devices': op({
    id: 'identity.devices', domain: 'identity', method: 'GET',
    path: '/v7/identity/devices', authRequired: true,
    description: 'Lista dispositivos asociados a la identidad.',
    category: 'user',
  }),

  // ═══════════════════ SECURITY / SENTINEL (12) ═══════════════════
  'security.threat.map': op({
    id: 'security.threat.map', domain: 'security', method: 'GET',
    path: '/v7/sentinel/horus/threat-map', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Mapa global de amenazas Horus.',
    category: 'admin',
  }),
  'security.alerts': op({
    id: 'security.alerts', domain: 'security', method: 'GET',
    path: '/v7/sentinel/horus/alerts', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Alertas de seguridad activas.',
    category: 'admin',
  }),
  'security.anubis.purge': op({
    id: 'security.anubis.purge', domain: 'security', method: 'POST',
    path: '/v7/sentinel/anubis/purge', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Exilio inmediato de un actor malicioso.',
    category: 'admin',
  }),
  'security.anubis.flag': op({
    id: 'security.anubis.flag', domain: 'security', method: 'POST',
    path: '/v7/sentinel/anubis/flag', authRequired: true,
    description: 'Marca un actor como sospechoso.',
    category: 'user',
  }),
  'security.osiris.restore': op({
    id: 'security.osiris.restore', domain: 'security', method: 'POST',
    path: '/v7/sentinel/osiris/restore', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Restauración controlada de cuenta (Osiris).',
    category: 'admin',
  }),
  'security.audit.logs': op({
    id: 'security.audit.logs', domain: 'security', method: 'GET',
    path: '/v7/sentinel/audit/logs', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Acceso a logs de seguridad.',
    category: 'admin',
  }),
  'security.incident.report': op({
    id: 'security.incident.report', domain: 'security', method: 'POST',
    path: '/v7/sentinel/incident/report', authRequired: true,
    description: 'Reporte de incidente de seguridad.',
    category: 'user',
  }),
  'security.incident.get': op({
    id: 'security.incident.get', domain: 'security', method: 'GET',
    path: '/v7/sentinel/incident/:id', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Detalle de incidente específico.',
    category: 'admin',
  }),
  'security.mode.set': op({
    id: 'security.mode.set', domain: 'security', method: 'POST',
    path: '/v7/sentinel/mode/set', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Cambia el modo civilizatorio (peace/alert/lockdown).',
    category: 'admin',
  }),
  'security.mode.get': op({
    id: 'security.mode.get', domain: 'security', method: 'GET',
    path: '/v7/sentinel/mode', authRequired: true,
    description: 'Consulta el modo civilizatorio actual.',
    category: 'user',
  }),
  'security.ratelimit.state': op({
    id: 'security.ratelimit.state', domain: 'security', method: 'GET',
    path: '/v7/sentinel/rate-limit/state', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Estado de rate limiting por dominio.',
    category: 'admin',
  }),
  'security.firewall.rules': op({
    id: 'security.firewall.rules', domain: 'security', method: 'GET',
    path: '/v7/sentinel/firewall/rules', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Reglas activas de firewall lógico.',
    category: 'admin',
  }),

  // ═══════════════════ ECONOMY (22) ═══════════════════
  'economy.balance': op({
    id: 'economy.balance', domain: 'economy', method: 'GET',
    path: '/v7/economy/balance', authRequired: true,
    description: 'Consulta de saldo del usuario.',
    category: 'user',
  }),
  'economy.ledger': op({
    id: 'economy.ledger', domain: 'economy', method: 'GET',
    path: '/v7/economy/ledger', authRequired: true,
    description: 'Entradas del ledger económico personal.',
    category: 'user',
  }),
  'economy.tcep.atomicSwap': op({
    id: 'economy.tcep.atomicSwap', domain: 'economy', method: 'POST',
    path: '/v7/economy/tcep/atomic-swap', authRequired: true,
    description: 'Intercambio atómico TCEP entre dos partes.',
    category: 'user',
  }),
  'economy.transfer': op({
    id: 'economy.transfer', domain: 'economy', method: 'POST',
    path: '/v7/economy/transfer', authRequired: true,
    description: 'Transferencia de valor entre entidades.',
    category: 'user',
  }),
  'economy.lock': op({
    id: 'economy.lock', domain: 'economy', method: 'POST',
    path: '/v7/economy/lock', authRequired: true,
    description: 'Bloquea fondos del usuario (staking/garantía).',
    category: 'user',
  }),
  'economy.unlock': op({
    id: 'economy.unlock', domain: 'economy', method: 'POST',
    path: '/v7/economy/unlock', authRequired: true,
    description: 'Desbloquea fondos previamente bloqueados.',
    category: 'user',
  }),
  'economy.positions': op({
    id: 'economy.positions', domain: 'economy', method: 'GET',
    path: '/v7/economy/positions', authRequired: true,
    description: 'Posiciones económicas activas del usuario.',
    category: 'user',
  }),
  'economy.distribution.audit': op({
    id: 'economy.distribution.audit', domain: 'economy', method: 'GET',
    path: '/v7/economy/distribution/audit', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Auditoría de distribución económica 20/30/50.',
    category: 'admin',
  }),
  'economy.fenix.ignite': op({
    id: 'economy.fenix.ignite', domain: 'economy', method: 'POST',
    path: '/v7/economy/fenix/ignite', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Activa Protocolo Fénix para redistribución.',
    category: 'admin',
  }),
  'economy.fenix.regions': op({
    id: 'economy.fenix.regions', domain: 'economy', method: 'GET',
    path: '/v7/economy/fenix/regions', authRequired: true,
    description: 'Regiones beneficiarias del Protocolo Fénix.',
    category: 'user',
  }),
  'economy.gifts.bless': op({
    id: 'economy.gifts.bless', domain: 'economy', method: 'POST',
    path: '/v7/economy/gifts/mini-anubis/bless', authRequired: true,
    description: 'Envía un regalo Mini-Anubis a otro usuario.',
    category: 'user',
  }),
  'economy.gifts.history': op({
    id: 'economy.gifts.history', domain: 'economy', method: 'GET',
    path: '/v7/economy/gifts/history', authRequired: true,
    description: 'Historial de regalos enviados y recibidos.',
    category: 'user',
  }),
  'economy.lottery.jackpot': op({
    id: 'economy.lottery.jackpot', domain: 'economy', method: 'GET',
    path: '/v7/economy/lottery/jackpot-pulse', authRequired: true,
    description: 'Estado actual del jackpot de lotería.',
    category: 'user',
  }),
  'economy.lottery.ticket': op({
    id: 'economy.lottery.ticket', domain: 'economy', method: 'POST',
    path: '/v7/economy/lottery/ticket', authRequired: true,
    description: 'Compra un ticket de lotería TAMV.',
    category: 'user',
  }),
  'economy.lottery.tickets': op({
    id: 'economy.lottery.tickets', domain: 'economy', method: 'GET',
    path: '/v7/economy/lottery/tickets', authRequired: true,
    description: 'Lista tickets de lotería del usuario.',
    category: 'user',
  }),
  'economy.fees.model': op({
    id: 'economy.fees.model', domain: 'economy', method: 'GET',
    path: '/v7/economy/fees/model', authRequired: true,
    description: 'Modelo de comisiones vigente.',
    category: 'user',
  }),
  'economy.stats.velocity': op({
    id: 'economy.stats.velocity', domain: 'economy', method: 'GET',
    path: '/v7/economy/stats/velocity', authRequired: true,
    description: 'Velocidad de circulación de tokens.',
    category: 'user',
  }),
  'economy.stats.volume': op({
    id: 'economy.stats.volume', domain: 'economy', method: 'GET',
    path: '/v7/economy/stats/volume', authRequired: true,
    description: 'Volumen total transaccionado.',
    category: 'user',
  }),
  'economy.compliance.reports': op({
    id: 'economy.compliance.reports', domain: 'economy', method: 'GET',
    path: '/v7/economy/compliance/reports', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Reportes de cumplimiento económico.',
    category: 'admin',
  }),
  'economy.compliance.flag': op({
    id: 'economy.compliance.flag', domain: 'economy', method: 'POST',
    path: '/v7/economy/compliance/flag', authRequired: true,
    description: 'Marca una transacción para revisión de cumplimiento.',
    category: 'user',
  }),
  'economy.policies': op({
    id: 'economy.policies', domain: 'economy', method: 'GET',
    path: '/v7/economy/policies', authRequired: true,
    description: 'Políticas económicas vigentes.',
    category: 'user',
  }),
  'economy.policies.update': op({
    id: 'economy.policies.update', domain: 'economy', method: 'PATCH',
    path: '/v7/economy/policies', authRequired: true,
    roles: ['admin'],
    description: 'Actualiza políticas económicas.',
    category: 'admin',
  }),

  // ═══════════════════ XR / DREAMSPACE (18) ═══════════════════
  'xr.world.instantiate': op({
    id: 'xr.world.instantiate', domain: 'xr', method: 'POST',
    path: '/v7/xr/world/instantiate-4d', authRequired: true,
    description: 'Instancia un mundo 4D.',
    category: 'user',
  }),
  'xr.world.list': op({
    id: 'xr.world.list', domain: 'xr', method: 'GET',
    path: '/v7/xr/world/list', authRequired: true,
    description: 'Lista mundos disponibles.',
    category: 'user',
  }),
  'xr.world.get': op({
    id: 'xr.world.get', domain: 'xr', method: 'GET',
    path: '/v7/xr/world/:id', authRequired: true,
    description: 'Detalle de un mundo.',
    category: 'user',
  }),
  'xr.world.state.update': op({
    id: 'xr.world.state.update', domain: 'xr', method: 'POST',
    path: '/v7/xr/world/state/update', authRequired: true,
    description: 'Actualiza estado de un mundo.',
    category: 'user',
  }),
  'xr.world.state.get': op({
    id: 'xr.world.state.get', domain: 'xr', method: 'GET',
    path: '/v7/xr/world/state', authRequired: true,
    description: 'Obtiene estado actual del mundo.',
    category: 'user',
  }),
  'xr.physics.gravity.get': op({
    id: 'xr.physics.gravity.get', domain: 'xr', method: 'GET',
    path: '/v7/xr/physics/gravity-config', authRequired: true,
    description: 'Configuración de gravedad del mundo.',
    category: 'user',
  }),
  'xr.physics.gravity.update': op({
    id: 'xr.physics.gravity.update', domain: 'xr', method: 'PATCH',
    path: '/v7/xr/physics/gravity-config', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Modifica configuración de gravedad.',
    category: 'admin',
  }),
  'xr.dreamspace.mint': op({
    id: 'xr.dreamspace.mint', domain: 'xr', method: 'POST',
    path: '/v7/dreamspace/object/mint-3d', authRequired: true,
    description: 'Crea un asset 3D en Dreamspace.',
    category: 'user',
  }),
  'xr.dreamspace.object.get': op({
    id: 'xr.dreamspace.object.get', domain: 'xr', method: 'GET',
    path: '/v7/dreamspace/object/:id', authRequired: true,
    description: 'Detalle de un objeto Dreamspace.',
    category: 'user',
  }),
  'xr.dreamspace.inventory': op({
    id: 'xr.dreamspace.inventory', domain: 'xr', method: 'GET',
    path: '/v7/dreamspace/inventory', authRequired: true,
    description: 'Inventario del usuario en Dreamspace.',
    category: 'user',
  }),
  'xr.dreamspace.reality.patch': op({
    id: 'xr.dreamspace.reality.patch', domain: 'xr', method: 'PATCH',
    path: '/v7/dreamspace/reality/patch', authRequired: true,
    description: 'Aplica un parche a la realidad Dreamspace.',
    category: 'user',
  }),
  'xr.dreamspace.reality.snapshots': op({
    id: 'xr.dreamspace.reality.snapshots', domain: 'xr', method: 'GET',
    path: '/v7/dreamspace/reality/snapshots', authRequired: true,
    description: 'Snapshots de la realidad Dreamspace.',
    category: 'user',
  }),
  'xr.session.open': op({
    id: 'xr.session.open', domain: 'xr', method: 'POST',
    path: '/v7/xr/session/open', authRequired: true,
    description: 'Abre sesión XR.',
    category: 'user',
  }),
  'xr.session.close': op({
    id: 'xr.session.close', domain: 'xr', method: 'POST',
    path: '/v7/xr/session/close', authRequired: true,
    description: 'Cierra sesión XR.',
    category: 'user',
  }),
  'xr.session.active': op({
    id: 'xr.session.active', domain: 'xr', method: 'GET',
    path: '/v7/xr/session/active', authRequired: true,
    description: 'Sesiones XR activas.',
    category: 'user',
  }),
  'xr.presence.update': op({
    id: 'xr.presence.update', domain: 'xr', method: 'POST',
    path: '/v7/xr/presence/update', authRequired: true,
    description: 'Actualiza presencia del usuario en XR.',
    category: 'user',
  }),
  'xr.presence.get': op({
    id: 'xr.presence.get', domain: 'xr', method: 'GET',
    path: '/v7/xr/presence', authRequired: true,
    description: 'Obtiene presencia actual.',
    category: 'user',
  }),
  'xr.telemetry': op({
    id: 'xr.telemetry', domain: 'xr', method: 'GET',
    path: '/v7/xr/telemetry', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Telemetría XR del sistema.',
    category: 'admin',
  }),

  // ═══════════════════ QUANTUM (14) ═══════════════════
  'quantum.circuit.execute': op({
    id: 'quantum.circuit.execute', domain: 'quantum', method: 'POST',
    path: '/v7/quantum/circuit/execute', authRequired: true,
    description: 'Ejecuta un circuito cuántico.',
    category: 'user',
  }),
  'quantum.circuit.status': op({
    id: 'quantum.circuit.status', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/circuit/:id/status', authRequired: true,
    description: 'Estado de ejecución de circuito.',
    category: 'user',
  }),
  'quantum.circuit.result': op({
    id: 'quantum.circuit.result', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/circuit/:id/result', authRequired: true,
    description: 'Resultado de circuito ejecutado.',
    category: 'user',
  }),
  'quantum.vqe.ecoBalance': op({
    id: 'quantum.vqe.ecoBalance', domain: 'quantum', method: 'POST',
    path: '/v7/quantum/vqe/eco-balance', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'VQE para balance económico cuántico.',
    category: 'admin',
  }),
  'quantum.qaoa.citySync': op({
    id: 'quantum.qaoa.citySync', domain: 'quantum', method: 'POST',
    path: '/v7/quantum/qaoa/city-sync', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'QAOA para sincronización de ciudades.',
    category: 'admin',
  }),
  'quantum.qrng.entropy': op({
    id: 'quantum.qrng.entropy', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/qrng/entropy-source', authRequired: true,
    description: 'Fuente de entropía cuántica (QRNG).',
    category: 'user',
  }),
  'quantum.providers': op({
    id: 'quantum.providers', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/providers', authRequired: true,
    description: 'Backends cuánticos disponibles.',
    category: 'user',
  }),
  'quantum.usage.stats': op({
    id: 'quantum.usage.stats', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/usage/stats', authRequired: true,
    description: 'Estadísticas de uso cuántico.',
    category: 'user',
  }),
  'quantum.job.cancel': op({
    id: 'quantum.job.cancel', domain: 'quantum', method: 'POST',
    path: '/v7/quantum/job/cancel', authRequired: true,
    description: 'Cancela un job cuántico en ejecución.',
    category: 'user',
  }),
  'quantum.job.list': op({
    id: 'quantum.job.list', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/job/list', authRequired: true,
    description: 'Lista de jobs cuánticos del usuario.',
    category: 'user',
  }),
  'quantum.policy.set': op({
    id: 'quantum.policy.set', domain: 'quantum', method: 'POST',
    path: '/v7/quantum/policy/set', authRequired: true,
    roles: ['admin'],
    description: 'Establece políticas de uso cuántico.',
    category: 'admin',
  }),
  'quantum.policy.get': op({
    id: 'quantum.policy.get', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/policy', authRequired: true,
    description: 'Obtiene políticas de uso cuántico.',
    category: 'user',
  }),
  'quantum.health': op({
    id: 'quantum.health', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/health', authRequired: true,
    description: 'Estado de salud del subsistema cuántico.',
    category: 'user',
  }),
  'quantum.backends': op({
    id: 'quantum.backends', domain: 'quantum', method: 'GET',
    path: '/v7/quantum/backends', authRequired: true,
    description: 'Lista de backends cuánticos (Qiskit, TFQ, cuQuantum).',
    category: 'user',
  }),

  // ═══════════════════ GOVERNANCE (20) ═══════════════════
  'governance.proposal.submitMaster': op({
    id: 'governance.proposal.submitMaster', domain: 'governance', method: 'POST',
    path: '/v7/governance/proposal/submit-master', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Propuesta constitucional de alto nivel.',
    category: 'admin',
  }),
  'governance.proposal.submit': op({
    id: 'governance.proposal.submit', domain: 'governance', method: 'POST',
    path: '/v7/governance/proposal/submit', authRequired: true,
    description: 'Envía una propuesta de gobernanza.',
    category: 'user',
  }),
  'governance.proposals.list': op({
    id: 'governance.proposals.list', domain: 'governance', method: 'GET',
    path: '/v7/governance/proposals', authRequired: true,
    description: 'Lista de propuestas activas.',
    category: 'user',
  }),
  'governance.proposal.get': op({
    id: 'governance.proposal.get', domain: 'governance', method: 'GET',
    path: '/v7/governance/proposal/:id', authRequired: true,
    description: 'Detalle de una propuesta.',
    category: 'user',
  }),
  'governance.proposal.close': op({
    id: 'governance.proposal.close', domain: 'governance', method: 'POST',
    path: '/v7/governance/proposal/close', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Cierra una propuesta de gobernanza.',
    category: 'admin',
  }),
  'governance.voting.cast': op({
    id: 'governance.voting.cast', domain: 'governance', method: 'POST',
    path: '/v7/governance/voting/cast', authRequired: true,
    description: 'Emite un voto.',
    category: 'user',
  }),
  'governance.voting.quadratic': op({
    id: 'governance.voting.quadratic', domain: 'governance', method: 'POST',
    path: '/v7/governance/voting/quadratic-power', authRequired: true,
    description: 'Calcula poder de voto cuadrático.',
    category: 'user',
  }),
  'governance.voting.result': op({
    id: 'governance.voting.result', domain: 'governance', method: 'GET',
    path: '/v7/governance/voting/result/:id', authRequired: true,
    description: 'Resultado de votación.',
    category: 'user',
  }),
  'governance.constitution.get': op({
    id: 'governance.constitution.get', domain: 'governance', method: 'GET',
    path: '/v7/governance/constitution', authRequired: true,
    description: 'Constitución vigente.',
    category: 'user',
  }),
  'governance.constitution.update': op({
    id: 'governance.constitution.update', domain: 'governance', method: 'PATCH',
    path: '/v7/governance/constitution', authRequired: true,
    roles: ['admin'],
    description: 'Actualiza la constitución.',
    category: 'admin',
  }),
  'governance.court.arbitration': op({
    id: 'governance.court.arbitration', domain: 'governance', method: 'POST',
    path: '/v7/governance/court/arbitration', authRequired: true,
    description: 'Solicita arbitraje ante la corte.',
    category: 'user',
  }),
  'governance.court.case': op({
    id: 'governance.court.case', domain: 'governance', method: 'GET',
    path: '/v7/governance/court/case/:id', authRequired: true,
    description: 'Detalle de un caso de corte.',
    category: 'user',
  }),
  'governance.court.verdict': op({
    id: 'governance.court.verdict', domain: 'governance', method: 'POST',
    path: '/v7/governance/court/verdict', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Emite veredicto de corte.',
    category: 'admin',
  }),
  'governance.blackhole.ban': op({
    id: 'governance.blackhole.ban', domain: 'governance', method: 'POST',
    path: '/v7/governance/protocol/black-hole/ban', authRequired: true,
    roles: ['admin'],
    description: 'Protocolo Black Hole: ban permanente.',
    category: 'admin',
  }),
  'governance.protocols.list': op({
    id: 'governance.protocols.list', domain: 'governance', method: 'GET',
    path: '/v7/governance/protocols', authRequired: true,
    description: 'Protocolos de gobernanza activos.',
    category: 'user',
  }),
  'governance.roles.list': op({
    id: 'governance.roles.list', domain: 'governance', method: 'GET',
    path: '/v7/governance/roles', authRequired: true,
    description: 'Roles de gobernanza disponibles.',
    category: 'user',
  }),
  'governance.role.grant': op({
    id: 'governance.role.grant', domain: 'governance', method: 'POST',
    path: '/v7/governance/role/grant', authRequired: true,
    roles: ['admin'],
    description: 'Concede rol de gobernanza.',
    category: 'admin',
  }),
  'governance.role.revoke': op({
    id: 'governance.role.revoke', domain: 'governance', method: 'POST',
    path: '/v7/governance/role/revoke', authRequired: true,
    roles: ['admin'],
    description: 'Revoca rol de gobernanza.',
    category: 'admin',
  }),
  'governance.stats.participation': op({
    id: 'governance.stats.participation', domain: 'governance', method: 'GET',
    path: '/v7/governance/stats/participation', authRequired: true,
    description: 'Estadísticas de participación.',
    category: 'user',
  }),
  'governance.stats.trust': op({
    id: 'governance.stats.trust', domain: 'governance', method: 'GET',
    path: '/v7/governance/stats/trust', authRequired: true,
    description: 'Estadísticas de confianza del sistema.',
    category: 'user',
  }),

  // ═══════════════════ UTAMV (10) ═══════════════════
  'utamv.courses.list': op({
    id: 'utamv.courses.list', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/courses', authRequired: true,
    description: 'Lista de cursos disponibles.',
    category: 'user',
  }),
  'utamv.course.get': op({
    id: 'utamv.course.get', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/course/:id', authRequired: true,
    description: 'Detalle de un curso.',
    category: 'user',
  }),
  'utamv.classroom.join': op({
    id: 'utamv.classroom.join', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/classroom/join-xr', authRequired: true,
    description: 'Unirse a aula XR.',
    category: 'user',
  }),
  'utamv.progress.update': op({
    id: 'utamv.progress.update', domain: 'utamv', method: 'POST',
    path: '/v7/utamv/progress/update', authRequired: true,
    description: 'Actualiza progreso de aprendizaje.',
    category: 'user',
  }),
  'utamv.progress.get': op({
    id: 'utamv.progress.get', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/progress', authRequired: true,
    description: 'Progreso actual del estudiante.',
    category: 'user',
  }),
  'utamv.cert.proof': op({
    id: 'utamv.cert.proof', domain: 'utamv', method: 'POST',
    path: '/v7/utamv/cert/proof-of-knowledge', authRequired: true,
    description: 'Genera prueba de conocimiento (certificado).',
    category: 'user',
  }),
  'utamv.cert.get': op({
    id: 'utamv.cert.get', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/cert/:id', authRequired: true,
    description: 'Obtiene certificado por ID.',
    category: 'user',
  }),
  'utamv.stats': op({
    id: 'utamv.stats', domain: 'utamv', method: 'GET',
    path: '/v7/utamv/stats', authRequired: true,
    description: 'Estadísticas educativas.',
    category: 'user',
  }),
  'utamv.course.create': op({
    id: 'utamv.course.create', domain: 'utamv', method: 'POST',
    path: '/v7/utamv/course/create', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Crea un nuevo curso UTAMV.',
    category: 'admin',
  }),
  'utamv.course.update': op({
    id: 'utamv.course.update', domain: 'utamv', method: 'PATCH',
    path: '/v7/utamv/course/:id', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Actualiza un curso existente.',
    category: 'admin',
  }),

  // ═══════════════════ BOOKPI (10) ═══════════════════
  'bookpi.event.log': op({
    id: 'bookpi.event.log', domain: 'bookpi', method: 'POST',
    path: '/v7/bookpi/event/log', authRequired: true,
    description: 'Registra evento en el ledger BookPI.',
    category: 'internal',
  }),
  'bookpi.event.get': op({
    id: 'bookpi.event.get', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/event/:id', authRequired: true,
    description: 'Obtiene evento por ID.',
    category: 'user',
  }),
  'bookpi.ledger': op({
    id: 'bookpi.ledger', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/ledger', authRequired: true,
    description: 'Consulta el ledger BookPI.',
    category: 'user',
  }),
  'bookpi.ledger.witness': op({
    id: 'bookpi.ledger.witness', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/ledger/witness', authRequired: true,
    description: 'Testigo de integridad del ledger.',
    category: 'user',
  }),
  'bookpi.snapshot.civilization': op({
    id: 'bookpi.snapshot.civilization', domain: 'bookpi', method: 'POST',
    path: '/v7/bookpi/snapshot/civilization', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Crea snapshot civilizatorio.',
    category: 'admin',
  }),
  'bookpi.snapshot.get': op({
    id: 'bookpi.snapshot.get', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/snapshot/:id', authRequired: true,
    description: 'Obtiene snapshot por ID.',
    category: 'user',
  }),
  'bookpi.snapshots': op({
    id: 'bookpi.snapshots', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/snapshots', authRequired: true,
    description: 'Lista de snapshots.',
    category: 'user',
  }),
  'bookpi.merkle.root': op({
    id: 'bookpi.merkle.root', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/merkle/root', authRequired: true,
    description: 'Raíz Merkle del ledger actual.',
    category: 'user',
  }),
  'bookpi.audit.trail': op({
    id: 'bookpi.audit.trail', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/audit/trail', authRequired: true,
    description: 'Trail de auditoría completo.',
    category: 'user',
  }),
  'bookpi.stats': op({
    id: 'bookpi.stats', domain: 'bookpi', method: 'GET',
    path: '/v7/bookpi/stats', authRequired: true,
    description: 'Estadísticas del ledger.',
    category: 'user',
  }),

  // ═══════════════════ KERNEL / IA (12) ═══════════════════
  'kernel.isabella.intentMatrix': op({
    id: 'kernel.isabella.intentMatrix', domain: 'kernel', method: 'POST',
    path: '/v7/kernel/isabella/intent-matrix', authRequired: true,
    description: 'Envía intent a la matriz de decisión Isabella.',
    category: 'user',
  }),
  'kernel.agent.deploy': op({
    id: 'kernel.agent.deploy', domain: 'kernel', method: 'POST',
    path: '/v7/kernel/agent/deploy', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Despliega un agente IA.',
    category: 'admin',
  }),
  'kernel.agent.stop': op({
    id: 'kernel.agent.stop', domain: 'kernel', method: 'POST',
    path: '/v7/kernel/agent/stop', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Detiene un agente IA.',
    category: 'admin',
  }),
  'kernel.agent.get': op({
    id: 'kernel.agent.get', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/agent/:id', authRequired: true,
    description: 'Detalle de un agente.',
    category: 'user',
  }),
  'kernel.agents.list': op({
    id: 'kernel.agents.list', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/agents', authRequired: true,
    description: 'Lista de agentes IA activos.',
    category: 'user',
  }),
  'kernel.isabella.shutdown': op({
    id: 'kernel.isabella.shutdown', domain: 'kernel', method: 'POST',
    path: '/v7/kernel/isabella/shutdown-preventive', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Shutdown preventivo de Isabella.',
    category: 'admin',
  }),
  'kernel.explainability.trace': op({
    id: 'kernel.explainability.trace', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/explainability/trace', authRequired: true,
    description: 'Traza de explicabilidad de decisión IA.',
    category: 'user',
  }),
  'kernel.explainability.list': op({
    id: 'kernel.explainability.list', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/explainability/list', authRequired: true,
    description: 'Lista de trazas de explicabilidad.',
    category: 'user',
  }),
  'kernel.policy.set': op({
    id: 'kernel.policy.set', domain: 'kernel', method: 'POST',
    path: '/v7/kernel/policy/set', authRequired: true,
    roles: ['admin'],
    description: 'Establece políticas del kernel IA.',
    category: 'admin',
  }),
  'kernel.policy.get': op({
    id: 'kernel.policy.get', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/policy', authRequired: true,
    description: 'Políticas actuales del kernel.',
    category: 'user',
  }),
  'kernel.health': op({
    id: 'kernel.health', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/health', authRequired: true,
    description: 'Estado de salud del kernel IA.',
    category: 'user',
  }),
  'kernel.telemetry': op({
    id: 'kernel.telemetry', domain: 'kernel', method: 'GET',
    path: '/v7/kernel/telemetry', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Telemetría del kernel IA.',
    category: 'admin',
  }),

  // ═══════════════════ OPS / IRON-GATE (10) ═══════════════════
  'ops.health': op({
    id: 'ops.health', domain: 'ops', method: 'GET',
    path: '/v7/ops/system/health-index', authRequired: true,
    description: 'Índice de salud del sistema.',
    category: 'user',
  }),
  'ops.status': op({
    id: 'ops.status', domain: 'ops', method: 'GET',
    path: '/v7/ops/system/status', authRequired: true,
    description: 'Estado general del sistema.',
    category: 'user',
  }),
  'ops.mcp.cleanup': op({
    id: 'ops.mcp.cleanup', domain: 'ops', method: 'POST',
    path: '/v7/ops/mcp/cleanup-auto', authRequired: true,
    roles: ['admin'],
    description: 'Limpieza automática de procesos MCP.',
    category: 'admin',
  }),
  'ops.mcp.restart': op({
    id: 'ops.mcp.restart', domain: 'ops', method: 'POST',
    path: '/v7/ops/mcp/restart-service', authRequired: true,
    roles: ['admin'],
    description: 'Reinicia un servicio MCP.',
    category: 'admin',
  }),
  'ops.services': op({
    id: 'ops.services', domain: 'ops', method: 'GET',
    path: '/v7/ops/services', authRequired: true,
    description: 'Lista de servicios y estado.',
    category: 'user',
  }),
  'ops.scale.quantum': op({
    id: 'ops.scale.quantum', domain: 'ops', method: 'POST',
    path: '/v7/ops/infrastructure/scale-quantum', authRequired: true,
    roles: ['admin'],
    description: 'Escala infraestructura cuántica.',
    category: 'admin',
  }),
  'ops.scale.api': op({
    id: 'ops.scale.api', domain: 'ops', method: 'POST',
    path: '/v7/ops/infrastructure/scale-api', authRequired: true,
    roles: ['admin'],
    description: 'Escala instancias de API.',
    category: 'admin',
  }),
  'ops.logs': op({
    id: 'ops.logs', domain: 'ops', method: 'GET',
    path: '/v7/ops/logs', authRequired: true,
    roles: ['guardian', 'admin'],
    description: 'Logs del sistema.',
    category: 'admin',
  }),
  'ops.metrics': op({
    id: 'ops.metrics', domain: 'ops', method: 'GET',
    path: '/v7/ops/metrics', authRequired: true,
    description: 'Métricas Prometheus.',
    category: 'user',
  }),
  'ops.mode': op({
    id: 'ops.mode', domain: 'ops', method: 'GET',
    path: '/v7/ops/mode', authRequired: true,
    description: 'Modo operativo actual.',
    category: 'user',
  }),

  // ═══════════════════ SOCIAL (10) ═══════════════════
  'social.post.create': op({
    id: 'social.post.create', domain: 'social', method: 'POST',
    path: '/v7/social/post/create', authRequired: true,
    description: 'Crea una publicación.',
    category: 'user',
  }),
  'social.post.get': op({
    id: 'social.post.get', domain: 'social', method: 'GET',
    path: '/v7/social/post/:id', authRequired: true,
    description: 'Obtiene una publicación.',
    category: 'user',
  }),
  'social.feed': op({
    id: 'social.feed', domain: 'social', method: 'GET',
    path: '/v7/social/feed', authRequired: true,
    description: 'Feed personalizado del usuario.',
    category: 'user',
  }),
  'social.post.like': op({
    id: 'social.post.like', domain: 'social', method: 'POST',
    path: '/v7/social/post/like', authRequired: true,
    description: 'Da like a una publicación.',
    category: 'user',
  }),
  'social.post.report': op({
    id: 'social.post.report', domain: 'social', method: 'POST',
    path: '/v7/social/post/report', authRequired: true,
    description: 'Reporta una publicación.',
    category: 'user',
  }),
  'social.relation.follow': op({
    id: 'social.relation.follow', domain: 'social', method: 'POST',
    path: '/v7/social/relation/follow', authRequired: true,
    description: 'Sigue a un usuario.',
    category: 'user',
  }),
  'social.relation.unfollow': op({
    id: 'social.relation.unfollow', domain: 'social', method: 'POST',
    path: '/v7/social/relation/unfollow', authRequired: true,
    description: 'Deja de seguir a un usuario.',
    category: 'user',
  }),
  'social.relation.list': op({
    id: 'social.relation.list', domain: 'social', method: 'GET',
    path: '/v7/social/relation/list', authRequired: true,
    description: 'Lista de relaciones (seguidores/seguidos).',
    category: 'user',
  }),
  'social.notifications': op({
    id: 'social.notifications', domain: 'social', method: 'GET',
    path: '/v7/social/notifications', authRequired: true,
    description: 'Notificaciones del usuario.',
    category: 'user',
  }),
  'social.message.send': op({
    id: 'social.message.send', domain: 'social', method: 'POST',
    path: '/v7/social/message/send', authRequired: true,
    description: 'Envía un mensaje directo.',
    category: 'user',
  }),

  // ═══════════════════ DEVTOOLS (10) ═══════════════════
  'devtools.spec': op({
    id: 'devtools.spec', domain: 'devtools', method: 'GET',
    path: '/v7/dev/spec', authRequired: false,
    description: 'Especificación completa de la API TAMV.',
    category: 'user',
  }),
  'devtools.spec.domain': op({
    id: 'devtools.spec.domain', domain: 'devtools', method: 'GET',
    path: '/v7/dev/spec/domain/:name', authRequired: false,
    description: 'Especificación por dominio.',
    category: 'user',
  }),
  'devtools.version': op({
    id: 'devtools.version', domain: 'devtools', method: 'GET',
    path: '/v7/dev/version', authRequired: false,
    description: 'Versión actual de la API.',
    category: 'user',
  }),
  'devtools.runtime.state': op({
    id: 'devtools.runtime.state', domain: 'devtools', method: 'GET',
    path: '/v7/dev/runtime/state', authRequired: true,
    roles: ['admin'],
    description: 'Estado interno del runtime TAMVAI.',
    category: 'admin',
  }),
  'devtools.runtime.reload': op({
    id: 'devtools.runtime.reload', domain: 'devtools', method: 'POST',
    path: '/v7/dev/runtime/reload', authRequired: true,
    roles: ['admin'],
    description: 'Recarga el runtime (hot reload).',
    category: 'admin',
  }),
  'devtools.featureFlags.get': op({
    id: 'devtools.featureFlags.get', domain: 'devtools', method: 'GET',
    path: '/v7/dev/feature-flags', authRequired: true,
    description: 'Feature flags activos.',
    category: 'user',
  }),
  'devtools.featureFlags.update': op({
    id: 'devtools.featureFlags.update', domain: 'devtools', method: 'PATCH',
    path: '/v7/dev/feature-flags', authRequired: true,
    roles: ['admin'],
    description: 'Actualiza feature flags.',
    category: 'admin',
  }),
  'devtools.simulations': op({
    id: 'devtools.simulations', domain: 'devtools', method: 'GET',
    path: '/v7/dev/simulations', authRequired: true,
    description: 'Lista de simulaciones disponibles.',
    category: 'user',
  }),
  'devtools.simulations.run': op({
    id: 'devtools.simulations.run', domain: 'devtools', method: 'POST',
    path: '/v7/dev/simulations/run', authRequired: true,
    roles: ['admin'],
    description: 'Ejecuta una simulación.',
    category: 'admin',
  }),
  'devtools.echo': op({
    id: 'devtools.echo', domain: 'devtools', method: 'GET',
    path: '/v7/dev/echo', authRequired: false,
    description: 'Endpoint de echo/ping para validar conectividad.',
    category: 'user',
  }),
};

// ═══════════════════ HELPERS ═══════════════════

export function getSpecByDomain(domain: TamvDomain): TamvOperationSpec[] {
  return Object.values(tamvSpec).filter(s => s.domain === domain);
}

export function getAllDomains(): TamvDomain[] {
  return Object.keys(DOMAIN_META) as TamvDomain[];
}

export function getEndpointCount(): number {
  return Object.keys(tamvSpec).length;
}

export function getDomainCounts(): Record<TamvDomain, number> {
  const counts = {} as Record<TamvDomain, number>;
  for (const domain of getAllDomains()) {
    counts[domain] = getSpecByDomain(domain).length;
  }
  return counts;
}

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PATCH: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};
