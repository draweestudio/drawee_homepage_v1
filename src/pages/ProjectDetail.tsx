import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Header from '../components/Header';

const isVideo = (url?: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.mov');
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useSite();
  
  const projectIndex = projects.findIndex((p: any) => String(p.id) === String(id));
  const project = projects[projectIndex];
  
  // 다음 프로젝트 찾기 (마지막이면 첫 번째로)
  const nextProject = projectIndex !== -1 
    ? projects[(projectIndex + 1) % projects.length] 
    : null;

  // 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text">
        <h1 className="text-4xl font-medium mb-4">Project Not Found</h1>
        <Link to="/" className="text-secondary hover:text-primary border-b border-secondary hover:border-primary transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-bg">
      {/* Header */}
      <Header />

      <main className="pt-40 pb-20">
        {/* Project Info */}
        <section className="px-6 md:px-10 max-w-[1800px] mx-auto mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-12 md:mb-20">
              {project.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-t border-gray-200 pt-8">
              <div className="md:col-span-2">
                <p className="text-base text-secondary font-light leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Client</h3>
                  <p className="text-base">{project.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Role</h3>
                  <p className="text-base">{project.role}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
                  <p className="text-base">{project.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Year</h3>
                  <p className="text-base font-secondary">{project.year}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Project Images */}
        <section className="space-y-6 md:space-y-10 max-w-[1800px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.image ? (
              isVideo(project.image) ? (
                <video 
                  src={project.image} 
                  autoPlay loop muted playsInline 
                  className="w-full aspect-video object-cover bg-gray-100"
                />
              ) : (
                <img 
                  src={project.image} 
                  alt={`${project.title} main`} 
                  className="w-full aspect-video object-cover bg-gray-100"
                  referrerPolicy="no-referrer"
                />
              )
            ) : (
              <div className="w-full aspect-video bg-gray-100"></div>
            )}
          </motion.div>
          
          {project.contentImages?.map((img: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {img ? (
                isVideo(img) ? (
                  <video 
                    src={img} 
                    autoPlay loop muted playsInline 
                    className="w-full aspect-video object-cover bg-gray-100"
                  />
                ) : (
                  <img 
                    src={img} 
                    alt={`${project.title} detail ${idx + 1}`} 
                    className="w-full aspect-video object-cover bg-gray-100"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="w-full aspect-video bg-gray-100"></div>
              )}
            </motion.div>
          ))}
        </section>

        {/* Next Project */}
        {nextProject && (
          <section className="mt-32 px-6 md:px-10 max-w-[1800px] mx-auto border-t border-gray-200 pt-20">
            <Link to={`/work/${nextProject.id}`} className="group block text-center">
              <p className="text-secondary mb-4">Next Project</p>
              <h2 className="text-4xl md:text-6xl font-medium group-hover:text-secondary transition-colors inline-flex items-center gap-4">
                {nextProject.title} <ArrowRight className="w-8 h-8 md:w-12 md:h-12 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </h2>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
