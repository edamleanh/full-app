const https = require('https');
const fs = require('fs');

const VIDEO_ID = 'jfKfPfyJRdk';
const URL = `https://www.youtube.com/live_chat?is_popout=1&v=${VIDEO_ID}`;

https.get(URL, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('chat.html', data);
        console.log('Saved to chat.html');
    });
});
