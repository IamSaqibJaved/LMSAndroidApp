// screens/UserTypeScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function UserTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SMARTIOUS</Text>
      </View>
      <Text style={styles.welcomeText}>WELCOME!</Text>
      <Text style={styles.selectText}>Select Usertype!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ADMIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>STUDENT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>TEACHER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'IMFellEnglish-Italic',
  },
  welcomeText: {
    marginTop: 30,
    fontSize: 24,
    color: 'black',
    fontFamily: 'IMFellEnglish-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  selectText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    fontFamily: 'IMFellEnglish-Italic',
  },
  button: {
    backgroundColor: '#BCECBE',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'IMFellEnglish-Regular',
  },
});

export default UserTypeScreen;

{/* <Stack.Screen name="UserType" component={UserTypeScreen} options={{ headerShown: false }} /> */}