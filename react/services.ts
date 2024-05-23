import { jitsiLocalStorage } from '@jitsi/js-utils';
import { isMobileBrowser } from './features/base/environment/utils';

const baseUrl = 'https://cm3.centralus.cloudapp.azure.com:8081/api/';
let accessToken;
const token = jitsiLocalStorage.getItem('token');


const API = {
    request: async (method: string, endpoint: string, data?: any, useToken= true) => {
        let dataObj: any = {
            method: method,
            headers: {
                'content-type': 'Application/json',
            },
        }
        accessToken = APP.store.getState()['features/recent-list'];

        if(useToken) {
            dataObj['headers']['Authorization'] = isMobileBrowser() ? `Bearer ${accessToken[0].conference.split('token')[1]}` : `Bearer ${token}`
        }

        let queryParams = '?'
        let url
        if (method === 'GET' && data) {
            for (const key in data) {
                queryParams += `${key}=${data[key]}&`
            }
            url = baseUrl + endpoint + queryParams
        }
        else {
            if(data) dataObj['body'] = data
            url = baseUrl + endpoint
        }
        try {
            const res = await fetch(url,dataObj)
            console.log('ressss',res);
            return await res.json()
        }
        catch(err){
            return err
        }
    }
}
export default API;
