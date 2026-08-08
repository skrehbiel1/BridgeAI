import React, {
    useState
} from "react";

import {
    StatusBar
} from "expo-status-bar";

import BridgeSessionScreen
from "./src/bridge/ui/BridgeSessionScreen";

import WelcomeScreen, {
    ScoringMode
} from "./src/bridge/ui/WelcomeScreen";

export default function App() {
    const [
        scoringMode,
        setScoringMode
    ] = useState<
        ScoringMode | null
    >(null);

    return (
        <>
            <StatusBar style="light" />

            {scoringMode ? (
                <BridgeSessionScreen
                    scoringMode={
                        scoringMode
                    }
                />
            ) : (
                <WelcomeScreen
                    onStart={
                        setScoringMode
                    }
                />
            )}
        </>
    );
}