import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './AdminScreen'; // Correctly import AdminScreen using a relative path

const HomeScreen = ({ navigation }) => {
  const handlePress = (accountType) => {
    if (accountType === 'Admin') {
      navigation.navigate('AdminOptionScreen');
    }
    else if (accountType === 'Student'){
        navigation.navigate('Student');
    }
    else if (accountType === 'Teacher'){
      navigation.navigate('LoginScreen');
  }
  };


  return (
    <View style={styles.homeContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.homeWelcomeText}>Welcome!</Text>
        <Text style={styles.homeSelectText}>SELECT ACCOUNT TYPE</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Admin')}>
          <Text style={styles.homeButtonText}>ADMIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Teacher')}>
          <Text style={styles.homeButtonText}>TEACHER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Student')}>
          <Text style={styles.homeButtonText}>STUDENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 50,
  },
  homeWelcomeText: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
    color: 'black',
  },
  homeSelectText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default HomeScreen;