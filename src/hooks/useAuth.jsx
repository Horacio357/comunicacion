import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const ROLE_IDS = {
  'ADMIN': 1,
  'DIRECTOR': 2,
  'COORDINADOR': 3,
  'DOCENTE': 4,
  'FAMILIA': 5,
  'ESTUDIANTE': 6
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isMockMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('tu-proyecto-id');

const DEFAULT_MOCK_USERS = [
  { email: 'horacitoxp@gmail.com', password: '1234567', nombre: 'Horacio', apellido: 'QA', rol: 'ADMIN', isQA: true },
  { email: 'admin@escuela.com', password: 'admin123', nombre: 'Admin', apellido: 'San Martín', rol: 'ADMIN' },
  { email: 'docente@escuela.com', password: 'docente123', nombre: 'Ana', apellido: 'Martínez', rol: 'DOCENTE' },
  { email: 'estudiante@escuela.com', password: 'estudiante123', nombre: 'Lucas', apellido: 'Pérez', rol: 'ESTUDIANTE' },
  { email: 'familia@escuela.com', password: 'familia123', nombre: 'Familia', apellido: 'Pérez Gómez', rol: 'FAMILIA' }
];

const getMockUsers = () => {
  const stored = localStorage.getItem('mock_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_MOCK_USERS;
    }
  }
  localStorage.setItem('mock_users', JSON.stringify(DEFAULT_MOCK_USERS));
  return DEFAULT_MOCK_USERS;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    if (isMockMode) return null;
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          nombre,
          apellido,
          activo,
          rol_id,
          roles (
            nombre
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error cargando el perfil del usuario:', err.message);
      return null;
    }
  };

  useEffect(() => {
    const storedSession = localStorage.getItem('mock_session');
    if (storedSession) {
      try {
        const sess = JSON.parse(storedSession);
        if (sess.profile?.isQA || isMockMode) {
          setSession(sess);
          setUser(sess.user);
          setProfile(sess.profile);
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem('mock_session');
      }
    }

    if (isMockMode) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentStored = localStorage.getItem('mock_session');
      if (currentStored) {
        try {
          const sess = JSON.parse(currentStored);
          if (sess.profile?.isQA) return;
        } catch(e) {}
      }

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    if (email.toLowerCase() === 'horacitoxp@gmail.com' && password === '1234567') {
      const mockUserObj = { id: 'mock-id-qa', email: 'horacitoxp@gmail.com' };
      const mockProfileObj = {
        id: mockUserObj.id,
        nombre: 'Horacio',
        apellido: 'QA',
        activo: true,
        rol_id: 1,
        roles: { nombre: 'ADMIN' },
        isQA: true
      };

      const mockSessObj = {
        user: mockUserObj,
        profile: mockProfileObj
      };

      localStorage.setItem('mock_session', JSON.stringify(mockSessObj));
      setSession(mockSessObj);
      setUser(mockUserObj);
      setProfile(mockProfileObj);
      setLoading(false);
      return mockSessObj;
    }

    if (isMockMode) {
      const users = getMockUsers();
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!match) {
        setLoading(false);
        throw new Error('Credenciales inválidas. Revisa las cuentas de prueba o regístrate.');
      }

      const mockUserObj = { id: `mock-id-${match.email}`, email: match.email };
      const mockProfileObj = {
        id: mockUserObj.id,
        nombre: match.nombre,
        apellido: match.apellido,
        activo: true,
        rol_id: ROLE_IDS[match.rol],
        roles: { nombre: match.rol },
        isQA: match.isQA || false
      };

      const mockSessObj = {
        user: mockUserObj,
        profile: mockProfileObj
      };

      localStorage.setItem('mock_session', JSON.stringify(mockSessObj));
      setSession(mockSessObj);
      setUser(mockUserObj);
      setProfile(mockProfileObj);
      setLoading(false);
      return mockSessObj;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  const signup = async (email, password, nombre, apellido, roleName) => {
    setLoading(true);
    if (isMockMode) {
      const users = getMockUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        throw new Error('El correo electrónico ya está registrado.');
      }

      const newUser = {
        email: email,
        password: password,
        nombre: nombre,
        apellido: apellido,
        rol: roleName
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
      setLoading(false);
      return newUser;
    }

    const roleId = ROLE_IDS[roleName] || 5;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          rol_id: roleId
        }
      }
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('mock_session');
    setProfile(null);
    setSession(null);
    setUser(null);

    if (!isMockMode) {
      try {
        await supabase.auth.signOut();
      } catch(e) {}
    }
    setLoading(false);
  };

  const switchRole = (newRole) => {
    if (!profile) return;
    const updatedProfile = {
      ...profile,
      rol_id: ROLE_IDS[newRole] || 5,
      roles: { nombre: newRole }
    };
    setProfile(updatedProfile);

    if (session) {
      const updatedSess = {
        ...session,
        profile: updatedProfile
      };
      localStorage.setItem('mock_session', JSON.stringify(updatedSess));
      setSession(updatedSess);
    }
  };

  const roleName = profile?.roles?.nombre || null;
  const isQAMode = profile?.isQA || user?.email === 'horacitoxp@gmail.com' || false;

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      role: roleName,
      loading,
      login,
      signup,
      logout,
      switchRole,
      isMockMode,
      isQAMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
export default useAuth;
