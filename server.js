const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const DB_FILE = 'norrisDb';

const readJSONData = (nomeFile) => {
  const filePath = path.join(__dirname, nomeFile + '.json');
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (fileData) {
      return JSON.parse(fileData);
    }
  }
  return [];
};

const writeJSONData = (nomeFile, newData) => {
  const filePath = path.join(__dirname, nomeFile + '.json');
  const fileString = JSON.stringify(newData, null, 2);
  fs.writeFileSync(filePath, fileString);
};

// funzione per ottenere una battuta
fetchJoke = async () => {
  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Errore', error);
    return null;
  }
};
const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/favicon.ico':
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end();
      break;
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

      const joke = await fetchJoke();
      if (joke) {
        const jokes = readJSONData(DB_FILE);

        jokes.push({ joke, date: new Date().toISOString() });

        writeJSONData(DB_FILE, jokes);

        res.end(`<h1>${joke}</h1>`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Errore nel recupero della battuta</h1>`);
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Pagina non trovata</h1>`);
      break;
  }
});
server.listen(port, host, () => {
  console.log(`Server avviato su http://${host}:${port}`);
});
