import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "../../context/TransactionContext";
import { Transaction, Category } from "../../types/transaction";
import { useBudget } from "../../context/BudgetContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const categories: Category[] = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

export default function HomeScreen() {
  const router = useRouter();
  const { monthlyBudget } = useBudget();
  const { transactions, addTransaction } = useTransactions();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");

  const { spent, remaining, progress, byCategory } = useMemo(() => {
    const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    // const totalRemaining = Math.max(monthlyBudget - totalSpent, 0);
    const totalRemaining = monthlyBudget - totalSpent;
    // const budgetProgress = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;
    const budgetProgress = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
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

  const handleAddTransaction = () => {
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
      id: Date.now(),
      title: title.trim(),
      amount: parsedAmount,
      category: category,
      createdAt: new Date().getTime(),
    };

    addTransaction(newTransaction);
    setTitle("");
    setAmount("");
    setCategory("Food");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.heading}>MyMoney</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Monthly Budget</Text>
            <Pressable
              onPress={() => { router.push('/budgetHistory') }}
              style={({pressed})=>[{backgroundColor: pressed?"#ececec": "white", borderRadius: 10}]}
            >
              {({pressed})=>(
                <SummaryBox label="Total Monthly Budget" value={monthlyBudget} color={pressed?"black":"#868686"} history={true} />
              )}
            </Pressable>
            
            <View style={styles.row}>
              {
                remaining >= 0 ?
                  <SummaryBox label="Remaining" value={remaining} color="#16a34a" history={false} /> :
                  <SummaryBox label="Credit" value={remaining} color="#ff1515" history={false} />
              }
              <SummaryBox label="Spent" value={spent} color="#f97316" history={false} />
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: progress > 100 ? "#f91616" : "#2563eb" }]} />
            </View>
            <Text style={styles.progressText}>{progress.toFixed(1)}% of budget used</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add Expense</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Transaction title"
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
            <Pressable style={styles.primaryButton} onPress={handleAddTransaction}>
              <Text style={styles.primaryButtonText}>Add Transaction</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {byCategory.map((item) => (
              <View key={item.category} style={styles.breakdownRow}>
                <Text style={styles.breakdownCategory}>{item.category}</Text>
                <Text style={styles.breakdownAmount}>₹{item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>

        </KeyboardAvoidingView>
      </ScrollView >
    </SafeAreaView >
  );
}

function SummaryBox({ label, value, color, history }: { label: string; value: number; color: string; history: boolean }) {
  return (
    <View style={[styles.summaryBox, { borderColor: color }]}>
      <View style={{flex:1}}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={[styles.summaryValue, { color }]}>₹{value.toFixed(2)}</Text>
      </View>
      {history && <Ionicons name="time-outline" style={styles.budgetHistory} />}
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
    elevation: 3,
  },
  budgetHistory: {
    fontSize: 24,
    paddingHorizontal: 12,
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
    flex: 1,
  },
  budgetChangeButton: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  budgetChangeText: {
    fontSize: 20,
    fontWeight: 500,
    color: 'white'
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  summaryBox: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
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
