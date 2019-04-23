# EAD Plataforma SDK for Node.js

## Installing

Using npm:

```bash
npm install @engaged/eadplataforma-sdk-nodejs
```

## Configuration

The SDK settings can be loaded in two ways:

### Environment variables

| Variable                         | Default value |
| -------------------------------- | ------------- |
| `EADPLATAFORMA_SDK_API_KEY`      |
| `EADPLATAFORMA_SDK_API_DOMAIN`   |               |
| `EADPLATAFORMA_SDK_API_PROTOCOL` | `https`       |
| `EADPLATAFORMA_SDK_API_TIMEOUT`  | `5000`        |
| `EADPLATAFORMA_SDK_API_PATH`     | `api/1`       |

### SDK params

```javascript
const { EADPlataformaSDK } = require('@engaged/eadplataforma-sdk-nodejs');

const sdk = new EADPlataformaSDK({
    // required
    apiKey: 'my-api-key',

    // required
    apiDomain: 'myaccount.eadplataforma.com',

    // default
    apiProtocol: 'https',

    // default
    apiTimeout: 5000,

    // default
    apiPath: 'api/v1',
});
```

## Example

Enrolling a new student

```javascript
const { EADPlataformaSDK, Types } = require('@engaged/eadplataforma-sdk-nodejs');

const sdk = new EADPlataformaSDK({
    apiKey: 'my-api-key',
    apiDomain: 'myaccount.eadplataforma.com',
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