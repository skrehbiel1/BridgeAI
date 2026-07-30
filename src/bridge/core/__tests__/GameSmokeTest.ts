import { Game } from "../Game";
import { Contract } from "../../play/Contract";
import { Seat } from "../Seat";

const game =
  new Game(
    new Contract(
      4,
      "♠",
      Seat.South
    ),
    Seat.West
  );

console.log(
  game.handOf(
    Seat.South
  ).count()
);