import React from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

interface Props {
    visible: boolean;
    heading: string;
    recommendation: string;
    rule: string;
    summary: string;
    facts: string[];
    alternatives: string[];
    onClose: () => void;
}

export default function HintModal({
    visible,
    heading,
    recommendation,
    rule,
    summary,
    facts,
    alternatives,
    onClose
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.panel}>
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.heading}>
                                {heading}
                            </Text>

                            <Text style={styles.recommendation}>
                                {recommendation}
                            </Text>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close hint"
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.closeButton,
                                pressed &&
                                    styles.pressedButton
                            ]}
                        >
                            <Text style={styles.closeButtonText}>
                                Close
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={
                            styles.content
                        }
                    >
                        <Text style={styles.ruleLabel}>
                            Rule
                        </Text>

                        <Text style={styles.ruleText}>
                            {rule}
                        </Text>

                        <Text style={styles.summary}>
                            {summary}
                        </Text>

                        <HintSection
                            title="Why"
                            entries={facts}
                        />

                        <HintSection
                            title="Alternatives"
                            entries={alternatives}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function HintSection({
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
            <Text style={styles.sectionTitle}>
                {title}
            </Text>

            {entries.map((entry, index) => (
                <View
                    key={`${entry}-${index}`}
                    style={styles.entryRow}
                >
                    <Text style={styles.bullet}>
                        •
                    </Text>

                    <Text style={styles.entryText}>
                        {entry}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.52)",
        justifyContent: "flex-end"
    },

    panel: {
        maxHeight: "82%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 14,
        paddingHorizontal: 18,
        paddingBottom: 24
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3",
        paddingBottom: 12
    },

    headerText: {
        flex: 1,
        paddingRight: 12
    },

    heading: {
        color: "#173A26",
        fontSize: 16,
        fontWeight: "800",
        includeFontPadding: false
    },

    recommendation: {
        color: "#173A26",
        fontSize: 27,
        fontWeight: "900",
        marginTop: 3,
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

    closeButtonText: {
        color: "#173A26",
        fontSize: 14,
        fontWeight: "800"
    },

    pressedButton: {
        opacity: 0.7
    },

    content: {
        paddingTop: 16,
        paddingBottom: 15
    },

    ruleLabel: {
        color: "#777777",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.6
    },

    ruleText: {
        color: "#1B1B1B",
        fontSize: 18,
        fontWeight: "800",
        marginTop: 3
    },

    summary: {
        color: "#444444",
        fontSize: 15,
        lineHeight: 21,
        marginTop: 10
    },

    section: {
        marginTop: 20
    },

    sectionTitle: {
        color: "#173A26",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 8
    },

    entryRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 7
    },

    bullet: {
        width: 18,
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "900",
        lineHeight: 20
    },

    entryText: {
        flex: 1,
        color: "#444444",
        fontSize: 14,
        lineHeight: 20
    }
});