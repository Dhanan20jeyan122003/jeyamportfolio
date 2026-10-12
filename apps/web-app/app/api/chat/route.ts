import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('DATABASE_URL is not set, skipping DB connection');
      return null;
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

const CHAT_MODEL = process.env.CHAT_MODEL || 'openai/gpt-oss-120b';
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

    const dbPool = getPool();
    if (!dbPool) {
      return NextResponse.json({ error: 'Database connection is not configured' }, { status: 500 });
    }

    // Embed query and search Supabase vector embeddings
    const queryEmbedding = await generateEmbedding(query);
    const searchRes = await dbPool.query(
      'SELECT * FROM match_content($1::vector, 0.2, 8)',
      [`[${queryEmbedding.join(',')}]`]
    );

    const contextChunks = (searchRes.rows || []).map((r: any) => r.content_text);
    const contextText = contextChunks.join('\n\n');

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
      const errText = await groqRes.text().catch(() => '');
      console.error('Groq API error:', groqRes.status, errText);
      throw new Error(`Groq API error (${groqRes.status}): ${errText || groqRes.statusText}`);
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
          if (dbPool) {
            dbPool.query(
              'INSERT INTO chat_logs (session_id, question, answer) VALUES ($1, $2, $3)',
              [sessionId || 'anon', query, fullResponse]
            ).catch(e => console.error('Error logging chat:', e));
          }

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
