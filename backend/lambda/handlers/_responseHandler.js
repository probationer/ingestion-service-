'use strict';

exports.callbackRespondWithCodeOnly = async function (code ) {
    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "*"
        }
    };
};

exports.callbackRespondWithSimpleMessage = async function (code, message) {

    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
            message: message
        })
    };
};

exports.callbackRespondWithJsonBody = async function (code, body) {

    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(body)
    };
};
