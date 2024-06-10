const {
    getAllPatients,
    getPatientById,
    addPatient,
    updatePatient,
    deletePatient
} = require('../handlers/patientHandler');

const patientRoutes = [
    {
        method: 'GET',
        path: '/patients',
        handler: getAllPatients,
    },
    {
        method: 'GET',
        path: '/patients/{id}',
        handler: getPatientById,
    },
    {
        method: 'POST',
        path: '/patients',
        handler: addPatient,
    },
    {
        method: 'PUT',
        path: '/patients/{id}',
        handler: updatePatient,
    },
    {
        method: 'DELETE',
        path: '/patients/{id}',
        handler: deletePatient,
    },
];

module.exports = patientRoutes;
