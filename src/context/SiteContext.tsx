import React, { createContext, useContext, useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../constants';

export const defaultAbout = {
  title: "우리는 사람들의 기억에 남는\n디지털 경험을 만듭니다.",
  description: "drawee(드로이)는 단순한 시각적 아름다움을 넘어, 브랜드의 본질을 탐구하고 사용자에게 의미 있는 경험을 제공하는 디자인 스튜디오입니다. 우리는 복잡한 문제를 가장 단순하고 직관적인 형태로 풀어냅니다.",
  services: "Brand Identity, UI/UX Design, Web Development, Editorial Design, Art Direction",
  clients: "Samsung, Hyundai, Naver, Kakao, Amorepacific, CJ ENM, Toss, Musinsa"
};

export const defaultContact = {
  title: "새로운 프로젝트를\n기다리고 있습니다.",
  email: "hello@drawee.studio",
  location: "서울특별시 강남구\n테헤란로 123, 4층\ndrawee studio",
  socials: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
    { id: '2', platform: 'Twitter', url: 'https://twitter.com' },
    { id: '3', platform: 'Mail', url: 'mailto:hello@drawee.studio' }
  ]
};

export const defaultTheme = {
  bgColor: "#ffffff",
  textColor: "#111111",
  primaryColor: "#000000",
  secondaryColor: "#666666",
  accentColor: "#FF4500",
  aboutBgColor: "#050505",
  aboutTextColor: "#ffffff"
};

export const SiteContext = createContext<any>(null);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [projects, setProjects] = useState(PORTFOLIO_DATA);
  const [about, setAbout] = useState(defaultAbout);
  const [contact, setContact] = useState(defaultContact);
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedLogo = localStorage.getItem('drawee_logo');
    if (savedLogo) setLogo(savedLogo);
    
    const savedProjects = localStorage.getItem('drawee_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));

    const savedAbout = localStorage.getItem('drawee_about');
    if (savedAbout) setAbout(JSON.parse(savedAbout));

    const savedContact = localStorage.getItem('drawee_contact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      if (!parsed.socials) {
        parsed.socials = [
          { id: '1', platform: 'Instagram', url: parsed.instagram || 'https://instagram.com' },
          { id: '2', platform: 'Twitter', url: parsed.twitter || 'https://twitter.com' },
          { id: '3', platform: 'Behance', url: parsed.behance || 'https://behance.net' }
        ];
      }
      setContact(parsed);
    }

    const savedTheme = localStorage.getItem('drawee_theme');
    if (savedTheme) setTheme(JSON.parse(savedTheme));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', theme.bgColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--about-bg-color', theme.aboutBgColor);
    document.documentElement.style.setProperty('--about-text-color', theme.aboutTextColor);
  }, [theme]);

  const updateLogo = (newLogo: string | null) => { 
    setLogo(newLogo); 
    if(newLogo) localStorage.setItem('drawee_logo', newLogo); 
    else localStorage.removeItem('drawee_logo');
  };
  
  const updateProjects = (newProjects: any) => { 
    setProjects(newProjects); 
    localStorage.setItem('drawee_projects', JSON.stringify(newProjects)); 
  };
  
  const updateAbout = (newAbout: any) => { 
    setAbout(newAbout); 
    localStorage.setItem('drawee_about', JSON.stringify(newAbout)); 
  };
  
  const updateContact = (newContact: any) => { 
    setContact(newContact); 
    localStorage.setItem('drawee_contact', JSON.stringify(newContact)); 
  };

  const updateTheme = (newTheme: any) => {
    setTheme(newTheme);
    localStorage.setItem('drawee_theme', JSON.stringify(newTheme));
  };

  return (
    <SiteContext.Provider value={{ 
      logo, updateLogo, 
      projects, updateProjects, 
      about, updateAbout, 
      contact, updateContact,
      theme, updateTheme
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
