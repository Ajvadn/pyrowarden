-- Create missing tables for full admin functionality

-- Create internships table
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('remote', 'onsite', 'hybrid')),
    department TEXT NOT NULL,
    salary_range TEXT,
    benefits TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'in_progress', 'completed')),
    max_applications INTEGER,
    current_applications INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create internship_applications table
CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'withdrawn')),
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    expected_graduation_date DATE,
    current_education TEXT,
    relevant_experience TEXT,
    skills TEXT[] DEFAULT '{}',
    availability_start DATE,
    availability_end DATE,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(internship_id, user_id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internships
CREATE POLICY "Anyone can view open internships"
ON public.internships
FOR SELECT
USING (status = 'open' OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all internships"
ON public.internships
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for internship_applications
CREATE POLICY "Users can view their own applications"
ON public.internship_applications
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own applications"
ON public.internship_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.internship_applications
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all applications"
ON public.internship_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_internships_updated_at
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internship_applications_updated_at
BEFORE UPDATE ON public.internship_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_internships_status ON public.internships(status);
CREATE INDEX idx_internships_department ON public.internships(department);
CREATE INDEX idx_internship_applications_user_id ON public.internship_applications(user_id);
CREATE INDEX idx_internship_applications_internship_id ON public.internship_applications(internship_id);
CREATE INDEX idx_internship_applications_status ON public.internship_applications(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);