import React, { useState } from 'react';

export const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([
    { id: 'doc-1', name: 'Prof. Ana Martínez', course: '4.º A', email: 'ana.martinez@colegio.edu.ar', status: 'PRESENTE', motive: '' },
    { id: 'doc-2', name: 'Prof. Carlos Gómez', course: '5.º B', email: 'carlos.gomez@colegio.edu.ar', status: 'PRESENTE', motive: '' },
    { id: 'doc-3', name: 'Prof. Lucía Ruiz', course: 'Sala de 5', email: 'lucia.ruiz@colegio.edu.ar', status: 'AUSENTE_ENFERMEDAD', motive: 'Licencia médica por Gripe (48hs de reposo certificado)' }
  ]);

  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 101, teacherName: 'Prof. Lucía Ruiz', date: '23 Ago', status: 'AUSENTE_ENFERMEDAD', motive: 'Presentó certificado de reposo médico por Gripe.' },
    { id: 102, teacherName: 'Prof. Carlos Gómez', date: '21 Ago', status: 'TARDE', motive: 'Retraso de 20 min por corte de tránsito.' },
    { id: 103, teacherName: 'Prof. Ana Martínez', date: '20 Ago', status: 'AUSENTE_LICENCIA', motive: 'Licencia por examen universitario.' }
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [newStatus, setNewStatus] = useState('PRESENTE');
  const [motiveDetail, setMotiveDetail] = useState('');

  const handleRegisterAttendance = (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const teacher = teachers.find(t => t.id === selectedTeacher);
    if (!teacher) return;

    // Update teacher list status
    setTeachers(prev => prev.map(t => 
      t.id === selectedTeacher ? { ...t, status: newStatus, motive: motiveDetail } : t
    ));

    // Append to logs
    const newLog = {
      id: Date.now(),
      teacherName: teacher.name,
      date: 'Hoy',
      status: newStatus,
      motive: motiveDetail || 'Registrado sin observaciones.'
    };

    setAttendanceLogs([newLog, ...attendanceLogs]);
    setSelectedTeacher('');
    setMotiveDetail('');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PRESENTE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'AUSENTE_ENFERMEDAD': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'AUSENTE_LICENCIA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AUSENTE_PARTICULAR': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'TARDE': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PRESENTE': return 'Presente';
      case 'AUSENTE_ENFERMEDAD': return 'Ausente (Enfermedad)';
      case 'AUSENTE_LICENCIA': return 'Ausente (Licencia)';
      case 'AUSENTE_PARTICULAR': return 'Ausente (Particular)';
      case 'TARDE': return 'Tarde';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">⏱️ Control Laboral y Asistencia Docente</h1>
          <p className="text-slate-500 text-sm">Registro de presentismo diario, carpetas médicas, licencias y retardos del personal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* REGISTER ATTENDANCE FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Registrar Novedad / Asistencia</h3>
            
            <form onSubmit={handleRegisterAttendance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Docente / Personal</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Selecciona Docente...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.course})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estado de Asistencia</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="PRESENTE">Presente</option>
                  <option value="AUSENTE_ENFERMEDAD">Ausente por Enfermedad</option>
                  <option value="AUSENTE_LICENCIA">Ausente por Licencia</option>
                  <option value="AUSENTE_PARTICULAR">Ausente Particular</option>
                  <option value="TARDE">Tarde</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Detalle / Justificación</label>
                <textarea
                  rows={3}
                  placeholder="Detalla el motivo, número de reposo o justificación de inasistencia..."
                  value={motiveDetail}
                  onChange={(e) => setMotiveDetail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow transition-colors cursor-pointer"
              >
                Guardar Novedad de Asistencia
              </button>
            </form>
          </div>

          {/* TEACHERS LIST WITH CURRENT STATE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-3">Plantel de Docentes - Estado de Hoy</h3>
              <div className="divide-y divide-slate-100">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{teacher.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{teacher.course} • {teacher.email}</p>
                      {teacher.motive && (
                        <p className="text-[10px] text-slate-600 bg-slate-100 p-2 rounded-lg mt-1.5 border border-slate-200 italic">
                          ℹ️ {teacher.motive}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusLabel(teacher.status)}`}>
                      {getStatusText(teacher.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* AUDITING LOGS OF PERSONAL */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Historial General de Inasistencias y Licencias</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {attendanceLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm shadow-inner">
                    📋
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs">{log.teacherName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Fecha: {log.date} • Motivo: <strong className="text-slate-600 font-normal">{log.motive}</strong></p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusLabel(log.status)}`}>
                  {getStatusText(log.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default TeacherAttendance;
