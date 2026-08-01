import { Card } from "../cards/Card";
import { Seat } from "../core/Seat";

export class PlayRecord {

    constructor(

        public seat: Seat,

        public card: Card

    ) {}

}