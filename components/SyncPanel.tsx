import React, { useState } from 'react';
import { Download, Upload, Settings, X, Check } from 'lucide-react';

const SyncPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Regex to find all keys used by our app
  const getAppKeys = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('hero_') || 
        key.startsWith('philo_') || 
        key.startsWith('expertise_') || 
        key.startsWith('pricing_') || 
        key.startsWith('marquee_') || 
        key.startsWith('showcase_') || 
        key.startsWith('axem_')
      )) {
        keys.push(key);
      }
    }
    return keys;
  };

  const handleExport = () => {
    const keys = getAppKeys();
    const data: Record<string, any> = {};
    keys.forEach(key => {
      const val = localStorage.getItem(key);
      try {
        data[key] = JSON.parse(val || "");
      } catch {
        data[key] = val;
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        Object.keys(json).forEach(key => {
          const val = json[key];
          if (typeof val === 'object') {
             localStorage.setItem(key, JSON.stringify(val));
          } else {
             localStorage.setItem(key, val);
          }
        });
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        console.error("Import failed", err);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all shadow-lg opacity-50 hover:opacity-100"
          title="Panneau de configuration"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 w-72 shadow-2xl animate-reveal">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h3 className="text-white font-medium text-sm">Synchronisation</h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-neutral-400 mb-2">
              1. Faites vos modifications sur le site.<br/>
              2. Exportez le fichier JSON.<br/>
              3. Mettez ce fichier dans <code>src/data/content.json</code> et poussez sur GitHub.
            </div>

            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-[#00FA9A]/10 hover:bg-[#00FA9A]/20 text-[#00FA9A] text-xs font-bold py-2 px-3 rounded-lg transition-colors border border-[#00FA9A]/20"
            >
              <Download className="w-4 h-4" />
              Exporter content.json
            </button>

            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors border border-white/10 ${importStatus === 'success' ? 'text-green-500 border-green-500/50' : ''}`}>
                 {importStatus === 'success' ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                 {importStatus === 'success' ? 'Chargé ! Reloading...' : 'Importer un fichier'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncPanel;