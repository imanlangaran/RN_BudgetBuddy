import { View, Text, ScrollView, TextStyle, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Category, Transaction, TransactionsByMonth } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import TransactionsList from "../components/TransactionsList";
import Card from "../components/ui/Card";
import AddTransaction from "../components/AddTransaction";

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

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const transactionByMonth = await db.getAllAsync<TransactionsByMonth>(`
      SELECT ifnull(
          SUM(
            CASE
              WHEN type = 'Expense' THEN amount
              ELSE 0
            END
          ),
          0
        ) as totalExpense,
        ifnull(
          SUM(
            CASE
              WHEN type = 'Income' THEN amount
              ELSE 0
            END
          ),
          0
        ) as totalIncome
      FROM Transactions
      WHERE date BETWEEN ? AND ?
      `, [startOfMonthTimestamp, endOfMonthTimestamp]);
    setTransactionsByMonth(transactionByMonth[0]);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await getData();
    });
  }

  const insertTransaction = async (transaction: Transaction) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO Transactions (category_id, amount, date, description , type) VALUES (?,?,?,?,?)`,
        [
          transaction.category_id,
          transaction.amount,
          transaction.date,
          transaction.description,
          transaction.type,
        ]
      );
      await getData();
    })
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 17 }}>
      <AddTransaction insertTransaction={insertTransaction} />
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
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: 'bold',
    color: value < 0 ? '#ff4500' : '#2e8b57',
  });

  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}$${absValue}`;
  }

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Income: {' '}
        <Text style={getMoneyTextStyle(totalIncome)}>
          {formatMoney(totalIncome)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Expenses:{' '}
        <Text style={getMoneyTextStyle(totalExpenses)}>
          {formatMoney(totalExpenses)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Saving:{' '}
        <Text style={getMoneyTextStyle(saving)}>
          {formatMoney(saving)}
        </Text>
      </Text>
    </Card>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  }
})