import { Seat } from "../core/Seat";
import { Suit } from "../cards/Card";

export type TrumpSuit =
  | Suit
  | "NT";

export class Contract {
  constructor(
    public level: number,
    public trump: TrumpSuit,
    public declarer: Seat
  ) {}

  requiredTricks(): number {
    return this.level + 6;
  }

  toString(): string {
    return `${this.level}${this.trump}`;
  }
}