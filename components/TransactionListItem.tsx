import { View, Text } from "react-native";
import React from "react";
import { Category, Transaction } from "../types";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

const TransactionListItem = ({
  transaction,
  categoryInfo,
}: TransactionListItemProps) => {
  return (
    <Text>
      {categoryInfo?.name} amount: {transaction.amount}
    </Text>
  );
};

export default TransactionListItem;
