import { Seat } from "./Seat";
import { BridgeAI } from "../ai/BridgeAI";


export class PlayerController {

    constructor(
        public seat: Seat,
        public ai?: BridgeAI
    ) {}


    isComputer(){

        return this.ai !== undefined;

    }

}