import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, ArrowUpRight, Facebook, Linkedin, Youtube, Github, Dribbble, Figma, Link as LinkIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Header from '../components/Header';

export default function Home() {
  const { projects, contact } = useSite();
  const [activeCategory, setActiveCategory] = useState('All work');

  const categories = ['All work', ...Array.from(new Set(projects.map((p: any) => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'All work'
    ? projects
    : projects.filter((p: any) => p.category === activeCategory);

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
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-bg">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6">
            본질에 집중하는<br />
            미니멀 디자인 스튜디오.
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl font-light leading-relaxed">
            drawee(드로이)는 불필요한 요소를 덜어내고, 브랜드의 진정한 가치를 시각적으로 전달합니다. 우리는 디지털과 아날로그의 경계를 허무는 경험을 디자인합니다.
          </p>
        </motion.div>
      </section>

      {/* Portfolio Grid */}
      <section id="work" className="px-6 md:px-10 pb-32 max-w-[1800px] mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-12">
          {categories.map((category: any) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-primary text-bg shadow-md' 
                  : 'bg-transparent text-secondary hover:text-primary border border-gray-200 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16 md:gap-y-24">
          {filteredProjects.map((project: any, index: number) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index % 2 === 0 ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/work/${project.id}`} className="group cursor-pointer block">
                <div className="overflow-hidden bg-gray-100 aspect-video mb-6">
                  {project.image ? (
                    project.image.includes('.mp4') ? (
                      <video 
                        src={project.image} 
                        autoPlay loop muted playsInline 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200 transition-transform duration-700 group-hover:scale-105"></div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl md:text-2xl font-medium mb-2">{project.title}</h3>
                    <p className="text-secondary text-sm md:text-base">{project.category}</p>
                  </div>
                  <span className="text-sm text-secondary font-secondary">{project.year}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-10 py-12 border-t border-gray-200 max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-medium mb-6">Let's work together.</h2>
          <a href={`mailto:${contact.email}`} className="text-lg md:text-xl border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors inline-flex items-center gap-2">
            {contact.email} <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
        
        <div className="flex flex-col md:items-end gap-6">
          {contact.socials && contact.socials.length > 0 && (
            <div className="flex gap-4">
              {contact.socials.map((social: any) => (
                <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="p-2 border border-gray-200 rounded-full hover:bg-primary hover:text-bg transition-colors" aria-label={social.platform}>
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
          <p className="text-sm text-secondary font-secondary">
            &copy; {new Date().getFullYear()} drawee studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
