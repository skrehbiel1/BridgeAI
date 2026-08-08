import {
    Contract,
    ContractMultiplier
} from "../play/Contract";

import { Suit } from "../cards/Card";

export interface ScoreResult {
    declarerScore: number;

    contractTricks: number;
    tricksWon: number;

    made: boolean;

    overtricks: number;
    undertricks: number;

    contractPoints: number;
    overtrickPoints: number;
    bonusPoints: number;
    penaltyPoints: number;

    description: string;
}

export class BridgeScoring {
    static score(
        contract: Contract,
        tricksWon: number,
        vulnerable = false
    ): ScoreResult {
        const required =
            contract.requiredTricks();

        const made =
            tricksWon >= required;

        const overtricks =
            made
                ? tricksWon - required
                : 0;

        const undertricks =
            made
                ? 0
                : required - tricksWon;

        if (!made) {
            const penalty =
                this.undertrickPenalty(
                    undertricks,
                    contract.multiplier,
                    vulnerable
                );

            return {
                declarerScore:
                    -penalty,

                contractTricks:
                    required,

                tricksWon,

                made: false,

                overtricks: 0,
                undertricks,

                contractPoints: 0,
                overtrickPoints: 0,
                bonusPoints: 0,
                penaltyPoints:
                    penalty,

                description:
                    `Down ${undertricks}`
            };
        }

        const contractPoints =
            this.contractPoints(
                contract
            );

        const overtrickPoints =
            this.overtrickPoints(
                contract,
                overtricks,
                vulnerable
            );

        const bonusPoints =
            this.bonusPoints(
                contract,
                contractPoints,
                vulnerable
            );

        const total =
            contractPoints +
            overtrickPoints +
            bonusPoints;

        return {
            declarerScore:
                total,

            contractTricks:
                required,

            tricksWon,

            made: true,

            overtricks,
            undertricks: 0,

            contractPoints,
            overtrickPoints,
            bonusPoints,
            penaltyPoints: 0,

            description:
                overtricks === 0
                    ? "Made exactly"
                    : `Made ${overtricks}`
        };
    }

    private static contractPoints(
        contract: Contract
    ): number {
        const multiplier =
            this.multiplierValue(
                contract.multiplier
            );

        let basePoints = 0;

        if (
            contract.trump ===
                Suit.Clubs ||
            contract.trump ===
                Suit.Diamonds
        ) {
            basePoints =
                contract.level * 20;
        } else if (
            contract.trump ===
                Suit.Hearts ||
            contract.trump ===
                Suit.Spades
        ) {
            basePoints =
                contract.level * 30;
        } else {
            /*
             * Notrump:
             * first trick = 40,
             * additional tricks = 30.
             */
            basePoints =
                40 +
                (
                    contract.level - 1
                ) * 30;
        }

        return (
            basePoints *
            multiplier
        );
    }

    private static overtrickPoints(
        contract: Contract,
        overtricks: number,
        vulnerable: boolean
    ): number {
        if (overtricks <= 0) {
            return 0;
        }

        if (
            contract.multiplier ===
            ContractMultiplier.Doubled
        ) {
            return (
                overtricks *
                (
                    vulnerable
                        ? 200
                        : 100
                )
            );
        }

        if (
            contract.multiplier ===
            ContractMultiplier.Redoubled
        ) {
            return (
                overtricks *
                (
                    vulnerable
                        ? 400
                        : 200
                )
            );
        }

        if (
            contract.trump ===
                Suit.Clubs ||
            contract.trump ===
                Suit.Diamonds
        ) {
            return (
                overtricks * 20
            );
        }

        return (
            overtricks * 30
        );
    }

    private static bonusPoints(
        contract: Contract,
        contractPoints: number,
        vulnerable: boolean
    ): number {
        let bonus = 0;

        /*
         * Partscore / game bonus.
         */
        if (contractPoints >= 100) {
            bonus +=
                vulnerable
                    ? 500
                    : 300;
        } else {
            bonus += 50;
        }

        /*
         * Small slam.
         */
        if (contract.level === 6) {
            bonus +=
                vulnerable
                    ? 750
                    : 500;
        }

        /*
         * Grand slam.
         */
        if (contract.level === 7) {
            bonus +=
                vulnerable
                    ? 1500
                    : 1000;
        }

        /*
         * "Insult" bonus.
         */
        if (
            contract.multiplier ===
            ContractMultiplier.Doubled
        ) {
            bonus += 50;
        }

        if (
            contract.multiplier ===
            ContractMultiplier.Redoubled
        ) {
            bonus += 100;
        }

        return bonus;
    }

    private static undertrickPenalty(
        undertricks: number,
        multiplier:
            ContractMultiplier,
        vulnerable: boolean
    ): number {
        if (undertricks <= 0) {
            return 0;
        }

        /*
         * Undoubled.
         */
        if (
            multiplier ===
            ContractMultiplier.Undoubled
        ) {
            return (
                undertricks *
                (
                    vulnerable
                        ? 100
                        : 50
                )
            );
        }

        const doubled =
            this.doubledPenalty(
                undertricks,
                vulnerable
            );

        if (
            multiplier ===
            ContractMultiplier.Redoubled
        ) {
            return doubled * 2;
        }

        return doubled;
    }

    private static doubledPenalty(
        undertricks: number,
        vulnerable: boolean
    ): number {
        /*
         * Vulnerable doubled:
         *
         * first = 200
         * each additional = 300
         */
        if (vulnerable) {
            return (
                200 +
                Math.max(
                    0,
                    undertricks - 1
                ) * 300
            );
        }

        /*
         * Non-vulnerable doubled:
         *
         * first = 100
         * second/third = 200 each
         * fourth+ = 300 each
         */
        let penalty = 0;

        for (
            let trick = 1;
            trick <= undertricks;
            trick++
        ) {
            if (trick === 1) {
                penalty += 100;
            } else if (
                trick === 2 ||
                trick === 3
            ) {
                penalty += 200;
            } else {
                penalty += 300;
            }
        }

        return penalty;
    }

    private static multiplierValue(
        multiplier:
            ContractMultiplier
    ): number {
        switch (multiplier) {
            case ContractMultiplier.Doubled:
                return 2;

            case ContractMultiplier.Redoubled:
                return 4;

            default:
                return 1;
        }
    }
}