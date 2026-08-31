import React, { useState } from 'react';

export const QRAttendanceTracker = ({ forceMode }) => {
  const [localViewMode, setLocalViewMode] = useState('student'); // 'student' or 'scanner'
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, studentName: 'Lucas Pérez', course: '4.º A', time: '07:45', status: 'PRESENTE' },
    { id: 2, studentName: 'Sofía Gómez', course: '4.º A', time: '07:48', status: 'PRESENTE' },
    { id: 3, studentName: 'Mateo Díaz', course: '5.º B', time: '08:02', status: 'TARDE' }
  ]);
  const [scanSuccess, setScanSuccess] = useState(null);

  const viewMode = forceMode || localViewMode;

  // Students list to select from to simulate a QR scan
  const studentsToScan = [
    { id: 'stud-10', name: 'Julián Bianchi', course: '4.º A' },
    { id: 'stud-11', name: 'Valentina López', course: '4.º A' },
    { id: 'stud-12', name: 'Ignacio Ruiz', course: '5.º B' }
  ];

  const handleSimulateScan = (student) => {
    // Check if already registered
    if (attendanceLogs.some(log => log.studentName === student.name)) {
      setScanSuccess({ error: `El estudiante ${student.name} ya registró su asistencia hoy.` });
      setTimeout(() => setScanSuccess(null), 3000);
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = new Date().getHours() >= 8; // Assumes late after 08:00
    const status = isLate ? 'TARDE' : 'PRESENTE';

    const newLog = {
      id: Date.now(),
      studentName: student.name,
      course: student.course,
      time: time,
      status: status
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setScanSuccess({ success: true, name: student.name, status: status, time: time });
    
    // Clear success message
    setTimeout(() => setScanSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Toggle Mode Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-800">⏱️ Control de Asistencia QR</h1>
            <p className="text-xs text-slate-500">Módulo de control de presencialidad y credenciales escolares.</p>
          </div>
          
          {!forceMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setLocalViewMode('student')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'student'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🪪 Credencial Estudiante
              </button>
              <button
                onClick={() => setLocalViewMode('scanner')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'scanner'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📷 Modo Escáner (Docentes)
              </button>
            </div>
          )}
        </div>


        {viewMode === 'student' ? (
          // STUDENT VIEW: SHOW THE QR CREDENTIAL
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
              {/* Header card banner */}
              <div className="bg-emerald-700 p-6 text-white text-center relative">
                <h3 className="font-bold text-lg">Instituto San Martín</h3>
                <span className="text-xs opacity-75">Credencial Digital del Alumno</span>
              </div>
              
              {/* Student Photo and Info */}
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl shadow-inner border-2 border-emerald-500">
                  👦
                </div>
                <h4 className="font-bold text-slate-800 text-base mt-3">Lucas Pérez</h4>
                <span className="text-xs text-slate-400 font-semibold uppercase mt-0.5">4.º A • Nivel Primario</span>
                
                {/* QR Code Container */}
                <div className="mt-6 p-3 bg-white border border-slate-200 rounded-xl shadow-inner flex flex-col items-center justify-center">
                  {/* Simulated QR Code SVG */}
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="5" y="5" width="25" height="25" fill="#075E54" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="#075E54" />
                    
                    <rect x="70" y="5" width="25" height="25" fill="#075E54" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="#075E54" />
                    
                    <rect x="5" y="70" width="25" height="25" fill="#075E54" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="#075E54" />
                    {/* Random patterns */}
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
                  <span className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">ID: STUD-19283-LUCAS</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // TEACHER SCANNER VIEW: SIMULATION PANEL
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Camera simulator */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Simulador de Cámara del Lector</h3>
              
              {/* Scan box viewfinder */}
              <div className="w-full aspect-square max-w-sm bg-slate-900 rounded-xl relative flex flex-col items-center justify-center overflow-hidden border border-slate-800">
                <div className="absolute inset-8 border-2 border-emerald-500 border-dashed rounded-lg opacity-75 animate-pulse"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-600 animate-bounce"></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest absolute bottom-4">En espera de código...</span>
              </div>

              {/* Simulation triggers */}
              <div className="w-full mt-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase">Simular Escaneo de Alumno:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {studentsToScan.map(student => (
                    <button
                      key={student.id}
                      onClick={() => handleSimulateScan(student)}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 text-left p-3 rounded-lg text-xs font-medium flex justify-between items-center transition-colors"
                    >
                      <span>👦 {student.name} ({student.course})</span>
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">Escanear QR ➔</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance list logs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Registros de Asistencias del Día</h3>

              {scanSuccess && (
                <div className={`p-4 mb-4 rounded-xl text-xs flex flex-col ${
                  scanSuccess.error 
                    ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}>
                  {scanSuccess.error ? (
                    <p>⚠️ {scanSuccess.error}</p>
                  ) : (
                    <div>
                      <p className="font-bold">✓ Escaneo exitoso</p>
                      <p className="mt-1">{scanSuccess.name} registrado como <strong>{scanSuccess.status}</strong> a las {scanSuccess.time} hs.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-slate-100">
                {attendanceLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{log.studentName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{log.course} • Entrada: {log.time} hs</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'PRESENTE' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default QRAttendanceTracker;
