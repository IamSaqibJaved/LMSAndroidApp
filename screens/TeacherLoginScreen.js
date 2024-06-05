import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disableLogin = email === '' || password === '';

  const handleLogin = async () => {
    try {
      if (userType === 'Admin') {
        if (email === "muh.uzair102@gmail.com" && password === "lms1234") {
          navigation.replace('AdminOptions');
        }
      } else if (userType === 'Student') {
        if (email === "abc" && password === "123") {
          navigation.replace('StudentOptions');
        }
      } else if (userType === 'Teacher') {
        const teacherSnapshot = await firestore().collection('teachers')
          .where('email', '==', email)
          .where('password', '==', password)
          .get();

        if (!teacherSnapshot.empty) {
          const teacherId = teacherSnapshot.docs[0].id;
          navigation.replace('TeacherDashboard', { teacherId });
        } else {
          Alert.alert('Invalid Credentials', 'The email or password you entered is incorrect.');
        }
      }
    } catch (error) {
      console.error('Login error: ', error);
      Alert.alert('Login Error', 'An error occurred while trying to log in.');
    }
  };

  return (
    <View style={styles.container}>
      
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
  logo: {
    height: 150,
    width: 150,
    marginLeft: 118,
    marginTop: -180,
  },
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
    backgroundColor: '#d6f7e7',
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
