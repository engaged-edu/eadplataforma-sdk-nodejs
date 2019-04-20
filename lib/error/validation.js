'use strict';

const debug = require('../debug')('validation-error');

class EADPlataformaValidationError extends Error {
    constructor(message, payload) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.payload = payload;
        debug('%s (%o)', message, payload);
        return this;
    }
}

module.exports = EADPlataformaValidationError;
