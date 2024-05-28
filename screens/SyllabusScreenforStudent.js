// Screens/Timetable.js
import React from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';

const SyllabusScreenforStudent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Syllabus</Text>
      <View>
        <Image
          source={require('../images/syllabus.jpg')} 
          style={styles.image} />
      </View>
      <TouchableOpacity
        style={styles.Button}
        onPress={() => handlePress()}
      >
      <Text style={styles.ButtonText}>Open Syllabus</Text>
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
  },

  text: {
    fontSize: 20,
  },
  image:{
    width:230, 
    height: 230 ,
    marginBottom: 10,
    margin: -120,  
  },
  Button: {
      backgroundColor: '#d3f7d3',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginVertical: 10,
      width: 220,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ButtonText: {
      fontSize: 17,
      fontFamily: 'Poppins-SemiBold',
      color: 'black',
    },
});

export default SyllabusScreenforStudent;
