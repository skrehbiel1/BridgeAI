import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";

import {
    Seat,
    nextSeat
} from "./Seat";

import {
    Deal,
    DealResult
} from "./Deal";

import { Table } from "./Table";
import { Contract } from "../play/Contract";
import { PlayedCard } from "../play/PlayedCard";
import { PlayValidator } from "../play/PlayValidator";
import { Trick } from "../play/Trick";
import { TrickWinner } from "../play/TrickWinner";

import {
    partnershipOf
} from "./Partnership";

import {
    PlayerController
} from "./PlayerController";

import {
    DefenseAI
} from "../ai/DefenseAI";

export class Game {
    hands: DealResult;

    table: Table;

    currentSeat: Seat;

    controllers:
        Record<Seat, PlayerController>;

    openingLeadMade = false;

    lastCompletedTrick:
        Trick | null = null;

    constructor(
        public contract: Contract,
        openingLeader: Seat
    ) {
        this.hands =
            Deal.create();

        this.table =
            new Table();

        this.currentSeat =
            openingLeader;

        /*
         * South is declarer.
         * North is dummy.
         *
         * Both are controlled by the human UI.
         * East and West are controlled by AI.
         */
        this.controllers = {
            [Seat.North]:
                new PlayerController(
                    Seat.North
                ),

            [Seat.East]:
                new PlayerController(
                    Seat.East,
                    new DefenseAI()
                ),

            [Seat.South]:
                new PlayerController(
                    Seat.South
                ),

            [Seat.West]:
                new PlayerController(
                    Seat.West,
                    new DefenseAI()
                )
        };
    }

    handOf(
        seat: Seat
    ): Hand {
        return this.hands[seat];
    }

    isHumanControlled(
        seat: Seat
    ): boolean {
        return (
            !this.controllers[
                seat
            ].isComputer()
        );
    }

    playCard(
        seat: Seat,
        card: Card
    ): boolean {
        if (
            seat !==
            this.currentSeat
        ) {
            return false;
        }

        const hand =
            this.handOf(seat);

        const legal =
            PlayValidator.isLegalPlay(
                hand,
                card,
                this.table
                    .currentTrick
                    .leadSuit
            );

        if (!legal) {
            return false;
        }

        hand.remove(card);

        const played:
            PlayedCard = {
                seat,
                card
            };

        this.table
            .currentTrick
            .addCard(played);

        /*
         * The first successfully played card is
         * the opening lead. Dummy may now appear.
         */
        if (
            !this.openingLeadMade
        ) {
            this.openingLeadMade =
                true;
        }

        if (
            this.table
                .currentTrick
                .isComplete()
        ) {
            this.finishTrick();
        } else {
            this.currentSeat =
                nextSeat(
                    this.currentSeat
                );
        }

        return true;
    }

    playComputerTurn():
        boolean {
        const seat =
            this.currentSeat;

        const controller =
            this.controllers[seat];

        if (
            !controller.isComputer()
        ) {
            return false;
        }

        const hand =
            this.handOf(seat);

        if (
            hand.cards.length === 0
        ) {
            return false;
        }

        const leadSuit =
            this.table
                .currentTrick
                .leadSuit;

        const aiCard =
            controller.ai?.chooseCard(
                seat,
                hand,
                this.table
                    .currentTrick,
                this.contract.trump
            );

        if (
            aiCard &&
            PlayValidator.isLegalPlay(
                hand,
                aiCard,
                leadSuit
            )
        ) {
            return this.playCard(
                seat,
                aiCard
            );
        }

        /*
         * Safety fallback.
         *
         * A correctly implemented AI should
         * already return a legal card, but this
         * keeps the game from freezing.
         */
        const fallbackCard =
            hand.cards.find(
                card =>
                    PlayValidator
                        .isLegalPlay(
                            hand,
                            card,
                            leadSuit
                        )
            );

        if (!fallbackCard) {
            return false;
        }

        return this.playCard(
            seat,
            fallbackCard
        );
    }

    playAllComputerTurns():
        void {
        while (
            !this.isFinished() &&
            this.controllers[
                this.currentSeat
            ].isComputer()
        ) {
            const played =
                this.playComputerTurn();

            if (!played) {
                break;
            }
        }
    }

    isFinished():
        boolean {
        return (
            this.table.totalTricks() ===
            13
        );
    }

    tricksWon() {
        return {
            NS:
                this.table.nsTricks,

            EW:
                this.table.ewTricks
        };
    }

    private finishTrick():
        void {
        const completedCards = [
            ...this.table
                .currentTrick
                .cards
        ];

        const completedLeadSuit =
            this.table
                .currentTrick
                .leadSuit;

        const winner =
            TrickWinner.determine(
                completedCards,
                this.contract.trump
            );

        /*
         * Preserve the completed trick so the UI
         * can display all four cards briefly.
         */
        const savedTrick =
            new Trick();

        savedTrick.cards =
            completedCards;

        savedTrick.leadSuit =
            completedLeadSuit;

        this.lastCompletedTrick =
            savedTrick;

        this.table.awardTrick(
            partnershipOf(
                winner
            )
        );

        this.table
            .currentTrick
            .clear();

        this.currentSeat =
            winner;
    }
}