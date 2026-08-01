import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import { Hand } from "../cards/Hand";
import { Suit } from "../cards/Card";
import { Seat } from "../core/Seat";

import DummyHandView from "./DummyHandView";
import SeatView from "./SeatView";

interface Props {
    hand: Hand;
    dummyVisible: boolean;
    leadSuit?: Suit;
    enabled: boolean;
    active: boolean;

    onCardPlayed: (
        seat: Seat,
        index: number
    ) => void;
}

export default function NorthArea({
    hand,
    dummyVisible,
    leadSuit,
    enabled,
    active,
    onCardPlayed
}: Props) {
    return (
        <View style={styles.container}>
            {dummyVisible ? (
                <DummyHandView
                    hand={hand}
                    leadSuit={leadSuit}
                    enabled={enabled}
                    onCardPlayed={
                        index =>
                            onCardPlayed(
                                Seat.North,
                                index
                            )
                    }
                />
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