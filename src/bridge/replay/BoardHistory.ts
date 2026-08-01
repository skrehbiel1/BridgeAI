import { Card } from "../cards/Card";
import { Seat } from "../core/Seat";

import { PlayRecord } from "./PlayRecord";
import { TrickRecord } from "./TrickRecord";

export class BoardHistory {

    tricks: TrickRecord[] = [];

    currentTrick(): TrickRecord {

        if (

            this.tricks.length === 0 ||

            this.tricks[
                this.tricks.length - 1
            ].isComplete()

        ) {

            this.tricks.push(
                new TrickRecord()
            );

        }

        return this.tricks[
            this.tricks.length - 1
        ];

    }

    recordPlay(

        seat: Seat,

        card: Card

    ) {

        this.currentTrick()

            .addPlay(

                new PlayRecord(
                    seat,
                    card
                )

            );

    }

completeTrick(
    winner: Seat
): void {
    const lastTrick =
        this.tricks[
            this.tricks.length - 1
        ];

    if (
        !lastTrick ||
        !lastTrick.isComplete()
    ) {
        throw new Error(
            "Cannot complete an incomplete trick"
        );
    }

    lastTrick.winner =
        winner;
}


    clear() {

        this.tricks = [];

    }

}