import React, { useState } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MarksScreenforStudent = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [SelecterdExam, setSelecterdExam] = useState('');

  const subjects = ['Math', 'Science', 'History', 'English', 'Geography'];
  const Exam = ['Midterm', 'Final', 'FirstTerm'];


  return (
    <View style={styles.container}>
      <View>
            <Image
             source={require('../images/exam.jpg')} 
             style={styles.image} />
          </View>

      <Text style={styles.label}>Choose Subject</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {subjects.map((subject, index) => (
            <Picker.Item label={subject} value={subject} key={index} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Choose Exam Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {Exam.map((Exam, index) => (
            <Picker.Item label={Exam} value={Exam} key={index} />
          ))}
        </Picker>
      </View>
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
  image:{
    width:230, 
    height: 230 ,
    marginBottom: 10,
    margin: -120,  },
  label: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#d3f7d3'
  },
  picker: {
    backgroundColor: '#d3f7d3',
    color: '#000',
    height: 50,
    width: '100%',
    
  },
});

export default MarksScreenforStudent;
