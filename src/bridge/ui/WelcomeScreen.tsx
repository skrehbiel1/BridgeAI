import React, {
    useState
} from "react";

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    SafeAreaView
} from "react-native-safe-area-context";

export type ScoringMode =
    | "duplicate"
    | "rubber";

interface Props {
    onStart: (
        scoringMode: ScoringMode
    ) => void;
}

export default function WelcomeScreen({
    onStart
}: Props) {
    const [
        scoringMode,
        setScoringMode
    ] = useState<ScoringMode>(
        "rubber"
    );

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={[
                "top",
                "right",
                "bottom",
                "left"
            ]}
        >
            <View style={styles.container}>
                <Image
                    source={require(
                        "../../../assets/bridge-welcome.png"
                    )}
                    style={styles.image}
                    resizeMode="contain"
                />

                <View style={styles.scoringPanel}>
                    <Text style={styles.scoringTitle}>
                        Scoring
                    </Text>

                    <View style={styles.scoringRow}>
                        <Pressable
                            onPress={() =>
                                setScoringMode(
                                    "duplicate"
                                )
                            }
                            style={[
                                styles.scoringButton,
                                scoringMode ===
                                    "duplicate" &&
                                    styles.selectedButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.scoringButtonText,
                                    scoringMode ===
                                        "duplicate" &&
                                        styles.selectedButtonText
                                ]}
                            >
                                Duplicate
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                setScoringMode(
                                    "rubber"
                                )
                            }
                            style={[
                                styles.scoringButton,
                                scoringMode ===
                                    "rubber" &&
                                    styles.selectedButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.scoringButtonText,
                                    scoringMode ===
                                        "rubber" &&
                                        styles.selectedButtonText
                                ]}
                            >
                                Rubber
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Start playing BridgeAI"
                    onPress={() =>
                        onStart(
                            scoringMode
                        )
                    }
                    style={({ pressed }) => [
                        styles.startButton,
                        pressed &&
                            styles.startButtonPressed
                    ]}
                >
                    <Text style={styles.startButtonText}>
                        Play Bridge
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#073D22"
    },

    container: {
        flex: 1,
        backgroundColor: "#073D22",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18
    },

    image: {
        width: "95%",
        height: "72%"
    },

    scoringPanel: {
        width: "90%",
        maxWidth: 360,
        marginTop: 8
    },

    scoringTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 7
    },

    scoringRow: {
        flexDirection: "row",
        gap: 10
    },

    scoringButton: {
        flex: 1,
        minHeight: 42,
        backgroundColor: "#E7EFE9",
        borderWidth: 2,
        borderColor: "#B8C9BC",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center"
    },

    selectedButton: {
        backgroundColor: "#FFEB3B",
        borderColor: "#F9A825"
    },

    scoringButtonText: {
        color: "#445247",
        fontSize: 15,
        fontWeight: "800"
    },

    selectedButtonText: {
        color: "#173A26"
    },

    startButton: {
        width: "90%",
        maxWidth: 360,
        minHeight: 52,
        backgroundColor: "#F7C843",
        borderWidth: 2,
        borderColor: "#D89E18",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12
    },

    startButtonPressed: {
        opacity: 0.82,
        transform: [
            {
                scale: 0.98
            }
        ]
    },

    startButtonText: {
        color: "#173A26",
        fontSize: 19,
        fontWeight: "900"
    }
});