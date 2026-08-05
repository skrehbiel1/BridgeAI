import React, {
    useState
} from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import { Seat } from "../core/Seat";
import { PlayedCard } from "../play/PlayedCard";
import { Trick } from "../play/Trick";

import { suitSymbol } from "../cards/SuitDisplay";

import AnimatedPlayedCard
from "./AnimatedPlayedCard";

interface Props {
    trick: Trick;
    winnerSeat?: Seat;
    collecting?: boolean;
}

export default function TableCenter({
    trick,
    winnerSeat,
    collecting = false
}: Props) {
    const [
        selectedPlay,
        setSelectedPlay
    ] = useState<
        PlayedCard | null
    >(null);

    const cardAt = (
        seat: Seat
    ): PlayedCard | undefined =>
        trick.cards.find(
            played =>
                played.seat === seat
        );

    const north =
        cardAt(Seat.North);

    const east =
        cardAt(Seat.East);

    const south =
        cardAt(Seat.South);

    const west =
        cardAt(Seat.West);

    function renderPlayedCard(
        played:
            PlayedCard | undefined,
        seat: Seat
    ) {
        if (!played) {
            return null;
        }

        return (
            <AnimatedPlayedCard
                card={played.card}
                seat={seat}
                winner={
                    winnerSeat === seat
                }
                collectToSeat={
                    collecting
                        ? winnerSeat
                        : undefined
                }
                hasExplanation={
                    played.explanation !==
                    undefined
                }
                onPress={
                    played.explanation
                        ? () =>
                            setSelectedPlay(
                                played
                            )
                        : undefined
                }
            />
        );
    }

    return (
        <>
            <View style={styles.table}>
                <Text style={styles.label}>
                    Current Trick
                </Text>

                <View
                    style={
                        styles.northPosition
                    }
                >
                    {renderPlayedCard(
                        north,
                        Seat.North
                    )}
                </View>

                <View
                    style={
                        styles.westPosition
                    }
                >
                    {renderPlayedCard(
                        west,
                        Seat.West
                    )}
                </View>

                <View
                    style={
                        styles.eastPosition
                    }
                >
                    {renderPlayedCard(
                        east,
                        Seat.East
                    )}
                </View>

                <View
                    style={
                        styles.southPosition
                    }
                >
                    {renderPlayedCard(
                        south,
                        Seat.South
                    )}
                </View>
            </View>

            <PlayExplanationModal
                played={selectedPlay}
                onClose={() =>
                    setSelectedPlay(
                        null
                    )
                }
            />
        </>
    );
}

function PlayExplanationModal({
    played,
    onClose
}: {
    played: PlayedCard | null;
    onClose: () => void;
}) {
    if (
        !played ||
        !played.explanation
    ) {
        return null;
    }

    const explanation =
        played.explanation;

    return (
        <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View
                style={
                    styles.modalBackdrop
                }
            >
                <View
                    style={
                        styles.modalPanel
                    }
                >
                    <View
                        style={
                            styles.modalHeader
                        }
                    >
                        <View>
                            <Text
                                style={[
                                    styles.modalCard,
                                    {
                                        color:
                                            suitColor(
                                                played.card.suit
                                            )
                                    }
                                ]}
                            >
                                {cardText(
                                    played.card
                                )}
                            </Text>

                            <Text
                                style={
                                    styles.modalSeat
                                }
                            >
                                Played by{" "}
                                {played.seat}
                            </Text>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close play explanation"
                            onPress={onClose}
                            style={({
                                pressed
                            }) => [
                                styles.closeButton,
                                pressed &&
                                    styles.closeButtonPressed
                            ]}
                        >
                            <Text
                                style={
                                    styles.closeButtonText
                                }
                            >
                                Close
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.modalContent
                        }
                    >
                        <Text
                            style={
                                styles.explanationTitle
                            }
                        >
                            {explanation.title}
                        </Text>

                        <Text
                            style={
                                styles.ruleLabel
                            }
                        >
                            Rule
                        </Text>

                        <Text
                            style={
                                styles.ruleText
                            }
                        >
                            {explanation.rule}
                        </Text>

                        <Text
                            style={
                                styles.summaryText
                            }
                        >
                            {explanation.summary}
                        </Text>

                        <ExplanationSection
                            title="Reasons"
                            entries={
                                explanation.facts
                            }
                        />

                        <ExplanationSection
                            title="Alternatives"
                            entries={
                                explanation.alternatives
                            }
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function ExplanationSection({
    title,
    entries
}: {
    title: string;
    entries: string[];
}) {
    if (entries.length === 0) {
        return null;
    }

    return (
        <View style={styles.section}>
            <Text
                style={
                    styles.sectionTitle
                }
            >
                {title}
            </Text>

            {entries.map(
                (
                    entry,
                    index
                ) => (
                    <View
                        key={`${entry}-${index}`}
                        style={
                            styles.entryRow
                        }
                    >
                        <Text
                            style={
                                styles.entryBullet
                            }
                        >
                            •
                        </Text>

                        <Text
                            style={
                                styles.entryText
                            }
                        >
                            {entry}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
}

function cardText(
    card: Card
): string {
    return (
        `${displayRank(card.rank)}` +
        `${suitSymbol(card.suit)}`
    );
}

function displayRank(
    rank: number
): string {
    switch (rank) {
        case 14:
            return "A";

        case 13:
            return "K";

        case 12:
            return "Q";

        case 11:
            return "J";

        default:
            return String(rank);
    }
}

function suitColor(
    suit: Suit
): string {
    if (
        suit === Suit.Hearts ||
        suit === Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#111111";
}

const CARD_WIDTH = 48;
const CARD_HEIGHT = 58;

const styles = StyleSheet.create({
    table: {
        width: 210,
        height: 210,
        borderRadius: 105,
        position: "relative",
        backgroundColor: "#08752F",
        borderWidth: 3,
        borderColor: "#075324"
    },

    label: {
        position: "absolute",
        top: 95,
        alignSelf: "center",
        color:
            "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "600",
        includeFontPadding: false
    },

    northPosition: {
        position: "absolute",
        top: 13,
        left: 78,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    southPosition: {
        position: "absolute",
        bottom: 13,
        left: 78,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    westPosition: {
        position: "absolute",
        top: 74,
        left: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    eastPosition: {
        position: "absolute",
        top: 74,
        right: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.52)",
        justifyContent: "flex-end"
    },

    modalPanel: {
        maxHeight: "82%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 14,
        paddingHorizontal: 18,
        paddingBottom: 24
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3",
        paddingBottom: 12
    },

    modalCard: {
        fontSize: 29,
        fontWeight: "900",
        includeFontPadding: false
    },

    modalSeat: {
        color: "#666666",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2,
        includeFontPadding: false
    },

    closeButton: {
        minWidth: 70,
        minHeight: 38,
        backgroundColor: "#EDF5EF",
        borderWidth: 1,
        borderColor: "#B8D0BD",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12
    },

    closeButtonPressed: {
        opacity: 0.7
    },

    closeButtonText: {
        color: "#173A26",
        fontSize: 14,
        fontWeight: "800",
        includeFontPadding: false
    },

    modalContent: {
        paddingTop: 16,
        paddingBottom: 15
    },

    explanationTitle: {
        color: "#173A26",
        fontSize: 23,
        fontWeight: "900",
        marginBottom: 14,
        includeFontPadding: false
    },

    ruleLabel: {
        color: "#777777",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        includeFontPadding: false
    },

    ruleText: {
        color: "#1B1B1B",
        fontSize: 18,
        fontWeight: "800",
        marginTop: 3,
        includeFontPadding: false
    },

    summaryText: {
        color: "#444444",
        fontSize: 15,
        lineHeight: 21,
        marginTop: 10,
        includeFontPadding: false
    },

    section: {
        marginTop: 20
    },

    sectionTitle: {
        color: "#173A26",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 8,
        includeFontPadding: false
    },

    entryRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 7
    },

    entryBullet: {
        width: 18,
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "900",
        lineHeight: 20,
        includeFontPadding: false
    },

    entryText: {
        flex: 1,
        color: "#444444",
        fontSize: 14,
        lineHeight: 20,
        includeFontPadding: false
    }
});