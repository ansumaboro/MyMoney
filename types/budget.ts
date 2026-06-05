export type Budget = {
    id: number;
    title: string;
    amount: number;
    createdAt: number;
}

export type BudgetSection = {
    title: string;
    data: Budget[];
    total: number;
}
