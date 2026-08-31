import React, { useState } from 'react';

export const AdminKnowledgeBase = () => {
  const [faqs, setFaqs] = useState([
    { id: 1, title: 'Métodos de pago y aranceles', category: 'Administración', lastUpdated: 'Hace 2 días', wordCount: 154 },
    { id: 2, title: 'Fechas de Exámenes Trimestrales 2026', category: 'Pedagógico', lastUpdated: 'Hace 5 días', wordCount: 320 },
    { id: 3, title: 'Reglamento de Vestimenta Escolar', category: 'Convivencia', lastUpdated: 'Hace 1 semana', wordCount: 210 }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Administración');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock interaction metrics
  const stats = {
    totalInteractions: 1450,
    botAccuracyRate: '94%',
    unresolvedQuestions: 12,
    readStats: {
      totalSent: 1540,
      totalRead: 1312,
      pendingRead: 228,
      readRatio: 85 // 85%
    }
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newFaq = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      lastUpdated: 'Ahora mismo',
      wordCount: newContent.split(' ').length
    };

    setFaqs([newFaq, ...faqs]);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
            <p className="text-slate-500 text-sm">Gestiona la base de conocimiento de la IA y visualiza las métricas de lectura.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors text-sm"
          >
            {showAddForm ? 'Cancelar' : '➕ Alimentar IA (Nuevo Conocimiento)'}
          </button>
        </div>

        {/* METRICS DASHBOARD ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasa de Apertura</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-emerald-600">{stats.readStats.readRatio}%</span>
              <span className="text-xs text-slate-500">promedio</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {stats.readStats.totalRead} de {stats.readStats.totalSent} familias leyeron los últimos comunicados.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Interacciones con Bot</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-slate-800">{stats.totalInteractions}</span>
              <span className="text-xs text-emerald-600 font-semibold">↑ 12% este mes</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Preguntas respondidas por el asistente virtual.</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Efectividad de IA</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-blue-600">{stats.botAccuracyRate}</span>
              <span className="text-xs text-slate-500">de acierto</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Resolución directa sin derivar a secretaría física.</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Preguntas sin Resolver</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-amber-600">{stats.unresolvedQuestions}</span>
              <span className="text-xs text-slate-500">pendientes</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Dudas fuera de contexto que requieren actualización.</p>
          </div>

        </div>

        {/* INPUT FORM */}
        {showAddForm && (
          <form onSubmit={handleAddFaq} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Alimentar Base de Conocimiento IA</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título del Tema</label>
                <input
                  type="text"
                  placeholder="Ej: Fechas de inscripción 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Administración">Administración & Pagos</option>
                  <option value="Pedagógico">Pedagógico & Exámenes</option>
                  <option value="Convivencia">Reglamentos & Convivencia</option>
                  <option value="Eventos">Eventos & Calendario</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Información Detallada (Alimento IA)</label>
              <textarea
                rows={5}
                placeholder="Escribe aquí toda la información reglamentaria. La IA utilizará este texto exacto como contexto para responder a las familias."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow transition-colors"
              >
                Vectorizar y Guardar
              </button>
            </div>
          </form>
        )}

        {/* FAQ KNOWLEDGE LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Contenido Vectorizado (Base de Conocimiento)</h3>
            <span className="text-xs text-slate-500 font-semibold">{faqs.length} Artículos Activos</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    📄
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{faq.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Categoría: <strong className="text-slate-600">{faq.category}</strong></span>
                      <span>•</span>
                      <span>Actualizado: {faq.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                    {faq.wordCount} tokens / palabras
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1 text-sm">
                    ✏️
                  </button>
                  <button className="text-red-400 hover:text-red-600 p-1 text-sm">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminKnowledgeBase;
