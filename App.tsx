
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeSection from './components/MarqueeSection';
import FolderShowcase from './components/FolderShowcase';
import Philosophy from './components/Philosophy';
import Expertise from './components/Expertise';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ProjectDetailPage from './components/ProjectDetailPage';

const App: React.FC = () => {
  const [activeProject, setActiveProject] = useState<{id: string | number, data: any, saveCallback: (id: string|number, data: any) => void} | null>(null);
  const [homeKey, setHomeKey] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('axem_custom_logo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  const handleUpdateLogo = (newLogoBase64: string) => {
    setCustomLogo(newLogoBase64);
    localStorage.setItem('axem_custom_logo', newLogoBase64);
  };

  const handleOpenProject = (id: string | number, data: any, saveCallback: (id: string|number, data: any) => void) => {
    setActiveProject({ id, data, saveCallback });
  };

  const handleCloseProject = () => {
    setActiveProject(null);
    setHomeKey(prev => prev + 1);
  };

  const handleSaveProject = (id: string | number, newData: any) => {
    if (activeProject && activeProject.saveCallback) {
        activeProject.saveCallback(id, newData);
        setActiveProject(prev => prev ? { ...prev, data: newData } : null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#00FA9A]/30 text-white bg-[#050505] relative">
      {activeProject ? (
        <ProjectDetailPage 
            projectId={activeProject.id}
            initialData={activeProject.data}
            onClose={handleCloseProject}
            onSave={handleSaveProject}
        />
      ) : (
        <div key={homeKey}>
            <Navbar customLogo={customLogo} onUpdateLogo={handleUpdateLogo} />
            <main>
                <Hero />
                <MarqueeSection onOpenProject={handleOpenProject} />
                <FolderShowcase onOpenProject={handleOpenProject} />
                <Philosophy />
                <Expertise />
                <Pricing />
            </main>
            <Footer customLogo={customLogo} />
        </div>
      )}
    </div>
  );
};

export default App;
