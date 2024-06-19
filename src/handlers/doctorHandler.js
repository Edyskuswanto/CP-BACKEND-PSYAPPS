const { nanoid } = require('nanoid');
const db = require('../db');

const getAllDoctors = (request, h) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Doctors', (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to retrieve doctors' }).code(500));
            } else {
                resolve(h.response(results));
            }
        });
    });
};

const getDoctorById = (request, h) => {
    const { id } = request.params;
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Doctors WHERE doctor_id = ?', [id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to retrieve doctor' }).code(500));
            } else if (results.length > 0) {
                resolve(h.response(results[0]));
            } else {
                resolve(h.response({ message: 'Doctor not found' }).code(404));
            }
        });
    });
};

const addDoctor = (request, h) => {
    const { username, email } = request.payload;

    // Lakukan pengecekan apakah nama dokter sudah ada di database
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Doctors WHERE username = ?', [username], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to check for existing doctor' }).code(500));
            } else if (results.length > 0) {
                reject(h.response({ error: 'Doctor with the same username already exists' }).code(400));
            } else {
                // Jika tidak ada nama yang sama, lanjutkan dengan menambahkan data
                const doctor_id = nanoid();
                const newDoctor = { doctor_id, username, email };

                db.query('INSERT INTO Doctors SET ?', newDoctor, (err) => {
                    if (err) {
                        reject(h.response({ error: 'Failed to add doctor' }).code(500));
                    } else {
                        resolve(h.response(newDoctor).code(201));
                    }
                });
            }
        });
    });
};

const deleteDoctor = (request, h) => {
    const { id } = request.params;

    return new Promise((resolve, reject) => {
        db.query('DELETE FROM Doctors WHERE doctor_id = ?', [id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to delete doctor' }).code(500));
            } else if (results.affectedRows > 0) {
                resolve(h.response({ message: 'Doctor deleted' }));
            } else {
                resolve(h.response({ message: 'Doctor not found' }).code(404));
            }
        });
    });
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    deleteDoctor,
};
