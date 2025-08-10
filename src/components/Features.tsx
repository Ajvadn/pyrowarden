import { useEffect, useRef, useState } from 'react';
import { Activity, Shield, HardHat, Zap, ArrowRight, Star, Sparkles, Target, Award } from "lucide-react";
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import wifiTestingDevice from '@/assets/wifi-testing-device.webp';
import rfidTool from '@/assets/rfid-tool.webp';
import hardwareToolkit from '@/assets/hardware-toolkit.webp';
import badgeFlipper from '@/assets/badge-flipper.webp';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Activity className="w-8 h-8 text-blue-600" />,
      title: "Network Security Tools",
      description: "Advanced wireless testing equipment for penetration testing and network analysis.",
      image: wifiTestingDevice,
      category: "Network",
      rating: 4.9,
      badge: "Popular"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Physical Security Kits",
      description: "RFID cloning tools and access control bypass equipment for security assessments.",
      image: rfidTool,
      category: "Physical",
      rating: 4.8,
      badge: "New"
    },
    {
      icon: <HardHat className="w-8 h-8 text-orange-600" />,
      title: "Hardware Hacking Tools",
      description: "Embedded systems analysis tools and circuit debugging equipment for IoT research.",
      image: hardwareToolkit,
      category: "Hardware",
      rating: 4.7,
      badge: "Featured"
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "Social Engineering Kits",
      description: "Educational phishing kits and awareness training tools for human factor testing.",
      image: badgeFlipper,
      category: "Social",
      rating: 4.6,
      badge: "Limited"
    }
  ];

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-info');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll('.feature-card');
      elements.forEach(el => {
        observer.observe(el);
      });
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={featuresRef}>
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            Featured Products
          </div>
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-4">
            Professional Security Tools
          </h2>
          <p className="hero-subtitle text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Discover our curated collection of cutting-edge cybersecurity tools designed for professionals, 
            researchers, and ethical hackers. Each tool is carefully selected for quality and effectiveness.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "feature-card group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white",
                "transform hover:-translate-y-2 hover:scale-105",
                "opacity-0 translate-y-8"
              )}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with badge */}
                  <div className="absolute top-2 right-2">
                    <span className={cn(
                      "px-1.5 py-0.5 text-xs font-semibold rounded-full text-white",
                      feature.badge === "Popular" && "bg-red-500",
                      feature.badge === "New" && "bg-green-500",
                      feature.badge === "Featured" && "bg-blue-500",
                      feature.badge === "Limited" && "bg-purple-500"
                    )}>
                      {feature.badge}
                    </span>
                  </div>
                  
                  {/* Category tag */}
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
                      {feature.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Icon and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{feature.rating}</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="feature-title text-sm text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="card-body text-gray-600 text-xs mb-3">
                    {feature.description}
                  </p>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 md:p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <h3 className="hero-title text-xl md:text-2xl mb-3">
                Ready to Level Up Your Security Skills?
              </h3>
              <p className="hero-subtitle text-sm md:text-base text-blue-100 mb-6">
                Join our community of cybersecurity professionals and get access to the latest tools and training programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="sm" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                  onClick={scrollToContact}
                >
                  <Award className="w-4 h-4 mr-1" />
                  Get Started Today
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                >
                  View All Products
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
