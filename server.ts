import * as express from 'express';
import {Request, Response} from "express";

const app = express();

function defaultPage (req: Request, res: Response) {
    res.send('Welcome to Ramzi\'s Fall2022 SoftEng Home Page')
}

app.get('/',defaultPage)

const PORT = 3000;
app.listen(process.env.PORT || PORT);
