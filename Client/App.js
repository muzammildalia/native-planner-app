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

// function EmptyScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// const Drawer = createDrawerNavigator();
// const Stack = createNativeStackNavigator();


// function Root() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       useLegacyImplementation
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: '#B9D5FF'
//         },
//         drawerStyle: {
//           backgroundColor: '#B9D5FF',
//           width: 240,
//         },
//       }}
//     >
//       <Drawer.Screen name="Home" component={Hindex} />
//       <Drawer.Screen name="Calender" component={CalenderScreen} />
//       <Drawer.Screen name="Logout" options={{ title: 'Logout', headerShown: false }} component={Login} />
//       <Drawer.Screen name="Settings" component={Setting} />
//     </Drawer.Navigator>
//   );
// }
function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        {/* <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
              name="Root"
              component={Root}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer> */}
        <MainNavigation />
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;