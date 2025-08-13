import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Building, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

interface Internship {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  duration: string;
  location: string;
  type: string;
  department: string;
  salary_range: string | null;
  benefits: string[];
  status: 'open' | 'closed' | 'in_progress' | 'completed';
  max_applications: number | null;
  current_applications: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

const InternshipApplication = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    expected_graduation_date: '',
    current_education: '',
    relevant_experience: '',
    skills: [''],
    availability_start: '',
    availability_end: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchInternship();
      checkApplicationStatus();
    }
  }, [id, user]);

  const fetchInternship = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setInternship(data);
    } catch (error) {
      console.error('Error fetching internship:', error);
      toast.error('Failed to fetch internship details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('internship_applications')
        .select('*')
        .eq('internship_id', id)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasApplied(true);
        setFormData({
          cover_letter: data.cover_letter || '',
          resume_url: data.resume_url || '',
          portfolio_url: data.portfolio_url || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          expected_graduation_date: data.expected_graduation_date || '',
          current_education: data.current_education || '',
          relevant_experience: data.relevant_experience || '',
          skills: data.skills.length > 0 ? data.skills : [''],
          availability_start: data.availability_start || '',
          availability_end: data.availability_end || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      // No application found, which is expected for new applications
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !internship) return;

    setSubmitting(true);
    
    try {
      const applicationData = {
        internship_id: internship.id,
        user_id: user.id,
        cover_letter: formData.cover_letter,
        resume_url: formData.resume_url,
        portfolio_url: formData.portfolio_url,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        expected_graduation_date: formData.expected_graduation_date || null,
        current_education: formData.current_education,
        relevant_experience: formData.relevant_experience,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        availability_start: formData.availability_start || null,
        availability_end: formData.availability_end || null,
        notes: formData.notes,
      };

      if (hasApplied) {
        // Update existing application
        const { error } = await supabase
          .from('internship_applications')
          .update(applicationData)
          .eq('internship_id', internship.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Application updated successfully');
      } else {
        // Create new application
        const { error } = await supabase
          .from('internship_applications')
          .insert(applicationData);

        if (error) throw error;
        toast.success('Application submitted successfully');
        setHasApplied(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading internship details...</div>
        </div>
      </PageLayout>
    );
  }

  if (!internship) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Internship not found</div>
        </div>
      </PageLayout>
    );
  }

  if (internship.status !== 'open') {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Applications Closed</h1>
            <p className="text-muted-foreground mb-4">
              This internship is currently not accepting applications.
            </p>
            <Link to="/internships">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Internships
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title={`Apply to ${internship.title} - Pyrowarden`} description={`Apply to the ${internship.title} internship position`} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/internships" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Internships
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Internship Details */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{internship.title}</CardTitle>
                  <CardDescription>{internship.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {internship.location} • {internship.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {internship.duration}
                  </div>
                  {internship.salary_range && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {internship.salary_range}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {internship.current_applications} applications
                    {internship.max_applications && ` / ${internship.max_applications} max`}
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <div className="space-y-1">
                      {internship.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">Responsibilities</h3>
                    <div className="space-y-1">
                      {internship.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-sm">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {internship.benefits.length > 0 && (
                    <div className="pt-4">
                      <h3 className="font-semibold mb-2">Benefits</h3>
                      <div className="space-y-1">
                        {internship.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {hasApplied ? 'Update Application' : 'Submit Application'}
                  </CardTitle>
                  <CardDescription>
                    {hasApplied 
                      ? 'You have already applied to this internship. You can update your application below.'
                      : 'Fill out the form below to apply for this internship position.'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="cover_letter">Cover Letter *</Label>
                      <Textarea
                        id="cover_letter"
                        value={formData.cover_letter}
                        onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                        rows={6}
                        placeholder="Tell us why you're interested in this internship and what makes you a great candidate..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current_education">Current Education *</Label>
                        <Input
                          id="current_education"
                          value={formData.current_education}
                          onChange={(e) => setFormData(prev => ({ ...prev, current_education: e.target.value }))}
                          placeholder="e.g., Bachelor's in Computer Science"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expected_graduation_date">Expected Graduation Date</Label>
                        <Input
                          id="expected_graduation_date"
                          type="date"
                          value={formData.expected_graduation_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, expected_graduation_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="relevant_experience">Relevant Experience</Label>
                      <Textarea
                        id="relevant_experience"
                        value={formData.relevant_experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, relevant_experience: e.target.value }))}
                        rows={4}
                        placeholder="Describe any relevant work experience, projects, or coursework..."
                      />
                    </div>

                    <div>
                      <Label>Skills</Label>
                      <div className="space-y-2">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => updateSkill(index, e.target.value)}
                              placeholder="Enter a skill"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSkill(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSkill}
                        >
                          Add Skill
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="availability_start">Availability Start Date</Label>
                        <Input
                          id="availability_start"
                          type="date"
                          value={formData.availability_start}
                          onChange={(e) => setFormData(prev => ({ ...prev, availability_start: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="availability_end">Availability End Date</Label>
                        <Input
                          id="availability_end"
                          type="date"
                          value={formData.availability_end}
                          onChange={(e) => setFormData(prev => ({ ...prev, availability_end: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="resume_url">Resume URL</Label>
                        <Input
                          id="resume_url"
                          type="url"
                          value={formData.resume_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, resume_url: e.target.value }))}
                          placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio_url">Portfolio URL</Label>
                        <Input
                          id="portfolio_url"
                          type="url"
                          value={formData.portfolio_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                          placeholder="Link to your portfolio"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          type="url"
                          value={formData.github_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                          placeholder="Link to your GitHub profile"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                        <Input
                          id="linkedin_url"
                          type="url"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                          placeholder="Link to your LinkedIn profile"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : hasApplied ? 'Update Application' : 'Submit Application'}
                      </Button>
                      <Link to="/internships">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default InternshipApplication;
