export enum Seat {
  North = "North",
  East = "East",
  South = "South",
  West = "West",
}

export const SeatOrder: Seat[] = [
  Seat.North,
  Seat.East,
  Seat.South,
  Seat.West,
];

export function nextSeat(seat: Seat): Seat {
  const index = SeatOrder.indexOf(seat);
  return SeatOrder[(index + 1) % 4];
}