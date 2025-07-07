
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('farmer', 'investor', 'extension_agent');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  region text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create farmer profiles table for farmer-specific data
CREATE TABLE public.farmer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  farm_size text,
  crop_type text[],
  farm_photos text[],
  previous_harvest jsonb,
  current_growth_stage text,
  is_verified boolean DEFAULT false,
  credibility_score integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create investor profiles table
CREATE TABLE public.investor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  investment_interests text[],
  total_investments numeric DEFAULT 0,
  active_partnerships integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create extension agent profiles table
CREATE TABLE public.extension_agent_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  operational_areas text[],
  specializations text[],
  farmers_managed integer DEFAULT 0,
  certifications text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create associations table
CREATE TABLE public.associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL,
  description text,
  extension_agent_id uuid REFERENCES auth.users(id),
  member_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create association members table
CREATE TABLE public.association_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE NOT NULL,
  farmer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(association_id, farmer_id)
);

-- Create consultations table
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  extension_agent_id uuid REFERENCES auth.users(id),
  consultation_type text CHECK (consultation_type IN ('in_person', 'virtual', 'ai_chat')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  scheduled_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create farm partner opportunities table
CREATE TABLE public.farm_partner_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  funding_needed numeric NOT NULL,
  expected_yield numeric,
  crop_type text NOT NULL,
  farm_size text,
  location text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'funded', 'completed', 'cancelled')),
  investor_id uuid REFERENCES auth.users(id),
  extension_agent_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_partner_opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for farmer profiles
CREATE POLICY "Users can view farmer profiles" ON public.farmer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Farmers can manage their own profile" ON public.farmer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for investor profiles
CREATE POLICY "Users can view investor profiles" ON public.investor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Investors can manage their own profile" ON public.investor_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for extension agent profiles
CREATE POLICY "Users can view extension agent profiles" ON public.extension_agent_profiles
  FOR SELECT USING (true);

CREATE POLICY "Extension agents can manage their own profile" ON public.extension_agent_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for associations
CREATE POLICY "Users can view associations" ON public.associations
  FOR SELECT USING (true);

CREATE POLICY "Extension agents can manage associations" ON public.associations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'extension_agent'
  ));

-- Create RLS policies for farm partner opportunities
CREATE POLICY "Users can view farm partner opportunities" ON public.farm_partner_opportunities
  FOR SELECT USING (true);

CREATE POLICY "Farmers can manage their opportunities" ON public.farm_partner_opportunities
  FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Investors can view and update opportunities" ON public.farm_partner_opportunities
  FOR UPDATE USING (auth.uid() = investor_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'farmer')::user_role,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
