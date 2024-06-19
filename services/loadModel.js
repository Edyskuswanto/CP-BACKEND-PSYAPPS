const tfjs = require('@tensorflow/tfjs-node');

async function loadModel() {
    const MODEL_URL = 'https://storage.cloud.google.com/cp-psyapps-425414.appspot.com/ModelML/model_klasifikasi.json';
    return tfjs.loadGraphModel(process.env.MODEL_URL);
}

function predict(model) {
    const tensorflow = tfjs.node
        .decodeJpeg(imaageBuffer)
        .resizeNearestNeighbor([150, 150])
        .expandDims()
        .toFloat();

    return model.predict(tensorflow).data();
}

module.exports = { loadModel, predict };