
/**
 * About Page Component
 * 
 * This page displays information about Pyrowarden Technologies,
 * including our mission, values, story, and team members.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';

/**
 * About Component
 * 
 * Features:
 * - Company mission and values
 * - Team member profiles
 * - Responsive design
 * - Smooth animations
 */
const About: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Team member data
  const teamMembers = [
    {
      name: "Ajvad N",
      role: "CEO and Founder",
      bio: "Leading PyroWarden Technologies with a vision to democratize cybersecurity tools.",
      image: "/team-images/ajvad-n.jpeg"
    },
    {
      name: "Vaishnav",
      role: "Software Lead",
      bio: "Leading our technical vision and cybersecurity tool development with expertise in ethical hacking and security research.",
      image: "/team-images/vaishnav.jpeg"
    },
    {
      name: "Afeef M",
      role: "Full Stack Developer",
      bio: "Expert in Web Development .frontend and backend development",
      image: "/team-images/afeef-m.jpeg"
    },
    {
      name: "Jithin PR",
      role: "COO",
      bio: "Overseeing operations and ensuring seamless delivery of security solutions.",
      image: "/team-images/jithin-pr.jpeg"
    },
    {
      name: "Fawas",
      image: "/team-images/fawas.jpeg"
    },
    {
      name: "Irfhan",
      image: "/team-images/irfhan.jpeg"
    },
    {
      name: "Shree Vishnu",
      image: "/team-images/vishnu.jpeg"
    },
    {
      name: "Salman P",
      image: "/placeholder.svg"
    }
  ];

  return (
    <PageLayout>
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* Back Navigation */}
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            {/* Page Title */}
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="hero-title text-3xl mb-4"
            >
              About PyroWarden Technologies
            </motion.h1>
            
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                className="hero-subtitle text-base text-gray-600 mb-8"
              >
                We're a team of cybersecurity experts dedicated to providing cutting-edge hacking tools and security equipment.
              </motion.p>
              
              {/* Mission and Values Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                
                {/* Mission */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="section-title text-2xl">Our Mission</h2>
                  <p className="card-body text-gray-600 text-sm">
                    At PyroWarden Technologies, we're on a mission to provide professional-grade cybersecurity tools 
                    and equipment that empower ethical hackers, penetration testers, and security researchers worldwide.
                  </p>
                  <p className="card-body text-gray-600 text-sm">
                    We believe that by providing cutting-edge security tools and fostering ethical hacking practices, 
                    we can create a more secure digital world for everyone.
                  </p>
                </motion.div>
                
                {/* Values */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <h3 className="section-title text-xl mb-3">Our Values</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-gray-700 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm"><strong>Innovation:</strong> We push boundaries to create solutions that weren't possible before.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-gray-700 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm"><strong>Quality:</strong> We're committed to excellence in every sensor, algorithm, and solution we deliver.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-gray-700 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm"><strong>Collaboration:</strong> We work closely with our clients to ensure their unique needs are met.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-gray-700 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm"><strong>Impact:</strong> We measure success by the tangible differences our technology makes in the real world.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              {/* Our Story Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="section-title text-2xl mb-4">Our Story</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-gray-600 mb-3 text-sm">
                    We started with the ambition to make an inherently scattered and complex development area modular, 
                    accessible, and efficient. Our journey began with a simple observation: the cybersecurity industry 
                    needed better tools and training programs that were both accessible and professional.
                  </p>
                  <p className="text-gray-600 mb-3 text-sm">
                    Today, we're proud to offer comprehensive cybersecurity solutions, from professional-grade hacking 
                    tools to intensive training programs that prepare the next generation of security professionals.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Our commitment to quality, innovation, and ethical practices has made us a trusted partner for 
                    security researchers, penetration testers, and organizations worldwide.
                  </p>
                </div>
              </motion.div>
              
              {/* Team Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="section-title text-xl mb-3">Our Team</h2>
                <p className="card-body text-gray-600 mb-4 text-xs">
                  Our diverse team combines expertise in cybersecurity, hardware engineering, software development, 
                  and penetration testing to deliver comprehensive security solutions.
                </p>
                
                {/* Team Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                  {teamMembers.map((member, i) => (
                    <Card key={i} className="bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-2 sm:p-3 flex flex-col items-center text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative mb-2 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover object-top" 
                          />
                        </div>
                        <h3 className="team-name text-xs sm:text-sm text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="team-role text-gray-600 text-xs mb-1">
                          {member.role}
                        </p>
                        {member.bio && (
                          <p className="text-gray-500 text-xs text-center leading-tight line-clamp-2">
                            {member.bio}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Link 
                to="/careers" 
                className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group"
              >
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
