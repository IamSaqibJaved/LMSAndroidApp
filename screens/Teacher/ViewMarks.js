import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const terms = ['First Term', 'Mid Term', 'Final Term'];
const subjects = ['Math', 'English', 'Science', 'Art'];

const ViewMarks = () => {
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const navigation = useNavigation();

  const handleViewMarks = () => {
    navigation.navigate('view-student-marks', {
      term: selectedTerm,
      subject: selectedSubject,
    });
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedTerm}
          onValueChange={(itemValue) => setSelectedTerm(itemValue)}
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

      <TouchableOpacity style={styles.button} onPress={handleViewMarks}>
        <Text style={styles.buttonText}>View Marks</Text>
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

export default ViewMarks;
