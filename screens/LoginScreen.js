import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disableLogin = email === '' || password === '';

  const handleLogin = async () => {
    if (userType === 'Admin') {
      if (email === "muh.uzair102@gmail.com" && password === "lms1234") {
        navigation.replace('AdminOptions');
      }
    } else if (userType === 'Student') {
      try {
        // Authenticate student via Firebase Authentication
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Search for student email in Firestore
        const studentSnapshot = await firestore().collection('students')
          .where('email', '==', email)
          .get();

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentId = studentDoc.id;
          //Alert.alert(studentId);

          navigation.replace('StudentOptions', { studentId });
        } else {
          Alert.alert('Login failed', 'Student record not found');
        }
      } catch (error) {
        Alert.alert('Login failed', 'Invalid email or password');
        console.error('Login error:', error);
      }
    } else if (userType === 'Teacher') {
      try {
        // Authenticate student via Firebase Authentication
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
      
        // Search for student email in Firestore
        const teacherSnapshot = await firestore().collection('teachers')
          .where('email', '==', email)
          .get();
      
        if (!teacherSnapshot.empty) {
          const teacherDoc = teacherSnapshot.docs[0];
          const teacherId = teacherDoc.id;
          //Alert.alert(studentId);
      
          navigation.replace('TeacherDashboard', { teacherId });
        } else {
          Alert.alert('Login failed', 'Teacher record not found');
        }
      } catch (error) {
        Alert.alert('Login failed', 'Invalid email or password');
        console.error('Login error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userType} Portal</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={disableLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    color: 'black',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    color: 'black',
    fontFamily: 'Poppins-SemiBold'
  },
  button: {
    backgroundColor: '#d3f7d3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-SemiBold'
  },
});

export default LoginScreen;
