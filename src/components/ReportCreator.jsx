import React, { useState } from 'react';

export const ReportCreator = ({ userRole, userId }) => {
  const [targetProfile, setTargetProfile] = useState('ESTUDIANTE'); // 'ESTUDIANTE', 'FAMILIA', 'DOCENTE'
  const [selectedTarget, setSelectedTarget] = useState('');
  const [reportType, setReportType] = useState('ACADEMICO'); // 'ACADEMICO', 'CONDUCTA', 'DESEMPENO_LABORAL', 'ASISTENCIA'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sentReports, setSentReports] = useState([
    { id: 1, creator: 'Administración', target: 'Prof. Lucía Ruiz', type: 'DESEMPENO_LABORAL', title: 'Informe de Desempeño Trimestral', date: 'Hoy' },
    { id: 2, creator: 'Prof. Ana Martínez', target: 'Lucas Pérez (Alumno)', type: 'CONDUCTA', title: 'Felicitación por Participación en Clase', date: 'Ayer' },
    { id: 3, creator: 'Administración', target: 'Familia Pérez Gómez', type: 'ASISTENCIA', title: 'Aviso de Inasistencias Reincidentes', date: '20 Ago' }
  ]);

  const students = [
    { id: 'est-1', name: 'Lucas Pérez', course: '4.º A' },
    { id: 'est-2', name: 'Sofía Gómez', course: '4.º A' },
    { id: 'est-3', name: 'Mateo Díaz', course: '5.º B' }
  ];

  const teachers = [
    { id: 'doc-1', name: 'Prof. Ana Martínez', course: '4.º A' },
    { id: 'doc-2', name: 'Prof. Carlos Gómez', course: '5.º B' },
    { id: 'doc-3', name: 'Prof. Lucía Ruiz', course: 'Sala de 5' }
  ];

  const families = [
    { id: 'fam-1', name: 'Familia Pérez Gómez' },
    { id: 'fam-2', name: 'Familia López Silva' }
  ];

  const handleSendReport = (e) => {
    e.preventDefault();
    if (!selectedTarget || !title.trim() || !content.trim()) return;

    let targetName = '';
    if (targetProfile === 'ESTUDIANTE') targetName = students.find(s => s.id === selectedTarget)?.name + ' (Alumno)';
    else if (targetProfile === 'DOCENTE') targetName = teachers.find(t => t.id === selectedTarget)?.name;
    else targetName = families.find(f => f.id === selectedTarget)?.name;

    const newReport = {
      id: Date.now(),
      creator: userRole === 'ADMIN' ? 'Administración' : 'Prof. Ana Martínez', // Mock creator name
      target: targetName,
      type: reportType,
      title: title,
      date: 'Ahora mismo'
    };

    setSentReports([newReport, ...sentReports]);
    setTitle('');
    setContent('');
    setSelectedTarget('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📄 Generador de Informes Académicos y Administrativos</h1>
          <p className="text-slate-500 text-sm">Crea informes oficiales dirigidos a los diferentes miembros de la comunidad escolar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* REPORT CREATION FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 md:col-span-1">
            <h3 className="font-bold text-slate-800 text-base">Redactar Informe</h3>
            
            <form onSubmit={handleSendReport} className="space-y-3">
              
              {/* Profile Type Selector (Restricted for teachers) */}
              {userRole === 'ADMIN' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Destinatario del Perfil</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => { setTargetProfile('ESTUDIANTE'); setSelectedTarget(''); }}
                      className={`py-1.5 rounded text-[10px] font-bold transition-all ${
                        targetProfile === 'ESTUDIANTE' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Alumnos
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTargetProfile('FAMILIA'); setSelectedTarget(''); }}
                      className={`py-1.5 rounded text-[10px] font-bold transition-all ${
                        targetProfile === 'FAMILIA' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Familias
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTargetProfile('DOCENTE'); setSelectedTarget(''); }}
                      className={`py-1.5 rounded text-[10px] font-bold transition-all ${
                        targetProfile === 'DOCENTE' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Docentes
                    </button>
                  </div>
                </div>
              ) : (
                // Docentes are locked to student reports
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Destinatario del Perfil</label>
                  <span className="block text-xs font-bold bg-slate-100 p-2.5 rounded-lg text-slate-700 border border-slate-200">
                    🎓 Alumno / Estudiante (Restringido)
                  </span>
                </div>
              )}

              {/* Target User Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Seleccionar Destinatario</label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Selecciona destinatario...</option>
                  {targetProfile === 'ESTUDIANTE' && students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                  ))}
                  {targetProfile === 'FAMILIA' && families.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                  {targetProfile === 'DOCENTE' && teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.course})</option>
                  ))}
                </select>
              </div>

              {/* Report Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Informe</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {targetProfile === 'ESTUDIANTE' && (
                    <>
                      <option value="ACADEMICO">Académico</option>
                      <option value="CONDUCTA">Conducta y Disciplina</option>
                    </>
                  )}
                  {targetProfile === 'FAMILIA' && (
                    <>
                      <option value="ASISTENCIA">Avisos de Inasistencias</option>
                      <option value="CONDUCTA">Convivencia Familiar</option>
                    </>
                  )}
                  {targetProfile === 'DOCENTE' && (
                    <>
                      <option value="DESEMPENO_LABORAL">Desempeño Laboral</option>
                      <option value="LICENCIA_MEDICA">Carpeta Médica / Licencia</option>
                    </>
                  )}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título del Informe</label>
                <input
                  type="text"
                  placeholder="Ej: Calificación de Convivencia Escolar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contenido / Cuerpo</label>
                <textarea
                  rows={4}
                  placeholder="Redacta los detalles del informe formal aquí..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow transition-colors cursor-pointer"
              >
                Emitir y Registrar Informe
              </button>
            </form>
          </div>

          {/* LIST OF SENT REPORTS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-3">Historial de Informes Emitidos</h3>
              <div className="divide-y divide-slate-100">
                {sentReports.map(report => (
                  <div key={report.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors px-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{report.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Destinatario: <strong className="text-slate-700 font-semibold">{report.target}</strong> • Creador: {report.creator}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase font-mono">
                        {report.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ReportCreator;
