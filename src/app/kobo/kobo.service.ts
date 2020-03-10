import {KoboFormResponse} from './kobo-form-response';
import rp = require('request-promise');

export class KoboService {

    static async getFormResponse(formId: string, token: string): Promise<KoboFormResponse> {
        return rp({
            uri: `https://kobo.humanitarianresponse.info/api/v2/assets/${formId}/data?format=json&limit=30000`,
            headers: {
                'Authorization': `Token ${token}`
            },
            json: true
        });
    }

}
