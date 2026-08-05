import { Card } from "../cards/Card";
import { Seat } from "../core/Seat";

import {
    PlayExplanation
} from "../ai/PlayExplanation";

export interface PlayedCard {
    seat: Seat;
    card: Card;

    explanation?:
        PlayExplanation;
}