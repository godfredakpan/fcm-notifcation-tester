const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.get('/api/getAccessToken', async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const key = require('./service-account.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/firebase.messaging'], 
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});