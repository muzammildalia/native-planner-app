import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Hindex from './src/screens/index';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Logout from './src/components/Logout'
import CalenderScreen from './src/screens/CalenderScreen';
import Setting from './src/screens/Setting';
import { AuthProvider } from './src/context/auth.js';
import { TasksProvider } from './src/context/Task';
import ForgotPassword from './src/screens/ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainNavigation from './src/Navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <MainNavigation style={{ backgroundColor: "#ffffff" }} />
      </TasksProvider>
    </AuthProvider>
  );
}

export default gestureHandlerRootHOC(App);