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
    const { name, email } = request.payload;
    const doctor_id = nanoid();
    const newDoctor = { doctor_id, name, email };

    console.log('Adding new doctor:', newDoctor);

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO Doctors SET ?', newDoctor, (err) => {
            if (err) {
                console.error('Error adding doctor:', err);
                reject(h.response({ error: 'Failed to add doctor' }).code(500));
            } else {
                resolve(h.response(newDoctor).code(201));
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
