const {
    registerPatient,
    registerDoctor,
    loginPatient,
    loginDoctor
} = require('../handlers/authHandler');

const authRoutes = [
    {
        method: 'POST',
        path: '/register/patient',
        handler: registerPatient
    },
    {
        method: 'POST',
        path: '/register/doctor',
        handler: registerDoctor
    },
    {
        method: 'POST',
        path: '/login/patient',
        handler: loginPatient
    },
    {
        method: 'POST',
        path: '/login/doctor',
        handler: loginDoctor
    },
];

module.exports = authRoutes;
