import React from 'react';
import { View, Text, TouchableOpacity,Image, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from './AdminClass'; // Correctly import AdminScreen using a relative path
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {

  const handlePress = (userType) => {
    if (userType === 'Admin') {
        navigation.navigate('Login', {userType});
      //navigation.navigate("AdminOptions");

    }
    else if (userType === 'Student'){
      navigation.navigate('Login', {userType});
      //navigation.navigate("StudentOptions");
    }
    else if (userType === 'Teacher'){
      //navigation.navigate('TeacherDashboard');
      navigation.navigate('Login', {userType});
  }
  };


  return (
    <View style={styles.homeContainer}>
      <View style={styles.contentContainer}>
        <Image
            source={require('../images/welcome.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        {/* <Text style={styles.homeWelcomeText}>Welcome!</Text> */}
        {/* <Text style={styles.homeSelectText}>Select Your Role</Text> */}
        
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Admin')}>
        <View style={styles.circle}>
          <Icon name="school" size={45} color="#3ca475" />
        </View>
          <Text style={styles.homeButtonText}>ADMIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Teacher')}>
        <View style={styles.circle}>
          <Icon name="account" size={45} color="#3ca475" />
        </View>
          <Text style={styles.homeButtonText}>TEACHER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => handlePress('Student')}>
        <View style={styles.circle}>
          <Icon name="account-group" size={45} color="#3ca475" />
        </View>
          <Text style={styles.homeButtonText}>STUDENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle:{
    width: 80,
    height:80,
    borderRadius: 70,
    backgroundColor: '#d6f7e7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -200,
    bottom: 23, 
    zIndex: 1,
  },

  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    height: 200,
    width: 200,
    marginLeft: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 50,
  },
  // homeWelcomeText: {
  //   fontSize: 32,
  //   // fontFamily: 'Poppins-SemiBold',
  //   marginBottom: 20,
  //   color: 'black',
  // },
  // homeSelectText: {
  //   fontSize: 24,
  //   marginBottom: 20,
  //   color: 'black',
  //   // fontFamily: 'Poppins-SemiBold',
  //   fontWeight: 'bold',
  // },
  homeButton: {
    backgroundColor: '#d6f7e7',
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
    marginBottom: 30,
  },
  homeButtonText: {
    letterSpacing: 3,
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginTop: -80,
    marginLeft: 20,
    // backgroundColor: "red",
  },
});

export default HomeScreen;