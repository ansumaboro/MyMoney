import { Text, View, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, SectionList, Modal, TextInput } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { Budget } from "../types/budget";

export default function Budgets() {
    const insets = useSafeAreaInsets();
    const { increaseMonthlyBudget, decreaseMonthlyBudget, loadAllBudget, budgetSection, removeBudgetEntry } = useBudget();
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        loadAllBudget();
    }, [])
    const [budgetType, setBudgetType] = useState<"in" | "out">("in");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");

    const handleBudgetChange = () => {
        const parsedAmount = Number(amount)
        if (!title.trim()) {
            Alert.alert("Missing title", "Please enter a transaction title.");
            return;
        }
        if (!parsedAmount || parsedAmount <= 0) {
            Alert.alert("Invalid amount", "Please enter a valid amount greater than 0.");
            return;
        }
        if (budgetType === "in") {
            increaseMonthlyBudget(title, parsedAmount);
        } else if (budgetType === "out") {
            decreaseMonthlyBudget(title, parsedAmount);
        }
        setTitle("");
        setAmount("");
        setModalVisible(false);
    }

    const handleRemoveBudget = (id: number) => {
        Alert.alert(
            "Delete Budget Entry",
            "Are you sure you want to delete this budget entry?",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                },
                {
                    text: "Delete",
                    onPress: () => { removeBudgetEntry(id) }
                }
            ],
            { cancelable: true }
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                // behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text style={styles.heading}>Budget History</Text>
                <SectionList
                    sections={budgetSection}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TransactionCard item={item} handleRemoveBudget={handleRemoveBudget} />
                    )}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.monthHeader}>
                            <Text style={styles.monthHeaderText}>
                                {section.title}
                            </Text>
                            <Text style={[styles.monthHeaderAmount, { color: section.total > 0 ? 'green' : '#dc2626' }]}>
                                ₹{section.total.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    renderSectionFooter={() => (
                        <View style={styles.footerLine}></View>
                    )}
                    ListEmptyComponent={
                        <View>
                            <Text style={styles.emptyText}>No budgets recorded.</Text>
                        </View>
                    }
                />
                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={() => { setModalVisible(true); setBudgetType("in") }}
                        style={({ pressed }) => [styles.updateButton, { backgroundColor: pressed ? "darkgreen" : "green" }]}
                    >
                        <Text style={styles.updateButtonText}>Add</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { setModalVisible(true); setBudgetType("out") }}
                        style={({ pressed }) => [styles.updateButton, { backgroundColor: pressed ? "#af1c1c" : "#dc2626" }]}
                    >
                        <Text style={styles.updateButtonText}>Less</Text>
                    </Pressable>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        style={{flex: 1}}
                        behavior={Platform.OS === "ios"?"padding":"padding"}
                        keyboardVerticalOffset={Platform.OS === "ios"?undefined:-insets.bottom}
                    >
                        <Pressable
                            style={styles.overlay}
                            onPress={() => setModalVisible(false)}
                        >
                            <Pressable style={[styles.modalContainer, { marginBottom: insets.bottom }]} onPress={(e) => e.stopPropagation()}>
                                <View>
                                    <Text style={styles.modalTitle}>{budgetType == "in" ? "Increase Budget" : "Decrease Budget"}</Text>
                                    <TextInput
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Budget title"
                                        placeholderTextColor={"gray"}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        value={amount}
                                        onChangeText={setAmount}
                                        keyboardType="numeric"
                                        placeholder="Amount"
                                        placeholderTextColor={"gray"}
                                        style={styles.input}
                                    />
                                    {budgetType === "in" ?
                                        <Pressable
                                            onPress={handleBudgetChange}
                                            style={({ pressed }) => [styles.saveButton, { backgroundColor: pressed ? "darkgreen" : "green" }]}
                                        >
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </Pressable> :
                                        <Pressable
                                            onPress={handleBudgetChange}
                                            style={({ pressed }) => [styles.saveButton, { backgroundColor: pressed ? "#af1c1c" : "#dc2626" }]}
                                        >
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </Pressable>
                                    }
                                </View>
                            </Pressable>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function TransactionCard({ item, handleRemoveBudget }: { item: Budget, handleRemoveBudget: (id: number) => void }) {
    return (
        <View style={styles.transactionRow}>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionMeta}>
                    <Text style={{ color: item.amount > 0 ? 'green' : '#dc2626' }}>{item.amount > 0 ? "Add" : "Less"}</Text> | {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.transactionActions}>
                <Text style={[styles.transactionAmount, { color: item.amount > 0 ? 'green' : '#dc2626' }]}> ₹{item.amount < 0 ? (item.amount * (-1)).toFixed(2) : item.amount.toFixed(2)}</Text>
                <Pressable onPress={() => handleRemoveBudget(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    )
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
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8,
        // paddingHorizontal: 8,
    },
    monthHeaderText: {
        fontWeight: 500,
        textAlign: 'center',
        flex: 1,
    },
    monthHeaderAmount: {
        color: "#dc2626",
        fontWeight: 700,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "white"
    },
    footerLine: {
        backgroundColor: "#b1b1b1",
        height: 2,
        margin: 8,
        marginBottom: 12,
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
        fontWeight: "400",
    },
    deleteText: {
        color: "#2563eb",
        fontSize: 12,
        fontWeight: "600",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#888",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 30,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    updateButton: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: "center"
    },
    updateButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },
    saveButton: {
        height: 45,
        justifyContent: "center",
        marginHorizontal: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: 600,
        textAlign: "center"
    },
    modalTitle: {
        color: "black",
        fontSize: 24,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 20,
    }
});
