"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  amount: z.string()
    .refine(val => {
      const num = Number(val.replace(/[^0-9.]/g, ''));
      return !isNaN(num) && num >= 5000000;
    }, 'Minimum investment amount is $5M'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function InvestorsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const elements = [titleRef.current, formRef.current];
    
    elements.forEach((element, index) => {
      if (!element) return;
      
      gsap.fromTo(
        element,
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
            trigger: element,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          delay: index * 0.2
        }
      );
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      reset();
      
      toast({
        title: "Success!",
        description: "Thank you for your interest. Our team will contact you shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section 
      id="investors" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden bg-cyberpunk-darker"
    >
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            Become an <span className="text-cyberpunk-cyan">Early Investor</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join us in building the future of decentralized trading. We're currently raising our seed round with a minimum investment of $5M+.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-cyberpunk-black/50 p-8 rounded-lg border border-gray-800"
          >
            <div>
              <label className="block text-white mb-2">Name *</label>
              <input
                type="text"
                {...register('name')}
                className={cn(
                  "w-full bg-cyberpunk-darker border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyberpunk-cyan transition-colors",
                  errors.name && "border-red-500"
                )}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">Email *</label>
              <input
                type="email"
                {...register('email')}
                className={cn(
                  "w-full bg-cyberpunk-darker border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyberpunk-cyan transition-colors",
                  errors.email && "border-red-500"
                )}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">Company (Optional)</label>
              <input
                type="text"
                {...register('company')}
                className="w-full bg-cyberpunk-darker border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyberpunk-cyan transition-colors"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Investment Amount *</label>
              <input
                type="text"
                {...register('amount')}
                className={cn(
                  "w-full bg-cyberpunk-darker border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyberpunk-cyan transition-colors",
                  errors.amount && "border-red-500"
                )}
                placeholder="Minimum $5M"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">Message (Optional)</label>
              <textarea
                {...register('message')}
                className="w-full bg-cyberpunk-darker border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyberpunk-cyan transition-colors"
                rows={4}
                placeholder="Any additional information you'd like to share"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "neon-btn w-full",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Submitting..." : "Submit Investment Interest"}
            </button>
          </form>

          {isSubmitted && (
            <div className="mt-8 p-6 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
              <h3 className="text-xl font-display text-white mb-2">Thank You!</h3>
              <p className="text-gray-300">
                We've received your investment interest. Our team will review your submission and contact you shortly to discuss the next steps.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}