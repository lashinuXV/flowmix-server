export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.send(`
      <html><body style="background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:50px">
        <h2>❌ Erreur : ${error}</h2>
        <p>Retourne dans FlowMix et réessaie.</p>
      </body></html>
    `);
  }

  if (code) {
    return res.send(`
      <html><body style="background:#0a0a0a;color:white;font-family:sans-serif;text-align:center;padding:50px">
        <h1>✅ Connexion réussie !</h1>
        <p>Copie ce code et colle-le dans FlowMix :</p>
        <div style="background:#1a1a1a;padding:20px;border-radius:10px;margin:20px;word-break:break-all;font-size:14px;color:#1DB954">
          ${code}
        </div>
        <p style="color:#888;font-size:13px">Appuie longtemps sur le code pour le copier</p>
      </body></html>
    `);
  }
}

