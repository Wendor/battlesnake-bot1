const pathfind = require("./pathfind");

module.exports = (request, response) => {
  const gameData = request.body;

  //console.log(gameData);

  const possibleMoves = pathfind.safeMoves(gameData);
  const moves = pathfind.foodDirection(gameData, possibleMoves);

  let move = moves.length ? moves[Math.floor(Math.random() * moves.length)].direction : "up";
  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}