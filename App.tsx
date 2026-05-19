import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Category = "Food" | "Transport" | "Shopping" | "Bills" | "Health" | "Other";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  createdAt: string;
};

const categories: Category[] = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

const initialTransactions: Transaction[] = [
  { id: "1", title: "Groceries", amount: 65, category: "Food", createdAt: "2026-05-02" },
  { id: "2", title: "Bus Pass", amount: 20, category: "Transport", createdAt: "2026-05-03" },
  { id: "3", title: "Electricity Bill", amount: 50, category: "Bills", createdAt: "2026-05-04" },
];

export default function App() {
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState("500");
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");

  const monthlyBudget = Number(monthlyBudgetInput) || 0;

  const { spent, remaining, progress, byCategory } = useMemo(() => {
    const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const totalRemaining = Math.max(monthlyBudget - totalSpent, 0);
    const budgetProgress = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;
    const grouped = categories.map((item) => {
      const total = transactions
        .filter((tx) => tx.category === item)
        .reduce((acc, tx) => acc + tx.amount, 0);
      return { category: item, total };
    });

    return {
      spent: totalSpent,
      remaining: totalRemaining,
      progress: budgetProgress,
      byCategory: grouped,
    };
  }, [monthlyBudget, transactions]);

  const addTransaction = () => {
    const parsedAmount = Number(amount);
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a transaction title.");
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than 0.");
      return;
    }

    const newTransaction: Transaction = {
      id: `${Date.now()}`,
      title: title.trim(),
      amount: parsedAmount,
      category,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {/* <ScrollView> */}


          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={styles.heading}>MyMoneyAI Budget Tracker</Text>
            <ScrollView>

            <View style={styles.card}>
              <Text style={styles.label}>Monthly Budget</Text>
              <TextInput
                value={monthlyBudgetInput}
                onChangeText={setMonthlyBudgetInput}
                keyboardType="numeric"
                placeholder="Set monthly budget"
                style={styles.input}
              />
              <View style={styles.row}>
                <SummaryBox label="Spent" value={spent} color="#f97316" />
                <SummaryBox label="Remaining" value={remaining} color="#16a34a" />
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(1)}% of budget used</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Add Expense</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Transaction title"
                style={styles.input}
              />
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Amount"
                style={styles.input}
              />
              <View style={styles.categoriesWrap}>
                {categories.map((item) => (
                  <Pressable
                    key={item}
                    style={[styles.categoryChip, category === item && styles.categoryChipActive]}
                    onPress={() => setCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === item && styles.categoryChipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.primaryButton} onPress={addTransaction}>
                <Text style={styles.primaryButtonText}>Add Transaction</Text>
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Category Breakdown</Text>
              {byCategory.map((item) => (
                <View key={item.category} style={styles.breakdownRow}>
                  <Text style={styles.breakdownCategory}>{item.category}</Text>
                  <Text style={styles.breakdownAmount}>Rs. {item.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
              </ScrollView>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
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
                    <Text style={styles.transactionAmount}>-${item.amount.toFixed(2)}</Text>
                    <Pressable onPress={() => removeTransaction(item.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          </KeyboardAvoidingView>
        {/* </ScrollView> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function SummaryBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.summaryBox, { borderColor: color }]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]}>Rs. {value.toFixed(2)}</Text>
    </View>
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
