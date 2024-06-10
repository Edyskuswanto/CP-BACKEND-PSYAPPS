const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '34.101.104.172',
    user: 'root',
    password: 'db-psyapps',
    port: 3306,
    database: 'db-psyapps'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;
