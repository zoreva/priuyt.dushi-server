const PORT = process.env.PORT || 8080;
const GET_HOST = process.env.GET_HOST || 'http://localhost';

const { divCeil } = require('../utils/divCeil');
const { nanoid } = require('nanoid');
const { Client } = require('pg');

const connectDB = function () {
	return new Client({
		connectionString: process.env.POSTGRES_URI,
		ssl: {
			rejectUnauthorized: false,
		},
	});
};

/** GET /api/poetry/all */
console.log(`##poetry ${GET_HOST}:${PORT}/api/poetry/all`);
exports.getPoetryAll = (req, res) => {
	const { pageNumber, counterContent } = req.query;
    const queryGetCountRecords = `SELECT COUNT(1) FROM public.poetry`
	const queryGetPoetries = `
        SELECT id, title, poetry_type, content_poetry, create_date, background, book 
        FROM public.poetry
        LIMIT ${counterContent}
        OFFSET ${counterContent * (pageNumber - 1)};
    `;

	const client = connectDB();

	client.connect();

    client.query(queryGetCountRecords, (errorDb, resultDb) => {
        if (errorDb) {
			console.log(errorDb);
			client.end();
			return res.sendStatus(500);
		}
        return getPortitionData(+resultDb.rows[0].count);
    })
	
    function getPortitionData(rowCount) {
        client.query(queryGetPoetries, (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }    
            res.send({
                pageCounter: divCeil(rowCount, counterContent),
                count: rowCount,
                array: resultDb.rows,
            });
            client.end();
        });
    }

	return;
};

/** GET /api/poetry/:id */
console.log(`##poetry ${GET_HOST}:${PORT}/api/poetry/:id`);
exports.getPoetryById = (req, res) => {
	const { id } = req.params;

	const client = connectDB();

	client.connect();

	client.query(`SELECT * FROM public.poetry WHERE id='${id}';`, (errorDb, resultDb) => {
		if (errorDb) {
			console.log(errorDb);
			client.end();
			return res.sendStatus(500);
		}
		res.send(resultDb.rows);
		client.end();
	});
	return;
};
