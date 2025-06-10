const express = require('express');
const bodyParser = require('body-parser');

const os = require('os');

const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE_PATH = path.join(LOG_DIR, 'logs.json');

app.get('/', async (req, res) => {
    try {
        await fs.mkdir(LOG_DIR, { recursive: true });
        await fs.appendFile(LOG_FILE_PATH, JSON.stringify({
            timeStamp: new Date().toISOString(),
            os: os.hostname(),
        }) + '\n');
    } catch (error) {
        console.error('Error writing to log file:', error);
        res.status(500).json({ error: 'Failed to write to log file' });
        return;
    }

    res.json({
        message: 'Welcome to the API!',
        os: os.hostname(),
    });

    // await fs.writeFile(path.join(logPath, 'logs.json'), JSON.stringify({
    //     timeStamp: new Date().toISOString(),
    //     os: os.hostname(),
    // }));
});

app.get('/read', async (req, res) => {
    try {
        const data = await fs.readFile(LOG_FILE_PATH, 'utf8');
        const logLines = data.split('\n').filter(line => line.trim() !== '');
        let parsedLogs = [];
        for (const line of logLines) {
            try {
                parsedLogs.push(JSON.parse(line));
            } catch (parseError) {
                console.warn('Skipping malformed log line:', line, parseError.message);
            }
        }
        res.json(parsedLogs);
    } catch (error) {
        console.error('Error reading log file:', error);
        res.status(500).json({ error: 'Failed to read log file' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});