import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Award, CheckCircle, Calendar, MapPin, DollarSign, Star, Download, Send, Building, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const internshipPrograms = [
    {
      title: "Cybersecurity Specialist",
      duration: "1 Month",
      type: "Hands-on Training",
      description: "Learn ethical hacking, penetration testing, and cybersecurity fundamentals through real-world projects.",
      skills: ["Penetration Testing", "Network Security", "OSINT", "Vulnerability Assessment", "Security Auditing"],
      projects: ["WiFi Security Testing", "Web Application Testing", "Social Engineering Awareness"],
      price: "₹12,999",
      certificate: "Industry-Recognized Certificate",
      mentors: "Senior Security Experts",
      icon: "🛡️",
      color: "from-red-500 to-red-600"
    },
    {
      title: "Full Stack Web Development",
      duration: "1 Month",
      type: "Project-Based Learning",
      description: "Master modern web development with React, Node.js, databases, and deployment strategies.",
      skills: ["React.js", "Node.js", "MongoDB", "Express.js", "API Development", "Git & GitHub"],
      projects: ["E-commerce Platform", "Real-time Chat App", "Portfolio Website"],
      price: "₹9,999",
      certificate: "Full Stack Developer Certificate",
      mentors: "Industry Professionals",
      icon: "💻",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Mobile App Development",
      duration: "1 Month",
      type: "Native & Cross-Platform",
      description: "Build mobile applications using React Native and Flutter for both iOS and Android platforms.",
      skills: ["React Native", "Flutter", "Firebase", "Mobile UI/UX", "App Store Deployment"],
      projects: ["Social Media App", "E-commerce Mobile App", "Utility App"],
      price: "₹11,999",
      certificate: "Mobile Developer Certificate",
      mentors: "App Development Experts",
      icon: "📱",
      color: "from-green-500 to-green-600"
    },
    {
      title: "DevOps & Cloud Computing",
      duration: "1 Month",
      type: "Infrastructure Focus",
      description: "Learn cloud platforms, containerization, CI/CD pipelines, and infrastructure automation.",
      skills: ["AWS/Azure", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux Administration"],
      projects: ["Cloud Migration", "CI/CD Pipeline Setup", "Containerized Application"],
      price: "₹13,999",
      certificate: "DevOps Engineer Certificate",
      mentors: "Cloud Architects",
      icon: "☁️",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "AI/ML & Data Science",
      duration: "1 Month",
      type: "Practical Implementation",
      description: "Dive into machine learning algorithms, data analysis, and AI model development with Python.",
      skills: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "Data Visualization", "Model Deployment"],
      projects: ["Predictive Analytics", "Image Recognition System", "NLP Chatbot"],
      price: "₹14,999",
      certificate: "AI/ML Specialist Certificate",
      mentors: "Data Scientists",
      icon: "🤖",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Blockchain Development",
      duration: "1 Month",
      type: "Decentralized Applications",
      description: "Build smart contracts, DApps, and understand blockchain technology with Ethereum and Solidity.",
      skills: ["Solidity", "Web3.js", "Smart Contracts", "DApp Development", "Cryptocurrency", "NFTs"],
      projects: ["Token Creation", "DeFi Application", "NFT Marketplace"],
      price: "₹15,999",
      certificate: "Blockchain Developer Certificate",
      mentors: "Blockchain Experts",
      icon: "⛓️",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const benefits = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Industry Certificate",
      description: "Get a verified certificate recognized by top tech companies"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentorship",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Hands-on Projects",
      description: "Build real applications that you can showcase in your portfolio"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Job Placement Support",
      description: "Get assistance with job placement and career guidance"
    }
  ];

  const scrollToInternships = () => {
    const internshipsSection = document.querySelector('section:nth-of-type(3)');
    if (internshipsSection) {
      internshipsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Tech Internships - PyroWarden Technologies" 
        description="1-month intensive tech internships in cybersecurity, web development, mobile apps, DevOps, AI/ML, and blockchain. Get industry-recognized certificates."
        keywords={['tech internships', 'cybersecurity internship', 'web development internship', 'mobile app development', 'DevOps training', 'AI ML course', 'blockchain course']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Launch Your Tech Career
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Intensive 1-month internship programs in cutting-edge technologies. Get hands-on experience, industry mentorship, and recognized certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={scrollToInternships} size="lg" className="bg-white text-primary hover:bg-white/90">
                Browse Internships <Send className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Download Brochure <Download className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose PyroWarden Internships?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our intensive programs are designed to give you real-world experience and industry-ready skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Internship Positions</h2>
            <p className="text-lg text-muted-foreground">
              {loading ? 'Loading internships...' : `We have ${internships.length} open internship positions`}
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading internships...</p>
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No open internship positions at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {internships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{internship.title}</CardTitle>
                          <CardDescription>{internship.department}</CardDescription>
                        </div>
                        <Badge variant="default">Open</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground line-clamp-3">{internship.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {internship.location} • {internship.type}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {internship.duration}
                        </div>
                        {internship.salary_range && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            {internship.salary_range}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {internship.current_applications} applications
                          {internship.max_applications && ` / ${internship.max_applications} max`}
                        </div>
                      </div>
                      
                      {internship.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                          <div className="flex flex-wrap gap-1">
                            {internship.requirements.slice(0, 3).map((req, reqIndex) => (
                              <Badge key={reqIndex} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {internship.requirements.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{internship.requirements.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {internship.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Benefits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {internship.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                              <Badge key={benefitIndex} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                            {internship.benefits.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{internship.benefits.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4">
                        {user ? (
                          <Link to={`/internship/${internship.id}/apply`}>
                            <Button className="w-full">
                              Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/auth">
                            <Button className="w-full">
                              Sign In to Apply <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="application-form" className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our available internship positions above and apply to the ones that match your interests and skills.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">You're signed in and ready to apply!</p>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Browse Internships <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Sign in to start applying for internships</p>
              <Link to="/auth">
                <Button size="lg">
                  Sign In to Apply <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is included in the internship fee?</h3>
              <p className="text-muted-foreground">The fee includes access to all course materials, hands-on projects, expert mentorship, industry certificate, and job placement assistance.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I switch between programs?</h3>
              <p className="text-muted-foreground">Yes, you can switch programs within the first week of enrollment, subject to availability and approval.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What are the prerequisites?</h3>
              <p className="text-muted-foreground">Basic computer knowledge is required. Specific prerequisites vary by program and are listed in the detailed program descriptions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is the certificate recognized by employers?</h3>
              <p className="text-muted-foreground">Yes, our certificates are industry-recognized and accepted by major tech companies and startups across India.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Internships;