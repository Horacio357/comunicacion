import React, { useState } from 'react';

export const Login = ({ onLogin, onSignup, isMockMode }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [role, setRole] = useState('FAMILIA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!nombre.trim() || !apellido.trim()) {
          throw new Error('Por favor completa nombre y apellido.');
        }
        await onSignup(email, password, nombre, apellido, role);
        setSuccess('¡Registro completado! Por favor inicia sesión.');
        setIsRegister(false);
        setPassword('');
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        {/* Logo and School Info */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏫</div>
          <h2 className="text-2xl font-bold text-slate-800">Instituto San Martín</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isRegister ? 'Crear una cuenta nueva' : 'Portal de Acceso Escolar'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-lg mb-6">
          <button
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Local Offline Demo Credentials Helper */}
        {!isRegister && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs mb-4 text-slate-700 leading-relaxed shadow-sm">
            <span className="font-bold text-amber-800 block mb-1">🔑 Acceso Rápido QA y Cuentas Demo:</span>
            <ul className="space-y-1 font-mono text-[11px] mb-2">
              <li className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                <strong>Super User QA:</strong> horacitoxp@gmail.com / 1234567
              </li>
            </ul>
            {isMockMode && (
              <>
                <p className="text-[10px] text-slate-500 mb-1 border-t border-amber-200 pt-1.5 font-bold">Otras cuentas de prueba locales:</p>
                <ul className="space-y-1 font-mono text-[11px]">
                  <li><strong>Admin:</strong> admin@escuela.com / admin123</li>
                  <li><strong>Docente:</strong> docente@escuela.com / docente123</li>
                  <li><strong>Estudiante:</strong> estudiante@escuela.com / estudiante123</li>
                  <li><strong>Familia:</strong> familia@escuela.com / familia123</li>
                </ul>
              </>
            )}
          </div>
        )}

        {/* Notification Messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-lg p-3 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-xs mb-4">
            ✅ {success}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Perfil Escolar (Rol)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="FAMILIA">Familia</option>
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="DOCENTE">Personal Docente</option>
                <option value="ADMIN">Administración / Directivo</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl font-bold text-white transition-all ${
              loading 
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer'
            }`}
          >
            {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Entrar al Portal'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-400">
            * Al registrarse con un rol específico, el sistema creará automáticamente su perfil utilizando la base de datos Supabase.
          </p>
        </div>

      </div>
    </div>
  );
};
export default Login;
