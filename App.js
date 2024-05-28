
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AdminScreen from './screens/AdminScreen'; // Import AdminScreen
import AdminOptionScreen from './screens/AdminOptionScreen'; 
import AssignClass from './screens/AssignClass'; // Adjust the path as needed

// Student Screens
import StudentOptionScreen from './screens/StudentOptionScreen.js';
// import AdminScreen from './screens/AdminOptionScreen.js';
import TeacherScreen from './screens/TeacherScreenforStudent.js';
import MarksScreen from './screens/MarksScreenforStudent.js';
import TimetableScreen from './screens/TimetableScreenforStudent.js';
import SyllabusScreen from './screens/SyllabusScreenforStudent.js';
import StudentScreen from './screens/StudentInfoScreen.js';
import FeeScreen from './screens/FeeScreenforStudent.js';
import ResultScreen from './screens/ResultScreeforStudent.js';
import LoginScreen from './screens/LoginScreen.js';



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
        <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{
            headerTitle: 'SMARTIOUS',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'IMFellEnglish-Regular',
              fontSize: 25,
              letterSpacing: 10,
              color: 'black',
              top: 0,
            },}} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="AdminOptionScreen" component={AdminOptionScreen} />
        <Stack.Screen name="AssignClass" component={AssignClass} />

        {/* Student Screens */}
        <Stack.Screen name="Student" component={StudentOptionScreen} />
        {/* <Stack.Screen name="Admin" component={AdminScreen} /> */}
        <Stack.Screen name="Teacher" component={TeacherScreen} />
        <Stack.Screen name="Marks" component={MarksScreen} />
        <Stack.Screen name="Timetable" component={TimetableScreen} />
        <Stack.Screen name="Syllabus" component={SyllabusScreen} />
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen name="Fee" component={FeeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
