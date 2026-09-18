import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10
    });
  }
  return pool;
}

const CHAT_MODEL = 'groq/compound-mini';
const EMBED_MODEL = 'embed-english-v3.0';

async function generateEmbedding(text: string): Promise<number[]> {
  const COHERE_API_KEY = process.env.COHERE_API_KEY;
  if (!COHERE_API_KEY) throw new Error('COHERE_API_KEY is not set');

  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      texts: [text],
      model: EMBED_MODEL,
      input_type: 'search_query'
    }),
    signal: AbortSignal.timeout(5000)
  });
  
  if (!response.ok) throw new Error('Cohere embedding failed');
  const data = await response.json();
  return data.embeddings[0];
}

const fallbackContext = `
Dhananjeyan M is an Electronics and Communication Engineering graduate and aspiring software developer. 
He has hands-on experience in full-stack web and Android app development. 
Skills: HTML, CSS, JavaScript, Java, React.js, Spring Boot, Node.js, Express, MySQL, MongoDB, Python, AI integration, Generate AI, LLMs, RAG.
Experience:
- Junior Software Engineer at WBC Software Lab (Mar 2026 - Present): Contributing to full-stack web applications and Agentic AI.
- AI/ML Engineer Intern at SetNext (Dec 2025 - Feb 2026): Trained ML models, AI feature integration.
- Full Stack Web Development Intern at Accent Techno Soft (Jul 2024 - Aug 2024): Built React.js, Node.js, MongoDB apps.
- Android App Development Intern at Phoenix Soft Tech (Jun 2023 - Jul 2023): Java, SQLite, Google Maps API.
Projects:
- Heart Disease Prediction Using Hybrid ML/DL.
- E-Commerce Eflyer with Node.js/Express.
- Furniture Website UI/UX.
- E-Book Management System (Java, JSP, Tomcat).
- School Management System (Spring Boot, MySQL).
`;

export async function POST(req: NextRequest) {
  try {
    const { query, history, sessionId } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 });
    }

    let contextText = fallbackContext;
    const dbPool = getPool();

    try {
      const queryEmbedding = await generateEmbedding(query);
      const searchRes = await dbPool.query(
        'SELECT * FROM match_content($1::vector, 0.2, 8)',
        [`[${queryEmbedding.join(',')}]`]
      );
      if (searchRes.rows && searchRes.rows.length > 0) {
        const contextChunks = searchRes.rows.map(r => r.content_text);
        contextText = contextChunks.join('\n\n');
      }
    } catch (e) {
      console.error('Vector search failed, using fallback context:', e);
    }

    const systemPrompt = `You are Studio Orb, Dhananjeyan's portfolio AI assistant. 
If the user says hello or greets you, introduce yourself as Studio Orb and ask what they would like to know about Dhananjeyan's skills, projects, or experience.
You can handle casual conversation, but for facts about Dhananjeyan, you must ONLY use the provided context. Do not make up facts or guess.
If the user asks a question that is completely unrelated to Dhananjeyan or outside the scope of his portfolio, politely explain that your focus is on Dhananjeyan's professional work, and then smoothly guide the conversation back.

CRITICAL INSTRUCTIONS FOR FORMATTING:
1. Make your responses highly attractive and easy to read.
2. Use Markdown formatting: **bold** for emphasis, bullet points for lists.
3. Keep paragraphs short (1-2 sentences max).
4. Use occasional, relevant emojis to add personality and warmth.
5. Be concise, friendly, and confident. 

Do NOT mention "the context" or "the provided text" in your response.

Context:
${contextText}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).map((m: any) => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content
          })),
          { role: 'user', content: query }
        ],
        stream: true
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!groqRes.ok) {
      throw new Error('Groq API error: ' + groqRes.statusText);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(l => l.trim() !== '' && l.trim() !== 'data: [DONE]');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const json = JSON.parse(line.substring(6));
                  if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                    const content = json.choices[0].delta.content;
                    fullResponse += content;
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {}
              }
            }
          }

          // Asynchronously log the chat to DB after stream completion
          dbPool.query(
            'INSERT INTO chat_logs (session_id, question, answer) VALUES ($1, $2, $3)',
            [sessionId || 'anon', query, fullResponse]
          ).catch(e => console.error('Error logging chat:', e));

        } catch (error: any) {
          console.error("Stream reading error:", error);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Connection interrupted' })}\n\n`));
        } finally {
          controller.enqueue(new TextEncoder().encode(`event: done\ndata: {}\n\n`));
          controller.close();
          reader.releaseLock();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
