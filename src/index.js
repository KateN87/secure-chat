import * as dotenv from 'dotenv';
import { app } from './server.js';

dotenv.config();
const port = process.env.port;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
