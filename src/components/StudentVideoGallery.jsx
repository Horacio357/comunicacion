import React, { useState, useRef } from 'react';

export const StudentVideoGallery = () => {
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [videos, setVideos] = useState([
    { id: 1, studentName: 'Lucas Pérez', course: '4.º A', title: 'Feria de Ciencias: Volcán', duration: 15, url: 'https://assets.mixkit.co/videos/preview/mixkit-kids-playing-with-toy-cars-on-a-table-41716-large.mp4', date: 'Hoy' },
    { id: 2, studentName: 'Sofía Gómez', course: '4.º A', title: 'Lectura en Voz Alta - Poema', duration: 18, url: 'https://assets.mixkit.co/videos/preview/mixkit-little-girl-writing-on-a-notebook-at-home-41712-large.mp4', date: 'Ayer' },
    { id: 3, studentName: 'Mateo Díaz', course: '5.º B', title: 'Proyecto de Robótica Básica', duration: 12, url: 'https://assets.mixkit.co/videos/preview/mixkit-boy-with-vr-glasses-playing-a-game-41708-large.mp4', date: '21 Ago' }
  ]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const courses = ['Todos', '4.º A', '5.º B'];

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setErrorMessage('');
    
    // Bulk or individual processing
    files.forEach(file => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = Math.round(videoElement.duration);

        if (duration > 20) {
          setErrorMessage(`El video "${file.name}" supera el límite permitido de 20 segundos (Duración: ${duration}s).`);
          return;
        }

        // Mock upload processing
        setUploading(true);
        setTimeout(() => {
          const newVideo = {
            id: Date.now() + Math.random(),
            studentName: 'Alumno Demo',
            course: filterCourse === 'Todos' ? '4.º A' : filterCourse,
            title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
            duration: duration,
            url: 'https://assets.mixkit.co/videos/preview/mixkit-kids-playing-with-toy-cars-on-a-table-41716-large.mp4', // Placeholder mock video
            date: 'Ahora mismo'
          };
          setVideos(prev => [newVideo, ...prev]);
          setUploading(false);
        }, 1500);
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  const filteredVideos = filterCourse === 'Todos' 
    ? videos 
    : videos.filter(v => v.course === filterCourse);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">📷 Perfil Multimedia Escolar</h1>
            <p className="text-slate-500 text-sm">Visualización y control de proyectos en video subidos por los estudiantes (límite 20s).</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="file" 
              accept="video/*" 
              multiple 
              ref={fileInputRef} 
              onChange={handleVideoUpload} 
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-colors"
            >
              📤 Subir Video / Carga Masiva
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Filtrar por Curso:</span>
            <div className="flex gap-1">
              {courses.map(course => (
                <button
                  key={course}
                  onClick={() => setFilterCourse(course)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCourse === course 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{filteredVideos.length} videos expuestos</span>
        </div>

        {/* Upload status or Errors */}
        {uploading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm animate-pulse flex items-center gap-2">
            <span>🔄 Procesando y validando metadatos de los videos en segundo plano...</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️ <strong>Error de carga:</strong> {errorMessage}</span>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
              
              {/* Video Player */}
              <div className="relative bg-black aspect-video flex items-center justify-center">
                <video 
                  src={vid.url} 
                  controls 
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  0:{vid.duration < 10 ? `0${vid.duration}` : vid.duration}
                </span>
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {vid.course}
                </span>
              </div>

              {/* Description Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{vid.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Sometido por: <strong>{vid.studentName}</strong></p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Subido: {vid.date}</span>
                  <span className="text-emerald-600 font-medium">Validado ✓ (Menor a 20s)</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default StudentVideoGallery;
