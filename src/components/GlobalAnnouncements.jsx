import React, { useState } from 'react';

export const GlobalAnnouncements = ({ userRole, announcements, setAnnouncements, unreadCount, setUnreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleReadAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === id && !ann.read) {
        setUnreadCount(count => Math.max(0, count - 1));
        return { ...ann, read: true };
      }
      return ann;
    }));
  };

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnn = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: 'Hoy mismo',
      sender: 'Administración',
      read: false
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setUnreadCount(count => count + 1);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="relative">
      
      {/* 1. BELL NOTIFICATION BUTTON FOR NAVBAR */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
      >
        <span className="text-sm">🔔</span>
        <span>Avisos</span>
        {unreadCount > 0 && (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* 2. DROPDOWN MODAL FOR ANNOUNCEMENTS */}
      {isOpen && (
        <div className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:mt-2 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 text-slate-800 overflow-hidden">
          
          <div className="p-4 bg-slate-950 text-white flex justify-between items-center">
            <h3 className="font-bold text-xs">🔔 Cartelera de Avisos Generales</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="p-2 max-h-[300px] overflow-y-auto divide-y divide-slate-100 bg-white">
            {announcements.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No hay avisos generales vigentes.</p>
            ) : (
              announcements.map((ann) => (
                <div 
                  key={ann.id} 
                  onClick={() => handleReadAnnouncement(ann.id)}
                  className={`p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer relative ${
                    !ann.read ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-slate-800">{ann.title}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{ann.content}</p>
                  
                  {!ann.read && (
                    <span className="absolute top-3.5 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 italic">Clic en un aviso para marcarlo como leído</span>
          </div>

        </div>
      )}

      {/* 3. ADMIN PUBLISHING PANEL (RENDERED OUTSIDE MODAL IF CALLED IN ADMIN TAB) */}
      {userRole === 'ADMIN_PANEL_INJECTION' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xl">📢</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Emitir Anuncio Global Masivo</h3>
              <p className="text-xs text-slate-400">Este comunicado se enviará de forma masiva a todos los perfiles con indicador visual.</p>
            </div>
          </div>

          <form onSubmit={handlePublishAnnouncement} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título del Anuncio</label>
              <input
                type="text"
                placeholder="Ej: Suspensión de clases presenciales por alerta meteorológica"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contenido del Comunicado</label>
              <textarea
                rows={4}
                placeholder="Escribe el aviso general aquí..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow transition-colors cursor-pointer"
            >
              🚀 Lanzar Alerta Masiva a Toda la Escuela
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
export default GlobalAnnouncements;
