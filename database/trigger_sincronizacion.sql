-- SCRIPT SQL PARA VINCULAR AUTH.USERS CON PUBLIC.USUARIOS EN SUPABASE
-- Ejecutar este script en el editor SQL de Supabase (SQL Editor)

-- 1. Crear función disparadora (trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, apellido, rol_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Nuevo'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Usuario'),
    COALESCE((NEW.raw_user_meta_data->>'rol_id')::int, 5) -- Por defecto: FAMILIA (rol_id: 5 en la tabla roles)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear el disparador (trigger) que se ejecuta al registrarse
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
