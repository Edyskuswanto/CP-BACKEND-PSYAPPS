const { loadModel, predict } = require('./loadModel');
const clientError = require('./clientError');
const inputError = require('./inputError');
const tfjs = require('@tensorflow/tfjs-node');

let model;

// Middleware untuk memuat model saat aplikasi dimulai
async function initModel() {
    try {
        model = await loadModel();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        throw new clientError('Failed to load model', 500); // Menggunakan status kode 500 untuk kesalahan server internal
    }
}

// Middleware untuk menangani prediksi
async function handlePrediction(req, res, next) {
    try {
        if (!req.file || !req.file.buffer) {
            throw new inputError('Image file is missing', 400); // Menggunakan status kode 400 untuk bad request
        }

        const imageBuffer = req.file.buffer;

        // Melakukan prediksi menggunakan model yang sudah dimuat
        const prediction = await predict(model, imageBuffer);

        res.status(200).json({ success: true, prediction }); // Menggunakan status kode 200 untuk sukses
    } catch (error) {
        if (error instanceof clientError || error instanceof inputError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: 'An unexpected error occurred' }); // Menggunakan status kode 500 untuk kesalahan server internal yang tidak terduga
        }
    }
}

module.exports = { initModel, handlePrediction };
