import React, {
    useEffect,
    useReducer,
    useState
} from "react";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Suit } from "../cards/Card";
import { Contract } from "../play/Contract";

import BridgeTable from "./BridgeTable";

const COMPUTER_PLAY_DELAY_MS = 650;
const COMPLETED_TRICK_DELAY_MS = 1000;

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

export default function BridgeScreen() {
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
        createGame
    );

    const [
        showCompletedTrick,
        setShowCompletedTrick
    ] = useState(false);

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

        const timer = setTimeout(() => {
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
                setShowCompletedTrick(true);
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
        clearTimeout(collectTimer);
        clearTimeout(clearTimer);
    };
}, [showCompletedTrick]);

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
            return;
        }

        const completed =
            game.table.totalTricks() >
            tricksBefore;

        if (completed) {
            setShowCompletedTrick(true);
        }

        redraw();
    }

function undoToMyTurn(): void {
    if (
        !game
            .canUndoToPreviousHumanDecision()
    ) {
        return;
    }

    /*
     * Cancel completed-trick display and
     * collection animations before restoring.
     */
    setShowCompletedTrick(false);

    setCollectingCompletedTrick(
        false
    );

    setHistoryVisible(false);

    const undone =
        game
            .undoToPreviousHumanDecision();

    if (!undone) {
        return;
    }

    redraw();
}



function startNewHand(): void {
    setShowCompletedTrick(false);
    setCollectingCompletedTrick(false);
    setHistoryVisible(false);
    setGame(createGame());
}

    const displayedTrick =
        showCompletedTrick &&
        game.lastCompletedTrick
            ? game.lastCompletedTrick
            : game.table.currentTrick;

    const dummyVisible =
        game.openingLeadMade;

    const southCanPlay =
        !showCompletedTrick &&
        !game.isFinished() &&
        game.currentSeat === Seat.South;

    const northCanPlay =
        dummyVisible &&
        !showCompletedTrick &&
        !game.isFinished() &&
        game.currentSeat === Seat.North;

    const statusMessage =
        getStatusMessage(
            game,
            southCanPlay,
            northCanPlay,
            showCompletedTrick
        );

    const completedTrickWinner =
        showCompletedTrick
        ? game.trickHistory().at(-1)?.winner
        : undefined;

const canUndo =
    game.canUndoToPreviousHumanDecision();

    return (
<BridgeTable
    game={game}
    displayedTrick={displayedTrick}
    completedTrickWinner={
        completedTrickWinner
    }
    collectingCompletedTrick={
        collectingCompletedTrick
    }
    dummyVisible={dummyVisible}
    southCanPlay={southCanPlay}
    northCanPlay={northCanPlay}
    statusMessage={statusMessage}
    showCompletedTrick={showCompletedTrick}
    historyVisible={historyVisible}
canUndo={canUndo}
onUndo={undoToMyTurn}
    onShowHistory={() =>
        setHistoryVisible(true)
    }
    onCloseHistory={() =>
        setHistoryVisible(false)
    }
    onPlayHumanCard={playHumanCard}
    onNewHand={startNewHand}
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
        return "Your turn — play from South";
    }

    if (northCanPlay) {
        return "Your turn — play from dummy";
    }

    return `${game.currentSeat} is playing`;
}