const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://7f17-2405-4802-1d36-af00-f9bd-96b0-80c4-1e7f.ngrok-free.app'
];
app.use(cors({
  origin: function(origin, callback){
    console.log('CORS check for origin:', origin);
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.error(msg, origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'project/public')));

let browser, page;

async function setupBrowser() {
  browser = await puppeteer.launch({ headless: false, args: ['--use-fake-ui-for-media-stream'] });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/tts-index.html');
}

app.post('/speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });
  if (!page) return res.status(500).json({ error: 'TTS page not ready' });

  await page.evaluate((t) => {
    window.speakText(t);
  }, text);

  res.json({ status: 'speaking', text });
});

app.listen(3000, async () => {
  await setupBrowser();
  console.log('TTS server running on http://localhost:3000');
});

// Add error handler for better logging
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
}); 