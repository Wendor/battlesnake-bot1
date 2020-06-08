import express from 'express';
import bodyParser from 'body-parser';
import routes from './Routes';
import cluster from "cluster";
import calcPath from "./CalcPath";
import { ExtRequest } from './Global';

const HOST = process.env.HOST || "0.0.0.0";
const PORT = parseInt(process.env.PORT) || 5000;

// Основной процесс прикидывается веб-сервером и рождает дочерние для просчета пути
if(cluster.isMaster) {
  const workers: cluster.Worker[] = [];
  for (let i = 0; i < 3; i++) {
    workers.push(cluster.fork({ id: i}));
  }

  const app = express();
  app.use(bodyParser.json())
  app.use(function (req: ExtRequest, res, next) {
    req.workers = workers;
    next();
  });
  app.use(routes);
  app.listen(PORT, HOST, () => console.log(`Example app listening at http://${HOST}:${PORT}`));
} else {
  calcPath();
}

