

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disableLogin = email==='' || password ==='';

  const handleLogin = () => {
    
    if (userType === 'Admin') {
      if(email=="muh.uzair102@gmail.com" && password=="lms1234"){
        navigation.replace('AdminOptions');
      } 
    }
    else if (userType === 'Student') {
      if(email=="abc" && password=="123"){
        navigation.replace('StudentOptions');
      }
    } else if (userType === 'Teacher') {
      if(email=="abc" && password=="123"){
        navigation.replace('TeacherOptions');     // Ensure TeacherOptions is set up
      }
      
    }

  //   else{
  //     auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(() => {
        
  //       //  if (userType === 'Student') {
  //       //   navigation.replace('StudentOptions');
  //       // } else if (userType === 'Teacher') {
  //       //   navigation.replace('TeacherOptions');     // Ensure TeacherOptions is set up
  //       // }
  //     })
  //     .catch(error => {
  //       alert('Login failed. Please check your credentials.');
  //     });
  // };
    }
    

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

// import React from 'react';
// import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// const LoginScreen = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <Text style={styles.title}>SMARTIOUS</Text>
//         <TextInput
//           style={[styles.input, { fontFamily: 'Poppins-Bold' }]}
//           placeholder="Reg#"
//           placeholderTextColor="#a1a1a1"
//         />
//         <TextInput
//           style={[styles.input, { fontFamily: 'Poppins-Bold' }]}
//           placeholder="Password"
//           placeholderTextColor="#a1a1a1"
//           secureTextEntry
//         />
//         <TouchableOpacity>
//           <Text style={styles.forgotText}>Forgot?</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.loginButton}>
//           <Text style={styles.loginButtonText}>LOGIN</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>

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

//     justifyContent: 'start',
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: 40,
//   },
//   input: {
//     height: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: '#a1a1a1',
//     marginBottom: 30,
//     fontSize: 16,
//     color: '#000',
//   },
//   forgotText: {
//     alignSelf: 'flex-end',
//     marginBottom: 20,
//     color: '#a1a1a1',
//     fontFamily: 'Poppins-Bold',
//   },
//   loginButton: {
//     backgroundColor: '#d3f7d3',
//     paddingVertical: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   loginButtonText: {
//     fontSize: 17,
//     fontFamily: 'Poppins-SemiBold',
//     color: 'black',

  },
});

export default LoginScreen;
