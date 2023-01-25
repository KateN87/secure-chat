import express from 'express';
import * as url from 'url';
import privateRoutes from './routes/private.js';
import publicRoutes from './routes/public.js';
import { authenticateUser, createToken } from './auth.js';

const app = express();
const staticPath = url.fileURLToPath(new URL('../static', import.meta.url));

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
};

app.use(express.json());
app.use(logger);
app.use(express.static(staticPath));
app.use('/api/public/', publicRoutes);
app.use('api/private', privateRoutes);

app.post('/login', (req, res) => {
    const { userName, password } = req.body;

    if (authenticateUser(userName, password)) {
        const userToken = createToken(userName);
        res.status(200).send(userToken);
    } else {
        console.log('Unauthorized user, req.body: ', req.body);
        res.sendStatus(401);
    }
});

export { app };
