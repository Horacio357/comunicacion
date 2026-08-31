-- APP DE COMUNICACIÓN INSTITUCIONAL - SCHEMA DE BASE DE DATOS (PostgreSQL / Supabase)

-- 1. EXTENSIONES
-- Habilitar extensión para embeddings vectoriales de IA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. TABLAS ESTRUCTURALES Y CONFIGURACIÓN
CREATE TABLE instituciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    color_primario VARCHAR(7) DEFAULT '#075E54', -- Verde WhatsApp por defecto
    color_secundario VARCHAR(7) DEFAULT '#128C7E',
    logo_url TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- 'ADMIN', 'DIRECTOR', 'COORDINADOR', 'DOCENTE', 'FAMILIA', 'ESTUDIANTE'
    descripcion TEXT
);

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Control total de la configuración institucional, usuarios, familias y permisos.'),
('DIRECTOR', 'Acceso institucional completo a comunicaciones y consultas del historial.'),
('COORDINADOR', 'Acceso a niveles asignados y envío de comunicaciones autorizadas.'),
('DOCENTE', 'Visualización de listas autorizadas, creación de envíos y consulta de historial propio.'),
('FAMILIA', 'Bandeja de entrada unidireccional y acceso al Chatbot de consulta de FAQ.'),
('ESTUDIANTE', 'Bandeja de entrada unidireccional propia según su curso.');

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Enlazado con auth.users en Supabase
    email VARCHAR(150) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id),
    institucion_id UUID REFERENCES instituciones(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT TRUE, -- Permite la baja inmediata y bloqueo de accesos
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ESTRUCTURA ACADÉMICA
CREATE TABLE niveles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL, -- e.g., 'Inicial', 'Primaria', 'Secundaria'
    institucion_id UUID NOT NULL REFERENCES instituciones(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL, -- e.g., '4.º Grado', 'Sala de 5', '2.º Año'
    nivel_id UUID NOT NULL REFERENCES niveles(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE secciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) NOT NULL, -- e.g., 'Sección A', 'Sección B', 'Turno Mañana'
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FAMILIAS Y ESTUDIANTES
CREATE TABLE familias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_referencia VARCHAR(150) NOT NULL, -- e.g., 'Familia Pérez Gómez'
    institucion_id UUID NOT NULL REFERENCES instituciones(id) ON DELETE CASCADE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
    seccion_id UUID NOT NULL REFERENCES secciones(id) ON DELETE RESTRICT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla intermedia para asociar cuentas de usuario a una unidad familiar
CREATE TABLE miembros_familia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
    relacion VARCHAR(50) NOT NULL, -- e.g., 'Madre', 'Padre', 'Tutor', 'Estudiante'
    UNIQUE(usuario_id, familia_id)
);

-- 5. LISTAS DE DESTINATARIOS DINÁMICAS
CREATE TABLE listas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL, -- e.g., '4.º A – Primaria', 'Toda Primaria'
    institucion_id UUID NOT NULL REFERENCES instituciones(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'INSTITUCIONAL', 'NIVEL', 'CURSO', 'SECCION'
    nivel_id UUID REFERENCES niveles(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    seccion_id UUID REFERENCES secciones(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_tipo CHECK (tipo IN ('INSTITUCIONAL', 'NIVEL', 'CURSO', 'SECCION'))
);

-- Permisos de envío para Docentes/Coordinadores
CREATE TABLE docente_listas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    lista_id UUID NOT NULL REFERENCES listas(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, lista_id)
);

-- 6. COMUNICACIONES Y TRAZABILIDAD
CREATE TABLE comunicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emisor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    lista_destinatario_id UUID NOT NULL REFERENCES listas(id) ON DELETE RESTRICT,
    categoria VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL,
    cantidad_destinatarios INT NOT NULL DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_categoria CHECK (categoria IN ('PEDAGOGICA', 'ORGANIZATIVA', 'INSTITUCIONAL', 'IMPORTANTE', 'SOCIAL_ACTIVIDADES'))
);

CREATE TABLE adjuntos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunicacion_id UUID NOT NULL REFERENCES comunicaciones(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- 'FOTO', 'VIDEO', 'PDF', 'LINK'
    url TEXT NOT NULL,
    nombre_archivo VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_tipo_adjunto CHECK (tipo IN ('FOTO', 'VIDEO', 'PDF', 'LINK'))
);

-- Tracking de recepción y lectura
CREATE TABLE registro_envios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunicacion_id UUID NOT NULL REFERENCES comunicaciones(id) ON DELETE CASCADE,
    familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    UNIQUE(comunicacion_id, familia_id)
);

-- 7. BASE DE CONOCIMIENTO IA (RAG)
CREATE TABLE conocimiento_bot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institucion_id UUID NOT NULL REFERENCES instituciones(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    embedding VECTOR(768), -- Cambiar a 1536 si se usa OpenAI embeddings (Gemini utiliza 768 por defecto)
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE historial_chatbot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TRIGGERS PARA AUTO-ACTUALIZACIÓN DE TIMESTAMPS
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_actualizar_instituciones BEFORE UPDATE ON instituciones FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER tr_actualizar_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER tr_actualizar_familias BEFORE UPDATE ON familias FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER tr_actualizar_estudiantes BEFORE UPDATE ON estudiantes FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER tr_actualizar_conocimiento_bot BEFORE UPDATE ON conocimiento_bot FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();


-- 9. FUNCIÓN DE RESOLUCIÓN DINÁMICA DE FAMILIAS SEGÚN LA LISTA
-- Resuelve las familias asociadas a una lista en el momento del envío
CREATE OR REPLACE FUNCTION obtener_familias_de_lista(p_lista_id UUID)
RETURNS TABLE (familia_id UUID) AS $$
DECLARE
    v_tipo VARCHAR(50);
    v_nivel_id UUID;
    v_curso_id UUID;
    v_seccion_id UUID;
    v_inst_id UUID;
BEGIN
    -- Obtener la configuración de la lista
    SELECT tipo, nivel_id, curso_id, seccion_id, institucion_id
    INTO v_tipo, v_nivel_id, v_curso_id, v_seccion_id, v_inst_id
    FROM listas
    WHERE id = p_lista_id;

    IF v_tipo = 'INSTITUCIONAL' THEN
        RETURN QUERY
        SELECT f.id FROM familias f
        WHERE f.institucion_id = v_inst_id AND f.activa = TRUE;

    ELSIF v_tipo = 'NIVEL' THEN
        RETURN QUERY
        SELECT DISTINCT f.id FROM familias f
        JOIN estudiantes e ON e.familia_id = f.id
        JOIN secciones s ON e.seccion_id = s.id
        JOIN cursos c ON s.curso_id = c.id
        WHERE c.nivel_id = v_nivel_id AND f.activa = TRUE;

    ELSIF v_tipo = 'CURSO' THEN
        RETURN QUERY
        SELECT DISTINCT f.id FROM familias f
        JOIN estudiantes e ON e.familia_id = f.id
        JOIN secciones s ON e.seccion_id = s.id
        WHERE s.curso_id = v_curso_id AND f.activa = TRUE;

    ELSIF v_tipo = 'SECCION' THEN
        RETURN QUERY
        SELECT DISTINCT f.id FROM familias f
        JOIN estudiantes e ON e.familia_id = f.id
        WHERE e.seccion_id = v_seccion_id AND f.activa = TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 10. SEGURIDAD Y RLS (Row Level Security) - Ejemplos
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE registro_envios ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver su propia información de perfil
CREATE POLICY usuarios_self_read ON usuarios
    FOR SELECT TO public
    USING (auth.uid() = id);

-- Política: Las familias solo pueden ver comunicaciones que les corresponden
CREATE POLICY comunicaciones_familias ON comunicaciones
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM registro_envios re
            JOIN miembros_familia mf ON re.familia_id = mf.familia_id
            WHERE re.comunicacion_id = comunicaciones.id
              AND mf.usuario_id = auth.uid()
        )
    );

-- 11. BÚSQUEDA SEMÁNTICA PARA CHATBOT IA (pgvector)
CREATE OR REPLACE FUNCTION buscar_conocimiento_ia (
  p_institucion_id UUID,
  p_query_embedding VECTOR(768),
  p_match_threshold FLOAT,
  p_match_count INT
)
RETURNS TABLE (
  id UUID,
  titulo VARCHAR,
  contenido TEXT,
  similarity FLOAT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cb.id,
    cb.titulo,
    cb.contenido,
    1 - (cb.embedding <=> p_query_embedding) AS similarity
  FROM conocimiento_bot cb
  WHERE cb.institucion_id = p_institucion_id
    AND 1 - (cb.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY cb.embedding <=> p_query_embedding
  LIMIT p_match_count;
END;
$$ LANGUAGE plpgsql;

-- 12. MULTIMEDIA, ASISTENCIAS Y CALIFICACIONES (ACTUALIZACIÓN v2)

CREATE TABLE videos_estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    seccion_id UUID NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    url_video TEXT NOT NULL, -- Bucket de Supabase Storage
    duracion_segundos INT NOT NULL CHECK (duracion_segundos <= 20), -- Límite de 20s en BD
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    hora_ingreso TIME WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PRESENTE', 'AUSENTE', 'TARDE')),
    metodo_registro VARCHAR(30) DEFAULT 'QR_AUTO' CHECK (metodo_registro IN ('QR_AUTO', 'MANUAL_DOCENTE')),
    UNIQUE(estudiante_id, fecha)
);

CREATE TABLE calificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    materia VARCHAR(100) NOT NULL,
    periodo VARCHAR(50) NOT NULL, -- e.g., '1er Trimestre'
    nota NUMERIC(4,2) NOT NULL CHECK (nota >= 1.0 AND nota <= 10.0),
    conducta VARCHAR(50) NOT NULL DEFAULT 'Bueno',
    observaciones TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reportes_firmados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    familia_id UUID NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
    token_seguridad VARCHAR(255) UNIQUE NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en nuevas tablas
ALTER TABLE videos_estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS de ejemplo para Asistencias y Calificaciones (Lectura familiar)
CREATE POLICY lectura_calificaciones_familia ON calificaciones
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM miembros_familia mf
            JOIN estudiantes e ON e.familia_id = mf.familia_id
            WHERE e.id = calificaciones.estudiante_id
              AND mf.usuario_id = auth.uid()
        )
    );

CREATE POLICY lectura_asistencias_familia ON asistencias
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM miembros_familia mf
            JOIN estudiantes e ON e.familia_id = mf.familia_id
            WHERE e.id = asistencias.estudiante_id
              AND mf.usuario_id = auth.uid()
        )
    );

-- 13. REPORTES JERÁRQUICOS Y ASISTENCIA DOCENTE (ACTUALIZACIÓN v3)

CREATE TABLE asistencias_docentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    hora_ingreso TIME WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(30) NOT NULL CHECK (estado IN ('PRESENTE', 'AUSENTE_ENFERMEDAD', 'AUSENTE_LICENCIA', 'AUSENTE_PARTICULAR', 'TARDE')),
    motivo_detalle TEXT,
    registrado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(docente_id, fecha)
);

CREATE TABLE informes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    destinatario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_informe VARCHAR(50) NOT NULL CHECK (tipo_informe IN ('ACADEMICO', 'CONDUCTA', 'DESEMPENO_LABORAL', 'ASISTENCIA', 'LICENCIA_MEDICA')),
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en nuevas tablas
ALTER TABLE asistencias_docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE informes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Asistencia Docente (Lectura del propio docente y escritura de Admin)
CREATE POLICY lectura_propia_asistencia_docente ON asistencias_docentes
    FOR SELECT TO public
    USING (docente_id = auth.uid());

CREATE POLICY admin_control_asistencia_docente ON asistencias_docentes
    FOR ALL TO public
    USING (
        EXISTS (
            SELECT 1 FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'ADMIN'
        )
    );

-- Políticas de RLS para Informes (Lectura del destinatario e informes jerárquicos)
CREATE POLICY lectura_informes_recibidos ON informes
    FOR SELECT TO public
    USING (destinatario_id = auth.uid());

CREATE POLICY docente_crea_informes_estudiantes ON informes
    FOR INSERT TO public
    WITH CHECK (
        -- El creador debe ser un Docente y el destinatario debe ser un Estudiante
        EXISTS (
            SELECT 1 FROM usuarios creador 
            JOIN roles rc ON creador.rol_id = rc.id
            WHERE creador.id = auth.uid() AND rc.nombre = 'DOCENTE'
        )
        AND EXISTS (
            SELECT 1 FROM usuarios dest 
            JOIN roles rd ON dest.rol_id = rd.id
            WHERE dest.id = destinatario_id AND rd.nombre = 'ESTUDIANTE'
        )
    );

CREATE POLICY admin_control_informes ON informes
    FOR ALL TO public
    USING (
        EXISTS (
            SELECT 1 FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'ADMIN'
        )
    );

-- 14. ANUNCIOS GLOBALES MASIVOS E INDICADOR DE NUEVO AVISO (ACTUALIZACIÓN v4)

CREATE TABLE anuncios_globales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emisor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lecturas_anuncios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anuncio_id UUID NOT NULL REFERENCES anuncios_globales(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    leido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anuncio_id, usuario_id)
);

-- Habilitar RLS en nuevas tablas
ALTER TABLE anuncios_globales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturas_anuncios ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Anuncios Globales (Lectura pública y escritura de Admin)
CREATE POLICY lectura_global_anuncios ON anuncios_globales
    FOR SELECT TO public
    USING (TRUE); -- Absolutamente todos los perfiles pueden leer

CREATE POLICY admin_control_anuncios ON anuncios_globales
    FOR ALL TO public
    USING (
        EXISTS (
            SELECT 1 FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'ADMIN'
        )
    );

-- Políticas de RLS para lectura de anuncios (Lectura y escritura del propio usuario)
CREATE POLICY control_propia_lectura_anuncios ON lecturas_anuncios
    FOR ALL TO public
    USING (usuario_id = auth.uid());




