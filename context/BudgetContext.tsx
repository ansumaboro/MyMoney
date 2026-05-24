import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { decreaseBudget, getMonthlyBudget, increaseBudget } from "../database/database";

type BudgetContextType = {
    monthlyBudget: number;
    // setMonthlyBudget: React.Dispatch<React.SetStateAction<number>>;
    increaseMonthlyBudget: (amount: number) => void;
    decreaseMonthlyBudget: (amount: number) => void;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export function BudgetProvider({children}: {children: ReactNode}) {
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    useEffect(() => {
        async function loadBudget() {
            const budget = await getMonthlyBudget(Date.now());
            setMonthlyBudget(budget);
        }
        loadBudget();
        
    },[])

    const newBudget = {
      id: Date.now(),
      amount: 0,
      createdAt: Date.now(),
    }
    const increaseMonthlyBudget = async (amount: number) => {
        setMonthlyBudget((prev) => prev + amount);
        newBudget.amount = amount;
        await increaseBudget(newBudget);
    }

    const decreaseMonthlyBudget = async (amount: number) => {
        setMonthlyBudget((prev) => prev - amount);
        newBudget.amount = 0 - amount;
        await decreaseBudget(newBudget);
    }

    return(
        <BudgetContext.Provider
        value={{
            monthlyBudget,
            increaseMonthlyBudget,
            decreaseMonthlyBudget,
        }}
        >
            {children}
        </BudgetContext.Provider>
    )
}

export function useBudget() {
    const context = useContext(BudgetContext);

    if(!context) {
        throw new Error("useBudget must be used inside BudgetProvider");
    }
    return context;
}