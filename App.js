
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
// import LoginScreen from './screens/LoginScreen.js';
import TeacherDashboard from './screens/Teacher/TeacherDashboard.js';
import InsertMarks from './screens/Teacher/InsertMarks.js';
import ViewMarks from './screens/Teacher/ViewMarks.js';
import ViewStudentMarks from './screens/Teacher/ViewStudentMarks.js';


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
              top: 5,
            },
          }}
        />
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{
            headerTitle: 'SMARTIOUS',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'IMFellEnglish-Regular',
              fontSize: 25,
              letterSpacing: 10,
              color: 'black',
              top: 5,
            },}} /> */}
        <Stack.Screen name="AdminOptionScreen" component={AdminOptionScreen} options={{
            headerTitle: 'Dashboard',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}
         />
         <Stack.Screen name="AdminScreen" component={AdminScreen} options={{
            headerTitle: 'Classes',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>
        <Stack.Screen name="AssignClass" component={AssignClass}  options={{
            headerTitle: 'Assign Class',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}} />

        {/* Student Screens */}
        <Stack.Screen name="Student" component={StudentOptionScreen} options={{
            headerTitle: 'Dashboard',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>

        <Stack.Screen name="Teacher" component={TeacherScreen} />


        <Stack.Screen name="Marks" component={MarksScreen} options={{
            headerTitle: 'Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>
        <Stack.Screen name="Timetable" component={TimetableScreen} options={{
            headerTitle: 'TimeTable',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}} />
        <Stack.Screen name="Syllabus" component={SyllabusScreen} options={{
            headerTitle: 'Syllabus',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen name="Fee" component={FeeScreen} options={{
            headerTitle: 'Fee',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>
        <Stack.Screen name="Result" component={ResultScreen} options={{
            headerTitle: 'Result',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>


                                              {/* Teacher Screens */}

          <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{
            headerTitle: 'Dashboard',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>

            <Stack.Screen name="insert-marks" component={InsertMarks} options={{
            headerTitle: 'Insert Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>

            <Stack.Screen name="view-marks" component={ViewMarks} options={{
            headerTitle: 'View Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>

            <Stack.Screen name="view-student-marks" component={ViewStudentMarks} options={{
            headerTitle: 'Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
