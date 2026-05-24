import * as SQLite from "expo-sqlite";
import { Transaction } from "../types/transaction";

type Budget = {
    id: number;
    amount: number;
    createdAt: number;
}

export const dbConnection = SQLite.openDatabaseAsync("mymoney.db");

export async function initializeDatabase() {
    const db = await dbConnection;
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
    `);
}

export async function addTransactionDb(newTransaction: Transaction) {
    const {id, title, amount, category, createdAt} = newTransaction;
    const db = await dbConnection;
    const result = await db.runAsync(
        `INSERT INTO transactions (id, title, amount, category, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [id, title, amount, category, createdAt]
    );
}

export async function removeTransactionDb(id: number) {
    const db = await dbConnection;
    await db.runAsync(`DELETE FROM transactions WHERE id = (?)`, [id]);
}

export async function getAllTransactionsDb() {
    const db = await dbConnection;
    const result: Transaction[] = await db.getAllAsync(`SELECT * FROM transactions ORDER BY createdAt DESC`);
    return result;
}

export async function getMonthlyBudget(createdDate: number) {
    const db = await dbConnection;
    const year = new Date(createdDate).getFullYear();
    const month = new Date(createdDate).getMonth();
    const monthStart = new Date(year, month).getTime();
    const monthEnd = new Date(year, month+1, 1).getTime()-1;

    const allRow: Budget[] = await db.getAllAsync(`SELECT * FROM budgets WHERE createdAt BETWEEN (?) AND (?)`,
        [monthStart, monthEnd]);

    let monthlyBudget=0;
    for (const row of allRow) {
        monthlyBudget += row.amount;        
    }
    return monthlyBudget;
}

export async function increaseBudget(newBudget: Budget) {
    const {id, amount, createdAt} = newBudget;
    const db = await dbConnection;
    await db.runAsync(`INSERT INTO budgets (id, amount, createdAt) VALUES (?, ?, ?)`, [id, amount, createdAt]);
}

export async function decreaseBudget(newBudget: Budget) {
    const {id, amount, createdAt} = newBudget;
    const db = await dbConnection;
    await db.runAsync(`INSERT INTO budgets (id, amount, createdAt) VALUES (?, ?, ?)`, [id, amount, createdAt]);
}