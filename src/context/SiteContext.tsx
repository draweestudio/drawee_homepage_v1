import React, { createContext, useContext, useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../constants';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export const defaultHome = {
  title: "본질에 집중하는\n미니멀 디자인 스튜디오.",
  description: "drawee(드로이)는 불필요한 요소를 덜어내고, 브랜드의 진정한 가치를 시각적으로 전달합니다. 우리는 디지털과 아날로그의 경계를 허무는 경험을 디자인합니다."
};

export const defaultAbout = {
  title: "우리는 사람들의 기억에 남는\n디지털 경험을 만듭니다.",
  description: "drawee(드로이)는 단순한 시각적 아름다움을 넘어, 브랜드의 본질을 탐구하고 사용자에게 의미 있는 경험을 제공하는 디자인 스튜디오입니다. 우리는 복잡한 문제를 가장 단순하고 직관적인 형태로 풀어냅니다.",
  services: "Brand Identity, UI/UX Design, Web Development, Editorial Design, Art Direction",
  clients: "Samsung, Hyundai, Naver, Kakao, Amorepacific, CJ ENM, Toss, Musinsa"
};

export const defaultContact = {
  title: "새로운 프로젝트를\n기다리고 있습니다.",
  description: "프로젝트에 대한 아이디어나 문의 사항이 있다면 언제든 편하게 연락 주세요.\n더 나은 결과물을 함께 만들어가기를 기대합니다.",
  email: "hello@drawee.studio",
  location: "서울특별시 강남구\n테헤란로 123, 4층\ndrawee studio",
  socials: [
    { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
    { id: '2', platform: 'Twitter', url: 'https://twitter.com' },
    { id: '3', platform: 'Mail', url: 'mailto:hello@drawee.studio' }
  ]
};

export const defaultTheme = {
  homeMode: 'light',
  aboutMode: 'dark', // About default standard mode is dark
  contactMode: 'light',
  projectDetailMode: 'light',

  lightBgColor: "#ffffff",
  lightTextColor: "#111111",
  lightPrimaryColor: "#000000",
  lightSecondaryColor: "#666666",
  lightAccentColor: "#FF4500",

  darkBgColor: "#050505",
  darkTextColor: "#ffffff",
  darkPrimaryColor: "#ffffff",
  darkSecondaryColor: "#999999",
  darkAccentColor: "#FF4500",

  // Backward compatibility
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
  const [home, setHome] = useState(defaultHome);
  const [about, setAbout] = useState(defaultAbout);
  const [contact, setContact] = useState(defaultContact);
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'site', 'data');
    
    // Initialize default data if it doesn't exist
    const initData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            logo: null,
            projects: PORTFOLIO_DATA,
            home: defaultHome,
            about: defaultAbout,
            contact: defaultContact,
            theme: defaultTheme
          });
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initData();

    // Listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logo !== undefined) setLogo(data.logo);
        if (data.projects) setProjects(data.projects);
        if (data.home) setHome(data.home);
        if (data.about) setAbout(data.about);
        if (data.contact) setContact(data.contact);
        if (data.theme) setTheme({ ...defaultTheme, ...data.theme });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Removed old theme-setting useEffect, handled by ThemeManager instead

  const updateData = async (field: string, value: any) => {
    try {
      const docRef = doc(db, 'site', 'data');
      await setDoc(docRef, { [field]: value }, { merge: true });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      throw error;
    }
  };

  const updateLogo = (newLogo: string | null) => updateData('logo', newLogo);
  const updateProjects = (newProjects: any) => updateData('projects', newProjects);
  const updateHome = (newHome: any) => updateData('home', newHome);
  const updateAbout = (newAbout: any) => updateData('about', newAbout);
  const updateContact = (newContact: any) => updateData('contact', newContact);
  const updateTheme = (newTheme: any) => updateData('theme', newTheme);

  return (
    <SiteContext.Provider value={{ 
      logo, updateLogo, 
      projects, updateProjects, 
      home, updateHome,
      about, updateAbout, 
      contact, updateContact,
      theme, updateTheme,
      isLoading
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
