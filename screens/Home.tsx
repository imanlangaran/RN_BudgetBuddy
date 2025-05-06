import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Category, Transaction, TransactionsByMonth } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import TransactionsList from "../components/TransactionsList";
import Card from "../components/ui/Card";

const Home = () => {
  const [catogories, setCatogories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Transaction>(
      `SELECT * FROM Transactions ORDER BY date DESC;`
    );
    setTransactions(result);

    const catResult = await db.getAllAsync<Category>(
      `SELECT * FROM Categories;`
    );
    setCatogories(catResult);

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(),1);
    const endOfMonth = new Date(now.getFullYear(),now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds()-1);

    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime()/1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime()/1000);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await getData();
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 17 }}>
      <TransactionSummary
        totalExpenses={transactionsByMonth.totalExpenses}
        totalIncome={transactionsByMonth.totalIncome}
      />
      <TransactionsList
        categories={catogories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  );
};

const TransactionSummary = ({
  totalIncome,
  totalExpenses,
}: TransactionsByMonth) => {
  const saving = totalIncome - totalExpenses;
  const readablePerion = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <Text>Summary for {readablePerion}</Text>
    </Card>
  );
};

export default Home;
