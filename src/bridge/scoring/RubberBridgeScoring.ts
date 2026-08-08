import {
    Contract,
    ContractMultiplier
} from "../play/Contract";

import {
    Partnership
} from "../core/Partnership";

import { Suit } from "../cards/Card";

export interface RubberSideScore {
    /*
     * Current game's below-the-line
     * contract points.
     */
    belowLine: number;

    /*
     * All above-the-line points accumulated
     * during the rubber.
     */
    aboveLine: number;

    /*
     * Completed games in this rubber.
     */
    gamesWon: number;

    /*
     * Completed-game contract points.
     *
     * This preserves the score when
     * belowLine is reset for a new game.
     */
    completedBelowLine: number;
}

export interface RubberState {
    NS: RubberSideScore;
    EW: RubberSideScore;

    rubberComplete: boolean;

    rubberWinner?:
        Partnership;
}

export interface RubberHandResult {
    declaringSide:
        Partnership;

    made: boolean;

    overtricks: number;
    undertricks: number;

    belowLinePoints: number;
    aboveLinePoints: number;

    gameWon: boolean;
    rubberWon: boolean;

    rubberBonus: number;

    description: string;
}

export class RubberBridgeScoring {
    static createState():
        RubberState {
        return {
            NS: {
                belowLine: 0,
                aboveLine: 0,
                gamesWon: 0,
                completedBelowLine: 0
            },

            EW: {
                belowLine: 0,
                aboveLine: 0,
                gamesWon: 0,
                completedBelowLine: 0
            },

            rubberComplete: false
        };
    }

    static isVulnerable(
        state: RubberState,
        side: Partnership
    ): boolean {
        return (
            this.side(
                state,
                side
            ).gamesWon >= 1
        );
    }

    static scoreHand(
        state: RubberState,
        contract: Contract,
        declaringSide:
            Partnership,
        tricksWon: number
    ): RubberHandResult {
        if (
            state.rubberComplete
        ) {
            throw new Error(
                "Rubber is already complete."
            );
        }

        const required =
            contract.requiredTricks();

        const made =
            tricksWon >= required;

        const overtricks =
            made
                ? tricksWon -
                    required
                : 0;

        const undertricks =
            made
                ? 0
                : required -
                    tricksWon;

        const vulnerable =
            this.isVulnerable(
                state,
                declaringSide
            );

        /*
         * CONTRACT DOWN
         */
        if (!made) {
            const defenders =
                this.opponentsOf(
                    declaringSide
                );

            const penalty =
                this.undertrickPenalty(
                    undertricks,
                    contract.multiplier,
                    vulnerable
                );

            this.side(
                state,
                defenders
            ).aboveLine +=
                penalty;

            return {
                declaringSide,

                made: false,

                overtricks: 0,
                undertricks,

                belowLinePoints: 0,

                /*
                 * Positive number represents
                 * points awarded to defenders.
                 */
                aboveLinePoints:
                    penalty,

                gameWon: false,
                rubberWon: false,

                rubberBonus: 0,

                description:
                    `Down ${undertricks}`
            };
        }

        /*
         * CONTRACT MADE
         */
        const belowLinePoints =
            this.contractPoints(
                contract
            );

        const aboveLinePoints =
            this.madeContractBonuses(
                contract,
                overtricks,
                vulnerable
            );

        const declaringScore =
            this.side(
                state,
                declaringSide
            );

        declaringScore.belowLine +=
            belowLinePoints;

        declaringScore.aboveLine +=
            aboveLinePoints;

        let gameWon = false;
        let rubberWon = false;
        let rubberBonus = 0;

        /*
         * 100 or more below the line
         * wins a game.
         */
        if (
            declaringScore
                .belowLine >= 100
        ) {
            gameWon = true;

            /*
             * Save the completed game's
             * contract points before resetting
             * below the line.
             */
            declaringScore
                .completedBelowLine +=
                declaringScore
                    .belowLine;

            declaringScore.gamesWon +=
                1;

            /*
             * A new game starts at zero
             * below the line for BOTH sides.
             */
            state.NS.belowLine = 0;
            state.EW.belowLine = 0;

            /*
             * Two games wins the rubber.
             */
            if (
                declaringScore
                    .gamesWon >= 2
            ) {
                rubberWon = true;

                state.rubberComplete =
                    true;

                state.rubberWinner =
                    declaringSide;

                const opponents =
                    this.opponentsOf(
                        declaringSide
                    );

                const opponentGames =
                    this.side(
                        state,
                        opponents
                    ).gamesWon;

                /*
                 * Rubber bonus:
                 *
                 * 700 — opponents won no game
                 * 500 — opponents won one game
                 */
                rubberBonus =
                    opponentGames === 0
                        ? 700
                        : 500;

                declaringScore
                    .aboveLine +=
                    rubberBonus;
            }
        }

        return {
            declaringSide,

            made: true,

            overtricks,
            undertricks: 0,

            belowLinePoints,
            aboveLinePoints,

            gameWon,
            rubberWon,

            rubberBonus,

            description:
                overtricks === 0
                    ? "Contract made"
                    : `Made ${overtricks}`
        };
    }

    static totalScore(
        state: RubberState,
        side: Partnership
    ): number {
        const score =
            this.side(
                state,
                side
            );

        return (
            score.aboveLine +
            score.completedBelowLine +
            score.belowLine
        );
    }

    private static side(
        state: RubberState,
        side: Partnership
    ): RubberSideScore {
        return (
            side ===
                Partnership.NS
                ? state.NS
                : state.EW
        );
    }

    private static opponentsOf(
        side: Partnership
    ): Partnership {
        return (
            side ===
                Partnership.NS
                ? Partnership.EW
                : Partnership.NS
        );
    }

    private static contractPoints(
        contract: Contract
    ): number {
        const multiplier =
            this.multiplierValue(
                contract.multiplier
            );

        let points: number;

        if (
            contract.trump ===
                Suit.Clubs ||
            contract.trump ===
                Suit.Diamonds
        ) {
            points =
                contract.level * 20;
        } else if (
            contract.trump ===
                Suit.Hearts ||
            contract.trump ===
                Suit.Spades
        ) {
            points =
                contract.level * 30;
        } else {
            /*
             * NT:
             *
             * first contract trick = 40
             * each additional = 30
             */
            points =
                40 +
                (
                    contract.level - 1
                ) * 30;
        }

        return (
            points *
            multiplier
        );
    }

    private static madeContractBonuses(
        contract: Contract,
        overtricks: number,
        vulnerable: boolean
    ): number {
        let points = 0;

        /*
         * Overtricks.
         */
        if (
            contract.multiplier ===
                ContractMultiplier.Doubled
        ) {
            points +=
                overtricks *
                (
                    vulnerable
                        ? 200
                        : 100
                );
        } else if (
            contract.multiplier ===
                ContractMultiplier.Redoubled
        ) {
            points +=
                overtricks *
                (
                    vulnerable
                        ? 400
                        : 200
                );
        } else if (
            contract.trump ===
                Suit.Clubs ||
            contract.trump ===
                Suit.Diamonds
        ) {
            points +=
                overtricks * 20;
        } else {
            points +=
                overtricks * 30;
        }

        /*
         * Double bonus.
         */
        if (
            contract.multiplier ===
                ContractMultiplier.Doubled
        ) {
            points += 50;
        }

        if (
            contract.multiplier ===
                ContractMultiplier.Redoubled
        ) {
            points += 100;
        }

        /*
         * Slam bonuses.
         */
        if (
            contract.level === 6
        ) {
            points +=
                vulnerable
                    ? 750
                    : 500;
        }

        if (
            contract.level === 7
        ) {
            points +=
                vulnerable
                    ? 1500
                    : 1000;
        }

        return points;
    }

    private static undertrickPenalty(
        undertricks: number,
        multiplier:
            ContractMultiplier,
        vulnerable: boolean
    ): number {
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

        let doubledPenalty = 0;

        /*
         * Vulnerable doubled:
         *
         * first = 200
         * additional = 300 each
         */
        if (vulnerable) {
            doubledPenalty =
                200 +
                Math.max(
                    0,
                    undertricks - 1
                ) * 300;
        } else {
            /*
             * Non-vulnerable doubled:
             *
             * 1st = 100
             * 2nd = 200
             * 3rd = 200
             * 4th+ = 300
             */
            for (
                let trick = 1;
                trick <=
                    undertricks;
                trick++
            ) {
                if (trick === 1) {
                    doubledPenalty +=
                        100;
                } else if (
                    trick === 2 ||
                    trick === 3
                ) {
                    doubledPenalty +=
                        200;
                } else {
                    doubledPenalty +=
                        300;
                }
            }
        }

        if (
            multiplier ===
                ContractMultiplier.Redoubled
        ) {
            return (
                doubledPenalty * 2
            );
        }

        return doubledPenalty;
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