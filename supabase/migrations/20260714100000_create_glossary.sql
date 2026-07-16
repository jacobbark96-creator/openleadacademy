-- Create glossary table
CREATE TABLE IF NOT EXISTS public.glossary (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view their company glossary" ON public.glossary
    FOR SELECT USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage glossary" ON public.glossary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'trainer')
            AND company_id = glossary.company_id
        )
    );

-- Add unique constraint on term per company
CREATE UNIQUE INDEX IF NOT EXISTS glossary_term_company_idx ON public.glossary (term, company_id);
