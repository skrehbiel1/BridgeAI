import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import { Hand } from "../cards/Hand";
import { Card, Suit } from "../cards/Card";
import { Seat } from "../core/Seat";

import DummyHandView from "./DummyHandView";
import HandView from "./HandView";
import SeatView from "./SeatView";

interface Props {
    hand: Hand;

    showHand: boolean;
    isDummy: boolean;

    leadSuit?: Suit;
    enabled: boolean;
    active: boolean;

    suggestedCard?: Card;

    onCardPlayed: (
        seat: Seat,
        index: number
    ) => void;
}

export default function NorthArea({
    hand,
    showHand,
    isDummy,
    leadSuit,
    enabled,
    active,
    suggestedCard,
    onCardPlayed
}: Props) {
    return (
        <View style={styles.container}>
            {showHand ? (
                isDummy ? (
<DummyHandView
    hand={hand}
    leadSuit={leadSuit}
    enabled={enabled}
    suggestedCard={suggestedCard}
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
    leadSuit={leadSuit}
    enabled={enabled}
    suggestedCard={suggestedCard}
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
                    active={active}
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