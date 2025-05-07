import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Category, Transaction } from '../types'
import { useSQLiteContext } from 'expo-sqlite';

const AddTransaction = ({
  insertTransaction,
}: {
  insertTransaction(transaction: Transaction): Promise<void>;
}) => {

  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [currentTab, setCurentTab] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [typeSelected, setTypeSelected] = useState<string>('');
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState('Expense');
  const [categoryId, setCategoryId] = useState<number>(1);
  const db = useSQLiteContext();

  useEffect(() => {
    getExpenseType(currentTab)
  }, [currentTab]);

  const getExpenseType = async (currentTab: number) => {
    setCategory(currentTab === 0 ? "Expense" : "Income");
    const type = currentTab === 0 ? "Expense" : "Income";

    const result = await db.getAllAsync<Category>(
      `SELECT * FROM Categories WHERE type = ?;`,
      [type]
    );
    setCategories(result);
  }

  return (
    <View>
      <Text>AddTransaction</Text>
    </View>
  )
}

export default AddTransaction