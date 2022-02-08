require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet'); // creates headers that protect from attacks (security)
const cors = require('cors');

const email = require('./api/email.js');
const admin = require('./api/admin.js');
const poetryApi = require('./api/poetry.js');

const whitelist = [
    process.env.LOCALHOST_3000,
    process.env.LOCALHOST_8000,
    process.env.LOCALHOST_8080,
    process.env.LOCALHOST_8084,
    process.env.PRODUCTION,
    process.env.TEST_DEVELOP,
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log('** Origin of request ' + origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log('Origin acceptable');
            callback(null, true);
        } else {
            console.log('Origin rejected');
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(helmet());
app.use(cors(corsOptions));

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});
const jsonencodedParser = bodyParser.json();

const PORT = process.env.PORT || 8084;
app.listen(PORT, (req, res) => {
    console.log(`server listening on port: ${PORT}`);
});

// Email
app.post('/api/email/add', urlencodedParser, email.toAddUserContact);

// Prod Content
app.get('/api/poetry/all', poetryApi.getPoetryAll);
app.get('/api/poetry/:id', poetryApi.getPoetryById);

// Admin Panel
app.get('/', (req, res) => res.sendfile(__dirname + '/indexAdm/index.html'));
app.get('/api/admin/get/all', admin.getPoetryAll);
app.post('/api/admin/add-new-poetry', jsonencodedParser, admin.toAddNewPoetry);
app.delete('/api/admin/delete/:id', admin.deletePoetryById);

// app.get('/api/admin/upload', admin.adminUploadFromJSON);
app.get('/api/admin/end', admin.endConnection);

module.exports = app;