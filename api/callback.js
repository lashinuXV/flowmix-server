export default async function handler(req, res) {
  const { code, error, state } = req.query;

  if (error) {
    return res.redirect(`exp://127.0.0.1:19000/--/callback?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No code received' });
  }

  const codeVerifier = state;

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.VERCEL_URL}/api/callback`,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        code_verifier: codeVerifier,
      }),
    });

    const data = await tokenResponse.json();

    if (data.access_token) {
      return res.redirect(
        `exp://127.0.0.1:19000/--/callback?access_token=${data.access_token}`
      );
    } else {
      return res.redirect(
        `exp://127.0.0.1:19000/--/callback?error=token_failed`
      );
    }
  } catch (e) {
    return res.redirect(
      `exp://127.0.0.1:19000/--/callback?error=server_error`
    );
  }
}
