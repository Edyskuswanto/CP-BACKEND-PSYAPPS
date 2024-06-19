const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { promisify } = require('util');
const SECRET_KEY = 'edys123'

const registerPatient = async (request, h) => {
    try {
        const { username, email, password } = request.payload;
        const patient_id = nanoid(10); // Generate unique patient_id
        const query = {
            text: 'INSERT INTO Patients( patient_id, username, email, password) VALUES(?, ?, ?, ?)',
            values: [patient_id, username, email, password] // Note: Password not hashed
        };

        await db.query(query.text, query.values); // Execute the query with text and values

        return {
            error: false,
            message: 'Patient Created'
        };
    } catch (err) {
        console.error('Error registering patient:', err);
        return h.response({
            error: true,
            message: 'Failed to register patient'
        }).code(500);
    }
};


const registerDoctor = async (request, h) => {
    try {
        const { username, email, password } = request.payload;
        const doctor_id = nanoid(10); // Generate unique doctor_id
        const query = {
            text: 'INSERT INTO Doctors(doctor_id, username, email, password) VALUES(?, ?, ?, ?)',
            values: [doctor_id, username, email, password] // Note: Password not hashed
        };

        await db.query(query.text, query.values); // Execute the query with text and values

        return {
            error: false,
            message: 'Doctor Created'
        };
    } catch (err) {
        console.error('Error registering doctor:', err);
        return h.response({
            error: true,
            message: 'Failed to register doctor'
        }).code(500);
    }
};

const queryAsync = promisify(db.query).bind(db);


const loginPatient = async (request, h) => {
    const { email, password } = request.payload;

    console.log('Login request received for email:', email);

    try {
        // Query untuk mencari patient berdasarkan email
        const query = {
            text: 'SELECT * FROM Patients WHERE email = ?',
            values: [email]
        };

        console.log('Executing query:', query);

        // Lakukan query ke database
        const result = await queryAsync(query.text, query.values);

        // Pastikan hasil query ada dan hanya mengambil row pertama
        if (result.length > 0) {
            const patient = result[0]; // Ambil row pertama dari hasil query

            // Bandingkan password yang dimasukkan dengan password di database
            if (password === patient.password) { // Note: Comparing passwords directly (not hashed)
                // Generate token JWT untuk autentikasi sukses


                const token = jwt.sign({ patient_id: patient.patient_id }, SECRET_KEY, { expiresIn: '1h' });

                // Respons dengan token dan data patient
                return h.response({
                    error: false,
                    message: 'Success',
                    loginResult: {
                        patient_id: patient.patient_id,
                        username: patient.username,
                        token
                    }
                }).code(200);
            } else {
                // Jika password tidak cocok
                console.log('Invalid credentials: password mismatch');
                return h.response({
                    error: true,
                    message: 'Invalid credentials'
                }).code(401);
            }
        } else {
            // Jika tidak ada patient dengan email yang ditemukan
            console.log('Invalid credentials: no patient found with the given email');
            return h.response({
                error: true,
                message: 'Invalid credentials'
            }).code(401);
        }
    } catch (err) {
        // Tangani kesalahan yang terjadi saat proses login
        console.error('Error logging in patient:', err);
        return h.response({
            error: true,
            message: 'Failed to login patient'
        }).code(500);
    }
};

const loginDoctor = async (request, h) => {
    const { email, password } = request.payload;
    console.log('Login request received for email:', email);

    try {
        //Quert untuk mencari doctor berdasarkan email
        const query = {
            text: 'SELECT * FROM Doctors WHERE email = ?',
            values: [email]
        };

        //Lakukan query ke database
        const result = await queryAsync(query.text, query.values);

        //Pastikan query ada dan hanya mengambil row pertama
        if (result.length > 0) {
            const doctor = result[0]; //Ambil row pertama dari hasil query

            // Bandingkan password yang dimasukkan dengan password di database
            if (password === doctor.password) { // Note: Comparing passwords directly (not hashed)

                //Generate token JWT untuk authentikasi sukses
                const token = jwt.sign({ doctor_id: doctor.doctor_id }, SECRET_KEY, { expiresIn: '24h' });

                //Respon dengan token dan data doctor
                return h.response({
                    error: false,
                    message: 'Success',
                    loginResult: {
                        doctor_id: doctor.doctor_id,
                        username: doctor.username,
                        token
                    }
                }).code(200);
            } else {
                //Jika password tidak cocok
                console.log('Invalid credentials: Password mismatch');
                return h.response({
                    error: true,
                    message: 'Invalid credentials'
                }).code(401);
            }
        } else {
            //Jika tidak ada doctor dengan email yang ditemukan 
            console.log('Invalid credentials: no doctor found with the given email');
            return h.response({
                error: true,
                message: 'Invalid credentials'
            }).code(401);
        }
    } catch (err) {
        //Tangani kesalahan yang terjadi saat proses login
        console.error('Error logging in doctor:', err);
        return h.response({
            error: true,
            message: 'Failed to login doctor'
        }).code(500);
    }
};


module.exports = {
    registerPatient,
    registerDoctor,
    loginPatient,
    loginDoctor
};
