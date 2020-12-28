import { get, post } from 'axios';

const getFromUrl = async (url, headers, queryParams = {}) => {
    try {
        const response = await get(url, headers, queryParams);
        return response.data;
    } catch (er) {

    }

};

const postCall = async (url, headers, data) => {
    try {
        const response = await post(url, data, headers);
        console.log(response);
        return response.data;
    } catch (er) {

    }
}

const uploadFile = async (url, data) => {
    const headers = {
        'content-type': 'multipart/form-data'
    }
    // return queryAsync(url, 'PUT', headers, data).then()
}

export {
    getFromUrl,
    postCall,
    uploadFile
};

