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
import { Partnership, partnershipOf } from "./Partnership";
import { PlayerController } from "./PlayerController";

import { Contract } from "../play/Contract";
import { PlayedCard } from "../play/PlayedCard";
import { PlayValidator } from "../play/PlayValidator";
import { Trick } from "../play/Trick";
import { TrickWinner } from "../play/TrickWinner";

import { DefenseAI } from "../ai/DefenseAI";

import { BoardHistory } from "../replay/BoardHistory";
import { TrickRecord } from "../replay/TrickRecord";

export interface TrickTotals {
    NS: number;
    EW: number;
}

export class Game {
    hands: DealResult;

    table: Table;

    currentSeat: Seat;

    controllers:
        Record<Seat, PlayerController>;

    openingLeadMade = false;

    lastCompletedTrick:
        Trick | null = null;

    readonly history =
        new BoardHistory();

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
         * The human controls both North and South.
         * East and West are controlled by the AI.
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
        return !this.controllers[
            seat
        ].isComputer();
    }

    playCard(
        seat: Seat,
        card: Card
    ): boolean {
        if (
            this.isFinished() ||
            seat !== this.currentSeat
        ) {
            return false;
        }

        const hand =
            this.handOf(seat);

        /*
         * Confirm that the requested card is
         * actually present in the player's hand.
         */
        const cardInHand =
            hand.cards.find(
                current =>
                    current.suit === card.suit &&
                    current.rank === card.rank
            );

        if (!cardInHand) {
            return false;
        }

        const leadSuit =
            this.table
                .currentTrick
                .leadSuit;

        const legal =
            PlayValidator.isLegalPlay(
                hand,
                cardInHand,
                leadSuit
            );

        if (!legal) {
            return false;
        }

        hand.remove(cardInHand);

        const playedCard:
            PlayedCard = {
                seat,
                card: cardInHand
            };

        this.table
            .currentTrick
            .addCard(playedCard);

        this.history.recordPlay(
            seat,
            cardInHand
        );

        /*
         * The first successful card play is the
         * opening lead. Dummy may now be displayed.
         */
        if (!this.openingLeadMade) {
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

    playComputerTurn(): boolean {
        if (this.isFinished()) {
            return false;
        }

        const seat =
            this.currentSeat;

        const controller =
            this.controllers[seat];

        if (!controller.isComputer()) {
            return false;
        }

        const hand =
            this.handOf(seat);

        if (hand.cards.length === 0) {
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
                this.table.currentTrick,
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
         * Safety fallback. Properly implemented AI
         * classes should already return a legal card.
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

    playAllComputerTurns(): void {
        while (
            !this.isFinished() &&
            !this.isHumanControlled(
                this.currentSeat
            )
        ) {
            const played =
                this.playComputerTurn();

            if (!played) {
                break;
            }
        }
    }

    trickHistory():
        readonly TrickRecord[] {
        return this.history.tricks;
    }

    isFinished(): boolean {
        return (
            this.table.totalTricks() ===
            13
        );
    }

    tricksWon(): TrickTotals {
        return {
            NS:
                this.table.nsTricks,

            EW:
                this.table.ewTricks
        };
    }

    contractTricksWon(): number {
        const declaringSide =
            partnershipOf(
                this.contract.declarer
            );

        return declaringSide ===
            Partnership.NS
            ? this.table.nsTricks
            : this.table.ewTricks;
    }

    contractMade(): boolean {
        if (!this.isFinished()) {
            return false;
        }

        return (
            this.contractTricksWon() >=
            this.contract.requiredTricks()
        );
    }

    private finishTrick(): void {
        const currentTrick =
            this.table.currentTrick;

        const completedCards = [
            ...currentTrick.cards
        ];

        const winner =
            TrickWinner.determine(
                completedCards,
                this.contract.trump
            );

        /*
         * Save the four cards before clearing the
         * active trick so the UI can display them
         * during the completed-trick pause.
         */
        const savedTrick =
            new Trick();

        savedTrick.cards =
            completedCards;

        savedTrick.leadSuit =
            currentTrick.leadSuit;

        this.lastCompletedTrick =
            savedTrick;

        this.history.completeTrick(
            winner
        );

        this.table.awardTrick(
            partnershipOf(
                winner
            )
        );

        currentTrick.clear();

        this.currentSeat =
            winner;
    }
}