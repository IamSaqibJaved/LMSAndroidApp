// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disableLogin = email==='' || password ==='';

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        
        if (userType === 'Admin') {
          navigation.replace('AdminOptions');
        } else if (userType === 'Student') {
          navigation.replace('StudentOptions');
        } else if (userType === 'Teacher') {
          navigation.replace('TeacherOptions');     // Ensure TeacherOptions is set up
        }
      })
      .catch(error => {
        alert('Login failed. Please check your credentials.');
      });
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
  },
});

export default LoginScreen;
