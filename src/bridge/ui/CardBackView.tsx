import React from "react";

import {
    View,
    StyleSheet
} from "react-native";

interface Props {
    orientation?: "horizontal" | "vertical";
    scale?: number;
}

export default function CardBackView({
    orientation = "horizontal",
    scale = 1
}: Props) {
    const width =
        orientation === "horizontal"
            ? 34 * scale
            : 24 * scale;

    const height =
        orientation === "horizontal"
            ? 48 * scale
            : 36 * scale;

    return (
        <View
            style={[
                styles.card,
                {
                    width,
                    height
                }
            ]}
        >
            <View style={styles.innerBorder}>
                <View style={styles.pattern} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#222222",
        borderRadius: 5,
        padding: 2,
        elevation: 2
    },

    innerBorder: {
        flex: 1,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "#1E4F9A",
        padding: 3
    },

    pattern: {
        flex: 1,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#AFC8EE",
        backgroundColor: "#315FA8"
    }
});