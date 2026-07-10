import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { code, errors } = await request.json();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a code repair expert. Fix the provided code and return ONLY the fixed code with no explanation, no markdown, no backticks. Just the raw fixed code.'
        },
        {
          role: 'user',
          content: `Fix this code. Errors: ${JSON.stringify(errors)}\n\nCode:\n${code}`
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });
    return Response.json({ fixedCode: completion.choices[0].message.content.trim() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
