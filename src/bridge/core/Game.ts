import { Card } from "../cards/Card";import { Hand } from "../cards/Hand";

import {PlayRecord} from "../replay/PlayRecord";

import {TrickRecord} from "../replay/TrickRecord";

import {BoardHistory} from "../replay/BoardHistory";

import {Seat,nextSeat} from "./Seat";

import {dummyForContract} from "./ContractSeats";

import {Deal,DealResult} from "./Deal";

import { Table } from "./Table";

import {Partnership,partnershipOf} from "./Partnership";

import {PlayerController} from "./PlayerController";

import { Contract } from "../play/Contract";import { PlayedCard } from "../play/PlayedCard";import { PlayValidator } from "../play/PlayValidator";import { Trick } from "../play/Trick";import { TrickWinner } from "../play/TrickWinner";

import { DefenseAI } from "../ai/DefenseAI";

export interface TrickTotals {NS: number;EW: number;}

interface GameSnapshot {hands: Record<Seat, Card[]>;

currentSeat: Seat;

currentTrick: PlayedCard[];

nsTricks: number;
ewTricks: number;

openingLeadMade: boolean;

lastCompletedTrick:
    Trick | null;

history: TrickRecord[];

}

export class Game {hands: DealResult;

table: Table;

currentSeat: Seat;

controllers:
    Record<Seat, PlayerController>;

openingLeadMade = false;

lastCompletedTrick:
    Trick | null = null;

readonly history =
    new BoardHistory();

declarerSeat(): Seat {return this.contract.declarer;}

dummySeat(): Seat {return dummyForContract(this.contract);}

isDummy(
    seat: Seat
): boolean {
    return (
        seat === this.dummySeat()
    );
}

isDeclarer(
    seat: Seat
): boolean {
    return (
        seat === this.declarerSeat()
    );
}

isDeclarerSide(seat: Seat): boolean {return (partnershipOf(seat) ===partnershipOf(this.contract.declarer));}/** Each entry represents the complete game* state immediately before a human card play.*/private undoPoints:GameSnapshot[] = [];

constructor(
public contract: Contract,
openingLeader: Seat,
initialHands?: DealResult

) {this.hands =initialHands ??Deal.create();

    this.table =
        new Table();

    this.currentSeat =
        openingLeader;

    /*
     * South is declarer.
     * North is dummy.
     *
     * The human controls North and South.
     * East and West are computer controlled.
     */
this.controllers =
    this.createControllers();
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

/*
 * Call immediately before a human plays a card.
 *
 * Undo will return to this exact game state,
 * automatically removing any later AI responses.
 */
saveHumanDecisionPoint(): void {
    this.undoPoints.push(
        this.createSnapshot()
    );
}

/*
 * Use this if the attempted human play fails.
 * The unused snapshot should not remain available.
 */
discardLatestUndoPoint(): void {
    this.undoPoints.pop();
}

canUndoToPreviousHumanDecision():
    boolean {
    return (
        this.undoPoints.length > 0
    );
}

undoToPreviousHumanDecision():
    boolean {
    const snapshot =
        this.undoPoints.pop();

    if (!snapshot) {
        return false;
    }

    this.restoreSnapshot(
        snapshot
    );

    return true;
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
     * Confirm that the requested card is still
     * present in the player's actual hand.
     */
    const cardInHand =
        hand.cards.find(
            current =>
                current.suit ===
                    card.suit &&
                current.rank ===
                    card.rank
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

    hand.remove(
        cardInHand
    );

    const playedCard:
        PlayedCard = {
            seat,
            card: cardInHand
        };

    this.table
        .currentTrick
        .addCard(
            playedCard
        );

    this.history.recordPlay(
        seat,
        cardInHand
    );

    /*
     * The first successful card is the opening
     * lead. Dummy may now be displayed.
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
     * Safety fallback. The AI should normally
     * return a legal card itself.
     */
    const fallbackCard =
        hand.cards.find(
            candidate =>
                PlayValidator
                    .isLegalPlay(
                        hand,
                        candidate,
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

private createControllers():
    Record<Seat, PlayerController> {
    const declaringPartnership =
        partnershipOf(
            this.contract.declarer
        );

    /*
     * When North-South wins the auction, the user
     * controls declarer and dummy, as before.
     */
    if (
        declaringPartnership ===
        Partnership.NS
    ) {
        return {
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

    /*
     * When East-West wins the auction, South
     * remains the user's defensive seat.
     *
     * North, East and West are computer controlled.
     * The declarer AI also controls its dummy.
     */
    return {
        [Seat.North]:
            new PlayerController(
                Seat.North,
                new DefenseAI()
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
     * Save all four cards so the UI can show
     * the completed trick before collecting it.
     */
    const savedTrick =
        new Trick();

    for (
        const played of
        completedCards
    ) {
        savedTrick.addCard({
            seat:
                played.seat,

            card:
                this.cloneCard(
                    played.card
                )
        });
    }

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

private createSnapshot():
    GameSnapshot {
    return {
        hands: {
            [Seat.North]:
                this.cloneCards(
                    this.handOf(
                        Seat.North
                    ).cards
                ),

            [Seat.East]:
                this.cloneCards(
                    this.handOf(
                        Seat.East
                    ).cards
                ),

            [Seat.South]:
                this.cloneCards(
                    this.handOf(
                        Seat.South
                    ).cards
                ),

            [Seat.West]:
                this.cloneCards(
                    this.handOf(
                        Seat.West
                    ).cards
                )
        },

        currentSeat:
            this.currentSeat,

        currentTrick:
            this.table
                .currentTrick
                .cards
                .map(
                    played => ({
                        seat:
                            played.seat,

                        card:
                            this.cloneCard(
                                played.card
                            )
                    })
                ),

        nsTricks:
            this.table.nsTricks,

        ewTricks:
            this.table.ewTricks,

        openingLeadMade:
            this.openingLeadMade,

        lastCompletedTrick:
            this.cloneTrick(
                this.lastCompletedTrick
            ),

        history:
            this.cloneHistory(
                this.history.tricks
            )
    };
}

private restoreSnapshot(
    snapshot: GameSnapshot
): void {
    this.hands = {
        [Seat.North]:
            this.createHand(
                snapshot.hands[
                    Seat.North
                ]
            ),

        [Seat.East]:
            this.createHand(
                snapshot.hands[
                    Seat.East
                ]
            ),

        [Seat.South]:
            this.createHand(
                snapshot.hands[
                    Seat.South
                ]
            ),

        [Seat.West]:
            this.createHand(
                snapshot.hands[
                    Seat.West
                ]
            )
    };

    this.currentSeat =
        snapshot.currentSeat;

    this.table.nsTricks =
        snapshot.nsTricks;

    this.table.ewTricks =
        snapshot.ewTricks;

    this.table
        .currentTrick
        .clear();

    for (
        const played of
        snapshot.currentTrick
    ) {
        this.table
            .currentTrick
            .addCard({
                seat:
                    played.seat,

                card:
                    this.cloneCard(
                        played.card
                    )
            });
    }

    this.openingLeadMade =
        snapshot.openingLeadMade;

    this.lastCompletedTrick =
        this.cloneTrick(
            snapshot
                .lastCompletedTrick
        );

    this.history.clear();

    this.history.tricks.push(
        ...this.cloneHistory(
            snapshot.history
        )
    );
}

private createHand(
    cards: Card[]
): Hand {
    const hand =
        new Hand();

    for (
        const card of cards
    ) {
        hand.add(
            this.cloneCard(card)
        );
    }

    hand.sort();

    return hand;
}

private cloneCard(
    card: Card
): Card {
    return new Card(
        card.suit,
        card.rank
    );
}

private cloneCards(
    cards: Card[]
): Card[] {
    return cards.map(
        card =>
            this.cloneCard(card)
    );
}

private cloneTrick(
    trick: Trick | null
): Trick | null {
    if (!trick) {
        return null;
    }

    const copy =
        new Trick();

    for (
        const played of
        trick.cards
    ) {
        copy.addCard({
            seat:
                played.seat,

            card:
                this.cloneCard(
                    played.card
                )
        });
    }

    return copy;
}

private cloneHistory(
    tricks:
        readonly TrickRecord[]
): TrickRecord[] {
    return tricks.map(
        trick => {
            const copy =
                new TrickRecord();

            for (
                const play of
                trick.plays
            ) {
                copy.addPlay(
                    new PlayRecord(
                        play.seat,
                        this.cloneCard(
                            play.card
                        )
                    )
                );
            }

            copy.winner =
                trick.winner;

            return copy;
        }
    );
}

}