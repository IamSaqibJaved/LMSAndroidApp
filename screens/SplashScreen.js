import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
<<<<<<< Updated upstream
    }, 3000);
=======
    }, 1000);
>>>>>>> Stashed changes
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../images/Design.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        </View>
      <View style={styles.container}>
        <Text style={styles.splashText}>SMARTIOUS</Text>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    top: 410,
<<<<<<< Updated upstream
    marginTop: 300,
=======
    marginTop: 270,
>>>>>>> Stashed changes
    width: '100%',
    height: '20%',
  },
  logo: {
    height: 150,
    width: 150,
    marginLeft: 118,
    marginTop: -400,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
  },
  splashText: {
    fontSize: 20,
    marginTop: -100,
    color: 'black',
    fontFamily: 'IMFellEnglish-Regular',
    letterSpacing: 10,
    bottom: 340,
  },});
  export default SplashScreen;