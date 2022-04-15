import express from 'express';
import config from 'config';
import cors from "cors";
import log from './logger';
import connect from "./db/connect";
import routes from "./routes";
import {deserializeUser} from "./middleware";

const port = config.get('port') as number;
const host = config.get('host') as string;

const index = express();

index.use(cors())
index.use(express.json());
index.use(express.urlencoded({extended: false}))
index.use(deserializeUser);

index.listen(port, host, () => {
    log.info(`Server running at http://${host}:${port}`);
    connect();

    routes(index);
})
