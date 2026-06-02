import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Transaction, Category } from "../types/transaction";
import { addTransactionDb, getMonthTransactionsDb, getAllTransactionsDb, removeTransactionDb } from "../database/database";

type Section = {
    title: string;
    data: Transaction[];
}

type TransactionContextType = {
    transactions: Transaction[];
    // setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    addTransaction: (newTransaction: Transaction) => void;
    removeTransaction: (id: number) => void;
    allTransactions: Transaction[];
    loadAllTransactions: () => void;
    sections: Section[];
};

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    useEffect(() => {
        async function loadTransactions() {
            const initialTransactions: Transaction[] = await getMonthTransactionsDb(Date.now());
            setTransactions(initialTransactions);
            createSections(transactions);
        }
        loadTransactions();
    }, [])

    useEffect(() => {
        createSections(allTransactions);
    }, [allTransactions]);

    const createSections = (transactionsList: Transaction[]) => {
        const grouped = transactionsList.reduce((acc, tx) => {
            const date = new Date(tx.createdAt);
            const monthYear = date.toLocaleDateString("default", { month: "long", year: "numeric" });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(tx);
            return acc;
        }, {} as Record<string, Transaction[]>);

        const tempSections = Object.entries(grouped).map(([title, data]) => (
            { title, data }
        ))
        setSections(tempSections);
    }

    const addTransaction = async (newTransaction: Transaction) => {
        setTransactions((prev) => [newTransaction, ...prev]);
        setAllTransactions((prev) => [newTransaction, ...prev]);
        await addTransactionDb(newTransaction);
    };

    const removeTransaction = async (id: number) => {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        setAllTransactions((prev) => prev.filter((tx) => tx.id !== id));
        await removeTransactionDb(id);
    };

    const loadAllTransactions = async () => {
        const moreTransactions: Transaction[] = await getAllTransactionsDb();
        setAllTransactions(moreTransactions);
    }

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
                removeTransaction,
                allTransactions,
                loadAllTransactions,
                sections,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);

    if (!context) {
        throw new Error("useTransactions must be used inside TransactionProvider");
    }

    return context;
}