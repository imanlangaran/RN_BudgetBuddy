import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Category, Transaction } from '../types'
import { useSQLiteContext } from 'expo-sqlite';
import TransactionsList from '../components/TransactionsList';

const Home = () => {
  const [catogories, setCatogories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    })
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Transaction>(`SELECT * FROM Transactions ORDER BY date DESC;`);
    setTransactions(result);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await getData();
    })
  }

  return (
    <ScrollView>
      <TransactionsList
        categories={catogories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  )
}

export default Home