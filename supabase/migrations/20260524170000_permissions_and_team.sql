-- Add youtube_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS youtube_url text;

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    role_title text NOT NULL,
    image_url text,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies for team_members
CREATE POLICY "Team members are viewable by everyone" 
ON public.team_members FOR SELECT USING (true);

CREATE POLICY "Admins can insert team members" 
ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update team members" 
ON public.team_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete team members" 
ON public.team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update profiles policies so admins and trainers can manage users
-- Note: users management also requires Auth APIs, but for profiles updates:
CREATE POLICY "Admins and trainers can update profiles"
ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
);

-- Insert initial team members
INSERT INTO public.team_members (name, role_title, order_index) VALUES 
('Sarah Jenkins', 'Head of Academy', 1),
('Marcus Thorne', 'Lead Sales Trainer', 2),
('Elena Rostova', 'Careers Director', 3)
ON CONFLICT DO NOTHING;
