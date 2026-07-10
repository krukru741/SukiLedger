-- ==============================================================================
-- SUKI LEDGER - SUPABASE DATABASE SCHEMA
-- Instructions: Copy this entire file and paste it into the Supabase SQL Editor,
-- then click "Run" to create the tables.
-- ==============================================================================

-- 1. INVENTORY TABLE
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    min INTEGER NOT NULL DEFAULT 0,
    category_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SUKI ACCOUNTS TABLE
CREATE TABLE suki_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    balance NUMERIC NOT NULL DEFAULT 0,
    initial TEXT,
    bg TEXT,
    last_active TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SUKI LEDGER HISTORY TABLE (Utang/Payment logs per Suki)
CREATE TABLE suki_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suki_id UUID REFERENCES suki_accounts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. SHIFT HISTORY TABLE (Daily Sales Summaries)
CREATE TABLE shift_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TEXT NOT NULL,
    cash NUMERIC NOT NULL DEFAULT 0,
    credit NUMERIC NOT NULL DEFAULT 0,
    profit NUMERIC NOT NULL DEFAULT 0,
    starting_cash NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. SHIFT TRANSACTIONS TABLE (Detailed receipts per shift)
CREATE TABLE shift_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shift_history(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    total NUMERIC NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- We will enable RLS but create a policy to allow anon access for now 
-- to ensure the app works immediately. Later, authentication can be added.
-- ==============================================================================
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suki_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE suki_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon all actions on inventory" ON inventory FOR ALL USING (true);
CREATE POLICY "Allow anon all actions on suki_accounts" ON suki_accounts FOR ALL USING (true);
CREATE POLICY "Allow anon all actions on suki_history" ON suki_history FOR ALL USING (true);
CREATE POLICY "Allow anon all actions on shift_history" ON shift_history FOR ALL USING (true);
CREATE POLICY "Allow anon all actions on shift_transactions" ON shift_transactions FOR ALL USING (true);
