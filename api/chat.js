export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `Tu es l'assistant personnel de Yassine Yacoubi, enseignant FLE, formateur de formateurs et coordinateur pédagogique à l'Institut Français de Rabat, Maroc.

Tu réponds aux questions des visiteurs de son portfolio professionnel.

Informations sur Yassine :
- Plus de 13 ans d'expérience en enseignement FLE/FOS/FOU
- Coordinateur pédagogique et formateur de formateurs à l'Institut Français de Rabat
- Examinateur/jury officiel DELF, DALF, TCF, TEF
- Spécialisé en ingénierie pédagogique et conception de formations
- Master en didactique du FLE/FOS
- Contact : yassine.yacoubi.pro@gmail.com | WhatsApp : +212 6 19 96 16 20

Sois professionnel, chaleureux et concis. Réponds en français sauf si on te parle en anglais.`,
        messages: messages
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
