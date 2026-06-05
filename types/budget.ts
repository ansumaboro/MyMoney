export type Budget = {
    id: number;
    amount: number;
    createdAt: number;
}

export type BudgetSection = {
    title: string;
    data: Budget[];
    total: number;
}
