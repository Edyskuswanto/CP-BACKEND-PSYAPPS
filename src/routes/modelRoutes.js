const { handlePrediction } = require('./modelHandler');

const modelRoutes = [
    {
        method: 'POST',
        path: '/predict',
        handler: handlePrediction
    }
];

module.exports = modelRoutes;
