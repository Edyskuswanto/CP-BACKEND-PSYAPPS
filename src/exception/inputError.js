const clientError = require('../exception/clientError');

class inputError extends clientError {
    constructor(message) {
        super(message);
        this.name = 'inputError';
    }
}

module.exports = inputError;