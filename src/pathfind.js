module.exports = {
  // Ходы которые не убьют
  safeMoves (gameData) {
    const self = gameData.snakes.find(snake => snake.id == gameData.you);

    const avaiableMoves = [
      { direction: "right", x: self.coords[0][0] + 1, y: self.coords[0][1] },
      { direction: "down", x: self.coords[0][0], y: self.coords[0][1] + 1 },
      { direction: "left", x: self.coords[0][0] - 1, y: self.coords[0][1] },
      { direction: "up", x: self.coords[0][0], y: self.coords[0][1] - 1 }
    ];

    let snakeBodies = [];
    let snakeHeads = [];
    
    for(let snake of gameData.snakes) {
      snakeBodies = [...snakeBodies, ...snake.coords];
      
      if(snake.id !== self.id) {
        snakeHeads.push(snake.coords[0]);
      }
    }

    return avaiableMoves
      // Не ходить за границы поля
      .filter(move => {
        return  move.x < gameData.width &&
                move.x >= 0 &&
                move.y < gameData.height &&
                move.y >= 0
      })
      // Не ходить в себя и тела других змей
      .filter(move => !snakeBodies.find(coord => coord[0] == move.x && coord[1] == move.y));
    ;
  },

  // Направление до ближайшей жрачки
  foodDirection(gameData, safeMoves) {
    const self = gameData.snakes.find(snake => snake.id == gameData.you);

    if(gameData.food.length == 0) return safeMoves;

    const food = gameData.food
      .sort((a,b) => {
        return  (Math.abs(self.coords[0][0] - b[0]) + Math.abs(self.coords[0][1] - b[1])) -
                (Math.abs(self.coords[0][0] - a[0]) + Math.abs(self.coords[0][1] - a[1]));
      })[0];

    let foodMoves = safeMoves.map(move => {
        move.foodDistance = Math.abs(move.x - food[0]) + Math.abs(move.y - food[1]);
        return move;
      })
      .sort((move1, move2) => move1.foodDistance - move2.foodDistance);

    console.log(foodMoves);

    return [foodMoves[0]];
  }
}