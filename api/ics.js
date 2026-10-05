// Vercel function: fetches an iCloud calendar link for YİĞİT OS (only icloud.com links are allowed).
module.exports = async (req, res) => {
  let url;
  try {
    url = new URL(String(req.query.url || '').replace(/^webcal:\/\//i, 'https://'));
  } catch {
    return res.status(400).send('Calendar link is not valid.');
  }
  if (url.protocol !== 'https:' || !/(^|\.)icloud\.com$/i.test(url.hostname)) {
    return res.status(400).send('Calendar: only iCloud share links are allowed.');
  }
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'YIGIT-OS' } });
    if (!r.ok) return res.status(502).send(`Calendar: iCloud answered ${r.status}. Is the calendar still public?`);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).send(await r.text());
  } catch {
    return res.status(502).send('Calendar: could not reach iCloud.');
  }
};
