-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'secretary', 'staff');
CREATE TYPE payment_method AS ENUM ('cash', 'mobile', 'card', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded');
CREATE TYPE job_status AS ENUM ('waiting', 'in_progress', 'done', 'cancelled');
CREATE TYPE stock_movement AS ENUM ('in', 'out', 'adjustment');
CREATE TYPE job_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'staff',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANCHES
CREATE TABLE branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMERS
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  address TEXT,
  preferred_contact TEXT DEFAULT 'phone',
  notes TEXT,
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARS
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  car_type TEXT,
  engine_size TEXT,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS (Queue / Orders)
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_number TEXT UNIQUE NOT NULL,
  car_id UUID REFERENCES cars(id),
  customer_id UUID REFERENCES customers(id),
  branch_id UUID REFERENCES branches(id),
  assigned_staff_id UUID REFERENCES profiles(id),
  status job_status DEFAULT 'waiting',
  priority job_priority DEFAULT 'normal',
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB SERVICES (many-to-many: jobs <-> services)
CREATE TABLE job_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  receipt_number TEXT UNIQUE NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  mobile_reference TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPENSES
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID REFERENCES branches(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  category TEXT,
  current_stock DECIMAL(10,2) DEFAULT 0,
  minimum_stock DECIMAL(10,2) DEFAULT 5,
  unit_cost DECIMAL(10,2),
  supplier TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY MOVEMENTS
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  movement_type stock_movement NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Authenticated read all" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON cars FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON job_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON inventory_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read all" ON inventory_movements FOR SELECT TO authenticated USING (true);

-- Full CRUD policies
CREATE POLICY "Full access for authenticated" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON cars FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON job_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON inventory_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON inventory_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for authenticated" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin/Manager only delete policy for jobs
CREATE POLICY "Admin delete jobs" ON jobs FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- FUNCTIONS
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TEXT AS $$
DECLARE
  today TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
  count_today INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_today FROM jobs
  WHERE DATE(created_at) = CURRENT_DATE;
  RETURN 'KAZI-' || today || '-' || LPAD((count_today + 1)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RISITI-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    LPAD(FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers SET
    total_visits = total_visits + 1,
    total_spent = total_spent + NEW.amount_paid,
    updated_at = NOW()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_created
  AFTER INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

CREATE OR REPLACE FUNCTION update_inventory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_inventory_updated
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_inventory_timestamp();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_items;