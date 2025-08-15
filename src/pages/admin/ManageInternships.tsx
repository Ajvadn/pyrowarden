import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Users, Calendar, MapPin, Building, DollarSign } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';

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

interface InternshipApplication {
  id: string;
  internship_id: string;
  user_id: string;
  status: string;
  cover_letter: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  expected_graduation_date: string | null;
  current_education: string | null;
  relevant_experience: string | null;
  skills: string[];
  availability_start: string | null;
  availability_end: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string;
    email: string;
  };
  internship?: {
    title: string;
  };
}

const ManageInternships = () => {
  const { user, isAdmin } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    duration: '',
    location: '',
    type: 'remote',
    department: '',
    salary_range: '',
    benefits: [''],
    status: 'open' as const,
    max_applications: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (user && isAdmin) {
      fetchInternships();
      fetchApplications();
    }
  }, [user, isAdmin]);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to fetch internships');
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('internship_applications')
        .select(`
          *,
          user_profile:profiles(full_name, email),
          internship:internships(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const internshipData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== ''),
        benefits: formData.benefits.filter(benefit => benefit.trim() !== ''),
        max_applications: formData.max_applications ? parseInt(formData.max_applications) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingInternship) {
        const { error } = await supabase
          .from('internships')
          .update(internshipData)
          .eq('id', editingInternship.id);

        if (error) throw error;
        toast.success('Internship updated successfully');
      } else {
        const { error } = await supabase
          .from('internships')
          .insert(internshipData);

        if (error) throw error;
        toast.success('Internship created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchInternships();
    } catch (error) {
      console.error('Error saving internship:', error);
      toast.error('Failed to save internship');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Internship deleted successfully');
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Failed to delete internship');
    }
  };

  const handleEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      title: internship.title,
      description: internship.description,
      requirements: internship.requirements.length > 0 ? internship.requirements : [''],
      responsibilities: internship.responsibilities.length > 0 ? internship.responsibilities : [''],
      duration: internship.duration,
      location: internship.location,
      type: internship.type,
      department: internship.department,
      salary_range: internship.salary_range || '',
      benefits: internship.benefits.length > 0 ? internship.benefits : [''],
      status: internship.status,
      max_applications: internship.max_applications?.toString() || '',
      start_date: internship.start_date || '',
      end_date: internship.end_date || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingInternship(null);
    setFormData({
      title: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      duration: '',
      location: '',
      type: 'remote',
      department: '',
      salary_range: '',
      benefits: [''],
      status: 'open',
      max_applications: '',
      start_date: '',
      end_date: '',
    });
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('internship_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading internship management...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="Manage Internships - Admin Panel" description="Manage internship positions and applications" />
      
      <div className="container mx-auto px-4 py-16">
        <BackButton to="/admin" />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Internship Management</h1>
            <p className="text-muted-foreground">Manage internship positions and applications</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Internship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingInternship ? 'Edit Internship' : 'Create New Internship'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for the internship position.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 3 months"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                      id="salary_range"
                      value={formData.salary_range}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                      placeholder="e.g., $15-20/hour"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_applications">Max Applications</Label>
                    <Input
                      id="max_applications"
                      type="number"
                      value={formData.max_applications}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_applications: e.target.value }))}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'open' | 'closed' | 'in_progress' | 'completed') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Requirements */}
                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={req}
                          onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                          placeholder="Enter requirement"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('requirements', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField('requirements')}
                    >
                      Add Requirement
                    </Button>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <Label>Responsibilities</Label>
                  <div className="space-y-2">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={resp}
                          onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                          placeholder="Enter responsibility"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('responsibilities', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField('responsibilities')}
                    >
                      Add Responsibility
                    </Button>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                          placeholder="Enter benefit"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('benefits', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField('benefits')}
                    >
                      Add Benefit
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingInternship ? 'Update Internship' : 'Create Internship'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="internships" className="space-y-6">
          <TabsList>
            <TabsTrigger value="internships">Internships ({internships.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="internships" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <Card key={internship.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{internship.title}</CardTitle>
                        <CardDescription>{internship.department}</CardDescription>
                      </div>
                      <Badge variant={
                        internship.status === 'open' ? 'default' :
                        internship.status === 'closed' ? 'secondary' :
                        internship.status === 'in_progress' ? 'outline' : 'destructive'
                      }>
                        {internship.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {internship.location} • {internship.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {internship.duration}
                    </div>
                    {internship.salary_range && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {internship.salary_range}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {internship.current_applications} applications
                      {internship.max_applications && ` / ${internship.max_applications} max`}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(internship)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Internship</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{internship.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(internship.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>Review and manage internship applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Internship</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {application.user_profile?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.user_profile?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.internship?.title || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            application.status === 'pending' ? 'outline' :
                            application.status === 'reviewed' ? 'secondary' :
                            application.status === 'shortlisted' ? 'default' :
                            application.status === 'interviewed' ? 'outline' :
                            application.status === 'accepted' ? 'default' : 'destructive'
                          }>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="font-medium">Applicant</Label>
                                    <p>{application.user_profile?.full_name} ({application.user_profile?.email})</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Internship</Label>
                                    <p>{application.internship?.title}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Cover Letter</Label>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {application.cover_letter || 'No cover letter provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Current Education</Label>
                                    <p>{application.current_education || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Expected Graduation</Label>
                                    <p>{application.expected_graduation_date || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Relevant Experience</Label>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {application.relevant_experience || 'No experience specified'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Skills</Label>
                                    <div className="flex flex-wrap gap-1">
                                      {application.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline">{skill}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-medium">Availability Start</Label>
                                      <p>{application.availability_start || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Availability End</Label>
                                      <p>{application.availability_end || 'Not specified'}</p>
                                    </div>
                                  </div>
                                  {application.resume_url && (
                                    <div>
                                      <Label className="font-medium">Resume</Label>
                                      <a href={application.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Resume
                                      </a>
                                    </div>
                                  )}
                                  {application.portfolio_url && (
                                    <div>
                                      <Label className="font-medium">Portfolio</Label>
                                      <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Portfolio
                                      </a>
                                    </div>
                                  )}
                                  {application.github_url && (
                                    <div>
                                      <Label className="font-medium">GitHub</Label>
                                      <a href={application.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View GitHub
                                      </a>
                                    </div>
                                  )}
                                  {application.linkedin_url && (
                                    <div>
                                      <Label className="font-medium">LinkedIn</Label>
                                      <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View LinkedIn
                                      </a>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="font-medium">Admin Notes</Label>
                                    <Textarea
                                      value={application.admin_notes || ''}
                                      onChange={(e) => {
                                        // Update admin notes
                                        supabase
                                          .from('internship_applications')
                                          .update({ admin_notes: e.target.value })
                                          .eq('id', application.id);
                                      }}
                                      placeholder="Add admin notes..."
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <Label className="font-medium">Update Status</Label>
                                    <Select
                                      value={application.status}
                                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="reviewed">Reviewed</SelectItem>
                                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                        <SelectItem value="interviewed">Interviewed</SelectItem>
                                        <SelectItem value="accepted">Accepted</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Back */}
        <div className="mt-8 text-center">
          <Link to="/admin" className="text-primary hover:underline">
            ← Back to Admin Panel
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManageInternships;
