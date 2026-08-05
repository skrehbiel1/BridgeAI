import { Card } from "../cards/Card";

import {
    PlayExplanation
} from "./PlayExplanation";

export interface PlayDecision {
    card: Card;

    explanation:
        PlayExplanation;
}