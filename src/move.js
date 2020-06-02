const findPath = require("./findPath");
const { performance } = require('perf_hooks');

module.exports = (request, response) => {
  const startTime = performance.now();
  const gameData = request.body;
  //console.log(gameData);


  gameData.self = gameData.snakes.find(snake => snake.id == gameData.you);

  const findedMove = findPath(gameData, (gameData.width+gameData.height)*2);
  //console.log(findedMove)
  const move = findedMove && findedMove.direction ? findedMove.direction : "up";

  console.log('MOVE: ' + move + ", " + parseFloat(performance.now() - startTime).toFixed(2) + "ms");
  response.status(200).send({
    move: move
  })
}