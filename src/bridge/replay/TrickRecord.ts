import { Seat } from "../core/Seat";
import { PlayRecord } from "./PlayRecord";

export class TrickRecord {

    plays: PlayRecord[] = [];

    winner?: Seat;

    addPlay(
        play: PlayRecord
    ) {

        this.plays.push(play);

    }

    isComplete() {

        return this.plays.length === 4;

    }

}