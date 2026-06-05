import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { decreaseBudget, getAllBudgetsDb, getMonthlyBudget, increaseBudget, removeBudgetEntryDb } from "../database/database";
import { Budget, BudgetSection } from "../types/budget";

type BudgetContextType = {
    monthlyBudget: number;
    increaseMonthlyBudget: (title: string, amount: number) => void;
    decreaseMonthlyBudget: (title: string, amount: number) => void;
    removeBudgetEntry: (id: number) => void;
    loadAllBudget: () => void;
    budgetSection: BudgetSection[];
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [allBudgets, setAllBudgets] = useState<Budget[]>([])
    const [budgetSection, setBudgetSection] = useState<BudgetSection[]>([]);
    useEffect(() => {
        async function loadBudget() {
            const budget = await getMonthlyBudget(Date.now());
            setMonthlyBudget(budget);
        }
        loadBudget();

    }, [])

    const newBudget = {
        id: Date.now(),
        title: "",
        amount: 0,
        createdAt: Date.now(),
    }

    useEffect(() => {
        createSections(allBudgets);
    }, [allBudgets])
    
    const createSections = (budgetList: Budget[]) => {
        const grouped = budgetList.reduce((acc, tx) => {
            const date = new Date(tx.createdAt);
            const monthYear = date.toLocaleDateString("default", { month: "long", year: "numeric" });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(tx);
            return acc;
        }, {} as Record<string, Budget[]>);

        const tempSections = Object.entries(grouped).map(([title, data]) => (
            {
                title,
                data,
                total: data.reduce((acc, tx) => (acc + tx.amount), 0),
            }
        ))
        setBudgetSection(tempSections);
    }

    const increaseMonthlyBudget = async (title: string, amount: number) => {
        setMonthlyBudget((prev) => prev + amount);
        newBudget.title = title;
        newBudget.amount = amount;
        setAllBudgets((prev) => [newBudget, ...prev]);
        await increaseBudget(newBudget);
    }

    const decreaseMonthlyBudget = async (title: string, amount: number) => {
        setMonthlyBudget((prev) => prev - amount);
        newBudget.title = title;
        newBudget.amount = 0 - amount;
        setAllBudgets((prev) => [newBudget, ...prev]);
        await decreaseBudget(newBudget);
    }

    const removeBudgetEntry = async (id: number) => {
        setAllBudgets((prev) => prev.filter((tx) => tx.id !== id));
        const result: Budget = await removeBudgetEntryDb(id);
        setMonthlyBudget((prev) => prev - result.amount);        
    }

    const loadAllBudget = async () => {
        const budgets: Budget[] = await getAllBudgetsDb();
        setAllBudgets(budgets);
    }

    return (
        <BudgetContext.Provider
            value={{
                monthlyBudget,
                increaseMonthlyBudget,
                decreaseMonthlyBudget,
                removeBudgetEntry,
                loadAllBudget,
                budgetSection,
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}

export function useBudget() {
    const context = useContext(BudgetContext);

    if (!context) {
        throw new Error("useBudget must be used inside BudgetProvider");
    }
    return context;
}