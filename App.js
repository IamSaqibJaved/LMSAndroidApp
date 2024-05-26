import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AdminScreen from './screens/AdminScreen'; // Import AdminScreen
import AssignClass from './screens/AssignClass'; // Adjust the path as needed


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'SMARTIOUS',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'IMFellEnglish-Regular',
              fontSize: 25,
              letterSpacing: 10,
              color: 'black',
              top: 10,
            },
          }}
        />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="AssignClass" component={AssignClass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
