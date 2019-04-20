'use strict';

module.exports = function eadPlataformaHTTPCode() {
    return new Proxy(
        {
            200: {
                // OK # Success
                ok: true,
                reason: 'Request is valid and we have a response.',
            },
            201: {
                // Created # Item was created
                ok: true,
                reason: 'Item was added to the list.',
            },
            400: {
                // Bad Request # Error in request
                ok: false,
                reason:
                    'There was a problem with request. The response body contains more information about the cause, most likely a syntax issue.',
            },
            401: {
                // Unauthorized # Problem with key authentication
                ok: false,
                reason:
                    'The API that was used is not valid. Please check the key format and it’s value in your dashboard.',
            },
            403: {
                // Forbidden # Problem with the account
                ok: false,
                reason: 'There is a problem with your account. Please get in touch with us for more information.',
            },
            404: {
                // Not Found # Not found
                ok: false,
                reason: 'The order was not found in our database.',
            },
            405: {
                // Method Not Allowed # Method does not exist
                ok: false,
                reason: 'The HTTP method used is not allowed for this resource.',
            },
            429: {
                // Too Many Requests # Request limit reached
                ok: false,
                reason:
                    'You have reached the limit of permitted requests. Please get in touch with us for more information.',
            },
            444: {
                // No Response # No response
                ok: false,
                reason:
                    'The address for the request is invalid and the server has closed the connection. Please check the URL you are using to send requests.',
            },
            500: {
                // Server Error # Internal server error
                ok: false,
                reason:
                    'There was an internal error when processing your request. You should get in touch with us for more information.',
            },
            default: {
                ok: false,
                reason: 'Unexpected response.',
            },
        },
        {
            get: function(codes, code) {
                return code in codes ? codes[code] : codes.default;
            },
        },
    );
};
