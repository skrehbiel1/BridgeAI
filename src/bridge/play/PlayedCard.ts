import { Card } from "../cards/Card";
import { Seat } from "../core/Seat";

export interface PlayedCard {
  seat: Seat;
  card: Card;
}