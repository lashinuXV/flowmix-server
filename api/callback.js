export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`flowmix://callback?error=${error}`);
  }

  if (code) {
    return res.redirect(`flowmix://callback?code=${code}`);
  }

  return res.status(400).json({ error: 'No code received' });
}
