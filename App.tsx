
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeSection from './components/MarqueeSection';
import FolderShowcase from './components/FolderShowcase';
import Philosophy from './components/Philosophy';
import Expertise from './components/Expertise';
import Footer from './components/Footer';
import ProjectDetailPage from './components/ProjectDetailPage';
import defaultContent from './src/data/defaultContent';

const App: React.FC = () => {
  const [activeProject, setActiveProject] = useState<{id: string | number, data: any, saveCallback: (id: string|number, data: any) => void} | null>(null);
  const [homeKey, setHomeKey] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // --- SYNC LOGIC (The Magic Part) ---
  useEffect(() => {
    const checkSync = () => {
        // 1. Get the timestamp from the code file (what you pushed to git)
        const fileTimestamp = (defaultContent as any).config_timestamp || 0;
        
        // 2. Get the timestamp from the browser's local memory
        const localTimestamp = Number(localStorage.getItem('config_timestamp') || 0);

        // 3. If the code file is NEWER than local memory, it means your associate 
        //    pulled new changes. We must overwrite local memory with the file data.
        if (fileTimestamp > localTimestamp) {
            console.log("📥 New update found in code! Syncing...");
            
            Object.entries(defaultContent).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, String(value));
                }
            });
            
            // Reload the logo specifically
            const logo = localStorage.getItem('axem_custom_logo');
            if (logo) setCustomLogo(logo);

            // Force React to re-render everything
            setHomeKey(prev => prev + 1);
        } else {
            // Load Logo normally
            const savedLogo = localStorage.getItem('axem_custom_logo');
            if (savedLogo) {
                setCustomLogo(savedLogo);
            }
        }
    };

    checkSync();
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
                {/* Pricing removed as requested */}
            </main>
            <Footer customLogo={customLogo} />
        </div>
      )}
    </div>
  );
};

export default App;
