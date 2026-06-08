export default async function handler(req, res) {
  const { code, error, state } = req.query;

  const EXPO_REDIRECT = 'exp://exp.host/@anonymous/flowmix';

  if (error) {
    return res.redirect(`${EXPO_REDIRECT}?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No code received' });
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://flowmix-server.vercel.app/api/callback',
        client_id: '6cefc128ed334a7a995214452cc8a869',
        code_verifier: state,
      }),
    });

    const data = await tokenResponse.json();

    if (data.access_token) {
      return res.redirect(`${EXPO_REDIRECT}?access_token=${data.access_token}`);
    }

    // Affiche l'erreur pour debug
    return res.status(200).json({ error: 'token_failed', details: data });

  } catch (e) {
    return res.status(200).json({ error: 'server_error', message: e.message });
  }
}
