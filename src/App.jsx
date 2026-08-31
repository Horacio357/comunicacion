import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import WhatsAppInbox from './components/WhatsAppInbox';
import AdminKnowledgeBase from './components/AdminKnowledgeBase';
import StudentVideoGallery from './components/StudentVideoGallery';
import QRAttendanceTracker from './components/QRAttendanceTracker';
import ParentPDFReport from './components/ParentPDFReport';
import StudentDashboard from './components/StudentDashboard';
import TeacherAttendance from './components/TeacherAttendance';
import ReportCreator from './components/ReportCreator';
import ReportViewer from './components/ReportViewer';
import GlobalAnnouncements from './components/GlobalAnnouncements';

// 1. RootRedirect component to decide home screen based on user role
const RootRedirect = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  if (role === 'ADMIN') return <Navigate to="/admin/faq" replace />;
  if (role === 'DOCENTE') return <Navigate to="/docente/scanner" replace />;
  if (role === 'ESTUDIANTE') return <Navigate to="/estudiante/dashboard" replace />;
  if (role === 'FAMILIA') return <Navigate to="/familia/chats" replace />;

  return <Navigate to="/login" replace />;
};

// 2. ProtectedRoute wrapper to guard views
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 3. Login Page handler to redirect if already logged in
const LoginPage = () => {
  const { session, login, signup, loading, isMockMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Login onLogin={login} onSignup={signup} isMockMode={isMockMode} />;
};

// 4. Main Layout of the app
function MainLayout({ children, announcements, setAnnouncements, unreadCount, setUnreadCount }) {
  const { role, logout, isQAMode, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message);
    }
  };

  const handleSwitchRole = (newRole) => {
    switchRole(newRole);
    if (newRole === 'ADMIN') navigate('/admin/faq');
    else if (newRole === 'DOCENTE') navigate('/docente/scanner');
    else if (newRole === 'ESTUDIANTE') navigate('/estudiante/dashboard');
    else if (newRole === 'FAMILIA') navigate('/familia/chats');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      
      {/* Header Navbar */}
      <header className="bg-slate-950 text-white p-4 shadow-md flex flex-wrap justify-between items-center gap-4 z-40 relative">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏫</span>
          <div>
            <h2 className="font-bold text-sm">Instituto San Martín</h2>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Control de Accesos, Informes y Alertas</span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs (Desktop only) */}
        <div className="hidden md:flex flex-wrap gap-1">
          {role === 'ADMIN' && (
            <>
              <button
                onClick={() => navigate('/admin/faq')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/faq' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                ⚙️ Base IA
              </button>
              <button
                onClick={() => navigate('/admin/multimedia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/multimedia' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Videos Alumnos
              </button>
              <button
                onClick={() => navigate('/admin/scanner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/scanner' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Escáner Alumnos
              </button>
              <button
                onClick={() => navigate('/admin/docentes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/docentes' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                ⏱️ Asistencia Docentes
              </button>
              <button
                onClick={() => navigate('/admin/informes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/informes' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📄 Crear Informes
              </button>
              <button
                onClick={() => navigate('/admin/anuncios')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/admin/anuncios' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📢 Emitir Aviso Masivo
              </button>
            </>
          )}

          {role === 'DOCENTE' && (
            <>
              <button
                onClick={() => navigate('/docente/scanner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/docente/scanner' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Escáner Asistencia
              </button>
              <button
                onClick={() => navigate('/docente/chats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/docente/chats' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                💬 Panel Mensajes
              </button>
              <button
                onClick={() => navigate('/docente/multimedia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/docente/multimedia' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Ver Videos
              </button>
              <button
                onClick={() => navigate('/docente/informes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/docente/informes' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📄 Informes a Alumnos
              </button>
            </>
          )}

          {role === 'ESTUDIANTE' && (
            <>
              <button
                onClick={() => navigate('/estudiante/dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/estudiante/dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                🏫 Mi Panel (QRs)
              </button>
              <button
                onClick={() => navigate('/estudiante/chats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/estudiante/chats' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                💬 Mis Comunicados
              </button>
              <button
                onClick={() => navigate('/estudiante/multimedia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/estudiante/multimedia' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Subir Video Tareas
              </button>
              <button
                onClick={() => navigate('/estudiante/informes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/estudiante/informes' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📄 Mis Informes
              </button>
            </>
          )}

          {role === 'FAMILIA' && (
            <>
              <button
                onClick={() => navigate('/familia/chats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/familia/chats' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                💬 WhatsApp Canales
              </button>
              <button
                onClick={() => navigate('/familia/multimedia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/familia/multimedia' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📷 Proyectos Alumnos
              </button>
              <button
                onClick={() => navigate('/familia/boletin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/familia/boletin' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📄 Escáner Boletín Hijo
              </button>
              <button
                onClick={() => navigate('/familia/informes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/familia/informes' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                📄 Informes Recibidos
              </button>
            </>
          )}
        </div>

        {/* Global Notifications Bell + Profile and Logout */}
        <div className="flex items-center gap-2">
          <GlobalAnnouncements 
            userRole={role} 
            announcements={announcements} 
            setAnnouncements={setAnnouncements} 
            unreadCount={unreadCount} 
            setUnreadCount={setUnreadCount} 
          />

          {isQAMode ? (
            <div className="flex items-center gap-1 bg-slate-900 border border-amber-500 rounded px-2 py-0.5 text-slate-300">
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider hidden sm:inline">QA:</span>
              <select
                value={role}
                onChange={(e) => handleSwitchRole(e.target.value)}
                className="bg-transparent text-white font-bold text-xs cursor-pointer focus:outline-none border-none py-0.5"
              >
                <option value="ADMIN" className="bg-slate-900 text-white">ADMIN</option>
                <option value="DOCENTE" className="bg-slate-900 text-white">DOCENTE</option>
                <option value="ESTUDIANTE" className="bg-slate-900 text-white">ESTUDIANTE</option>
                <option value="FAMILIA" className="bg-slate-900 text-white">FAMILIA</option>
              </select>
            </div>
          ) : (
            <span className="text-xs font-medium bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 max-w-[100px] truncate hidden sm:inline">
              <strong>{role}</strong>
            </span>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Render Component Content */}
      <main className="flex-1 bg-slate-50 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-900 text-white z-50 flex overflow-x-auto scrollbar-none py-2 px-2 gap-1 select-none shadow-lg">
        {role === 'ADMIN' && (
          <>
            <button
              onClick={() => navigate('/admin/faq')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/faq' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">⚙️</span>
              <span>Base IA</span>
            </button>
            <button
              onClick={() => navigate('/admin/multimedia')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/multimedia' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📷</span>
              <span>Videos</span>
            </button>
            <button
              onClick={() => navigate('/admin/scanner')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/scanner' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">🔍</span>
              <span>Escáner</span>
            </button>
            <button
              onClick={() => navigate('/admin/docentes')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/docentes' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">⏱️</span>
              <span>Docentes</span>
            </button>
            <button
              onClick={() => navigate('/admin/informes')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/informes' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📄</span>
              <span>Informes</span>
            </button>
            <button
              onClick={() => navigate('/admin/anuncios')}
              className={`flex flex-col items-center justify-center min-w-[70px] flex-1 py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/admin/anuncios' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📢</span>
              <span>Avisos</span>
            </button>
          </>
        )}
        {role === 'DOCENTE' && (
          <>
            <button
              onClick={() => navigate('/docente/scanner')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/docente/scanner' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📷</span>
              <span>Asistencia</span>
            </button>
            <button
              onClick={() => navigate('/docente/chats')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/docente/chats' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">💬</span>
              <span>Mensajes</span>
            </button>
            <button
              onClick={() => navigate('/docente/multimedia')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/docente/multimedia' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📷</span>
              <span>Videos</span>
            </button>
            <button
              onClick={() => navigate('/docente/informes')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/docente/informes' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📄</span>
              <span>Informes</span>
            </button>
          </>
        )}
        {role === 'ESTUDIANTE' && (
          <>
            <button
              onClick={() => navigate('/estudiante/dashboard')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/estudiante/dashboard' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">🏫</span>
              <span>Mi Panel</span>
            </button>
            <button
              onClick={() => navigate('/estudiante/chats')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/estudiante/chats' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">💬</span>
              <span>Mensajes</span>
            </button>
            <button
              onClick={() => navigate('/estudiante/multimedia')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/estudiante/multimedia' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📷</span>
              <span>Videos</span>
            </button>
            <button
              onClick={() => navigate('/estudiante/informes')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/estudiante/informes' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📄</span>
              <span>Informes</span>
            </button>
          </>
        )}
        {role === 'FAMILIA' && (
          <>
            <button
              onClick={() => navigate('/familia/chats')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/familia/chats' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">💬</span>
              <span>Mensajes</span>
            </button>
            <button
              onClick={() => navigate('/familia/multimedia')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/familia/multimedia' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📷</span>
              <span>Videos</span>
            </button>
            <button
              onClick={() => navigate('/familia/boletin')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/familia/boletin' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📄</span>
              <span>Boletín</span>
            </button>
            <button
              onClick={() => navigate('/familia/informes')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-semibold transition-all ${
                currentPath === '/familia/informes' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className="text-base mb-0.5">📄</span>
              <span>Informes</span>
            </button>
          </>
        )}
      </nav>

      {/* Footer (Desktop only to save mobile viewport height) */}
      <footer className="hidden md:block bg-slate-900 text-slate-500 text-center py-3 text-[10px] border-t border-slate-800">
        Plataforma Escolar Unidireccional © 2026. Todos los derechos reservados.
      </footer>

    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(1);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: '⚠️ Alerta Clima: Clases Virtuales', content: 'Estimadas familias y docentes: Debido al alerta meteorológico por lluvias torrenciales para mañana lunes 24, se suspende la presencialidad y se dictarán clases virtuales.', date: 'Ayer', sender: 'Administración', read: false },
    { id: 2, title: '🗓️ Inscripciones Ciclo 2026', content: 'Recordamos que se encuentra habilitado el periodo de reinscripciones tempranas en la secretaría del instituto.', date: 'Hace 3 días', sender: 'Administración', read: true }
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const layoutProps = {
    announcements,
    setAnnouncements,
    unreadCount,
    setUnreadCount
  };

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root Route - Decides where to redirect based on user role */}
      <Route path="/" element={<RootRedirect />} />

      {/* ADMIN Routes */}
      <Route path="/admin/faq" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}><AdminKnowledgeBase /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/multimedia" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}><StudentVideoGallery /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/scanner" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}>
            <div className="p-4 bg-slate-50">
              <h2 className="text-center font-bold text-slate-700 mb-2">Cámara de Escaneo de Asistencia Escolar</h2>
              <QRAttendanceTracker forceMode="scanner" />
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/docentes" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}><TeacherAttendance /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/informes" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}><ReportCreator userRole="ADMIN" /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/anuncios" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <MainLayout {...layoutProps}>
            <div className="p-6">
              <GlobalAnnouncements 
                userRole="ADMIN_PANEL_INJECTION" 
                announcements={announcements} 
                setAnnouncements={setAnnouncements} 
                unreadCount={unreadCount} 
                setUnreadCount={setUnreadCount} 
              />
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* DOCENTE Routes */}
      <Route path="/docente/scanner" element={
        <ProtectedRoute allowedRoles={['DOCENTE']}>
          <MainLayout {...layoutProps}>
            <div className="p-4 bg-slate-50">
              <h2 className="text-center font-bold text-slate-700 mb-2">Cámara de Escaneo de Asistencia Escolar</h2>
              <QRAttendanceTracker forceMode="scanner" />
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/docente/chats" element={
        <ProtectedRoute allowedRoles={['DOCENTE']}>
          <MainLayout {...layoutProps}>
            <WhatsAppInbox schoolName="Instituto San Martín" primaryColor="#075E54" secondaryColor="#128C7E" />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/docente/multimedia" element={
        <ProtectedRoute allowedRoles={['DOCENTE']}>
          <MainLayout {...layoutProps}><StudentVideoGallery /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/docente/informes" element={
        <ProtectedRoute allowedRoles={['DOCENTE']}>
          <MainLayout {...layoutProps}><ReportCreator userRole="DOCENTE" /></MainLayout>
        </ProtectedRoute>
      } />

      {/* ESTUDIANTE Routes */}
      <Route path="/estudiante/dashboard" element={
        <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
          <MainLayout {...layoutProps}>
            <StudentDashboard 
              onLogout={handleLogout}
              onNavigateToInbox={() => navigate('/estudiante/chats')}
              onNavigateToGallery={() => navigate('/estudiante/multimedia')}
            />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/estudiante/chats" element={
        <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
          <MainLayout {...layoutProps}>
            <WhatsAppInbox schoolName="Instituto San Martín" primaryColor="#075E54" secondaryColor="#128C7E" />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/estudiante/multimedia" element={
        <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
          <MainLayout {...layoutProps}><StudentVideoGallery /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/estudiante/informes" element={
        <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
          <MainLayout {...layoutProps}><ReportViewer userRole="ESTUDIANTE" /></MainLayout>
        </ProtectedRoute>
      } />

      {/* FAMILIA Routes */}
      <Route path="/familia/chats" element={
        <ProtectedRoute allowedRoles={['FAMILIA']}>
          <MainLayout {...layoutProps}>
            <WhatsAppInbox schoolName="Instituto San Martín" primaryColor="#075E54" secondaryColor="#128C7E" />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/familia/multimedia" element={
        <ProtectedRoute allowedRoles={['FAMILIA']}>
          <MainLayout {...layoutProps}><StudentVideoGallery /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/familia/boletin" element={
        <ProtectedRoute allowedRoles={['FAMILIA']}>
          <MainLayout {...layoutProps}><ParentPDFReport /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/familia/informes" element={
        <ProtectedRoute allowedRoles={['FAMILIA']}>
          <MainLayout {...layoutProps}><ReportViewer userRole="FAMILIA" /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
