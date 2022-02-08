const PORT = process.env.PORT || 8080;

const {nanoid} = require('nanoid');
const {Client} = require('pg');

/********** Api ***********/

/** POST /api/email/add */
console.log(`##email http://localhost:${PORT}/api/email/add`);
exports.toAddUserContact = (req, res) => {
    const {siteType, siteExsistUrl, clientName, email, contacts, exampleSitesUrls, functionOfSite, designSite, regionAudit, auditorsSite} = req.body;

    const client = new Client({
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    client.query(
        `INSERT INTO public.wr_requests (id, create_date, site_type, site_exsist_url, client_name, email, example_sites_urls, function_of_site, design_site, region_audit, auditors_site, another_contacts) VALUES('${nanoid(8)}', '${Date.now()}', '${siteType}', '${siteExsistUrl}', '${clientName}', '${email}', '${exampleSitesUrls}', '${functionOfSite}', '${designSite}', '${regionAudit}', '${auditorsSite}', '${contacts}');`,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            for (let row of resultDb.rows) {
                console.log('#+#+#+#+', JSON.stringify(row));
            }
            client.end();
            return res.send('OK!');
        },
    );
    return;
};

/** GET /api/get/contacts/:id */
console.log(`##email http://localhost:${PORT}/api/get/contacts/:id`);
exports.toReadUserContact = (req, res) => {
    const {id} = req.params;
    const client = new Client({
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    client.query(
        `SELECT id, create_date, site_type, site_exsist_url, client_name, email, example_sites_urls, function_of_site, design_site, region_audit, auditors_site, another_contacts FROM public.wr_requests WHERE id = '${id}';`,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            const mapData = {
                siteType: resultDb.rows[0].site_type,
                siteExsistUrl: resultDb.rows[0].site_exsist_url,
                clientName: resultDb.rows[0].client_name,
                email: resultDb.rows[0].email,
                contacts: resultDb.rows[0].contacts,
                exampleSitesUrls: resultDb.rows[0].example_sites_urls,
                functionOfSite: resultDb.rows[0].function_of_site,
                designSite: resultDb.rows[0].site_type,
                regionAudit: resultDb.rows[0].region_audit,
                auditorsSite: resultDb.rows[0].auditors_site,
                anotherContacts: resultDb.rows[0].another_contacts,
                createDate: resultDb.rows[0].create_date,
            }
            res.send(mapData);
            client.end();
        },
    );
    return;
};

/** GET /api/email/get/all */
/*
SELECT id, create_date, site_type, site_exsist_url, client_name, email, example_sites_urls, function_of_site, design_site, region_audit, auditors_site, another_contacts FROM public.wr_requests;
*/
console.log(`##email http://localhost:${PORT}/api/email/get/all`);
exports.toReadUserContactsAll = (req, res) => {
    const client = new Client({
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();

    client.query(
        `SELECT id, create_date, site_type, site_exsist_url, client_name, email, example_sites_urls, function_of_site, design_site, region_audit, auditors_site, another_contacts FROM public.wr_requests;`,
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

/** DELETE /api/contacts/delete/:id */
console.log(`##email http://localhost:${PORT}/api/contacts/delete/:id`);
exports.deleteContactById = (req, res) => {
    const {id} = req.params;
    console.log('START DELETE', id);
    const client = new Client({
        connectionString: process.env.POSTGRES_URI,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();
    
    client.query(
        `DELETE FROM public.wr_requests WHERE id = '${id}';`,
        (errorDb, resultDb) => {
            if (errorDb) {
                console.log(errorDb);
                client.end();
                return res.sendStatus(500);
            }
            
            console.log('DELETE id', id);

            res.sendStatus(200);
            client.end();
        },
    );
    return;
}