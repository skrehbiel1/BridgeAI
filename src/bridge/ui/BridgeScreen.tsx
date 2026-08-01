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

        const timer = setTimeout(() => {
            setShowCompletedTrick(false);
            redraw();
        }, COMPLETED_TRICK_DELAY_MS);

        return () => {
            clearTimeout(timer);
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

);

        redraw();
    }

    function startNewHand(): void {
        setShowCompletedTrick(false);
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

    return (
        <BridgeTable
            game={game}
            displayedTrick={displayedTrick}
            dummyVisible={dummyVisible}
            southCanPlay={southCanPlay}
            northCanPlay={northCanPlay}
            statusMessage={statusMessage}
	    showCompletedTrick={
            	showCompletedTrick
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