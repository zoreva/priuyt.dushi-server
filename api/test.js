const PORT = process.env.PORT || 8080;
const fs = require('fs');

// Data

var counter = {};
fs.readFile('database/test_counter.json', 'utf8', (err, data) => {
    if (err) return counter = { value: 0 };
    counter = JSON.parse(data)
});


// Api

console.log(`##test http://localhost:${PORT}/api/test/counter`);
exports.testCounter = (req, res) => {
    console.log('test!!!!!');
    counter.value++;

    res.status(200).send(`
    <h1>value: ${counter.value}</h1>
    <a href='http://localhost:${PORT}/api/test/write-file' target="_blank">Save to db</a>
    `);
};


console.log(`##test http://localhost:${PORT}/api/test/write-file`);
exports.testWriteFile = (req, res) => {
    var json = JSON.stringify(counter);
   
    fs.writeFile('database/test_counter.json', json, 'utf8', (err) => {
        if (err) throw err;
        res.status(200).send(`write success. counter:${counter.value}`);
    });
};
