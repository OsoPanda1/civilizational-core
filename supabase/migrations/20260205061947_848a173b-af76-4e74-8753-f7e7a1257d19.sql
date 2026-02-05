-- ============================================================
-- TAMV MD-X4: ESQUEMA CIVILIZATORIO COMPLETO
-- Sistema Tenochtitlán de 7 Capas - Registro MSR
-- ============================================================

-- 1. TABLA DE CIUDADANÍA EXTENDIDA (IDNVIDA)
-- Complementa profiles con datos de identidad soberana
CREATE TABLE public.citizen_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dna_hash TEXT, -- Hash biométrico SHA-256 (nunca dato crudo)
    consciousness_level DECIMAL(4,2) DEFAULT 1.00 CHECK (consciousness_level >= 0 AND consciousness_level <= 10.00),
    wallet_address VARCHAR(128) UNIQUE,
    did_document JSONB, -- W3C DID Document
    consent_ledger JSONB DEFAULT '[]'::jsonb, -- Registro de consentimientos
    reputation_score DECIMAL(5,2) DEFAULT 100.00,
    trust_level VARCHAR(20) DEFAULT 'citizen' CHECK (trust_level IN ('citizen', 'creator', 'guardian', 'architect')),
    last_verification TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. PHOENIX LEDGER - Motor Económico (Regla 75/25)
CREATE TABLE public.phoenix_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES public.citizen_identity(id),
    asset_id UUID,
    asset_type VARCHAR(50), -- DREAMSPACE, NFT, COURSE, SUBSCRIPTION, TIP
    total_amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TAMV-T',
    creator_payout DECIMAL(20, 8) GENERATED ALWAYS AS (total_amount * 0.75) STORED,
    system_fund DECIMAL(20, 8) GENERATED ALWAYS AS (total_amount * 0.25) STORED,
    tx_status VARCHAR(20) DEFAULT 'pending' CHECK (tx_status IN ('pending', 'approved', 'completed', 'rejected', 'frozen')),
    msr_hash TEXT NOT NULL, -- Hash inmutable para auditoría
    prev_hash TEXT,
    audit_signature TEXT, -- Firma de Isabella
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. GUARDIAN ACTIONS - Consola HITL
CREATE TABLE public.guardian_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(50) NOT NULL, -- APPROVE, DENY, ESCALATE, FREEZE, AUDIT
    target_id UUID,
    target_type VARCHAR(50), -- USER, POST, TRANSACTION, IDENTITY, NODE
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'escalated')),
    guardian_id UUID REFERENCES auth.users(id),
    isabella_recommendation TEXT,
    isabella_confidence DECIMAL(3,2),
    explanation TEXT,
    ethical_flags JSONB DEFAULT '[]'::jsonb,
    msr_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 4. FEDERATED NODES - Sistema Tenochtitlán
CREATE TABLE public.federated_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_name VARCHAR(100) NOT NULL,
    node_type VARCHAR(20) CHECK (node_type IN ('edge', 'fog', 'cloud', 'quantum')),
    region VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'degraded', 'offline', 'maintenance')),
    ast_state VARCHAR(20) DEFAULT 'NORMAL' CHECK (ast_state IN ('NORMAL', 'OBLIVION', 'BUNKER', 'ORPHAN', 'PHOENIX')),
    health_score DECIMAL(5,2) DEFAULT 100.00,
    latency_ms INTEGER,
    last_heartbeat TIMESTAMPTZ,
    metrics JSONB DEFAULT '{}'::jsonb,
    encryption_key_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. WORLD ENTITIES - Estado de Realidad 4D
CREATE TABLE public.world_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id),
    entity_type VARCHAR(50) CHECK (entity_type IN ('dreamspace', 'avatar', 'nft', 'structure', 'ambient')),
    name VARCHAR(255),
    position_x FLOAT8 DEFAULT 0,
    position_y FLOAT8 DEFAULT 0,
    position_z FLOAT8 DEFAULT 0,
    temporal_state FLOAT4 DEFAULT 0.0, -- -1.0 = decay, 0.0 = birth, 1.0 = peak
    structural_integrity DECIMAL(3,2) DEFAULT 1.0,
    visual_dna JSONB DEFAULT '{}'::jsonb, -- Shader config, colors, effects
    memory_context TEXT,
    last_interaction TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ISABELLA DECISIONS - Pipeline Cognitivo
CREATE TABLE public.isabella_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    input_payload JSONB NOT NULL,
    stage_results JSONB DEFAULT '{}'::jsonb, -- normalize, classify, ethics, security, governance, decision
    final_decision VARCHAR(20) CHECK (final_decision IN ('approve', 'deny', 'escalate', 'defer')),
    confidence_score DECIMAL(3,2),
    explanation TEXT,
    ethical_violations JSONB DEFAULT '[]'::jsonb,
    requires_hitl BOOLEAN DEFAULT false,
    processing_time_ms INTEGER,
    msr_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SENTINEL LOGS - Anubis Watchdog
CREATE TABLE public.sentinel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL, -- THREAT_DETECTED, INTEGRITY_VIOLATION, SAFE_MODE, CORRUPTION
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    source_node UUID REFERENCES public.federated_nodes(id),
    user_id UUID,
    ip_address INET,
    threat_details JSONB,
    action_taken VARCHAR(50),
    resolved BOOLEAN DEFAULT false,
    msr_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.citizen_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.federated_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentinel_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Citizen Identity: Users can view/update their own, guardians can view all
CREATE POLICY "Users can view own identity" ON public.citizen_identity
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own identity" ON public.citizen_identity
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own identity" ON public.citizen_identity
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Guardians can view all identities" ON public.citizen_identity
    FOR SELECT USING (public.has_role(auth.uid(), 'guardian') OR public.has_role(auth.uid(), 'admin'));

-- Phoenix Transactions: Users see their own, public can see aggregates
CREATE POLICY "Users can view own transactions" ON public.phoenix_transactions
    FOR SELECT USING (
        citizen_id IN (SELECT id FROM public.citizen_identity WHERE user_id = auth.uid())
        OR public.has_role(auth.uid(), 'guardian')
    );

-- Guardian Actions: Only guardians can manage
CREATE POLICY "Guardians can view actions" ON public.guardian_actions
    FOR SELECT USING (public.has_role(auth.uid(), 'guardian') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Guardians can manage actions" ON public.guardian_actions
    FOR ALL USING (public.has_role(auth.uid(), 'guardian') OR public.has_role(auth.uid(), 'admin'));

-- Federated Nodes: Public read for status dashboard
CREATE POLICY "Public can view nodes" ON public.federated_nodes
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage nodes" ON public.federated_nodes
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- World Entities: Owners manage their own, public can view
CREATE POLICY "Public can view entities" ON public.world_entities
    FOR SELECT USING (true);
CREATE POLICY "Owners can manage entities" ON public.world_entities
    FOR ALL USING (auth.uid() = owner_id);

-- Isabella Decisions: Users see their own, guardians see all
CREATE POLICY "Users can view own decisions" ON public.isabella_decisions
    FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'guardian'));

-- Sentinel Logs: Only admins
CREATE POLICY "Admins can view sentinel logs" ON public.sentinel_logs
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: Auto-evolve world when Phoenix fund grows
CREATE OR REPLACE FUNCTION public.evolve_world_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.world_entities 
    SET temporal_state = LEAST(temporal_state + 0.1, 1.0),
        structural_integrity = LEAST(structural_integrity + 0.05, 1.0)
    WHERE owner_id = (SELECT user_id FROM public.citizen_identity WHERE id = NEW.citizen_id)
    AND temporal_state < 1.0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_phoenix_growth
AFTER INSERT ON public.phoenix_transactions
FOR EACH ROW 
WHEN (NEW.tx_status = 'completed')
EXECUTE FUNCTION public.evolve_world_on_transaction();

-- Function: Calculate Phoenix Fund balance
CREATE OR REPLACE FUNCTION public.get_phoenix_fund_balance()
RETURNS DECIMAL AS $$
    SELECT COALESCE(SUM(system_fund), 0) FROM public.phoenix_transactions WHERE tx_status = 'completed';
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- Function: Calculate economic health ratio
CREATE OR REPLACE FUNCTION public.get_economic_health()
RETURNS DECIMAL AS $$
DECLARE
    total_fund DECIMAL;
    target DECIMAL := 10000; -- Target balance
BEGIN
    SELECT public.get_phoenix_fund_balance() INTO total_fund;
    RETURN LEAST(total_fund / target, 1.0);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Insert initial federated node
INSERT INTO public.federated_nodes (node_name, node_type, region, status, ast_state, health_score)
VALUES 
    ('TAMV-Core-MX', 'cloud', 'Mexico Central', 'active', 'NORMAL', 100.00),
    ('TAMV-Edge-NA', 'edge', 'North America', 'active', 'NORMAL', 98.50),
    ('TAMV-Fog-LATAM', 'fog', 'Latin America', 'active', 'NORMAL', 97.00);