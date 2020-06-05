import express from 'express';
import bodyParser from 'body-parser';
import routes from './Routes';

const HOST = process.env.HOST || "0.0.0.0";
const PORT = parseInt(process.env.PORT) || 5000;

const app = express();
app.use(bodyParser.json())

app.use(routes);

app.listen(PORT, HOST, () => console.log(`Example app listening at http://${HOST}:${PORT}`))

