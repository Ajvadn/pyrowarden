import React from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Award, CheckCircle, Calendar, MapPin, DollarSign, Star, Download, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Internships = () => {
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

  const scrollToApplication = () => {
    const applicationElement = document.getElementById('application-form');
    if (applicationElement) {
      applicationElement.scrollIntoView({ behavior: 'smooth' });
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
              <Button onClick={scrollToApplication} size="lg" className="bg-white text-primary hover:bg-white/90">
                Apply Now <Send className="ml-2 w-5 h-5" />
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
            <h2 className="text-3xl font-bold mb-4">Our Internship Programs</h2>
            <p className="text-lg text-muted-foreground">
              Choose from our comprehensive range of technology specializations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {internshipPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${program.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                      {program.icon}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <Badge variant="secondary">{program.duration}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{program.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{program.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{program.mentors}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-primary">{program.price}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Key Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.skills.slice(0, 4).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {program.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{program.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Projects:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {program.projects.map((project, projectIndex) => (
                          <li key={projectIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button onClick={scrollToApplication} className="w-full">
                      Apply for {program.title}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application-form" className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apply for Internship</h2>
            <p className="text-lg text-muted-foreground">
              Start your journey in technology with PyroWarden's intensive internship programs
            </p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Program *</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select a program</option>
                      {internshipPrograms.map((program, index) => (
                        <option key={index} value={program.title}>{program.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Education Level *</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Why do you want to join this program? *</label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your motivation and goals..."
                  ></textarea>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" className="rounded" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the terms and conditions and privacy policy *
                  </label>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
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