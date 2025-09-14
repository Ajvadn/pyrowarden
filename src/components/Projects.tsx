
import { useState, useRef, useEffect, TouchEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import wifiTestingDevice from '@/assets/wifi-testing-device.webp';
import rfidTool from '@/assets/rfid-tool.webp';
import hardwareToolkit from '@/assets/hardware-toolkit.webp';
import badgeFlipper from '@/assets/badge-flipper.webp';
import usbRubberDucky from '@/assets/usb-rubber-ducky.webp';

const projects = [
  {
    id: 1,
    title: "WiFi Pineapple Professional Kit",
    brand: "HACKER TOOLS PRO",
    description: "Complete wireless auditing platform for penetration testing and security research. Includes advanced antenna arrays, portable battery packs, and custom firmware.",
    tags: ["WiFi Security", "Penetration Testing", "Wireless Auditing", "Professional Kit"],
    imageUrl: wifiTestingDevice,
    isFeatured: true,
    link: "/products/wifi-pineapple",
    details: `
      Professional-grade wireless security testing platform used by ethical hackers and security professionals worldwide. Features include man-in-the-middle attack capabilities, evil twin access points, captive portal attacks, and comprehensive network reconnaissance tools. Includes portable battery system, high-gain directional antennas, and secure data logging capabilities.
    `
  },
  {
    id: 2,
    title: "RFID Cloning & Analysis Kit",
    brand: "HACK TOOLS ELITE",
    description: "Professional RFID/NFC security testing equipment for access control vulnerability assessment and card cloning research.",
    tags: ["RFID", "NFC", "Access Control", "Security Research"],
    imageUrl: rfidTool,
    link: "/products/rfid-kit"
  },
  {
    id: 3,
    title: "Hardware Hacking Toolkit",
    brand: "CIRCUIT BREAKER PRO",
    description: "Complete embedded systems analysis kit with logic analyzers, JTAG programmers, and bus pirate tools for IoT device reverse engineering.",
    tags: ["Hardware Hacking", "IoT Security", "Embedded Systems", "Reverse Engineering"],
    imageUrl: badgeFlipper,
    link: "/products/hardware-kit"
  },
  {
    id: 4,
    title: "USB Rubber Ducky Arsenal",
    brand: "PAYLOAD MASTERS",
    description: "Advanced keystroke injection tools with custom payloads for security testing and automated penetration testing scenarios.",
    tags: ["USB Attacks", "Keystroke Injection", "Automation", "Payload Development"],
    imageUrl: usbRubberDucky,
    link: "/products/rubber-ducky"
  },
  {
    id: 5,
    title: "Social Engineering Toolkit",
    brand: "PHISHING DEFENSE CO",
    description: "Educational phishing simulation tools and social engineering awareness training equipment for corporate security training programs.",
    tags: ["Social Engineering", "Phishing", "Security Training", "Corporate Defense"],
    imageUrl: hardwareToolkit,
    link: "/products/social-engineering"
  }
];

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);
  const projectsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const minSwipeDistance = 50;

  useEffect(() => {
    if (isInView && !isHovering) {
      const interval = setInterval(() => {
        setActiveProject(prev => (prev + 1) % projects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
      } else {
        setIsInView(false);
      }
    }, {
      threshold: 0.2
    });
    
    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveProject(prev => (prev + 1) % projects.length);
    } else if (isRightSwipe) {
      setActiveProject(prev => (prev - 1 + projects.length) % projects.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === activeProject) return "scale-100 opacity-100 z-20 translate3d(0,0,0)";
    if (index === (activeProject + 1) % projects.length) return "translate-x-[40%] scale-95 opacity-60 z-10 translate3d(0,0,0)";
    if (index === (activeProject - 1 + projects.length) % projects.length) return "translate-x-[-40%] scale-95 opacity-60 z-10 translate3d(0,0,0)";
    return "scale-90 opacity-0 translate3d(0,0,0)";
  };
  
  return <section id="projects" ref={projectsRef} className="bg-white py-[50px] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`text-center mb-10 max-w-3xl mx-auto transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Featured Products
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Professional Security Arsenal
          </h2>
          <p className="text-gray-600">
            Discover our curated collection of professional-grade hacking tools and cybersecurity equipment designed for ethical hackers, penetration testers, and security researchers.
          </p>
          {isMobile && (
            <div className="flex items-center justify-center mt-4 animate-pulse-slow">
              <div className="flex items-center text-blue-500">
                <ChevronLeft size={16} />
                <p className="text-sm mx-1">Swipe to navigate</p>
                <ChevronRight size={16} />
              </div>
            </div>
          )}
        </div>
        
        <div 
          className="relative h-[550px] overflow-hidden" 
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`absolute top-0 w-full max-w-md will-change-transform transition-transform transition-opacity duration-500 ease-out ${getCardAnimationClass(index)}`} 
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden h-[500px] border border-gray-100 shadow-sm hover:shadow-md flex flex-col">
                  <div 
                    className="relative bg-black p-6 flex items-center justify-center h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url(${project.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-white mb-2">{project.brand.toUpperCase()}</h3>
                      <div className="w-12 h-1 bg-white mb-2"></div>
                      <p className="text-white/90 text-sm">{project.title}</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-gray-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-medium">{project.brand}</p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs animate-pulse-slow" 
                            style={{ animationDelay: `${idx * 300}ms` }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {!isMobile && (
            <>
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-transform transition-colors duration-300 hover:scale-110 will-change-transform" 
                onClick={() => setActiveProject(prev => (prev - 1 + projects.length) % projects.length)}
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-transform transition-colors duration-300 hover:scale-110 will-change-transform" 
                onClick={() => setActiveProject(prev => (prev + 1) % projects.length)}
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {projects.map((_, idx) => (
              <button 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors transition-[width] duration-300 ${activeProject === idx ? 'bg-gray-500 w-5' : 'bg-gray-200 hover:bg-gray-300'}`} 
                onClick={() => setActiveProject(idx)}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>;
};

export default Projects;
