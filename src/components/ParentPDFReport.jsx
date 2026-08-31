import React, { useState } from 'react';

export const ParentPDFReport = () => {
  const [showReport, setShowReport] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(null);

  const studentData = {
    name: 'Lucas Pérez',
    course: '4.º A',
    level: 'Primaria',
    period: '2.º Trimestre 2026',
    attendance: {
      presents: 42,
      absences: 3,
      lates: 1,
      ratio: '93.3%'
    },
    behavior: 'Muy Bueno',
    grades: [
      { subject: 'Matemática', grade: 9.0 },
      { subject: 'Lengua y Literatura', grade: 8.5 },
      { subject: 'Ciencias Naturales', grade: 9.5 },
      { subject: 'Ciencias Sociales', grade: 8.0 },
      { subject: 'Educación Física', grade: 10.0 },
      { subject: 'Inglés', grade: 8.5 }
    ]
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setScanSuccess(null);
    setShowReport(false);

    // Simulate scanning camera feed detecting student's Boletín QR
    setTimeout(() => {
      setScanning(false);
      setScanSuccess("¡QR detectado! Vinculando boletín oficial...");
      
      setTimeout(() => {
        setScanSuccess(null);
        setShowReport(true);
      }, 1000);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    // Simulate compilation of PDF report on backend
    setTimeout(() => {
      setDownloading(false);
      
      // Simulate file download by creating a text file representing the report
      const reportText = `
=============================================
         REPORTE ACADÉMICO OFICIAL
           Instituto San Martín
=============================================
Alumno: ${studentData.name}
Curso: ${studentData.course} | Nivel: ${studentData.level}
Periodo: ${studentData.period}

ASISTENCIA:
---------------------------------------------
Presentes: ${studentData.attendance.presents}
Ausentes: ${studentData.attendance.absences}
Tardes: ${studentData.attendance.lates}
Tasa de Asistencia: ${studentData.attendance.ratio}

CONDUCTA:
---------------------------------------------
Calificación: ${studentData.behavior}

CALIFICACIONES DEL TRIMESTRE:
---------------------------------------------
${studentData.grades.map(g => `${g.subject.padEnd(25)}: ${g.grade}`).join('\n')}

---------------------------------------------
Emitido de forma oficial mediante la firma digital
del portal de comunicación institucional.
Fecha de Emisión: ${new Date().toLocaleDateString()}
=============================================
`;

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reporte_${studentData.name.replace(' ', '_')}_2T.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Visualización de Boletín Familiar</h1>
          <p className="text-xs text-slate-500">Módulo exclusivo para tutores. Escanea el código QR de boletín que muestra tu hijo para acceder a sus métricas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PARENT CAMERA SCANNER PORT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <span className="text-3xl">📷</span>
            <h3 className="font-bold text-slate-800 text-sm mt-2">Escáner de Boletín para Padres</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mb-4">
              Pídele a tu hijo que muestre su "QR de Boletín" en su teléfono y escanéalo con tu cámara.
            </p>

            {/* Viewfinder simulator */}
            <div className="w-full aspect-square max-w-xs bg-slate-900 rounded-xl relative flex flex-col items-center justify-center overflow-hidden border border-slate-800 mb-4">
              {scanning ? (
                <>
                  <div className="absolute inset-8 border-2 border-emerald-500 border-dashed rounded-lg opacity-75 animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500 animate-bounce"></div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest absolute bottom-4">Escaneando pantalla del hijo...</span>
                </>
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-1.5 p-4">
                  <span className="text-4xl">📴</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Cámara Inactiva</span>
                </div>
              )}
            </div>

            {/* Scan Simulation Buttons */}
            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow ${
                scanning 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-slate-950 cursor-pointer'
              }`}
            >
              {scanning ? '🔍 Escaneando...' : '📷 Iniciar Escáner QR de mi Hijo'}
            </button>
          </div>

          {/* REPORT SHEET SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            
            {scanSuccess && (
              <div className="h-full flex items-center justify-center text-center text-emerald-600 animate-pulse text-xs font-semibold">
                <span>🔄 {scanSuccess}</span>
              </div>
            )}

            {!scanSuccess && showReport ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header summary info */}
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Resumen Académico de {studentData.name}</h4>
                      <p className="text-[10px] text-slate-400">{studentData.course} | {studentData.level}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                      {studentData.period}
                    </span>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Asistencia Total</span>
                      <span className="text-lg font-bold text-slate-800">{studentData.attendance.ratio}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">({studentData.attendance.absences} inasistencias)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Nota de Conducta</span>
                      <span className="text-lg font-bold text-slate-800 text-emerald-600">{studentData.behavior}</span>
                    </div>
                  </div>

                  {/* Grades Grid */}
                  <div className="py-4 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Boletín de Calificaciones</span>
                    <div className="divide-y divide-slate-50 max-h-[160px] overflow-y-auto">
                      {studentData.grades.map((grade, idx) => (
                        <div key={idx} className="py-2 flex justify-between text-xs">
                          <span className="text-slate-600">{grade.subject}</span>
                          <strong className="text-slate-800 font-bold">{grade.grade.toFixed(1)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download PDF CTA */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className={`w-full py-2.5 rounded-lg font-semibold text-xs text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
                    downloading 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {downloading ? '🔄 Descargando PDF Boletín...' : '⬇️ Descargar Boletín Completo (PDF)'}
                </button>
              </div>
            ) : (
              !scanSuccess && (
                // Idle state
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <span className="text-5xl">📄</span>
                  <h4 className="font-bold text-slate-600 text-sm mt-3 font-sans">Esperando Escaneo</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    El boletín y las métricas se revelarán en este panel una vez que escanees el código QR del alumno.
                  </p>
                </div>
              )
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
export default ParentPDFReport;
