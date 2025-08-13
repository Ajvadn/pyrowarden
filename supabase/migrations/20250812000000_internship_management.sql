-- Create internship status enum
CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'in_progress', 'completed');

-- Create internship positions table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- 'remote', 'onsite', 'hybrid'
  department TEXT NOT NULL,
  salary_range TEXT,
  benefits TEXT[] DEFAULT '{}',
  status internship_status DEFAULT 'open',
  max_applications INTEGER,
  current_applications INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create internship applications table
CREATE TABLE public.internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected')),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(internship_id, user_id)
);

-- Enable RLS on internship tables
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internships
CREATE POLICY "Anyone can view open internships" ON public.internships
  FOR SELECT USING (status = 'open');

CREATE POLICY "Users can view their applied internships" ON public.internships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.internship_applications 
      WHERE internship_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all internships" ON public.internships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for internship applications
CREATE POLICY "Users can view their own applications" ON public.internship_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own applications" ON public.internship_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own applications" ON public.internship_applications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all applications" ON public.internship_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications" ON public.internship_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON public.internships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internship_applications_updated_at
  BEFORE UPDATE ON public.internship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update application count
CREATE OR REPLACE FUNCTION public.update_internship_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.internships 
    SET current_applications = current_applications + 1 
    WHERE id = NEW.internship_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.internships 
    SET current_applications = current_applications - 1 
    WHERE id = OLD.internship_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for application count
CREATE TRIGGER update_internship_application_count_insert
  AFTER INSERT ON public.internship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_internship_application_count();

CREATE TRIGGER update_internship_application_count_delete
  AFTER DELETE ON public.internship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_internship_application_count();
