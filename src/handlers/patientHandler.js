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
    const { name, gender, email } = request.payload;
    const patient_id = nanoid();
    const newPatient = { patient_id, name, gender, email };

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO Patients SET ?', newPatient, (err) => {
            if (err) {
                reject(h.response({ error: 'Failed to add patient' }).code(500));
            } else {
                resolve(h.response(newPatient).code(201));
            }
        });
    });
};

const updatePatient = (request, h) => {
    const { id } = request.params;
    const { name, gender, email } = request.payload;

    return new Promise((resolve, reject) => {
        db.query('UPDATE Patients SET ? WHERE patient_id = ?', [{ name, gender, email }, id], (err, results) => {
            if (err) {
                reject(h.response({ error: 'Failed to update patient' }).code(500));
            } else if (results.affectedRows > 0) {
                resolve(h.response({ patient_id: id, name, gender, email }));
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
