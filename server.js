const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const app = express();

function selfURL(req) {
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0];
  return proto + '://' + req.headers.host + '/';
}

app.get('/qr.png', (req, res) => {
  QRCode.toBuffer(selfURL(req), { width: 720, margin: 2, color: { dark: '#0b6f6d', light: '#ffffff' } },
    (err, buf) => {
      if (err) return res.status(500).end();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.end(buf);
    });
});

app.get('/qr-url', (req, res) => res.json({ url: selfURL(req) }));

app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders: (res, p) => {
    if (p.endsWith('.sigml')) res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    else if (p.endsWith('.jar')) res.setHeader('Content-Type', 'application/java-archive');
  }
}));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('ALSL Dictionary running on port ' + PORT));
