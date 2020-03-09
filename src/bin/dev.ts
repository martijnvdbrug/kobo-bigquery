import express = require('express');
import {koboToBigQuery} from '../index';
// Dev server for local testing of Cloud function
const app = express();
app.get('/*', koboToBigQuery);
app.listen(9000, () => console.log(`Dev server listening on :9000`));
