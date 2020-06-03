declare interface Move {
  direction: Direction,
  x: number,
  y: number,
  order: number,
  food_distance?: number
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default Move;