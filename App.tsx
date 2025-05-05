import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Suspense, useEffect, useState } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';

const Stack = createNativeStackNavigator()

const loadDatabase = async () => {
  const dbName = 'mySQLiteDB.db';
  const dbAsset = require('./assets/mySQLiteDB.db');
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, [])

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={'large'} />
        <Text>Loading...</Text>
      </View>
    )

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={'large'} />
            <Text>Loading...</Text>
          </View>
        }
      >
        <SQLiteProvider useSuspense databaseName='mySQLiteDB.db'>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={Home}
              options={{
                headerTitle: 'Budget Buddy',
                headerLargeTitle: true,
              }} />
          </Stack.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}
