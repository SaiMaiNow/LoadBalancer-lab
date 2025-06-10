const express = require('express');
const bodyParser = require('body-parser');

const os = require('os');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API!',
        os: os.hostname(),
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});