const {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    deleteDoctor
} = require('../handlers/doctorHandler');

const doctorRoutes = [
    {
        method: 'GET',
        path: '/doctors',
        handler: getAllDoctors,
    },
    {
        method: 'GET',
        path: '/doctors/{id}',
        handler: getDoctorById,
    },
    {
        method: 'POST',
        path: '/doctors',
        handler: addDoctor,
    },
    {
        method: 'DELETE',
        path: '/doctors/{id}',
        handler: deleteDoctor,
    },
];

module.exports = doctorRoutes;
