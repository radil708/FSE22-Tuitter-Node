import * as express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Welcome WebDev!'));
const PORT = 3000;
app.listen(process.env.PORT || PORT);
