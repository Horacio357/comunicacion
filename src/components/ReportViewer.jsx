import React, { useState } from 'react';

export const ReportViewer = ({ userRole }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const mockReports = [
    {
      id: 'rep-1',
      title: 'Felicitación por Participación en Clase',
      creator: 'Prof. Ana Martínez',
      type: 'CONDUCTA',
      date: 'Ayer a las 15:40 hs',
      content: `Estimado alumno y familia:
Queremos hacerles llegar nuestras más sinceras felicitaciones por el desempeño y la excelente participación de Lucas en la última feria escolar de ciencias. 
Se ha destacado por su creatividad en el proyecto del volcán y por cooperar activamente con sus compañeros de equipo.
Siga adelante con ese mismo entusiasmo.
Atentamente,
Cuerpo Docente de 4.° A`
    },
    {
      id: 'rep-2',
      title: 'Informe Académico de Ciencias Naturales',
      creator: 'Coordinación Pedagógica',
      type: 'ACADEMICO',
      date: '20 Ago',
      content: `Estimados padres:
Les informamos que se encuentra cargado el resumen detallado de calificaciones parciales para el área de Ciencias Naturales. Lucas ha completado satisfactoriamente los objetivos de la unidad número 2 ("Estructura terrestre").
Para coordinar tutorías de apoyo de cara a la evaluación trimestral, pueden solicitar turno con secretaría académica.
Saludos institucionales.`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">📄 Mis Informes Recibidos</h1>
          <p className="text-xs text-slate-500">Consulta los informes académicos o disciplinarios oficiales emitidos por el colegio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* REPORTS LISTING */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 h-[400px] overflow-y-auto">
            <h3 className="font-bold text-slate-700 text-xs pb-3 uppercase tracking-wider">Historial de Reportes</h3>
            {mockReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-3 rounded-lg transition-all mt-2 ${
                  selectedReport?.id === report.id ? 'bg-slate-100 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                    {report.type}
                  </span>
                  <span className="text-[10px] text-slate-400">{report.date}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs truncate">{report.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1 truncate">Emisor: {report.creator}</p>
              </button>
            ))}
          </div>

          {/* REPORT VIEW DETAILS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 flex flex-col justify-between h-[400px]">
            {selectedReport ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  {/* Header */}
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{selectedReport.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Emitido por: {selectedReport.creator} el {selectedReport.date}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="py-4 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-[220px] overflow-y-auto">
                    {selectedReport.content}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 italic flex justify-between items-center">
                  <span>Documento oficial de firma institucional digital</span>
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold">Descargar Copia PDF ➔</button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <span className="text-5xl">📄</span>
                <h4 className="font-bold text-slate-600 text-sm mt-3">Selecciona un informe</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                  Haz clic en cualquiera de los reportes del panel izquierdo para leer su contenido detallado.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
export default ReportViewer;
