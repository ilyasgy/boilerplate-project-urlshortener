const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// In-memory "database"
let urls = [];
let counter = 1;

// POST endpoint to shorten a URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try {
    const parsedUrl = new URL(originalUrl);
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      // Store and return the shortened URL
      urls.push({ original_url: originalUrl, short_url: counter });
      res.json({ original_url: originalUrl, short_url: counter });
      counter++;
    });
  } catch {
    return res.json({ error: 'invalid url' });
  }
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = urls.find((entry) => entry.short_url === id);

  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
