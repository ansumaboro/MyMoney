export type Category = 
    | "Food"
    | "Transport"
    | "Shopping"
    | "Bills"
    | "Health"
    | "Other";

export type Transaction = {
    id: number;
    title: string;
    amount: number;
    category: Category;
    createdAt: number;
}

export type TransactionSection = {
    title: string;
    data: Transaction[];
    total: number;
}