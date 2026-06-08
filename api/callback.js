export default async function handler(req, res) {
  const { code, error, state } = req.query;

  if (error) {
    return res.send(`
      <html><body style="background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:50px">
        <h2>❌ Erreur : ${error}</h2>
      </body></html>
    `);
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
      const token = data.access_token;
      return res.send(`
        <html>
        <body style="background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:30px">
          <h1>✅ Connecté !</h1>
          <p style="color:#888">Appuie sur le bouton pour copier ton token</p>
          <button onclick="copyToken()" style="background:#1DB954;color:white;border:none;padding:16px 32px;border-radius:12px;font-size:18px;margin:20px">
            📋 Copier le token
          </button>
          <p id="confirm" style="color:#1DB954;display:none">✅ Copié !</p>
          <p style="color:#555;font-size:11px;margin-top:30px">Token valide 1 heure</p>
          <script>
            const token = "${token}";
            function copyToken() {
              navigator.clipboard.writeText(token).then(() => {
                document.getElementById('confirm').style.display = 'block';
              });
            }
          </script>
        </body>
        </html>
      `);
    }

    return res.status(200).json({ error: 'token_failed', details: data });

  } catch (e) {
    return res.status(200).json({ error: 'server_error', message: e.message });
  }
}
