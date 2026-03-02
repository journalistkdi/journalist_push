import Groq from 'groq-sdk'

export async function callGroq(apiKey: string, system: string, user: string): Promise<string> {
  const groq = new Groq({ apiKey })
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  })
  return res.choices[0]?.message?.content ?? ''
}
