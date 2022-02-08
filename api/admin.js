const PORT = process.env.PORT || 8080;

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

/** GET /api/admin/get/all */
console.log(`##admin http://localhost:${PORT}/api/admin/get/all`);
exports.getPoetryAll = (req, res) => {
    const client = connectDB();

    client.connect();

    client.query(
        `SELECT * FROM public.poetry;`,
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

/** POST /api/admin/add-new-poetry */
console.log(`##admin http://localhost:${PORT}/api/admin/add-new-poetry`);
exports.toAddNewPoetry = (req, res) => {
    const {
        title, 
        poetryType,  
        contentPoetry, 
        createDate,
        background,
        book,
    } = req.body;
    
    const client = connectDB();

    client.connect();

    client.query(
        `INSERT INTO public.poetry (id, title, poetry_type, content_poetry, create_date, background, book) 
        VALUES('${nanoid(8)}', '${title}', '${poetryType}', '${contentPoetry}', '${createDate}', '${background}', '${book}');`,
        (errorDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            res.sendStatus(200);
            client.end();
        },
    );
    return;
};

/** DELETE /api/admin/delete/:id */
console.log(`##admin http://localhost:${PORT}/api/admin/delete/:id`);
exports.deletePoetryById = (req, res) => {
    const {id} = req.params;

    const client = connectDB();

    client.connect();

    client.query(
        `DELETE FROM public.poetry WHERE id='${id}';`,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            console.log('/api/admin/delete/:id', id);
            res.sendStatus(200);
            client.end();
        },
    );
    return;
}

// exports.adminUploadFromJSON = (req, res) => {
//     const client = connectDB();
//     client.connect();

//     console.log('###__UPLOAD_API__###');
//     const arr = require('../zorevaData.json').poetryData.data;

//     arr.map((item, ind) => {
//         const poetryType = 'Стихи'
//         const {
//             name: title, 
//             text, 
//             year: createDate,
//             background,
//             book: book,
//         } = item;

//         // if (ind > 0) return;
//         console.log('###__UPLOAD_API__###', ind);

//         let contentPoetry = '';
//         text.map((i) => contentPoetry = contentPoetry.concat('\n').concat(i));
        
//         client.query(
//             `INSERT INTO public.poetry (id, title, poetry_type, content_poetry, create_date, background, book) 
//             VALUES('${nanoid(8)}', '${title}', '${poetryType}', '${contentPoetry}', '${createDate}', '${background}', '${book}');`,
//             (errorDb) => {
//                 if (errorDb) {
//                     console.log(errorDb);
//                 }
//                 console.log('success@@@');
//             },
//         );
//     })

//     res.sendStatus(200);
//     return;
// }

exports.endConnection = (req, res) => {
    const client = connectDB();

    client.end();

    res.sendStatus(200);

    return;
}