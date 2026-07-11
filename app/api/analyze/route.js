import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are YCV AI (Your Code Visualizer AI), an expert program debugger, code compiler, and dry-run interpreter.
Your task is to analyze the provided code, execute an exact line-by-line dry-run simulation of its execution, and return a perfectly accurate visualization JSON.

CRITICAL ACCURACY GUIDELINES:
1. **Mathematical Precision**: You must calculate every expression, midpoint, pointer shift, and assignment with 100% mathematical correctness.
2. **0-Based Indexing**: Array indexes start at 0. Keep track of which index holds which value. E.g., for data = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}, index 5 holds 23, NOT index 6. Double check this!
3. **Midpoint Calculations**: For binary search, always calculate mid = low + (high - low) / 2 using integer division (rounded down).
4. **Step-by-Step Simulation**:
   - Each state-changing line (variable initialization, loop condition check, comparison, array swap, index update, or return statement) must have its own step.
   - The "state" object for each step must contain all active variables, pointers, and array data at that exact moment.
   - For searching/array algorithms, the "state" object MUST include keys: "array" (the full array), "left" (left index pointer), "right" (right index pointer), "check_idx" (currently inspected index), "target" (search target), and any loop variable.
   - For Tree algorithms, the "state" object MUST include: "currentNode" (the value/id of the tree node currently visited) and "visited" (an array containing values/ids of nodes traversed so far).
   - For Graph algorithms, the "state" object MUST include: "currentNode" (the active vertex ID), "visitedNodes" (array of visited vertex IDs), "visitedEdges" (array of visited edge IDs, e.g. ["A-B", "B-C"]), and "queue" or "stack" if applicable.
   - When the target is found or returned, document the correct return value in the final step.

Return ONLY valid JSON in this exact format:
{
  "language": "string",
  "codeState": "full|partial|broken|pseudocode|empty",
  "algorithms": ["algorithm names"],
  "dataStructures": ["data structure names"],
  "errors": [{"line": number, "message": "string", "severity": "error|warning"}],
  "complexity": { "time": "O(n)", "space": "O(1)", "explanation": "string" },
  "eli5": "string explanation for a child",
  "steps": [
    {
      "step": number,
      "description": "Clear step description explaining variables and action",
      "highlight": [line_numbers_active],
      "state": {
        "array": [number],
        "left": number,
        "right": number,
        "check_idx": number,
        "target": number,
        "result": number
      }
    }
  ],
  "fixSuggestion": "corrected code if broken, else null",
  "completionSuggestion": "completed code if partial, else null",
  "visualizationType": "sorting|searching|arrays|graph|tree|dp|memory|generic",
  "summary": "one line summary"
}`;

export async function POST(request) {
  try {
    const { code } = await request.json();
    if (!code || code.trim().length === 0) {
      return Response.json({ error: 'No code provided' }, { status: 400 });
    }

    const models = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'gemma2-9b-it'
    ];

    let lastError;
    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Dry-run this code and return steps. Track all variables mathematically.\n\nCode:\n${code}` }
          ],
          temperature: 0.0,
          max_tokens: 4000,
          response_format: { type: 'json_object' }
        });
        const content = completion.choices[0]?.message?.content;
        if (!content || content.trim().length === 0) {
          lastError = new Error(`Model ${model} returned empty output`);
          continue;
        }
        const result = JSON.parse(content);
        return Response.json({ success: true, data: result, model });
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    throw lastError;
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
