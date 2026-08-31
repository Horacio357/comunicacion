// SUPABASE EDGE FUNCTION - CHATBOT IA QUERY PIPELINE (RAG)
// Ubicación: /supabase/functions/chatbot-query/index.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { usuario_id, institucion_id, pregunta } = await req.json();

    if (!usuario_id || !institucion_id || !pregunta) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. GENERAR EMBEDDING DE LA PREGUNTA DEL USUARIO (Usando Gemini Embeddings API)
    // Gemini utiliza embeddings de 768 dimensiones
    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text: pregunta }] }
        })
      }
    );

    if (!embeddingResponse.ok) {
      throw new Error(`Error en API de Embeddings: ${await embeddingResponse.text()}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.embedding.values; // Array de floats (dim: 768)

    // 2. CONSULTAR SUPABASE (Búsqueda semántica usando pgvector)
    // Buscamos coincidencia mediante el operador de distancia de coseno <=> en PostgreSQL
    // Hacemos una llamada RPC (Remote Procedure Call) a una función de base de datos
    const { data: matches, error: dbError } = await supabase.rpc('buscar_conocimiento_ia', {
      p_institucion_id: institucion_id,
      p_query_embedding: queryEmbedding,
      p_match_threshold: 0.35, // Umbral mínimo de similitud
      p_match_count: 3          // Traer los 3 fragmentos más relevantes
    });

    if (dbError) throw dbError;

    // 3. CONSTRUIR CONTEXTO DE LA BASE DE CONOCIMIENTO
    let contextText = '';
    if (matches && matches.length > 0) {
      contextText = matches.map(match => `[Tema: ${match.titulo}]: ${match.contenido}`).join('\n\n');
    } else {
      contextText = 'No hay información oficial disponible en la base de datos para responder esta pregunta.';
    }

    // 4. PREPARAR EL PROMPT DEL SYSTEM PARA EL LLM
    const systemInstruction = `
Eres el Asistente Virtual IA oficial de la institución educativa.
Tu objetivo es responder de manera amable, clara y concisa las preguntas de los familiares o estudiantes.

REGLAS DE ORO:
1. Responde UNICAMENTE basándote en el contexto institucional provisto a continuación.
2. Si la respuesta no se encuentra en el contexto, indica educadamente que no tienes esa información registrada oficialmente y que deben consultar por los canales presenciales o esperar el comunicado oficial del colegio.
3. No inventes datos, fechas, precios ni políticas bajo ninguna circunstancia.
4. Mantén un tono formal, profesional e institucional. No habilites conversaciones personales ajenas a la escuela.

CONTEXTO INSTITUCIONAL DISPONIBLE:
${contextText}
`;

    // 5. LLAMADA AL LLM (Gemini API para generar la respuesta de texto)
    const chatResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `Pregunta del usuario: ${pregunta}` }] }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.1, // Baja temperatura para respuestas más precisas y predecibles
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!chatResponse.ok) {
      throw new Error(`Error en API de Chat: ${await chatResponse.text()}`);
    }

    const chatData = await chatResponse.json();
    const respuestaIA = chatData.candidates[0].content.parts[0].text;

    // 6. REGISTRAR LA CONSULTA EN EL HISTORIAL (Para trazabilidad y auditoría)
    await supabase.from('historial_chatbot').insert({
      usuario_id: usuario_id,
      pregunta: pregunta,
      respuesta: respuestaIA
    });

    // 7. RETORNAR LA RESPUESTA
    return new Response(JSON.stringify({ respuesta: respuestaIA }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});

/*
NOTA: Para habilitar la búsqueda vectorial en la base de datos (paso 2), 
se debe correr la siguiente función SQL en Supabase:

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
*/
