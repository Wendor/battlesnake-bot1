import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const PORT = parseInt(process.env.PORT) || 5000;

const app = express();
app.use(bodyParser.json())

app.use(routes);

app.listen(PORT, "0.0.0.0", () => console.log(`Example app listening at http://127.0.0.1:${PORT}`))

