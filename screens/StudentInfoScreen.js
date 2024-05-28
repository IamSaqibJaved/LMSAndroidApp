// Screens/Timetable.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>StudentInfoScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});

export default StudentInfoScreen;
