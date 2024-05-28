import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>SMARTIOUS</Text>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins-Bold' }]}
          placeholder="Reg#"
          placeholderTextColor="#a1a1a1"
        />
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins-Bold' }]}
          placeholder="Password"
          placeholderTextColor="#a1a1a1"
          secureTextEntry
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#a1a1a1',
    marginBottom: 30,
    fontSize: 16,
    color: '#000',
  },
  forgotText: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#a1a1a1',
    fontFamily: 'Poppins-Bold',
  },
  loginButton: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default LoginScreen;
