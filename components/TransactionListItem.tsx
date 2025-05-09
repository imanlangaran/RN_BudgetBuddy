import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Category, Transaction } from "../types";
import { AntDesign } from "@expo/vector-icons";
import Card from "./ui/Card";
import { categoryColors, categoryEmojies } from "../constants";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

const TransactionListItem = ({
  transaction,
  categoryInfo,
}: TransactionListItemProps) => {
  const iconName =
    transaction.type === "Expense" ? "minuscircle" : "pluscircle";
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[categoryInfo?.name ?? "Default"];
  const emoji = categoryEmojies[categoryInfo?.name ?? "Default"];

  return (
    <Card>
      <View style={style.row}>
        <View style={{ width: "40%", gap: 3 }}>
          <Amount
            amount={transaction.amount}
            color={color}
            iconName={iconName}
          />
          <CategoryItem
            categoryColor={categoryColor}
            categoryInfo={categoryInfo}
            emoji={emoji}
          />
        </View>
        <TransactionInfo
          date={transaction.date}
          description={transaction.description}
          id={transaction.id}
        />
      </View>
    </Card>
  );
};

const TransactionInfo = ({
  id,
  date,
  description,
}: {
  id: number;
  date: number;
  description: string;
}) => {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{description}</Text>
      <Text>Transaction Number {id}</Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        {new Date(date * 1000).toDateString()}
      </Text>
    </View>
  );
};

const CategoryItem = ({
  categoryColor,
  categoryInfo,
  emoji,
}: {
  categoryColor: string;
  categoryInfo: Category | undefined;
  emoji: string;
}) => {
  return (
    <View
      style={[
        style.categoryContainer,
        { backgroundColor: categoryColor + "40" },
      ]}
    >
      <Text style={style.categoryText}>
        {emoji} {categoryInfo?.name}
      </Text>
    </View>
  );
};

const Amount = ({
  iconName,
  color,
  amount,
}: {
  iconName: "minuscircle" | "pluscircle";
  color: string;
  amount: number;
}) => {
  return (
    <View style={style.row}>
      <AntDesign name={iconName} size={18} color={color} />
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[style.amount, { maxWidth: "80%" }]}
      >
        ${amount}
      </AutoSizeText>
    </View>
  );
};

const style = StyleSheet.create({
  amount: {
    fontSize: 20,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
  },
});

export default TransactionListItem;
