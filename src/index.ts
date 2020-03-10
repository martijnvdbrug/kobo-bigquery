import {Request, Response} from 'express';

import {BigqueryService} from './app/bigquery/bigquery.service';
import {KoboService} from './app/kobo/kobo.service';

export const koboToBigQuery = async (req: Request, res: Response) => {
    try {
        if (!req.path || req.path.length <= 1) {
            return res.send(`Please specify a Kobo project ID in the URL: http://test.function.com/this-should-be-an-id`);
        }
        const koboId = req.path.substring(1);
        const token = req.header('Authorization');
        if (!token) {
            return res.send(`Please pass a valid Kobo token as Authorization header: 'Authorization: d2f237453dd133fe'. Token can be retrieved here https://kobo.humanitarianresponse.info/token?format=json`);
        }
        const formResponses = await KoboService.getFormResponse(koboId, token);
        await BigqueryService.toBigQuery(koboId, formResponses.results);
        const msg = `${formResponses.count} responses processed for form ${koboId}`;
        console.log(msg);
        res.send(msg);
    } catch (err) {
        res.status(500).send(err);
    }
};
