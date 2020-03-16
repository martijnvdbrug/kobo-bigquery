import {BigQuery} from '@google-cloud/bigquery';
import fs = require('fs');

export class BigqueryService {

    static datasetId = 'kobo_responses';
    static bigquery = new BigQuery();

    static async toBigQuery(tableName: string, rows: any[]): Promise<void> {

        // Remove invalid types like Objects an inner Arrays
        rows.forEach(row => {
            Object.entries(row).sort().forEach(([key, value]) => {
                if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                    delete row[key];
                } else {
                    delete row[key];
                    row[key.replace(/\W/g, '')] = value;
                }
            });
        });
        // Remove invalid non-alphanumeric characters in field names
        let formattedJson = '';
        for (const row of rows) {
            formattedJson += JSON.stringify(row) + '\n';
        }
        fs.writeFileSync(`/tmp/${tableName}.json`, (formattedJson));
        await this.deleteTable(tableName);
        const metadata = {
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
            autodetect: true,
        };

        const [job] = await this.bigquery
            .dataset(this.datasetId)
            .table(tableName)
            .load(`/tmp/${tableName}.json`, metadata);
        // load() waits for the job to finish
        console.log(`Job ${job.id} completed.`);

        // Check the job's status for errors
        const errors = job.status.errors;
        if (errors && errors.length > 0) {
            throw errors;
        }
    }

    static async deleteTable(name: string): Promise<void> {
        try {
            await this.bigquery
                .dataset(this.datasetId)
                .table(name)
                .delete();
        } catch (e) {
            console.error(e);
        }
    }
}
