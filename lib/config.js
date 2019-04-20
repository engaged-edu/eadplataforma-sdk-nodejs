'use strict';

const joi = require('joi');
const { EADPlataformaValidationError } = require('./error');

module.exports = function eadPlataformaSDKConfig({
    apiProtocol,
    apiDomain,
    apiPath,
    apiKey,
    apiSubdomain,
    apiTimeout,
} = {}) {
    const config = {
        apiProtocol: apiProtocol || process.env.EADPLATAFORMA_SDK_API_PROTOCOL || 'https',
        apiTimeout: apiTimeout || process.env.EADPLATAFORMA_SDK_API_TIMEOUT || 5000,
        apiDomain: apiDomain || process.env.EADPLATAFORMA_SDK_API_DOMAIN || 'eadplataforma.com',
        apiPath: apiPath || process.env.EADPLATAFORMA_SDK_API_PATH || 'api/1',
        apiKey: apiKey || process.env.EADPLATAFORMA_SDK_API_KEY,
        apiSubdomain: apiSubdomain || process.env.EADPLATAFORMA_SDK_API_SUBDOMAIN,
    };
    const { error, value } = joi.validate(
        config,
        joi
            .object()
            .keys({
                apiProtocol: joi
                    .string()
                    .label('apiProtocol')
                    .valid(['http', 'https'])
                    .required(),
                apiTimeout: joi
                    .number()
                    .label('apiTimeout')
                    .positive()
                    .integer()
                    .required(),
                apiDomain: joi
                    .string()
                    .label('apiDomain')
                    .hostname()
                    .required(),
                apiPath: joi
                    .string()
                    .label('apiPath')
                    .required(),
                apiKey: joi
                    .string()
                    .label('apiKey')
                    .required(),
                apiSubdomain: joi
                    .string()
                    .label('apiSubdomain')
                    .required(),
            })
            .required(),
    );
    if (error) {
        throw new EADPlataformaValidationError(error.message, error.details);
    }
    return value;
};
