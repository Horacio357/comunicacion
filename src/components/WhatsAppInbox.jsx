import React, { useState } from 'react';

export const WhatsAppInbox = ({ schoolName, primaryColor, secondaryColor }) => {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'bot'
  const [selectedChat, setSelectedChat] = useState(null);
  const [botMessages, setBotMessages] = useState([
    { id: 1, sender: 'bot', text: '¡Hola! Soy el Asistente IA del colegio. Puedo responder tus preguntas frecuentes sobre fechas de exámenes, cuotas, horarios y reglamentos. ¿En qué te ayudo hoy?', time: '12:00' }
  ]);
  const [botInput, setBotInput] = useState('');

  // Apply custom CSS variables for theme customization
  const customStyles = {
    '--color-primary': primaryColor || '#075E54', // WhatsApp Green default
    '--color-secondary': secondaryColor || '#128C7E',
  };

  const mockCommunications = [
    {
      id: 'comm-1',
      senderName: 'Prof. Ana Martínez (4.º A)',
      category: 'PEDAGOGICA',
      title: 'Actividades de Matemática - Fracciones',
      text: 'Estimadas familias: Compartimos la guía de ejercicios de fracciones que los alumnos deberán resolver durante esta semana. Queda atenta a cualquier consulta por cuaderno de comunicados físico.',
      time: '08:30',
      date: 'Hoy',
      read: true,
      attachments: [{ type: 'PDF', name: 'Matematica_Fracciones_4A.pdf', size: '1.2 MB' }]
    },
    {
      id: 'comm-2',
      senderName: 'Dirección Primaria',
      category: 'IMPORTANTE',
      title: 'Cambio de horario - Acto del 25 de Mayo',
      text: 'Familias: Les recordamos que debido a cuestiones climáticas, el acto escolar se traslada a las 10:30 hs en el SUM institucional. Los alumnos deben ingresar con uniforme oficial de gala.',
      time: 'Ayer',
      date: 'Ayer',
      read: true,
      attachments: []
    },
    {
      id: 'comm-3',
      senderName: 'Coordinación Social',
      category: 'SOCIAL_ACTIVIDADES',
      title: 'Kermesse Familiar de Primavera',
      text: '¡Se viene nuestra kermesse anual! Los esperamos este sábado desde las 12:00 hs para compartir juegos, sorteos y buffet. Todo lo recaudado será destinado a los proyectos solidarios de 5.º año.',
      time: '20 Ago',
      date: '20 de Agosto',
      read: false,
      attachments: [{ type: 'IMAGE', name: 'banner_kermesse.jpg', size: '2.4 MB' }]
    }
  ];

  const handleSendBotMessage = (forcedQuery) => {
    const queryText = typeof forcedQuery === 'string' ? forcedQuery : botInput;
    if (!queryText.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: queryText, time: 'Ahora' };
    setBotMessages(prev => [...prev, userMsg]);
    if (typeof forcedQuery !== 'string') setBotInput('');

    // Simulate AI response response
    setTimeout(() => {
      let botResponse = 'Disculpa, solo puedo responder consultas sobre el reglamento escolar, cuotas y calendarios institucionales cargados por Administración.';
      
      const query = queryText.toLowerCase();
      if (query.includes('cuota') || query.includes('arancel') || query.includes('pagar')) {
        botResponse = 'La cuota escolar vence los primeros 10 días de cada mes. Puedes abonar mediante transferencia bancaria o en el portal de pagos institucional con tarjeta de crédito/débito.';
      } else if (query.includes('examen') || query.includes('prueba') || query.includes('fecha')) {
        botResponse = 'El calendario oficial de exámenes de este trimestre se encuentra disponible en la cartelera digital. Los exámenes de Primaria inician el lunes 7 de Septiembre.';
      } else if (query.includes('uniforme') || query.includes('vestir') || query.includes('ropa')) {
        botResponse = 'El uniforme oficial consta de chomba blanca escolar, pantalón/pollera gris y abrigo azul marino. Los días de Educación Física se permite gimnasia gris y zapatillas blancas.';
      }

      setBotMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: 'Ahora'
      }]);
    }, 1000);
  };

  return (
    <div style={customStyles} className="h-[calc(100vh-112px)] md:h-[88vh] bg-slate-100 flex justify-center items-center p-0 md:p-6 font-sans w-full">
      <div className="w-full max-w-6xl h-full bg-white rounded-none md:rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200">
        
        {/* Left Sidebar (Chats & Bot Selectors) */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-white ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header */}
          <div className="p-4 bg-[var(--color-primary)] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 font-bold shadow-inner">
                {schoolName ? schoolName.charAt(0) : 'E'}
              </div>
              <div>
                <h3 className="font-bold text-sm truncate w-40">{schoolName || 'Mi Colegio'}</h3>
                <span className="text-xs opacity-75">Bandeja Oficial</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Simulated WhatsApp chats filter) */}
          <div className="flex bg-slate-50 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('chats')} 
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
                activeTab === 'chats' 
                  ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              💬 Comunicados
            </button>
            <button 
              onClick={() => setActiveTab('bot')} 
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
                activeTab === 'bot' 
                  ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🤖 Consulta IA (FAQ)
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chats' ? (
              <div className="divide-y divide-slate-100">
                {mockCommunications.map((comm) => (
                  <button
                    key={comm.id}
                    onClick={() => setSelectedChat(comm)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors hover:bg-slate-50 ${
                      selectedChat?.id === comm.id ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-lg shadow-inner">
                      📢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-slate-800 text-sm truncate">{comm.senderName}</h4>
                        <span className="text-xs text-slate-400">{comm.time}</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--color-secondary)] mb-0.5">{comm.title}</p>
                      <p className="text-xs text-slate-500 truncate">{comm.text}</p>
                      {comm.attachments.length > 0 && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                          📎 {comm.attachments[0].name}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // AI Assistant Tab
              <button
                onClick={() => setSelectedChat({ id: 'bot-chat', type: 'bot' })}
                className="w-full p-4 text-left flex items-center gap-3 transition-colors bg-slate-100"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm">Asistente Virtual IA</h4>
                  <p className="text-xs text-emerald-600">En línea • Pregúntame sobre el colegio</p>
                </div>
              </button>
            )}
          </div>

        </div>

        {/* Right Chat View (Bandeja / Conversación Bot) */}
        <div className={`flex-1 flex-col bg-[#efeae2] ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
          {selectedChat ? (
            selectedChat.type === 'bot' || selectedChat.id === 'bot-chat' ? (
              // AI BOT INTERACTION INTERFACE
              <div className="h-full flex flex-col bg-[#efeae2]">
                {/* Bot Header */}
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center gap-3 shadow-sm">
                  <button 
                    onClick={() => setSelectedChat(null)} 
                    className="md:hidden text-slate-600 hover:text-slate-900 font-bold text-lg mr-1 p-1 rounded-full hover:bg-slate-200 w-8 h-8 flex items-center justify-center"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Asistente Institucional IA</h4>
                    <span className="text-xs text-emerald-600 font-semibold font-bold">En línea</span>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {botMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-lg shadow-sm text-sm relative ${
                          msg.sender === 'user'
                            ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[10px] text-slate-400 float-right mt-1 ml-4">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sugerencias de Preguntas Frecuentes */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSendBotMessage('¿Cuándo vence la cuota escolar?')}
                    className="bg-white hover:bg-slate-100 border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-600 transition-colors shadow-sm cursor-pointer"
                  >
                    💳 ¿Cuándo vence la cuota?
                  </button>
                  <button
                    onClick={() => handleSendBotMessage('¿Cuáles son las fechas de examen?')}
                    className="bg-white hover:bg-slate-100 border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-600 transition-colors shadow-sm cursor-pointer"
                  >
                    🗓️ Fechas de exámenes
                  </button>
                  <button
                    onClick={() => handleSendBotMessage('¿Cómo es el reglamento del uniforme?')}
                    className="bg-white hover:bg-slate-100 border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-600 transition-colors shadow-sm cursor-pointer"
                  >
                    👕 Uniforme oficial
                  </button>
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escribe tu duda aquí..."
                    value={botInput}
                    onChange={(e) => setBotInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                    className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
                  />
                  <button
                    onClick={handleSendBotMessage}
                    className="w-10 h-10 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white flex items-center justify-center shadow transition-colors"
                  >
                    ➔
                  </button>
                </div>
              </div>
            ) : (
              // OFFICIAL UNIDIRECTIONAL COMMUNICATION VIEW
              <div className="h-full flex flex-col bg-[#efeae2]">
                
                {/* Communication Header */}
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedChat(null)} 
                      className="md:hidden text-slate-600 hover:text-slate-900 font-bold text-lg mr-1 p-1 rounded-full hover:bg-slate-200 w-8 h-8 flex items-center justify-center"
                    >
                      ←
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-lg">
                      📢
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[150px] sm:max-w-xs">{selectedChat.senderName}</h4>
                      <span className="text-[10px] text-slate-400 block">{selectedChat.date} a las {selectedChat.time} hs</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-200 text-slate-600 truncate max-w-[90px] sm:max-w-none">
                    {selectedChat.category}
                  </span>
                </div>

                {/* Message Detail Feed (WhatsApp Unidirectional look) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  
                  {/* Centralized Chat Bubble */}
                  <div className="flex justify-center">
                    <div className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-md border border-slate-200 relative">
                      
                      {/* School Brand Accent Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--color-secondary)] rounded-t-xl"></div>
                      
                      <h3 className="font-bold text-slate-800 text-base mb-3 mt-1 text-[var(--color-secondary)]">
                        {selectedChat.title}
                      </h3>
                      
                      <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                        {selectedChat.text}
                      </p>

                      {/* Attachments Section */}
                      {selectedChat.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                          <h5 className="text-xs font-semibold text-slate-500">Archivos adjuntos:</h5>
                          {selectedChat.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">📄</span>
                                <div>
                                  <p className="text-xs font-medium text-slate-800 truncate w-60">{file.name}</p>
                                  <span className="text-[10px] text-slate-400">{file.size}</span>
                                </div>
                              </div>
                              <button className="text-xs bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-semibold px-3 py-1.5 rounded-md shadow-sm transition-colors">
                                Abrir
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Status indicator (Unidirectional, no answers) */}
                      <div className="mt-6 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-3">
                        <span className="italic">Canal Oficial Escolar - Respuestas deshabilitadas</span>
                        <div className="flex items-center gap-1 font-medium text-emerald-600">
                          <span>Recibido y Leído</span>
                          <span>✓✓</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )
          ) : (
            // Idle View (Select a chat)
            <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-lg font-bold text-slate-700">Bienvenido a la Bandeja Escolar</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
                Selecciona un comunicado oficial de la lista o utiliza el asistente IA para resolver dudas frecuentes.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default WhatsAppInbox;
