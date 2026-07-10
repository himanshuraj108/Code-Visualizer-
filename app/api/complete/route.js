import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { code } = await request.json();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a code completion expert. Complete the partial code provided and return ONLY the complete, working code. No explanation, no markdown, no backticks. Just raw code.'
        },
        {
          role: 'user',
          content: `Complete this partial code:\n\n${code}`
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });
    return Response.json({ completedCode: completion.choices[0].message.content.trim() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
