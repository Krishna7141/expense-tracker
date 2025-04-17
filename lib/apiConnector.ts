import axios from "axios";

interface ApiProps {
    method: string | null;
    url: string | null;
    bodyData: {} | null;
    headers: string | null;
    params: string | null;
}

export const axiosInstance = axios.create({});
export const apiConnector = (method:any, url:any, bodyData:any, headers:any, params:any) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    })
}