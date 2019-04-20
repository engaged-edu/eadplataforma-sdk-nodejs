'use strict';

const { EADPlataformaSDK } = require('../index');

const _ = require('lodash');
const assert = require('assert');

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
});
