'use strict';

const debug = require('../debug')('api-error');

class EADPlataformaAPIError extends Error {
    constructor(message, response) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.response = response;
        debug('%s (%o)', message, response);
        return this;
    }
}

module.exports = EADPlataformaAPIError;
