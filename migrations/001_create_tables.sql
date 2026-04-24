-- Flüxa Admin Panel — Database Migrations
-- Run these SQL commands in the Supabase SQL editor

-- ============================================================
-- 1. RESTAURANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  razao_social VARCHAR(255),
  address VARCHAR(500),
  address_city VARCHAR(100),
  address_cep VARCHAR(10),
  phone VARCHAR(20),
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  owner_cpf VARCHAR(14),
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'inadimplente')),
  documents_urls JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. RESTAURANT_USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'gestor' CHECK (role IN ('gestor', 'operador')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. INVOICES (Comissões mensais)
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  base_fee DECIMAL(10, 2) DEFAULT 1500.00,
  orders_count INT DEFAULT 0,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  commission_amount DECIMAL(10, 2) DEFAULT 0.00,
  total_due DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(restaurant_id, month)
);

-- ============================================================
-- 4. SUPPORT_TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'resolvido')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- 5. SUPPORT_MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) CHECK (sender_type IN ('cliente', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_restaurant_users_restaurant_id ON restaurant_users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_restaurant_id ON invoices(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_month ON invoices(month);
CREATE INDEX IF NOT EXISTS idx_support_tickets_restaurant_id ON support_tickets(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Service role bypass (admin panel uses service role key)
CREATE POLICY "Service role bypass" ON restaurants
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON restaurant_users
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON invoices
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON support_tickets
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON support_messages
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER restaurant_users_updated_at
  BEFORE UPDATE ON restaurant_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
