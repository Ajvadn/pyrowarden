
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="text-4xl font-bold mb-6"
            >
              About PyroWarden Technologies
            </motion.h1>
            
            <div className="prose prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                className="text-xl text-gray-600 mb-12"
              >
                We're a team of cybersecurity experts dedicated to providing cutting-edge hacking tools and security equipment.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                  <p className="text-gray-600">
                    At PyroWarden Technologies, we're on a mission to provide professional-grade cybersecurity tools 
                    and equipment that empower ethical hackers, penetration testers, and security researchers worldwide.
                  </p>
                  <p className="text-gray-600">
                    We believe that by providing cutting-edge security tools and fostering ethical hacking practices, 
                    we can create a more secure digital world for everyone.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Innovation:</strong> We push boundaries to create solutions that weren't possible before.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Quality:</strong> We're committed to excellence in every sensor, algorithm, and solution we deliver.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Collaboration:</strong> We work closely with our clients to ensure their unique needs are met.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Impact:</strong> We measure success by the tangible differences our technology makes in the real world.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                  <p className="text-gray-600 mb-4">
                    We started with the ambition to make an inherently scattered and complex development area modular, 
                    smart and available to analog brands. After successfully raising millions of dollars for development, 
                    we spent the first two years in full code mode.
                  </p>
                  <p className="text-gray-600 mb-4">
                    The goal was to turn all the scattered hardware and building blocks into simple modules to be 
                    assembled like Lego. During this time we took in a range of customers for whom we built prototypes - 
                    a way for us to make sure what we built had bearing in real world use cases.
                  </p>
                  <p className="text-gray-600">
                    In 2023 we felt we had reached a technology level allowing us to start working on enterprise level. 
                    Since then, we have focused on textile integrations because of the enormous potential smart textiles 
                    have across multiple industries from healthcare to public safety.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Our Team</h2>
                <p className="text-gray-600 mb-8">
                  Our diverse team combines expertise in cybersecurity, hardware engineering, software development, 
                  and penetration testing to deliver comprehensive security solutions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Ajvad N",
                      role: "CEO and Founder",
                      bio: "Leading PyroWarden Technologies with a vision to democratize cybersecurity tools.",
                      image: "/lovable-uploads/ajvad-n.jpg"
                    },
                    {
                      name: "Niek Bijman",
                      role: "Software Lead",
                      bio: "Specializing in cloud infrastructure and APIs for seamless data integration.",
                      image: "/lovable-uploads/e502f601-c519-43a8-86f5-5fa89ae50d2f.png"
                    },
                    {
                      name: "Afeef M",
                      role: "Hardware Lead",
                      bio: "Expert in embedded systems engineering, leading our hardware development efforts.",
                      image: "/lovable-uploads/afeef-m.jpg"
                    },
                    {
                      name: "Jithin",
                      role: "COO",
                      bio: "Overseeing operations and ensuring seamless delivery of security solutions.",
                      image: "/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png"
                    },
                    {
                      name: "Fawas",
                      role: "Role 5",
                      bio: "Short bio for team member 5.",
                      image: "/lovable-uploads/fawas.png"
                    },
                    {
                      name: "Irfhan",
                      role: "Role 6",
                      bio: "Short bio for team member 6.",
                      image: "/lovable-uploads/irfhan.jpg"
                    },
                    {
                      name: "Team Member 7",
                      role: "Role 7",
                      bio: "Short bio for team member 7.",
                      image: "/lovable-uploads/member7.jpg"
                    },
                    {
                      name: "Team Member 8",
                      role: "Role 8",
                      bio: "Short bio for team member 8.",
                      image: "/lovable-uploads/member8.jpg"
                    }
                  ].map((member, i) => (
                    <Card key={i} className="bg-white border border-gray-100 overflow-hidden flex flex-col items-center justify-center">
                      <CardContent className="p-6 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 relative mb-4 rounded-full overflow-hidden border-4 border-[#888F7F] shadow-lg bg-white flex items-center justify-center">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover object-top" 
                          />
                        </div>
                        <h3 className="font-bold text-lg text-[#14100F] mt-2">{member.name}</h3>
                        <p className="text-[#888F7F] text-sm mb-2">{member.role}</p>
                        <p className="text-gray-600 text-sm text-center">{member.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Link to="/careers" className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group">
                Join Our Team
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
