import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install react-native-vector-icons

const MarksScreenforStudent = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const subjects = ['Math', 'Science', 'History', 'English', 'Geography'];
  const exams = ['Midterm', 'Final', 'FirstTerm'];

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../images/exam.jpg')} style={styles.image} />
      </View>

      <Text style={styles.label}>Choose Subject</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {subjects.map((subject, index) => (
            <Picker.Item label={subject} value={subject} key={index} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <Text style={styles.label}>Choose Exam Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedExam}
          onValueChange={(itemValue) => setSelectedExam(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {exams.map((exam, index) => (
            <Picker.Item label={exam} value={exam} key={index} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
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
  image: {
    width: 230,
    height: 230,
    marginBottom: 10,
    margin: -120,
  },
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
    borderColor: '#d3f7d3',
    backgroundColor: '#d3f7d3',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    color: '#000',
    height: 50,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    color: '#000',
  },
});

export default MarksScreenforStudent;
