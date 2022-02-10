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
			const prepareArrayToClient = resultDb.rows.map((item) => ({
				id: item.id,
				title: item.title,
				book: item.book,
				poetryType: item.poetry_type,
				createDate: item.create_date,
				background: item.background,
			}))

            res.send({
                pageCounter: divCeil(rowCount, counterContent),
                count: rowCount,
                array: prepareArrayToClient,
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
		const prepareDataToClient = {
			id: resultDb.rows[0].id,
			title: resultDb.rows[0].title,
			book: resultDb.rows[0].book,
			poetryType: resultDb.rows[0].poetry_type,
			contentPoetry: resultDb.rows[0].content_poetry,
			createDate: resultDb.rows[0].create_date,
			background: resultDb.rows[0].background,
		}

		res.send(prepareDataToClient);
		client.end();
	});
	return;
};
