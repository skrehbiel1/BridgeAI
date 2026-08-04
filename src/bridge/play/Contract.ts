import { Seat } from "../core/Seat";
import { Suit } from "../cards/Card";

export type TrumpSuit =
    | Suit
    | "NT";

export enum ContractMultiplier {
    Undoubled = 1,
    Doubled = 2,
    Redoubled = 4
}

export class Contract {
    constructor(
        public level: number,
        public trump: TrumpSuit,
        public declarer: Seat,
        public multiplier:
            ContractMultiplier =
                ContractMultiplier.Undoubled
    ) {}

    requiredTricks(): number {
        return this.level + 6;
    }

    isDoubled(): boolean {
        return (
            this.multiplier ===
            ContractMultiplier.Doubled
        );
    }

    isRedoubled(): boolean {
        return (
            this.multiplier ===
            ContractMultiplier.Redoubled
        );
    }

    toString(): string {
        return (
            `${this.level}` +
            `${this.trump}` +
            this.multiplierText()
        );
    }

    private multiplierText(): string {
        switch (this.multiplier) {
            case ContractMultiplier.Doubled:
                return "X";

            case ContractMultiplier.Redoubled:
                return "XX";

            default:
                return "";
        }
    }
}