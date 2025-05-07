"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  index: number;
}

function TeamMember({ name, role, image, bio, links, index }: TeamMemberProps) {
  const memberRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!memberRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      memberRef.current,
      { 
        y: 50, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: memberRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        },
        delay: (index % 3) * 0.2
      }
    );
    
  }, [index]);
  
  return (
    <div 
      ref={memberRef}
      className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group transition-all duration-300 hover:border-cyberpunk-cyan/50"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-36 h-36 rounded-md overflow-hidden mb-4 md:mb-0">
          <Image 
            src={image} 
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            className="grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-cyberpunk-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {links.twitter && (
              <a 
                href={links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-cyberpunk-cyan transition-colors"
              >
                <Twitter size={16} />
              </a>
            )}
            
            {links.github && (
              <a 
                href={links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-cyberpunk-cyan transition-colors"
              >
                <Github size={16} />
              </a>
            )}
            
            {links.linkedin && (
              <a 
                href={links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-cyberpunk-cyan transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-display text-white mb-1">{name}</h3>
          <div className="text-cyberpunk-cyan text-sm font-mono mb-3">{role}</div>
          <p className="text-gray-400">{bio}</p>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      titleRef.current,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
    
  }, []);
  
  const teamMembers = [
    {
      name: 'Dr. Ivan Petrov',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Ex-HFT engineer with a PhD in distributed systems, bringing extensive experience in high-performance trading systems.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Anna Smirnova',
      role: 'Lead Developer',
      image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Rust & Solidity veteran, Hyperliquid contributor with deep expertise in blockchain development.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Maria Ivanova',
      role: 'UX Lead',
      image: 'https://images.pexels.com/photos/3812742/pexels-photo-3812742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Former Coinbase FinTech designer specializing in creating intuitive trading interfaces.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Sergey Kozlov',
      role: 'CFO',
      image: 'https://images.pexels.com/photos/2589650/pexels-photo-2589650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Ex-JP Morgan executive with extensive experience in institutional trading flow and financial operations.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Robert Chen',
      role: 'Advisor - DeFi',
      image: 'https://images.pexels.com/photos/2951142/pexels-photo-2951142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Core contributor at Compound, providing strategic guidance on DeFi protocol design and tokenomics.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
    {
      name: 'Sarah Williams',
      role: 'Advisor - Security',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Security expert from Aave, specializing in smart contract auditing and risk management frameworks.',
      links: {
        twitter: '#',
        github: '#',
        linkedin: '#'
      }
    },
  ];
  
  return (
    <section 
      id="team" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-cyberpunk-black"></div>
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            Meet The <span className="text-cyberpunk-cyan">Team</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our talented team of blockchain experts, developers, and industry veterans is building the future of finance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember 
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
              bio={member.bio}
              links={member.links}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}