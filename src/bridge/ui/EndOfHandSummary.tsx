import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Game } from "../core/Game";

import {
    Partnership
} from "../core/Partnership";

import {
    RubberHandResult,
    RubberState
} from "../scoring/RubberBridgeScoring";

import {
    ScoringMode
} from "./WelcomeScreen";

interface Props {
    game: Game;

    scoringMode:
        ScoringMode;

    rubberState:
        RubberState;

    rubberHandResult:
        RubberHandResult | null;

    onNewHand: () => void;
}

export default function EndOfHandSummary({
    game,
    scoringMode,
    rubberState,
    rubberHandResult,
    onNewHand
}: Props) {
    const declarerTricks =
        game.contractTricksWon();

    const requiredTricks =
        game.contract.requiredTricks();

    const difference =
        declarerTricks -
        requiredTricks;

    const made =
        game.contractMade();

    const resultText =
        getResultText(
            made,
            difference
        );

    const duplicateScore =
        scoringMode ===
            "duplicate"
            ? game.score(false)
            : undefined;

    return (
        <View style={styles.overlay}>
            <View style={styles.panel}>
                <Text style={styles.title}>
                    Hand Complete
                </Text>

                <Text style={styles.contract}>
                    {game.contract.toString()}
                    {" by "}
                    {game.contract.declarer}
                </Text>

                <Text
                    style={[
                        styles.result,
                        made
                            ? styles.made
                            : styles.down
                    ]}
                >
                    {resultText}
                </Text>

                {scoringMode ===
                    "duplicate" &&
                    duplicateScore && (
                    <DuplicateScore
                        score={
                            duplicateScore
                        }
                    />
                )}

                {scoringMode ===
                    "rubber" && (
                    <RubberScore
                        state={
                            rubberState
                        }
                        result={
                            rubberHandResult
                        }
                    />
                )}

                <View style={styles.trickRow}>
                    <Text
                        style={
                            styles.trickLabel
                        }
                    >
                        Declarer tricks
                    </Text>

                    <Text
                        style={
                            styles.trickValue
                        }
                    >
                        {declarerTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text
                        style={
                            styles.trickLabel
                        }
                    >
                        Required tricks
                    </Text>

                    <Text
                        style={
                            styles.trickValue
                        }
                    >
                        {requiredTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text
                        style={
                            styles.trickLabel
                        }
                    >
                        NS tricks
                    </Text>

                    <Text
                        style={
                            styles.trickValue
                        }
                    >
                        {game.table.nsTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text
                        style={
                            styles.trickLabel
                        }
                    >
                        EW tricks
                    </Text>

                    <Text
                        style={
                            styles.trickValue
                        }
                    >
                        {game.table.ewTricks}
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Deal a new bridge hand"
                    onPress={onNewHand}
                    style={({ pressed }) => [
                        styles.button,

                        pressed &&
                            styles.buttonPressed
                    ]}
                >
                    <Text
                        style={
                            styles.buttonText
                        }
                    >
                        {scoringMode ===
                            "rubber"
                            ? rubberState
                                .rubberComplete
                                ? "New Rubber"
                                : "Next Hand"
                            : "New Hand"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

function DuplicateScore({
    score
}: {
    score: {
        declarerScore: number;
        contractPoints: number;
        overtrickPoints: number;
        bonusPoints: number;
        penaltyPoints: number;
        made: boolean;
    };
}) {
    return (
        <View style={styles.scoreBox}>
            <Text style={styles.scoreHeading}>
                Duplicate Score
            </Text>

            <Text
                style={[
                    styles.bigScore,

                    score.declarerScore >= 0
                        ? styles.positiveScore
                        : styles.negativeScore
                ]}
            >
                {signed(
                    score.declarerScore
                )}
            </Text>

            {score.made ? (
                <>
                    <ScoreRow
                        label="Contract"
                        value={
                            score.contractPoints
                        }
                    />

                    {score.overtrickPoints >
                        0 && (
                        <ScoreRow
                            label="Overtricks"
                            value={
                                score.overtrickPoints
                            }
                        />
                    )}

                    {score.bonusPoints >
                        0 && (
                        <ScoreRow
                            label="Bonuses"
                            value={
                                score.bonusPoints
                            }
                        />
                    )}
                </>
            ) : (
                <ScoreRow
                    label="Penalty"
                    value={
                        -score.penaltyPoints
                    }
                />
            )}

            <Text style={styles.smallNote}>
                Non-vulnerable
            </Text>
        </View>
    );
}

function RubberScore({
    state,
    result
}: {
    state: RubberState;
    result:
        RubberHandResult | null;
}) {
    return (
        <View style={styles.scoreBox}>
            <Text style={styles.scoreHeading}>
                Rubber Score
            </Text>

            {result && (
                <View
                    style={
                        styles.handScoreArea
                    }
                >
                    <Text
                        style={
                            styles.handScoreLabel
                        }
                    >
                        This hand
                    </Text>

                    <Text
                        style={
                            styles.handScore
                        }
                    >
                        {result.made
                            ? `${result.belowLinePoints} below`
                            : `${Math.abs(
                                result.aboveLinePoints
                            )} penalty`}
                    </Text>

                    {result.aboveLinePoints >
                        0 && (
                        <Text
                            style={
                                styles.handAbove
                            }
                        >
                            +
                            {
                                result.aboveLinePoints
                            }{" "}
                            above
                        </Text>
                    )}

                    {result.gameWon && (
                        <Text
                            style={
                                styles.gameWon
                            }
                        >
                            Game won!
                        </Text>
                    )}

                    {result.rubberWon && (
                        <Text
                            style={
                                styles.rubberWon
                            }
                        >
                            Rubber won!
                        </Text>
                    )}
                </View>
            )}

            <View style={styles.rubberHeader}>
                <Text
                    style={
                        styles.rubberHeaderBlank
                    }
                />

                <Text
                    style={
                        styles.rubberHeaderText
                    }
                >
                    NS
                </Text>

                <Text
                    style={
                        styles.rubberHeaderText
                    }
                >
                    EW
                </Text>
            </View>

            <RubberRow
                label="Below"
                ns={state.NS.belowLine}
                ew={state.EW.belowLine}
            />

            <RubberRow
                label="Above"
                ns={state.NS.aboveLine}
                ew={state.EW.aboveLine}
            />

            <RubberRow
                label="Games"
                ns={state.NS.gamesWon}
                ew={state.EW.gamesWon}
            />

            <View style={styles.vulnerabilityRow}>
                <Text
                    style={
                        styles.vulnerabilityText
                    }
                >
                    NS:{" "}
                    {state.NS.gamesWon > 0
                        ? "Vulnerable"
                        : "Not vulnerable"}
                </Text>

                <Text
                    style={
                        styles.vulnerabilityText
                    }
                >
                    EW:{" "}
                    {state.EW.gamesWon > 0
                        ? "Vulnerable"
                        : "Not vulnerable"}
                </Text>
            </View>

            {state.rubberComplete &&
                state.rubberWinner !==
                    undefined && (
                <Text style={styles.rubberWinner}>
                    {state.rubberWinner ===
                    Partnership.NS
                        ? "North-South"
                        : "East-West"}{" "}
                    wins the rubber
                </Text>
            )}
        </View>
    );
}

function RubberRow({
    label,
    ns,
    ew
}: {
    label: string;
    ns: number;
    ew: number;
}) {
    return (
        <View style={styles.rubberRow}>
            <Text style={styles.rubberLabel}>
                {label}
            </Text>

            <Text style={styles.rubberValue}>
                {ns}
            </Text>

            <Text style={styles.rubberValue}>
                {ew}
            </Text>
        </View>
    );
}

function ScoreRow({
    label,
    value
}: {
    label: string;
    value: number;
}) {
    return (
        <View style={styles.scoreRow}>
            <Text style={styles.scoreRowLabel}>
                {label}
            </Text>

            <Text style={styles.scoreRowValue}>
                {signed(value)}
            </Text>
        </View>
    );
}

function signed(
    value: number
): string {
    if (value > 0) {
        return `+${value}`;
    }

    return String(value);
}

function getResultText(
    made: boolean,
    difference: number
): string {
    if (!made) {
        return (
            `Down ${Math.abs(
                difference
            )}`
        );
    }

    if (difference === 0) {
        return "Contract Made";
    }

    return `Made ${difference}`;
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,

        backgroundColor:
            "rgba(0, 0, 0, 0.58)",

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 20,

        zIndex: 20
    },

    panel: {
        width: "100%",
        maxWidth: 350,

        maxHeight: "94%",

        backgroundColor: "#FFFFFF",

        borderRadius: 16,

        paddingHorizontal: 20,
        paddingVertical: 16,

        elevation: 10,

        shadowColor: "#000000",
        shadowOpacity: 0.35,
        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: 4
        }
    },

    title: {
        color: "#173A26",

        fontSize: 24,
        fontWeight: "800",

        textAlign: "center",

        includeFontPadding: false
    },

    contract: {
        color: "#555555",

        fontSize: 16,
        fontWeight: "600",

        textAlign: "center",

        marginTop: 4,

        includeFontPadding: false
    },

    result: {
        fontSize: 22,
        fontWeight: "800",

        textAlign: "center",

        marginTop: 10,
        marginBottom: 9,

        includeFontPadding: false
    },

    made: {
        color: "#2E7D32"
    },

    down: {
        color: "#C62828"
    },

    scoreBox: {
        backgroundColor: "#F2F7F3",

        borderWidth: 1,
        borderColor: "#C7DACB",

        borderRadius: 12,

        paddingHorizontal: 12,
        paddingVertical: 9,

        marginBottom: 10
    },

    scoreHeading: {
        color: "#173A26",

        fontSize: 14,
        fontWeight: "900",

        textAlign: "center",

        includeFontPadding: false
    },

    bigScore: {
        fontSize: 29,
        fontWeight: "900",

        textAlign: "center",

        marginVertical: 3,

        includeFontPadding: false
    },

    positiveScore: {
        color: "#2E7D32"
    },

    negativeScore: {
        color: "#C62828"
    },

    smallNote: {
        color: "#777777",

        fontSize: 10,

        textAlign: "center",

        marginTop: 4,

        includeFontPadding: false
    },

    handScoreArea: {
        alignItems: "center",

        paddingVertical: 6
    },

    handScoreLabel: {
        color: "#777777",

        fontSize: 10,
        fontWeight: "800",

        textTransform: "uppercase",

        includeFontPadding: false
    },

    handScore: {
        color: "#173A26",

        fontSize: 18,
        fontWeight: "900",

        marginTop: 2,

        includeFontPadding: false
    },

    handAbove: {
        color: "#2E7D32",

        fontSize: 12,
        fontWeight: "800",

        marginTop: 2,

        includeFontPadding: false
    },

    gameWon: {
        color: "#1565C0",

        fontSize: 14,
        fontWeight: "900",

        marginTop: 4,

        includeFontPadding: false
    },

    rubberWon: {
        color: "#C58B00",

        fontSize: 16,
        fontWeight: "900",

        marginTop: 3,

        includeFontPadding: false
    },

    rubberHeader: {
        flexDirection: "row",

        borderBottomWidth: 1,
        borderBottomColor: "#CBD8CD",

        paddingBottom: 3
    },

    rubberHeaderBlank: {
        flex: 1.4
    },

    rubberHeaderText: {
        flex: 1,

        color: "#173A26",

        fontSize: 12,
        fontWeight: "900",

        textAlign: "center",

        includeFontPadding: false
    },

    rubberRow: {
        flexDirection: "row",

        paddingVertical: 3,

        borderBottomWidth: 1,
        borderBottomColor: "#E3EAE4"
    },

    rubberLabel: {
        flex: 1.4,

        color: "#555555",

        fontSize: 12,

        includeFontPadding: false
    },

    rubberValue: {
        flex: 1,

        color: "#222222",

        fontSize: 12,
        fontWeight: "800",

        textAlign: "center",

        includeFontPadding: false
    },

    vulnerabilityRow: {
        marginTop: 6
    },

    vulnerabilityText: {
        color: "#666666",

        fontSize: 10,

        textAlign: "center",

        includeFontPadding: false
    },

    rubberWinner: {
        color: "#C58B00",

        fontSize: 14,
        fontWeight: "900",

        textAlign: "center",

        marginTop: 7,

        includeFontPadding: false
    },

    trickRow: {
        flexDirection: "row",

        justifyContent:
            "space-between",

        paddingVertical: 3,

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },

    trickLabel: {
        color: "#444444",

        fontSize: 13
    },

    trickValue: {
        color: "#222222",

        fontSize: 13,
        fontWeight: "700"
    },

    scoreRow: {
        flexDirection: "row",

        justifyContent:
            "space-between",

        paddingVertical: 2
    },

    scoreRowLabel: {
        color: "#555555",

        fontSize: 12
    },

    scoreRowValue: {
        color: "#222222",

        fontSize: 12,
        fontWeight: "700"
    },

    button: {
        minHeight: 45,

        backgroundColor: "#FFEB3B",

        borderWidth: 2,
        borderColor: "#F9A825",

        borderRadius: 10,

        alignItems: "center",
        justifyContent: "center",

        marginTop: 13
    },

    buttonPressed: {
        backgroundColor: "#FDD835",

        transform: [
            {
                scale: 0.98
            }
        ]
    },

    buttonText: {
        color: "#1B1B1B",

        fontSize: 17,
        fontWeight: "800",

        includeFontPadding: false
    }
});