import { Stack } from "expo-router";
import { TransactionProvider } from "../context/TransactionContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BudgetProvider } from "../context/BudgetContext";
import { useEffect } from "react";
import { initializeDatabase } from "../database/database";

export default function RootLayout() {
    useEffect(() => {
        async function setupDatabase() {
            initializeDatabase();
        }
        setupDatabase();
    }, []);

    return (
        <BudgetProvider>
            <TransactionProvider>
                <SafeAreaProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                </SafeAreaProvider>
            </TransactionProvider>
        </BudgetProvider>
    );
}