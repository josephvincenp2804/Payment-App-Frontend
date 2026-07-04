import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { theme } from './src/styles/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTintColor: theme.colors.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: theme.colors.text,
              fontSize: 18,
            },
            headerBackTitleVisible: false,
            cardStyle: { backgroundColor: theme.colors.background }
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Dashboard' }} 
          />
          <Stack.Screen 
            name="Payment" 
            component={PaymentScreen} 
            options={{ title: 'Pay EMI' }} 
          />
          <Stack.Screen 
            name="Success" 
            component={SuccessScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Payment History' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
