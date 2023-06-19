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

function EmptyScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
function Root() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      useLegacyImplementation
      screenOptions={{
        headerStyle: {
          backgroundColor: '#B9D5FF'
        },
        drawerStyle: {
          backgroundColor: '#B9D5FF',
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Home" component={Hindex} />
      <Drawer.Screen name="Calender" component={CalenderScreen} />
      <Drawer.Screen name="Logout" component={Logout} />
      <Stack.Screen name="Settings" component={Setting} />
    </Drawer.Navigator>
  );
}
function App() {
  return (
    <AuthProvider>
      < NavigationContainer >
        <Stack.Navigator>

          {/* <Stack.Screen name="Calender" component={CalenderScreen} /> */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />





          {/* <Stack.Screen name="Home" component={Hindex} /> */}
        </Stack.Navigator>
      </NavigationContainer >
    </AuthProvider>
  );
}

export default App;