const http = require('http');
const https = require('https');

const API_KEY = '766970c19e8a4cab933b9f562bd4998b'; 
const BASE_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;

let cache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600 * 1000; // 1 hodina

const server = http.createServer((req, res) => {
    if (req.url === '/exchange-rates' && req.method === 'GET') {
        const now = Date.now();

        if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(cache));
        }

        https.get(BASE_URL, (apiRes) => {
            let data = '';

            apiRes.on('data', chunk => {
                data += chunk;
            });

            apiRes.on('end', () => {
                cache = JSON.parse(data);
                cacheTimestamp = now;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });

        }).on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Něco se pokazilo při získávání směnných kurzů' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
