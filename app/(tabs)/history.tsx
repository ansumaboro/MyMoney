import { Text, View, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useTransactions } from "../../context/TransactionContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
    const { transactions, removeTransaction } = useTransactions();

    const handleRemoveTransaction = (id: number) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                },
                {
                    text: "Delete",
                    onPress: () => {removeTransaction(id)}
                }
            ],
            { cancelable: true }
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.transactionRow}>
                        <View style={styles.transactionDetails}>
                            <Text style={styles.transactionTitle}>{item.title}</Text>
                            <Text style={styles.transactionMeta}>
                                {item.category} | {item.createdAt}
                            </Text>
                        </View>
                        <View style={styles.transactionActions}>
                            <Text style={styles.transactionAmount}>- ₹{item.amount.toFixed(2)}</Text>
                            <Pressable onPress={() => handleRemoveTransaction(item.id)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    heading: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    summaryBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    progressTrack: {
        marginTop: 10,
        height: 10,
        borderRadius: 99,
        backgroundColor: "#e5e7eb",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#2563eb",
    },
    progressText: {
        marginTop: 6,
        fontSize: 12,
        color: "#6b7280",
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
    },
    categoriesWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },
    categoryChip: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 99,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    categoryChipActive: {
        backgroundColor: "#dbeafe",
        borderColor: "#60a5fa",
    },
    categoryChipText: {
        fontSize: 13,
        color: "#374151",
    },
    categoryChipTextActive: {
        color: "#1d4ed8",
        fontWeight: "600",
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    breakdownRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    breakdownCategory: {
        color: "#374151",
    },
    breakdownAmount: {
        color: "#111827",
        fontWeight: "600",
    },
    listContent: {
        paddingBottom: 24,
    },
    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    transactionDetails: {
        flexShrink: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    transactionMeta: {
        marginTop: 2,
        color: "#6b7280",
        fontSize: 12,
    },
    transactionActions: {
        alignItems: "flex-end",
        marginLeft: 12,
        gap: 4,
    },
    transactionAmount: {
        color: "#dc2626",
        fontWeight: "700",
    },
    deleteText: {
        color: "#2563eb",
        fontSize: 12,
        fontWeight: "600",
    },
});
