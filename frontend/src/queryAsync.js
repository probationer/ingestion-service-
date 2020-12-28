import { get, post, put } from 'axios';

/** Get api call to given url */
const getCall = async (url, headers, queryParams = {}) => {
    try {
        const response = await get(url, headers, queryParams);
        return response.data;
    } catch (er) {

    }

};

/** Post api call to given url */
const postCall = async (url, headers, data) => {
    if (!headers) {
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    }
    try {
        const response = await post(url, data, headers);
        return response.data;
    } catch (er) {
        console.log("Er in post call ", er);
    }
}

/** Put/Update api call to given url */
const putCall = async (url, data) => {
    try {
        const response = await put(url, data);
        return response;
    } catch (er) {

    }
}

export {
    getCall,
    postCall,
    putCall,
};

