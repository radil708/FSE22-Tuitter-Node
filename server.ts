import * as express from 'express';
import {Request, Response} from "express";

const app = express();

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome WebDev!'));

const PORT = 3000;
app.listen(process.env.PORT || PORT);
