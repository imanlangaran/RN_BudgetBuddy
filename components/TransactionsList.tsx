import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

const TransactionsList = ({
  transactions,
  categories,
  deleteTransaction,
}: {
  transactions: Transaction[];
  categories: Category[];
  deleteTransaction: (id: number) => Promise<void>;
}) => {
  return (
    <View>
      {transactions.map((transaction) => {
        const categoryOfCurrentItem = categories.find(
          (categorie) => categorie.id === transaction.category_id
        );
        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={0.7}
            onLongPress={() => deleteTransaction(transaction.id)}
          >
            <TransactionListItem
              transaction={transaction}
              categoryInfo={categoryOfCurrentItem}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionsList;
