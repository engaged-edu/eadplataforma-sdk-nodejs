'use strict';

const Debug = require('debug');
Debug.enable('eadplataforma-sdk:*');

const { EADPlataformaSDK, Types } = require('../index');

const _ = require('lodash');
const joi = require('joi');
const assert = require('assert');
const dotenv = require('dotenv');

describe('EAD Plataforma SDK', () => {
    describe('Configuration', () => {
        it('Should load settings from environment variables', () => {
            const config = {
                apiProtocol: {
                    envKey: 'EADPLATAFORMA_SDK_API_PROTOCOL',
                    envValue: 'http',
                },
                apiTimeout: {
                    envKey: 'EADPLATAFORMA_SDK_API_TIMEOUT',
                    envValue: '2000',
                    configValue: 2000,
                },
                apiDomain: {
                    envKey: 'EADPLATAFORMA_SDK_API_DOMAIN',
                    envValue: 'eadplataforma-test.com',
                },
                apiPath: {
                    envKey: 'EADPLATAFORMA_SDK_API_PATH',
                    envValue: 'api-test',
                },
                apiKey: {
                    envKey: 'EADPLATAFORMA_SDK_API_KEY',
                    envValue: '123456789',
                },
                apiSubdomain: {
                    envKey: 'EADPLATAFORMA_SDK_API_SUBDOMAIN',
                    envValue: 'myaccount',
                },
            };

            _.forIn(config, ({ envKey, envValue } = {}) => (process.env[envKey] = envValue));
            const sdk = new EADPlataformaSDK();
            const valid = _.every(
                sdk._config,
                (value, key) => value === (config[key].configValue || config[key].envValue),
            );
            assert.equal(valid, true);
        });

        it('Should subscribe environment settings with sdk constructor params', () => {
            const config = {
                apiProtocol: 'https',
                apiTimeout: 5000,
                apiDomain: 'eadplataforma-test-2.com',
                apiPath: 'api-test-2',
                apiKey: '000000000',
                apiSubdomain: 'youraccount',
            };
            const sdk = new EADPlataformaSDK(config);
            const valid = _.every(sdk._config, (value, key) => value === config[key]);
            assert.equal(valid, true);
        });
    });
    describe('API requests', () => {
        before(() => {
            const { parsed } = dotenv.config();

            // O curso ID deve existir na base de dados da conta que será usada no teste
            this.courseId = parsed.EADPLATAFORMA_SDK_TEST_COURSE_ID || '1';
            // O e-mail deve ser válido para que não haja falha ao criar o perfil do aluno
            this.userEmail = parsed.EADPLATAFORMA_SDK_TEST_USER_EMAIL || `joao.silva@mycompany.com`;

            this.sdk = new EADPlataformaSDK({
                apiProtocol: 'https',
                apiTimeout: 5000,
                apiDomain: 'eadplataforma.com',
                apiPath: 'api/1',
                apiKey: parsed.EADPLATAFORMA_SDK_API_KEY,
                apiSubdomain: parsed.EADPLATAFORMA_SDK_API_SUBDOMAIN,
            });
        });
        it('Should create user (student) over API', async () => {
            this.user = await this.sdk.createUser({
                name: 'João Silva',
                email: this.userEmail,
                type: Types.USER_TYPE.STUDENT,
                status: Types.USER_STATUS.CONFIRMED,
            });
            joi.assert(
                this.user,
                joi
                    .object()
                    .required()
                    .keys({
                        id: joi.string().required(),
                    })
                    .unknown(),
            );
        });
        it('Should find user by e-mail', async () => {
            const found = await this.sdk.findUserByEmail({
                email: this.userEmail,
            });
            joi.assert(
                found,
                joi
                    .array()
                    .required()
                    .length(1)
                    .ordered(
                        joi
                            .object()
                            .required()
                            .keys({
                                aluno_id: joi
                                    .string()
                                    .required()
                                    .valid(this.user.id),
                            })
                            .unknown(),
                    ),
            );
        });
        it('Should enroll user in course', async () => {
            this.enrollment = await this.sdk.enrollUserAtCourse({
                userId: this.user.id,
                courseId: this.courseId,
            });
            joi.assert(
                this.enrollment,
                joi
                    .object()
                    .required()
                    .keys({
                        id: joi.string().required(),
                    })
                    .unknown(),
            );
        });
        it('Should find user enrollment in course', async () => {
            const found = await this.sdk.findUserEnrollmentAtCourse({
                userId: this.user.id,
                courseId: this.courseId,
            });
            joi.assert(
                found,
                joi
                    .array()
                    .required()
                    .length(1)
                    .ordered(
                        joi
                            .object()
                            .required()
                            .keys({
                                matricula_id: joi
                                    .string()
                                    .required()
                                    .valid(this.enrollment.id),
                                aluno_id: joi
                                    .string()
                                    .required()
                                    .valid(this.user.id),
                                curso_id: joi
                                    .string()
                                    .required()
                                    .valid(this.courseId),
                            })
                            .unknown(),
                    ),
            );
        });
    });
});
