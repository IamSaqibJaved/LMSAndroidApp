import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install react-native-vector-icons

const terms = ['First Term', 'Mid Term', 'Final Term'];
const subjects = ['Math', 'English', 'Science', 'Art'];
const students = ['FA21-BCS-001', 'FA21-BCS-002', 'FA21-BCS-003', 'FA21-BCS-004'];

const InsertMarks = () => {
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState(50);

  const handleTermChange = (itemValue) => {
    setSelectedTerm(itemValue);
    if (itemValue === 'First Term' || itemValue === 'Mid Term') {
      setMaxMarks(50);
    } else if (itemValue === 'Final Term') {
      setMaxMarks(100);
    }
  };

  const handleInsertMarks = () => {
    const marksValue = parseInt(marks, 10);
    if ((marksValue <= maxMarks) && (marksValue>0) ) {
      Alert.alert('Success', 'Marks inserted successfully!');
    } else {
      Alert.alert('Error', `Enter Marks Again`);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedTerm}
          onValueChange={handleTermChange}
          style={styles.picker}
        >
          {terms.map((term, index) => (
            <Picker.Item key={index} label={term} value={term} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {subjects.map((subject, index) => (
            <Picker.Item key={index} label={subject} value={subject} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedStudent}
          onValueChange={(itemValue) => setSelectedStudent(itemValue)}
          style={styles.picker}
        >
          {students.map((student, index) => (
            <Picker.Item key={index} label={student} value={student} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <View style={styles.marksContainer}>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder="Enter Marks"
          placeholderTextColor={"#a1a1a1"}
          value={marks}
          onChangeText={(text) => setMarks(text)}
        />
        <Text style={[styles.maxMarks, { fontFamily: 'Poppins-SemiBold' }]}>{`/ ${maxMarks}`}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleInsertMarks}>
        <Text style={styles.buttonText}>Insert Marks</Text>
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
  dropdownContainer: {
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
    color: 'black',
    height: 50,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    color: '#000',
  },
  pickerLabel: {
    fontFamily: 'Poppins-SemiBold',
  },
  marksContainer: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
  },
  maxMarks: {
    fontSize: 16,
    color: 'black',
  },
  button: {
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
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default InsertMarks;
