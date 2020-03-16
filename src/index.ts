import {Request, Response} from 'express';

import {BigqueryService} from './app/bigquery/bigquery.service';
import {KoboService} from './app/kobo/kobo.service';

export const koboToBigQuery = async (req: Request, res: Response) => {
    try {
        if (!req.path || req.path.length <= 1) {
            return res.send(`Please specify a Kobo project ID and token in the URL: http://test.function.com/token/this-should-be-an-id`);
        }
        if (req.path === '/test') {
            return res.send(`Cloud Function successfully deployed`);
        }
        const [token, koboId] = req.path.substring(1).split('/');
        if (!token || !koboId) {
            return res.send(`Please specify a Kobo project ID and token in the URL: http://test.function.com/token/this-should-be-an-id`);
        }
        const formResponses = await KoboService.getFormResponse(koboId, token);
        await BigqueryService.toBigQuery(koboId, formResponses.results);
        const msg = `${formResponses.count} responses processed for form ${koboId}`;
        res.send(msg);
    } catch (err) {
        res.status(500).send(err);
    }
};
