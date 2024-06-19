const { nanoid } = require('nanoid');
const db = require('../db');

const getAllPatients = (request, h) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Patients', (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to retrieve patients' }).code(500));
            } else {
                resolve(h.response(results));
            }
        });
    });
};

const getPatientById = (request, h) => {
    const { id } = request.params;
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Patients WHERE patient_id = ?', [id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to retrieve patient' }).code(500));
            } else if (results.length > 0) {
                resolve(h.response(results[0]));
            } else {
                resolve(h.response({ message: 'Patient not found' }).code(404));
            }
        });
    });
};

const addPatient = (request, h) => {
    const { username, email, password } = request.payload;

    // Lakukan pengecekan apakah nama pasien sudah ada di database
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Patients WHERE username = ?', [username], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to check for existing patient' }).code(500));
            } else if (results.length > 0) {
                reject(h.response({ error: 'Patient with the same username already exists' }).code(400));
            } else {
                // Jika tidak ada nama yang sama, lanjutkan dengan menambahkan data
                const patient_id = nanoid();
                const newPatient = { patient_id, username, email, password };

                db.query('INSERT INTO Patients SET ?', newPatient, (err) => {
                    if (err) {
                        reject(h.response({ error: 'Failed to add patient' }).code(500));
                    } else {
                        resolve(h.response(newPatient).code(201));
                    }
                });
            }
        });
    });
};


const updatePatient = (request, h) => {
    const { id } = request.params;
    const { username, email, password } = request.payload;

    return new Promise((resolve, reject) => {
        db.query('UPDATE Patients SET ? WHERE patient_id = ?', [{ username, email, password }, id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to update patient' }).code(500));
            } else if (results.affectedRows > 0) {
                resolve(h.response({ patient_id: id, username, email, password }));
            } else {
                resolve(h.response({ message: 'Patient not found' }).code(404));
            }
        });
    });
};

const deletePatient = (request, h) => {
    const { id } = request.params;

    return new Promise((resolve, reject) => {
        db.query('DELETE FROM Patients WHERE patient_id = ?', [id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to delete patient' }).code(500));
            } else if (results.affectedRows > 0) {
                resolve(h.response({ message: 'Patient deleted' }));
            } else {
                resolve(h.response({ message: 'Patient not found' }).code(404));
            }
        });
    });
};

module.exports = {
    getAllPatients,
    getPatientById,
    addPatient,
    updatePatient,
    deletePatient,
};
