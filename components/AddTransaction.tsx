import { Button, TextInput, View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Category, Transaction } from '../types'
import { useSQLiteContext } from 'expo-sqlite';
import Card from './ui/Card';

const AddTransaction = ({
  insertTransaction,
}: {
  insertTransaction(transaction: Omit<Transaction, 'id'>): Promise<void>;
}) => {

  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
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

  const handleSave = async () => {
    const theObj = {
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: new Date().getTime() / 1000,
      type: category as "Expense" | "Income",
    };

    // console.log(theObj);

    await insertTransaction(theObj);

    setAmount('');
    setDescription('');
    setCategory('Expense')
    setCategoryId(1);
    setCurrentTab(0);
    setIsAddingTransaction(false);
  }



  return (
    <View style={{ marginBottom: 15 }}>
      {
        isAddingTransaction ? (
          <View>
            <Card>
              <TextInput
                placeholder='$Amount'
                style={{ fontSize: 32, marginBottom: 15, fontWeight: 'bold' }}
                keyboardType='numeric'
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9.]/g, "");
                  setAmount(numericValue);
                }}
              />
              <TextInput
                placeholder='Description'
                style={{ marginBottom: 15 }}
                onChangeText={setDescription}
              />
              <Text style={{ marginBottom: 6 }}>Select a entry type</Text>
              <SegmentedControl
                values={['Expense', 'Income']}
                style={{ marginBottom: 15 }}
                selectedIndex={currentTab}
                onChange={(event) => {
                  setCurrentTab(event.nativeEvent.selectedSegmentIndex)
                }}
                tintColor="#fff" // Set the active segment color
                // backgroundColor="#FFFFFF" // Set the background color to white
                fontStyle={{
                  color: '#000000', // Set the text color to black
                }}
                // activeFontStyle={{
                //   color: '#007AFF', // Set the active text color
                // }}
              />
              {categories.map((cat) => (
                <CategoryButton
                  key={cat.name}
                  id={cat.id}
                  title={cat.name}
                  isSelected={typeSelected === cat.name}
                  setTypeSelected={setTypeSelected}
                  setCategoryId={setCategoryId}
                />
              ))}
            </Card>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              {/* <Button
                title='Cancel'
                color="red"
                onPress={() => setIsAddingTransaction(false)}
              />
              <Button
                title='Save'
                onPress={handleSave}
              /> */}
              <TextButton
                title='Cancel'
                color='red'
                onPress={() => setIsAddingTransaction(false)}
              />
              <TextButton
                title='Save'
                color='#007AFF'
                onPress={handleSave}
              />
            </View>
          </View>
        ) : (
          <AddButton setIsAddingTransaction={setIsAddingTransaction} />
        )
      }
    </View>
  )
}

const CategoryButton = ({
  id,
  title,
  isSelected,
  setTypeSelected,
  setCategoryId,
}: {
  id: number;
  title: string;
  isSelected: boolean;
  setTypeSelected: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setTypeSelected(title);
        setCategoryId(id);
      }}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isSelected ? '#007bff20' : '#00000020',
        borderRadius: 15,
        marginBottom: 6
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          color: isSelected ? '#007bff' : '#000000',
          marginLeft: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const AddButton = ({
  setIsAddingTransaction,
}: {
  setIsAddingTransaction: Dispatch<SetStateAction<boolean>>;
}) => {
  return (

    <TouchableOpacity
      onPress={() => setIsAddingTransaction(true)}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff20',
        borderRadius: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color='#007bff' />
      <Text style={{
        fontWeight: '700',
        color: '#007bff',
        marginLeft: 5,
      }}>
        New Entry
      </Text>
    </TouchableOpacity>
  )
}

const TextButton = (
  {
    title,
    onPress,
    color
  }: {
    title: string;
    onPress: ((event: GestureResponderEvent) => void) | undefined;
    color: string;
  }
) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingTop: 20,
        paddingBottom: 10,
        width: '40%',
        alignItems: 'center',
        // backgroundColor:'blue'
      }}
    >
      <Text style={{
        color: color,
        fontWeight: '700',
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default AddTransaction