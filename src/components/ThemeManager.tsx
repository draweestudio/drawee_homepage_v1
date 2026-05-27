import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export default function ThemeManager() {
  const location = useLocation();
  const { theme } = useSite();

  useEffect(() => {
    if (!theme) return;

    let mode = 'light';
    const path = location.pathname;

    // Determine the theme mode ('light' | 'dark') configured for each route
    if (path === '/') {
      mode = theme.homeMode || 'light';
    } else if (path === '/about') {
      mode = theme.aboutMode || 'dark';
    } else if (path === '/contact') {
      mode = theme.contactMode || 'light';
    } else if (path.startsWith('/work/')) {
      mode = theme.projectDetailMode || 'light';
    } else {
      // Default to light mode for neutral sections like Admin dashboard
      mode = 'light';
    }

    // Determine specific color bindings for the chosen mode
    const bg = mode === 'dark' ? (theme.darkBgColor || '#050505') : (theme.lightBgColor || '#ffffff');
    const text = mode === 'dark' ? (theme.darkTextColor || '#ffffff') : (theme.lightTextColor || '#111111');
    const primary = mode === 'dark' ? (theme.darkPrimaryColor || '#ffffff') : (theme.lightPrimaryColor || '#000000');
    const secondary = mode === 'dark' ? (theme.darkSecondaryColor || '#999999') : (theme.lightSecondaryColor || '#666666');
    const accent = mode === 'dark' ? (theme.darkAccentColor || '#FF4500') : (theme.lightAccentColor || '#FF4500');

    // Dynamically update the root style properties
    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--text-color', text);
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--accent-color', accent);

    // Keep About Page custom properties synchronized
    if (path === '/about') {
      document.documentElement.style.setProperty('--about-bg-color', bg);
      document.documentElement.style.setProperty('--about-text-color', text);
    } else {
      document.documentElement.style.setProperty('--about-bg-color', theme.aboutBgColor || '#050505');
      document.documentElement.style.setProperty('--about-text-color', theme.aboutTextColor || '#ffffff');
    }

    // Add or remove .dark class for tailwind custom support if required
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname, theme]);

  return null;
}
