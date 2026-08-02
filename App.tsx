import React from "react";

import {
    SafeAreaProvider
} from "react-native-safe-area-context";

import BridgeSessionScreen
from "./src/bridge/ui/BridgeSessionScreen";

export default function App() {
    return (
        <SafeAreaProvider>
            <BridgeSessionScreen />
        </SafeAreaProvider>
    );
}