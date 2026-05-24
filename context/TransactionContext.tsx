import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Transaction, Category } from "../types/transaction";
import { addTransactionDb, getAllTransactionsDb, removeTransactionDb } from "../database/database";

type TransactionContextType = {
    transactions: Transaction[];
    // setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    addTransaction: (newTransaction: Transaction) => void;
    removeTransaction: (id: number) => void;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({children}: {children: ReactNode}) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        async function loadTransactions() {
            const initialTransactions: Transaction[] = await getAllTransactionsDb();
            setTransactions(initialTransactions);
        }
        loadTransactions();
    },[])
    
    const addTransaction = async (newTransaction: Transaction) => {
        setTransactions((prev) => [newTransaction, ...prev]);
        await addTransactionDb(newTransaction);
    };

    const removeTransaction = async (id: number) => {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        await removeTransactionDb(id);
    };

    return(
        <TransactionContext.Provider
            value = {{
                transactions,
                addTransaction,
                removeTransaction,
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