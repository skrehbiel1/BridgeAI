import {
    Seat,
    nextSeat
} from "./Seat";

import { Contract } from "../play/Contract";

export function partnerOfSeat(
    seat: Seat
): Seat {
    return nextSeat(
        nextSeat(seat)
    );
}

export function dummyForContract(
    contract: Contract
): Seat {
    return partnerOfSeat(
        contract.declarer
    );
}

export function openingLeaderForContract(
    contract: Contract
): Seat {
    return nextSeat(
        contract.declarer
    );
}