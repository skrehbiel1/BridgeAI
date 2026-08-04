import { Suit } from "../cards/Card";

export type BidSuit =
    | Suit
    | "NT";

export enum CallType {
    Contract = "Contract",
    Pass = "Pass",
    Double = "Double",
    Redouble = "Redouble"
}

export class Bid {
    constructor(
        public type: CallType,
        public level?: number,
        public suit?: BidSuit
    ) {}

    static Contract(
        level: number,
        suit: BidSuit
    ): Bid {
        return new Bid(
            CallType.Contract,
            level,
            suit
        );
    }

    static Pass(): Bid {
        return new Bid(
            CallType.Pass
        );
    }

    static Double(): Bid {
        return new Bid(
            CallType.Double
        );
    }

    static Redouble(): Bid {
        return new Bid(
            CallType.Redouble
        );
    }

    isContract(): boolean {
        return (
            this.type ===
            CallType.Contract
        );
    }

    isPass(): boolean {
        return (
            this.type ===
            CallType.Pass
        );
    }

    isDouble(): boolean {
        return (
            this.type ===
            CallType.Double
        );
    }

    isRedouble(): boolean {
        return (
            this.type ===
            CallType.Redouble
        );
    }

    toString(): string {
        switch (this.type) {
            case CallType.Pass:
                return "Pass";

            case CallType.Double:
                return "X";

            case CallType.Redouble:
                return "XX";

            case CallType.Contract:
                return (
                    `${this.level}` +
                    `${this.suit}`
                );
        }
    }
}