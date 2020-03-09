export class BigqueryService {

    static async toBigQuery(rows: any[]) {
        console.log(rows);
        rows.forEach(row => {
            Object.entries(row).forEach(([key, value]) => {
                console.log(`typeof ${value}: ${typeof value}`);
                if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                    delete row[key];
                }
            })
        });
        console.log(rows);
    }
}
