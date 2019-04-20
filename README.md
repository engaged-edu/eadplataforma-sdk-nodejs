# EAD Plataforma SDK for Node.js

## Installing

Using npm:

```bash
npm install eadplataforma-sdk-nodejs
```

## Configuration

The SDK settings can be loaded in two ways:

### Environment variables

| Variable                          | Default value       |
| --------------------------------- | ------------------- |
| `EADPLATAFORMA_SDK_API_KEY`       |
| `EADPLATAFORMA_SDK_API_SUBDOMAIN` |
| `EADPLATAFORMA_SDK_API_PROTOCOL`  | `https`             |
| `EADPLATAFORMA_SDK_API_TIMEOUT`   | `5000`              |
| `EADPLATAFORMA_SDK_API_DOMAIN`    | `eadplataforma.com` |
| `EADPLATAFORMA_SDK_API_PATH`      | `api/1`             |

### SDK params

```javascript
const { EADPlataformaSDK } = require('eadplataforma-sdk-nodejs');

const sdk = new EADPlataformaSDK({
    // required
    apiKey: 'my-api-key',

    // required
    apiSubdomain: 'my-account-subdomain',

    // default
    apiProtocol: 'https',

    // default
    apiTimeout: 5000,

    // default
    apiDomain: 'eadplataforma.com',

    // default
    apiPath: 'api/v1',
});
```

## Example

Enrolling a new student

```javascript
const { EADPlataformaSDK, Types } = require('eadplataforma-sdk-nodejs');

const sdk = new EADPlataformaSDK({
    apiKey: 'my-api-key',
    apiSubdomain: 'my-account-subdomain',
});

const student = await sdk.createUser({
    name: 'João da Silva',
    email: 'joao.silva@example.com',
    type: Types.USER_TYPE.STUDENT,
    status: Types.USER_STATUS.CONFIRMED,
});

const enrollment = await sdk.enrollUserAtCourse({
    userId: student.id,
    courseId: 'my-course-id'
});
```