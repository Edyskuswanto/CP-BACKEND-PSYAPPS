const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: '0.0.0.0',  // Use '0.0.0.0' to allow external connections
    });

    // Membaca dan mengeksekusi skrip SQL untuk membuat tabel
    const createTablesSql = fs.readFileSync(path.join(__dirname, 'migrations', 'createTables.sql')).toString();
    const queries = createTablesSql.split(';').filter(query => query.trim());

    for (const query of queries) {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error creating tables:', err);
                process.exit(1);
            }
        });
    }

    console.log('Tables created or already exist');

    server.route([...patientRoutes, ...doctorRoutes]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
