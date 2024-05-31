import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AdminScreen from './screens/AdminClass.js';
import AdminOptionScreen from './screens/AdminOptionScreen';
import AssignClass from './screens/AssignClass';
import AdminTeacherScreen from './screens/AdminTeacherScreen';

// Login
import LoginScreen from './screens/LoginScreen';

// Admin Student Screens
import AdminStudentsScreen from './screens/AdminStudents.js';
import AddStudentsScreen from './screens/AdminAddStudent.js';
import EditStudentScreen from './screens/AdminEditStudent.js';
import ViewStudent from './screens/ReportStudents.js';
import AdminResultScreen from './screens/AdminResultScreen.js';
// Admin fee
import AddFeeScreen from './screens/AdminAddFee.js';
import EditFeeScreen from './screens/AdminEditFee.js';
import AdminStudentFeesScreen from './screens/AdminStudentFees.js';
import TimetableScreen from './screens/AdminTimetable.js';
import SyllabusScreen from './screens/AdminSyllabus.js';
import EditSyllabusScreen from './screens/AdminEditSyllabus.js';
import EditClassScreen from './screens/EditClassScreen.js';


import StudentResultDisplay from './screens/ResultDisplayForStudent.js';
import ViewResults from './screens/ReportResults.js';

// Student Screens
import StudentOptionScreen from './screens/StudentOptionScreen.js';
import TeacherScreen from './screens/TeacherScreenforStudent.js';
import MarksScreen from './screens/MarksScreenforStudent.js';
import TimetableScreenforStudent from './screens/TimetableScreenforStudent.js';
import SyllabusScreenforStudent from './screens/SyllabusScreenforStudent.js';
import StudentScreen from './screens/StudentInfoScreen.js';
import FeeScreen from './screens/FeeScreenforStudent.js';
import ResultScreen from './screens/ResultScreenforStudent.js';

// Teacher Screens
import TeacherDashboard from './screens/Teacher/TeacherDashboard.js';
import InsertMarks from './screens/Teacher/InsertMarks.js';
import ViewMarks from './screens/Teacher/ViewMarks.js';
import ViewStudentMarks from './screens/Teacher/ViewStudentMarks.js';
import EditStudentMarks from './screens/Teacher/EditStudentMarks.js';

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
              letterSpacing: 10,
              fontSize: 25,
      
              color: 'black',
              top: 5,
            },
          }}
        />

        {/* ADMIN SCREENS */}
        <Stack.Screen 
          name="AdminClass" 
          component={AdminScreen} 
          options={{
            headerTitle: 'Admin Class',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 25,
             
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen name="Login" component={LoginScreen}
        options={{
          headerTitle: 'Login Screen',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 25,
           
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="AdminOptions" component={AdminOptionScreen} 
        options={{
          headerTitle: 'Dashboard',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 25,
            color: 'black',
            top: 5,
          },
        }}/>
        <Stack.Screen name="Admin" component={AdminScreen} 
        options={{
          headerTitle: 'Admin',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 25,
            color: 'black',
            top: 5,
          },
        }}/>
        <Stack.Screen 
          name="AssignClass" 
          component={AssignClass} 
          options={{
            headerTitle: 'Assign Class',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen name="AdminStudent" component={AdminStudentsScreen} 
        options={{
          headerTitle: 'Student',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} 
        />
        <Stack.Screen name="AddStudent" component={AddStudentsScreen} 
        options={{
          headerTitle: 'Add Student',
          headerTitleAlign: 'center',

          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="EditStudent" component={EditStudentScreen} 
        options={{
          headerTitle: 'Edit Student',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="AddFee" component={AddFeeScreen} 
        options={{
          headerTitle: 'Add Fee',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="EditFee" component={EditFeeScreen} 
        options={{
          headerTitle: 'Edit Fee',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="Fee" component={AdminStudentFeesScreen} 
        options={{
          headerTitle: 'Fee Status',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="Syllabus" component={SyllabusScreen}
        options={{
          headerTitle: 'Syllabus',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }}  />
        <Stack.Screen name="EditSyllabus" component={EditSyllabusScreen}
        options={{
          headerTitle: 'Edit Syllabus',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }}  />
        <Stack.Screen name="Timetable" component={TimetableScreen} 
        options={{
          headerTitle: 'Timetable',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="AdminTeacherScreen" component={AdminTeacherScreen}
        options={{
          headerTitle: 'Admin Teacher',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }}  />
        <Stack.Screen name="EditClassScreen" component={EditClassScreen} 
        options={{
          headerTitle: 'Edit Class',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="Report" component={ViewStudent} 
        options={{
          headerTitle: 'Report',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="AdminResultScreen" component={AdminResultScreen}
        options={{
          headerTitle: 'Result',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }}  />



        <Stack.Screen name="ReportStudents" component={ViewStudent} 
        options={{
          headerTitle: 'Student Report',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />
        <Stack.Screen name="ReportResults" component={ViewResults}
        options={{
          headerTitle: 'Result Report',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }}  />
        <Stack.Screen name="ResultDisplay" component={StudentResultDisplay}
        options={{
          headerTitle: 'Display Result',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 22,
            color: 'black',
            top: 5,
          },
        }} />

        {/* STUDENT SCREENS */}
        <Stack.Screen 
          name="Student" 
          component={StudentOptionScreen} 
          options={{
            headerTitle: 'Dashboard',
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />

        <Stack.Screen name="SyllabusStudent" component={SyllabusScreenforStudent} />
        <Stack.Screen name="StudentOptions" component={StudentOptionScreen} />

        <Stack.Screen 
          name="Teacher" 
          component={TeacherScreen} 
          options={{
            headerTitle: 'Teacher',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="Marks" 
          component={MarksScreen} 
          options={{
            headerTitle: 'Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        {/* <Stack.Screen 
          name="StudentTimetable" 
          component={TimetableScreen} 
          options={{
            headerTitle: 'TimeTable',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        /> */}
        {/* <Stack.Screen 
          name="StudentSyllabus" 
          component={SyllabusScreen} 
          options={{
            headerTitle: 'Syllabus',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        /> */}
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen 
          name="StudentFee" 
          component={FeeScreen} 
          options={{
            headerTitle: 'Fee',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />

        <Stack.Screen 
          name="TimetableStudent" 
          component={TimetableScreenforStudent} 
          options={{
            headerTitle: 'Timetable',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{
            headerTitle: 'Result',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />

        {/* TEACHER SCREENS */}
        <Stack.Screen 
          name="TeacherDashboard" 
          component={TeacherDashboard} 
          options={{
            headerTitle: 'Dashboard',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="insert-marks" 
          component={InsertMarks} 
          options={{
            headerTitle: 'Insert Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="view-marks" 
          component={ViewMarks} 
          options={{
            headerTitle: 'View Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="view-student-marks" 
          component={ViewStudentMarks} 
          options={{
            headerTitle: 'Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
        <Stack.Screen 
          name="edit-student-marks" 
          component={EditStudentMarks} 
          options={{
            headerTitle: 'Marks',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              color: 'black',
              top: 5,
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
