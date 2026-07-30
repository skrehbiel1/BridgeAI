import {
  Card,
  Suit,
} from "../cards/Card";

import {
  PlayedCard,
} from "./PlayedCard";

import {
  TrumpSuit,
} from "./Contract";

import {
  Seat,
} from "../core/Seat";

export class TrickWinner {

  static determine(
    cards: PlayedCard[],
    trump: TrumpSuit
  ): Seat {

    if (
      cards.length === 0
    ) {
      throw new Error(
        "No cards played"
      );
    }

    const leadSuit =
      cards[0].card.suit;

    let winner =
      cards[0];

    for (
      const played of cards.slice(1)
    ) {

      if (
        this.beats(
          played.card,
          winner.card,
          leadSuit,
          trump
        )
      ) {
        winner = played;
      }
    }

    return winner.seat;
  }

  private static beats(
    candidate: Card,
    current: Card,
    leadSuit: Suit,
    trump: TrumpSuit
  ): boolean {

    const candidateTrump =
      trump !== "NT" &&
      candidate.suit === trump;

    const currentTrump =
      trump !== "NT" &&
      current.suit === trump;

    if (
      candidateTrump &&
      !currentTrump
    ) {
      return true;
    }

    if (
      !candidateTrump &&
      currentTrump
    ) {
      return false;
    }

    if (
      candidate.suit ===
      current.suit
    ) {
      return (
        candidate.rank >
        current.rank
      );
    }

    if (
      candidate.suit ===
        leadSuit &&
      current.suit !==
        leadSuit
    ) {
      return true;
    }

    return false;
  }
}