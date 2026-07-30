import {
  Card,
  Rank,
  Suit,
} from "../../cards/Card";

import {
  Seat,
} from "../../core/Seat";

import {
  TrickWinner,
} from "../TrickWinner";

const winner =
  TrickWinner.determine(
    [
      {
        seat: Seat.North,
        card: new Card(
          Suit.Spades,
          Rank.Ten
        ),
      },

      {
        seat: Seat.East,
        card: new Card(
          Suit.Spades,
          Rank.Ace
        ),
      },

      {
        seat: Seat.South,
        card: new Card(
          Suit.Hearts,
          Rank.King
        ),
      },

      {
        seat: Seat.West,
        card: new Card(
          Suit.Spades,
          Rank.Queen
        ),
      },
    ],
    "NT"
  );

console.log(
  "Winner:",
  winner
);