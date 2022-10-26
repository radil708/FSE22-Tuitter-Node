/**
 * @file Implements an Express Node HTTP server.
 */
import * as express from 'express';
import {Request, Response} from 'express';
import mongoose from "mongoose";
const cors = require('cors')

const app = express();
app.use(cors()); //Allows servers and clients to talk safely
app.use(express.json()); // Allows server to parse data coming from clients

function sayHello (req: Request, res: Response) {
    res.send('Hi from FSD!')
}

function defaultPage (req: Request, res: Response) {
    res.send('Welcome to Ramzi\'s FS22 SoftEng AWS server');
}

app.get('/', defaultPage);
app.get('/hello', sayHello);

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku/AWS if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
