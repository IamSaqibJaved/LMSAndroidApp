<<<<<<< Updated upstream
import React, { useState, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Image } from 'react-native';
>>>>>>> Stashed changes
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const disableLogin = email === '' || password === '';

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleLogin = async () => {
    setLoading(true);
    if (userType === 'Admin') {
      if (email === "abc@gmail.com" && password === "123456") {
        navigation.replace('AdminOptions');
        setLoading(false);
      } else {
        Alert.alert('Login failed', 'Invalid email or password');
        setLoading(false);
      }
    } else if (userType === 'Student') {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const studentSnapshot = await firestore().collection('students').where('email', '==', email).get();

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentId = studentDoc.id;
          navigation.replace('StudentOptions', { studentId });
        } else {
          Alert.alert('Login failed', 'Student record not found');
        }
      } catch (error) {
        Alert.alert('Login failed', 'Invalid email or password');
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    } else if (userType === 'Teacher') {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const teacherSnapshot = await firestore().collection('teachers').where('email', '==', email).get();

        if (!teacherSnapshot.empty) {
          const teacherDoc = teacherSnapshot.docs[0];
          const teacherId = teacherDoc.id;
          navigation.replace('TeacherDashboard', { teacherId });
        } else {
          Alert.alert('Login failed', 'Teacher record not found');
        }
      } catch (error) {
        Alert.alert('Login failed', 'Invalid email or password');
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <Image
        source={require("../images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
=======
      <View style={styles.logoContainer}>
        <Image
          source={require("../images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        </View>
      {/* <Text style={styles.title}>{userType} Portal</Text> */}
>>>>>>> Stashed changes
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
      {loading && (
        <ActivityIndicator size="large" color="grey" style={styles.loadingIndicator} />
      )}
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
  logo: {
    height: 150,
    width: 150,
    marginLeft: 10,
    marginTop: -180,
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
  loadingIndicator: {
    marginTop: 20,
  },
});

export default LoginScreen;
