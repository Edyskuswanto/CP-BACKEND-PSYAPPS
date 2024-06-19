const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/authRoutes');
const { initModel, handlePrediction } = require('./handlers/modelHandler');

const init = async () => {
    const port = process.env.PORT || 5000;
    const server = Hapi.server({
        port: port,
        host: 'localhost',
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

    // Inisialisasi model saat server dimulai
    try {
        await initModel();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to initialize the model:', error);
        process.exit(1);
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const baseUrl = `${request.headers['x-forwarded-proto'] || 'http'}://${request.info.host}`;
            return {
                model_url: `${baseUrl}/model`,
                loginResponPatient_url: `${baseUrl}/login/patient`,
                loginResponDoctor_url: `${baseUrl}/login/doctor`,
                registerResponPatient_url: `${baseUrl}/register/patient`,
                registerResponDoctor_url: `${baseUrl}/register/doctor`,
                doctors_url: `${baseUrl}/doctors`,
                patients_url: `${baseUrl}/patients`
            };
        }
    });

    // Definisikan rute model
    server.route({
        method: 'POST',
        path: '/model/predict',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            }
        },
        handler: async (request, h) => {
            try {
                const { image } = request.payload;
                const imageBuffer = await new Promise((resolve, reject) => {
                    const chunks = [];
                    image.on('data', (chunk) => chunks.push(chunk));
                    image.on('end', () => resolve(Buffer.concat(chunks)));
                    image.on('error', reject);
                });
                const prediction = await handlePrediction(imageBuffer);
                return h.response({ success: true, prediction }).code(200);
            } catch (error) {
                console.error('Prediction error:', error);
                return h.response({ success: false, error: error.message }).code(500);
            }
        }
    });

    server.route([...patientRoutes, ...doctorRoutes, ...authRoutes]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
