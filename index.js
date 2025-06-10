const express = require('express');
const bodyParser = require('body-parser');

const os = require('os');

const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.json({
        message: 'Welcome to the API!',
        os: os.hostname(),
    });

    const logPath = path.join(__dirname, 'logs');

    try {
        await fs.access(logPath);
    } catch (error) {
        await fs.mkdir(logPath, { recursive: true });
    }

    await fs.writeFile(path.join(logPath, 'logs.json'), JSON.stringify({
        timeStamp: new Date().toISOString(),
        os: os.hostname(),
    }));
});

app.get('/read', async (req, res) => {
    try {
        const logPath = path.join(__dirname, 'logs');
        const data = await fs.readFile(path.join(logPath, 'logs.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read log file' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});