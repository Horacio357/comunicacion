import React, { useState } from 'react';

export const StudentDashboard = ({ onLogout, onNavigateToInbox, onNavigateToGallery }) => {
  const [activeQR, setActiveQR] = useState('asistencia'); // 'asistencia' or 'boletin'

  const studentData = {
    name: 'Lucas Pérez',
    course: '4.º A',
    level: 'Primaria',
    id: 'STUD-19283-LUCAS'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-emerald-800 p-6 text-white text-center relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onLogout}
              className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
            >
              🚪 Salir
            </button>
          </div>
          <span className="text-3xl">🎓</span>
          <h2 className="font-bold text-lg mt-1">Portal del Alumno</h2>
          <p className="text-xs opacity-75">{studentData.name}</p>
        </div>

        {/* Student Info Box */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl shadow-inner border border-emerald-500">
            👦
          </div>
          <h3 className="font-bold text-slate-800 text-base mt-2">{studentData.name}</h3>
          <p className="text-xs text-slate-500 font-semibold">{studentData.course} • Nivel {studentData.level}</p>
        </div>

        {/* QR Selector Buttons */}
        <div className="p-4 flex gap-2 bg-white">
          <button
            onClick={() => setActiveQR('asistencia')}
            className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
              activeQR === 'asistencia'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🪪 QR de Asistencia
          </button>
          <button
            onClick={() => setActiveQR('boletin')}
            className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
              activeQR === 'boletin'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            📄 QR de Boletín (Padres)
          </button>
        </div>

        {/* QR Rendering Panel */}
        <div className="p-6 flex flex-col items-center bg-white">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col items-center">
            {activeQR === 'asistencia' ? (
              <>
                <h4 className="text-xs font-bold text-slate-700 mb-2">QR Registro Asistencia</h4>
                {/* QR Code SVG */}
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" fill="#075E54" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="#075E54" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#075E54" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="#075E54" />
                  
                  <rect x="5" y="70" width="25" height="25" fill="#075E54" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="#075E54" />
                  
                  <rect x="40" y="10" width="10" height="5" fill="#128C7E" />
                  <rect x="55" y="15" width="5" height="15" fill="#075E54" />
                  <rect x="40" y="30" width="15" height="5" fill="#128C7E" />
                  <rect x="10" y="40" width="10" height="10" fill="#075E54" />
                  <rect x="30" y="45" width="5" height="20" fill="#128C7E" />
                  <rect x="45" y="55" width="20" height="10" fill="#075E54" />
                  <rect x="70" y="45" width="15" height="5" fill="#128C7E" />
                  <rect x="75" y="55" width="20" height="20" fill="#075E54" />
                  <rect x="80" y="60" width="10" height="10" fill="white" />
                  <rect x="85" y="80" width="10" height="10" fill="#128C7E" />
                </svg>
                <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">{studentData.id}</p>
                <span className="text-[9px] text-slate-400 mt-2 italic text-center max-w-[200px]">Muestra este QR al preceptor para registrar tu ingreso</span>
              </>
            ) : (
              <>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Código QR del Boletín</h4>
                {/* QR Code SVG for Parents */}
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="#1e293b" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="#1e293b" />
                  
                  <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="#1e293b" />
                  
                  <rect x="35" y="15" width="15" height="10" fill="#10b981" />
                  <rect x="55" y="5" width="10" height="15" fill="#1e293b" />
                  <rect x="40" y="40" width="20" height="5" fill="#10b981" />
                  <rect x="15" y="45" width="10" height="10" fill="#1e293b" />
                  <rect x="45" y="50" width="15" height="15" fill="#10b981" />
                  <rect x="70" y="40" width="15" height="15" fill="#1e293b" />
                  <rect x="75" y="65" width="20" height="20" fill="#10b981" />
                  <rect x="80" y="70" width="10" height="10" fill="white" />
                </svg>
                <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">TUTOR-BOLETIN-{studentData.id}</p>
                <span className="text-[9px] text-slate-400 mt-2 italic text-center max-w-[200px]">Muestra este QR a tus padres para que descarguen tu boletín oficial</span>
              </>
            )}
          </div>
        </div>

        {/* Shortcuts to Inbox / Video Gallery */}
        <div className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
          <button
            onClick={onNavigateToInbox}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
          >
            💬 Ver Comunicados
          </button>
          <button
            onClick={onNavigateToGallery}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
          >
            📷 Ver Videos
          </button>
        </div>

      </div>
    </div>
  );
};
export default StudentDashboard;
