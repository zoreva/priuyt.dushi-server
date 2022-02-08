const PORT = process.env.PORT || 8080;

const {divCeil} = require('../utils/divCeil');
const {nanoid} = require('nanoid');
const {Client} = require('pg');

const connectDB = function () {
    return new Client({
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

/** GET /api/poetry/all */
console.log(`##poetry http://localhost:${PORT}/api/poetry/all`);
exports.getPoetryAll = (req, res) => {
    const {pageNumber, counterContent} = req.query;

    const client = connectDB();

    client.connect();

    client.query(`
            SELECT id, title, poetry_type, content_poetry, create_date, background, book 
            FROM public.poetry
            LIMIT ${counterContent}
            OFFSET ${counterContent * (pageNumber - 1)};
        `,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            res.send({
                pageCounter: divCeil(resultDb.rowCount, counterContent),
                count: resultDb.rowCount,
                array: resultDb.rows
            });
            client.end();
        },
    );
    return;
};

/** GET /api/poetry/:id */
console.log(`##poetry http://localhost:${PORT}/api/poetry/:id`);
exports.getPoetryById = (req, res) => {
    const {id} = req.params;

    const client = connectDB();

    client.connect();

    client.query(
        `SELECT * FROM public.poetry WHERE id='${id}';`,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            res.send(resultDb.rows);
            client.end();
        },
    );
    return;
};