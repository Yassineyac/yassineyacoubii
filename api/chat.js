module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

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
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
