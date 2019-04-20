'use strict';

const debug = require('debug')('eadplataforma-sdk');

module.exports = function eadPlataformaDebug(workspace) {
    return debug.extend(workspace);
};
