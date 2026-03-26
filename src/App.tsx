import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import { SiteProvider } from './context/SiteContext';

export default function App() {
  return (
    <SiteProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/work/:id" element={<ProjectDetail />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Router>
    </SiteProvider>
  );
}
