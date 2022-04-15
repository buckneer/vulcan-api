import express from 'express';
import config from 'config';
import cors from "cors";
import log from './logger';
import connect from "./db/connect";
import routes from "./routes";
import {deserializeUser} from "./middleware";

const port = config.get('port') as number;
const host = config.get('host') as string;

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(deserializeUser);

app.listen(port, host, () => {
    log.info(`Server running at http://${host}:${port}`);
    connect();

    routes(app);
})
