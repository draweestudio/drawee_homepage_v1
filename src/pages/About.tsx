import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, ArrowUpRight, Facebook, Linkedin, Youtube, Github, Dribbble, Figma, Link as LinkIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Header from '../components/Header';

export default function About() {
  const { about, logo, contact } = useSite();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      case 'dribbble': return <Dribbble className="w-5 h-5" />;
      case 'figma': return <Figma className="w-5 h-5" />;
      case 'mail': return <Mail className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black" style={{ backgroundColor: 'var(--about-bg-color)', color: 'var(--about-text-color)' }}>
      {/* Header */}
      <Header style={{ color: 'var(--about-text-color)' }} className="" />

      <main className="pt-40 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-12 whitespace-pre-line">
            {about.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mt-24">
            <div>
              <h2 className="text-xl font-medium mb-6 border-b pb-4" style={{ borderColor: 'color-mix(in srgb, var(--about-text-color) 20%, transparent)' }}>Our Approach</h2>
              <p className="font-light leading-relaxed text-lg whitespace-pre-line" style={{ color: 'color-mix(in srgb, var(--about-text-color) 70%, transparent)' }}>
                {about.description}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-6 border-b pb-4" style={{ borderColor: 'color-mix(in srgb, var(--about-text-color) 20%, transparent)' }}>Services</h2>
              <ul className="font-light leading-relaxed text-lg space-y-2" style={{ color: 'color-mix(in srgb, var(--about-text-color) 70%, transparent)' }}>
                {about.services.split(',').map((service: string, idx: number) => (
                  <li key={idx}>{service.trim()}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-32">
            {about.clients && about.clients.trim() !== '' && (
              <>
                <h2 className="text-xl font-medium mb-8 border-b pb-4" style={{ borderColor: 'color-mix(in srgb, var(--about-text-color) 20%, transparent)' }}>Selected Clients</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-secondary text-lg" style={{ color: 'color-mix(in srgb, var(--about-text-color) 70%, transparent)' }}>
                  {about.clients.split(',').map((client: string, idx: number) => (
                    <span key={idx}>{client.trim()}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-10 py-12 border-t max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mt-20" style={{ borderColor: 'color-mix(in srgb, var(--about-text-color) 10%, transparent)' }}>
        <div>
          <h2 className="text-3xl md:text-5xl font-medium mb-6">Let's work together.</h2>
          <a href="mailto:hello@drawee.studio" className="text-lg md:text-xl border-b pb-1 transition-colors inline-flex items-center gap-2" style={{ borderColor: 'var(--about-text-color)' }}>
            hello@drawee.studio <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
        
        <div className="flex flex-col md:items-end gap-6">
          {contact.socials && contact.socials.length > 0 && (
            <div className="flex gap-4">
              {contact.socials.map((social: any) => (
                <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="p-2 border rounded-full transition-colors hover:opacity-70" style={{ borderColor: 'color-mix(in srgb, var(--about-text-color) 20%, transparent)' }} aria-label={social.platform}>
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
          <p className="text-sm font-secondary" style={{ color: 'color-mix(in srgb, var(--about-text-color) 50%, transparent)' }}>
            &copy; {new Date().getFullYear()} drawee studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
