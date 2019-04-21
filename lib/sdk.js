'use strict';

const joi = require('joi');
const axios = require('axios');
const types = require('./types');
const debug = require('./debug')('sdk');
const Config = require('./config');
const httpCode = require('./http-code')();
const { EADPlataformaAPIError, EADPlataformaValidationError } = require('./error');

const buildBaseURL = ({ apiProtocol, apiSubdomain, apiDomain, apiPath } = {}) =>
    `${apiProtocol}://${apiSubdomain}.${apiDomain}/${apiPath}`;

const buildAuthorizationHeader = ({ apiKey } = {}) => `Token token="${apiKey}"`;

const transformRequest = (data = {}) =>
    Object.entries(data)
        .map(prop => `${encodeURIComponent(prop[0])}=${encodeURIComponent(prop[1])}`)
        .join('&');

const validateParamsObject = (params, schema) => {
    const { error, value } = joi.validate(
        params,
        joi
            .object()
            .keys(schema)
            .required(),
    );
    if (error) {
        throw new EADPlataformaValidationError(error.message, error.details);
    }
    return value;
};

const validateResponseObject = (response, schema) => {
    const { error } = joi.validate(
        response,
        joi
            .object()
            .keys(schema)
            .unknown()
            .required(),
    );
    if (error) {
        const message = response.msg || error.message;
        throw new EADPlataformaAPIError(message, response);
    }
    return response;
};

const validateResponseArray = response => (Array.isArray(response) ? response : []);

class EADPlataformaSDK {
    constructor(options) {
        this._config = Config(options);
        this._client = axios.create({
            baseURL: buildBaseURL(this._config),
            timeout: this._config.apiTimeout,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            validateStatus: null,
        });
        this._client.defaults.headers.common['Authorization'] = buildAuthorizationHeader(this._config);
        this._client.interceptors.response.use(({ status, data } = {}) => {
            const { ok, reason } = httpCode[status];
            if (!ok) {
                return Promise.reject(new EADPlataformaAPIError(reason, data));
            }
            if (data.Error) {
                return Promise.reject(new EADPlataformaAPIError(data.Error, data));
            }
            return Promise.resolve(data);
        });
        return this;
    }

    async callAPI({ url, method, params, data } = {}) {
        debug('Calling [%s] /(%s) params(%o) data(%o)', method, url, params, data);
        try {
            return await this._client({
                url,
                method,
                params,
                data: transformRequest(data),
            });
        } catch (requestError) {
            if (requestError instanceof EADPlataformaAPIError) {
                throw requestError;
            }
            throw new EADPlataformaAPIError(requestError.message, requestError.request);
        }
    }

    async findUserByEmail(params) {
        const value = validateParamsObject(params, {
            email: joi
                .string()
                .email()
                .required(),
        });
        const response = await this.callAPI({
            url: 'student',
            method: 'get',
            params: value,
        });
        return validateResponseArray(response);
    }

    async createUser(params) {
        const value = validateParamsObject(params, {
            name: joi.string().required(),
            email: joi
                .string()
                .email()
                .required(),
            type: joi
                .number()
                .default(types.USER_TYPE.STUDENT)
                .valid([types.USER_TYPE.STUDENT, types.USER_TYPE.TEACHER, types.USER_TYPE.ADM]),
            status: joi
                .number()
                .default(types.USER_STATUS.CONFIRMED)
                .valid([types.USER_STATUS.CONFIRMED, types.USER_STATUS.NOT_CONFIRMED]),
        });
        const response = await this.callAPI({
            url: 'student',
            method: 'post',
            data: {
                nome: value.name,
                email: value.email,
                tipo: value.type,
                status: value.status,
            },
        });
        return validateResponseObject(response, {
            id: joi.string().required(),
        });
    }

    async findUserEnrollmentAtCourse(params) {
        const value = validateParamsObject(params, {
            userId: joi.string().required(),
            courseId: joi.string().required(),
        });
        const response = await this.callAPI({
            url: 'enrollment',
            method: 'get',
            params: {
                curso: value.courseId,
                usuario_id: value.userId,
            },
        });
        return validateResponseArray(response);
    }

    async enrollUserAtCourse(params) {
        const value = validateParamsObject(params, {
            userId: joi.string().required(),
            courseId: joi.string().required(),
        });
        const response = await this.callAPI({
            url: 'enrollment',
            method: 'post',
            data: {
                curso_id: value.courseId,
                usuario_id: value.userId,
            },
        });
        return validateResponseObject(response, {
            id: joi.string().required(),
        });
    }
}

module.exports = EADPlataformaSDK;
