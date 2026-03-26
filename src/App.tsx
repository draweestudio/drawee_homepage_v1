import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import { SiteProvider, useSite } from './context/SiteContext';
import AdminLogin from './components/AdminLogin';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isLoading } = useSite();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/work/:id" element={<ProjectDetail />} />
        <Route path="/admin/*" element={
          <AdminLogin>
            <Admin />
          </AdminLogin>
        } />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
