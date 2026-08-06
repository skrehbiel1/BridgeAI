import React, {
    useEffect,
    useReducer,
    useState
} from "react";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Suit } from "../cards/Card";
import { Contract } from "../play/Contract";

import {
    PlayDecision
} from "../ai/PlayDecision";

import BridgeTable from "./BridgeTable";

const COMPUTER_PLAY_DELAY_MS = 650;

interface Props {
    initialGame?: Game;
    onNewBoard?: () => void;
}

function createGame(): Game {
    return new Game(
        new Contract(
            4,
            Suit.Spades,
            Seat.South
        ),
        Seat.West
    );
}

export default function BridgeScreen({
    initialGame,
    onNewBoard
}: Props) {
    const [
        renderVersion,
        redraw
    ] = useReducer(
        (version: number) =>
            version + 1,
        0
    );

    const [
        historyVisible,
        setHistoryVisible
    ] = useState(false);

    const [
        collectingCompletedTrick,
        setCollectingCompletedTrick
    ] = useState(false);

    const [
        game,
        setGame
    ] = useState<Game>(
        () =>
            initialGame ??
            createGame()
    );

    const [
        showCompletedTrick,
        setShowCompletedTrick
    ] = useState(false);

    /*
     * The suggested card and its explanation.
     *
     * playHint remains populated after the modal
     * closes so the suggested card stays highlighted.
     */
    const [
        playHint,
        setPlayHint
    ] = useState<
        PlayDecision | null
    >(null);

    const [
        playHintVisible,
        setPlayHintVisible
    ] = useState(false);

    /*
     * Computer play.
     */
    useEffect(() => {
        if (
            showCompletedTrick ||
            game.isFinished() ||
            game.isHumanControlled(
                game.currentSeat
            )
        ) {
            return;
        }

        const timer =
            setTimeout(() => {
                if (
                    showCompletedTrick ||
                    game.isFinished() ||
                    game.isHumanControlled(
                        game.currentSeat
                    )
                ) {
                    return;
                }

                const tricksBefore =
                    game.table.totalTricks();

                const played =
                    game.playComputerTurn();

                if (!played) {
                    return;
                }

                const completed =
                    game.table.totalTricks() >
                    tricksBefore;

                if (completed) {
                    setShowCompletedTrick(
                        true
                    );
                }

                redraw();
            }, COMPUTER_PLAY_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [
        game,
        renderVersion,
        showCompletedTrick
    ]);

    /*
     * Show a completed trick briefly before
     * collecting the cards.
     */
    useEffect(() => {
        if (!showCompletedTrick) {
            return;
        }

        const collectTimer =
            setTimeout(() => {
                setCollectingCompletedTrick(
                    true
                );
            }, 700);

        const clearTimer =
            setTimeout(() => {
                setCollectingCompletedTrick(
                    false
                );

                setShowCompletedTrick(
                    false
                );

                redraw();
            }, 1050);

        return () => {
            clearTimeout(
                collectTimer
            );

            clearTimeout(
                clearTimer
            );
        };
    }, [
        showCompletedTrick
    ]);

    /*
     * A hint belongs only to the current human
     * decision. Clear it when play moves to AI.
     */
    useEffect(() => {
        if (
            !game.isHumanControlled(
                game.currentSeat
            )
        ) {
            setPlayHint(null);

            setPlayHintVisible(
                false
            );
        }
    }, [
        game,
        renderVersion
    ]);

    function playHumanCard(
        seat: Seat,
        index: number
    ): void {
        if (
            showCompletedTrick ||
            game.isFinished() ||
            game.currentSeat !== seat
        ) {
            return;
        }

        const hand =
            game.handOf(seat);

        const card =
            hand.cards[index];

        if (!card) {
            return;
        }

        const tricksBefore =
            game.table.totalTricks();

        game.saveHumanDecisionPoint();

        const played =
            game.playCard(
                seat,
                card
            );

        if (!played) {
            game.discardLatestUndoPoint();
            return;
        }

        /*
         * The current suggestion is no longer
         * relevant after a successful play.
         */
        setPlayHint(null);

        setPlayHintVisible(
            false
        );

        const completed =
            game.table.totalTricks() >
            tricksBefore;

        if (completed) {
            setShowCompletedTrick(
                true
            );
        }

        redraw();
    }

    function showPlayHint(): void {
        if (
            showCompletedTrick ||
            game.isFinished() ||
            !game.isHumanControlled(
                game.currentSeat
            )
        ) {
            return;
        }

        const suggestion =
            game.suggestPlay();

        if (!suggestion) {
            return;
        }

        setPlayHint(
            suggestion
        );

        setPlayHintVisible(
            true
        );
    }

    function undoToMyTurn(): void {
        if (
            !game
                .canUndoToPreviousHumanDecision()
        ) {
            return;
        }

        /*
         * Cancel animations and overlays before
         * restoring the previous game state.
         */
        setShowCompletedTrick(
            false
        );

        setCollectingCompletedTrick(
            false
        );

        setHistoryVisible(
            false
        );

        setPlayHint(null);

        setPlayHintVisible(
            false
        );

        const undone =
            game
                .undoToPreviousHumanDecision();

        if (!undone) {
            return;
        }

        redraw();
    }

    function startNewHand(): void {
        setShowCompletedTrick(
            false
        );

        setCollectingCompletedTrick(
            false
        );

        setHistoryVisible(
            false
        );

        setPlayHint(null);

        setPlayHintVisible(
            false
        );

        if (onNewBoard) {
            onNewBoard();
            return;
        }

        setGame(
            createGame()
        );
    }

    const displayedTrick =
        showCompletedTrick &&
        game.lastCompletedTrick
            ? game.lastCompletedTrick
            : game.table.currentTrick;

    const dummyVisible =
        game.openingLeadMade;

    const northIsHuman =
        game.isHumanControlled(
            Seat.North
        );

    const southIsHuman =
        game.isHumanControlled(
            Seat.South
        );

    const northCanPlay =
        northIsHuman &&
        !showCompletedTrick &&
        !game.isFinished() &&
        game.currentSeat ===
            Seat.North;

    const southCanPlay =
        southIsHuman &&
        !showCompletedTrick &&
        !game.isFinished() &&
        game.currentSeat ===
            Seat.South;

    const statusMessage =
        getStatusMessage(
            game,
            southCanPlay,
            northCanPlay,
            showCompletedTrick
        );

    const completedTrickWinner =
        showCompletedTrick
            ? game
                .trickHistory()
                .at(-1)
                ?.winner
            : undefined;

    const canUndo =
        game
            .canUndoToPreviousHumanDecision();

    return (
        <BridgeTable
            game={game}
            displayedTrick={
                displayedTrick
            }
            completedTrickWinner={
                completedTrickWinner
            }
            collectingCompletedTrick={
                collectingCompletedTrick
            }
            dummyVisible={
                dummyVisible
            }
            southCanPlay={
                southCanPlay
            }
            northCanPlay={
                northCanPlay
            }
            statusMessage={
                statusMessage
            }
            showCompletedTrick={
                showCompletedTrick
            }
            historyVisible={
                historyVisible
            }
            canUndo={
                canUndo
            }
            playHint={
                playHint
            }
            playHintVisible={
                playHintVisible
            }
            onUndo={
                undoToMyTurn
            }
            onShowHint={
                showPlayHint
            }
            onCloseHint={() =>
                setPlayHintVisible(
                    false
                )
            }
            onShowHistory={() =>
                setHistoryVisible(
                    true
                )
            }
            onCloseHistory={() =>
                setHistoryVisible(
                    false
                )
            }
            onPlayHumanCard={
                playHumanCard
            }
            onNewHand={
                startNewHand
            }
        />
    );
}

function getStatusMessage(
    game: Game,
    southCanPlay: boolean,
    northCanPlay: boolean,
    showCompletedTrick: boolean
): string {
    if (showCompletedTrick) {
        return "Trick complete";
    }

    if (game.isFinished()) {
        const tricks =
            game.tricksWon();

        return (
            `Hand complete — ` +
            `NS ${tricks.NS}, ` +
            `EW ${tricks.EW}`
        );
    }

    if (southCanPlay) {
        return game.isDummy(
            Seat.South
        )
            ? "Your turn — play from dummy"
            : "Your turn — play from South";
    }

    if (northCanPlay) {
        return game.isDummy(
            Seat.North
        )
            ? "Your turn — play from dummy"
            : "Your turn — play from North";
    }

    return (
        `${game.currentSeat} is playing`
    );
}