import React from "react";

import {
    SafeAreaProvider
} from "react-native-safe-area-context";

import BridgeScreen
from "./src/bridge/ui/BridgeScreen";

export default function App() {
    return (
        <SafeAreaProvider>
            <BridgeScreen />
        </SafeAreaProvider>
    );
}