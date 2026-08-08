import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import { Hand } from "../cards/Hand";
import { Seat } from "../core/Seat";

import {
    TrumpSuit
} from "../play/Contract";

import DummyHandView
from "./DummyHandView";

import HandView
from "./HandView";

import SeatView
from "./SeatView";

interface Props {
    hand: Hand;

    showHand: boolean;

    /*
     * When true, reveal North even if
     * North would normally be concealed.
     */
    showAllHands?: boolean;

    isDummy: boolean;

    leadSuit?: Suit;

    enabled: boolean;

    active: boolean;

    suggestedCard?: Card;

    trump: TrumpSuit;

    onCardPlayed: (
        seat: Seat,
        index: number
    ) => void;
}

export default function NorthArea({
    hand,
    showHand,
    showAllHands = false,
    isDummy,
    leadSuit,
    enabled,
    active,
    suggestedCard,
    trump,
    onCardPlayed
}: Props) {
    /*
     * Normal visibility OR temporary
     * Show Hands visibility.
     */
    const shouldShowHand =
        showHand ||
        showAllHands;

    /*
     * If North is only revealed because
     * Show Hands is on, keep the cards
     * view-only.
     */
    const canPlayRevealedHand =
        showHand &&
        enabled;

    const visibleSuggestedCard =
        showHand
            ? suggestedCard
            : undefined;

    return (
        <View style={styles.container}>
            {shouldShowHand ? (
                isDummy ? (
                    <DummyHandView
                        hand={hand}
                        leadSuit={
                            leadSuit
                        }
                        enabled={
                            canPlayRevealedHand
                        }
                        suggestedCard={
                            visibleSuggestedCard
                        }
                        trump={
                            trump
                        }
                        onCardPlayed={
                            index =>
                                onCardPlayed(
                                    Seat.North,
                                    index
                                )
                        }
                    />
                ) : (
                    <HandView
                        hand={hand}
                        leadSuit={
                            leadSuit
                        }
                        enabled={
                            canPlayRevealedHand
                        }
                        suggestedCard={
                            visibleSuggestedCard
                        }
                        trump={
                            trump
                        }
                        onCardPlayed={
                            index =>
                                onCardPlayed(
                                    Seat.North,
                                    index
                                )
                        }
                    />
                )
            ) : (
                <SeatView
                    name="North"
                    cardCount={
                        hand.cards.length
                    }
                    orientation="horizontal"
                    active={
                        active
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 94,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4
    }
});