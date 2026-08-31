import React, { useState } from 'react';

export const ProfileSelector = ({ onSelectProfile }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const profiles = [
    {
      id: 'FAMILIA',
      title: 'Familia',
      description: 'Accede a la bandeja de comunicados de tus hijos, autorizaciones y chatea con el Asistente IA.',
      icon: '👨‍👩‍👧‍👦',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
    },
    {
      id: 'ESTUDIANTE',
      title: 'Estudiante',
      description: 'Consulta tus tareas, notificaciones escolares y novedades de tu curso.',
      icon: '🎓',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      id: 'DOCENTE',
      title: 'Personal Docente',
      description: 'Envía comunicaciones a tus listas autorizadas, adjunta archivos y revisa tu historial.',
      icon: '📝',
      bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200'
    },
    {
      id: 'ADMIN',
      title: 'Administración / Directivo',
      description: 'Gestiona la estructura del colegio, familias, permisos e historial general.',
      icon: '⚙️',
      bgColor: 'bg-slate-50 hover:bg-slate-100 border-slate-200'
    }
  ];

  const handleProceed = () => {
    if (selectedRole) {
      onSelectProfile(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏫</div>
          <h2 className="text-2xl font-bold text-slate-800">Portal Escolar</h2>
          <p className="text-slate-500 text-sm mt-1">
            Por favor, selecciona tu perfil para ingresar a la plataforma
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="space-y-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedRole(profile.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                selectedRole === profile.id
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 ring-opacity-20'
                  : 'border-transparent ' + profile.bgColor
              }`}
            >
              <span className="text-3xl">{profile.icon}</span>
              <div>
                <h4 className="font-semibold text-slate-800">{profile.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{profile.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          disabled={!selectedRole}
          onClick={handleProceed}
          className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition-all ${
            selectedRole
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Continuar como {selectedRole ? profiles.find(p => p.id === selectedRole).title : ''}
        </button>

      </div>
    </div>
  );
};
export default ProfileSelector;
