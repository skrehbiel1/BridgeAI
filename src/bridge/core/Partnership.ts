import { Seat } from "./Seat";

export enum Partnership {
  NS = "NS",
  EW = "EW",
}

export function partnershipOf(
  seat: Seat
): Partnership {
  return seat === Seat.North ||
    seat === Seat.South
    ? Partnership.NS
    : Partnership.EW;
}