import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { code, step, mode } = await request.json();
    const isELI5 = mode === 'eli5';
    const prompt = isELI5
      ? `Explain what is happening in step ${step} of this code to a 6-year-old child using simple words, analogies with toys, and no technical jargon. Be fun and engaging. Code: ${code}`
      : `Explain what is happening in step ${step} of this code clearly and concisely for a developer. Code: ${code}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: isELI5 ? 0.7 : 0.2,
      max_tokens: 500,
    });
    return Response.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
