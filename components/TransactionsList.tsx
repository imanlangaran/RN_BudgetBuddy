import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Category, Transaction } from '../types'

const TransactionsList = ({
  transactions,
  categories,
  deleteTransaction,
}: {
  transactions: Transaction[],
  categories: Category[],
  deleteTransaction: (id: number) => Promise<void>;
}) => {
  return (
    <View>
      {transactions.map((transaction) => {
        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={.7}
            onLongPress={() => deleteTransaction(transaction.id)}
          >
            <Text>
              {transaction.description} amount: {transaction.amount}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TransactionsList