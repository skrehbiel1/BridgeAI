import { Deck } from "../cards/Deck";
import { Hand } from "../cards/Hand";
import { Seat } from "./Seat";

export interface DealResult {
  [Seat.North]: Hand;
  [Seat.East]: Hand;
  [Seat.South]: Hand;
  [Seat.West]: Hand;
}

export class Deal {
  static create(): DealResult {
    const deck = new Deck();
    deck.shuffle();

    const north = new Hand();
    const east = new Hand();
    const south = new Hand();
    const west = new Hand();

    for (let i = 0; i < 13; i++) {
      north.add(deck.deal());
      east.add(deck.deal());
      south.add(deck.deal());
      west.add(deck.deal());
    }

    north.sort();
    east.sort();
    south.sort();
    west.sort();

    return {
      [Seat.North]: north,
      [Seat.East]: east,
      [Seat.South]: south,
      [Seat.West]: west,
    };
  }
}