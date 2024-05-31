import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const terms = ['First Term', 'Mid Term', 'Final Term'];

const ViewMarks = ({ route }) => {
  const { teacherId } = route.params;
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const classSnapshot = await firestore().collection('classes').where('teacher', '==', teacherId).get();
        if (!classSnapshot.empty) {
          const classData = classSnapshot.docs[0].data();
          setSubjects(classData.subjects);
          setSelectedSubject(classData.subjects[0]);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch subjects');
      }
    };

    fetchSubjects();
  }, [teacherId]);

  const handleViewMarks = () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    navigation.navigate('view-student-marks', {
      term: selectedTerm,
      subject: selectedSubject,
      teacherId,
    });
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.titleContainer}>
        <Icon name="assignment" size={30} color="#4CAF50" />
        <Text style={styles.title}>View Marks</Text>
      </View> */}

      <View style={styles.dropdownContainer}>
        <Icon name="event" size={30} color="#4CAF50" style={styles.dropdownIcon} />
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
        <Icon name="book" size={30} color="#4CAF50" style={styles.dropdownIcon} />
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
        <Icon name="visibility" size={25} color="#000" style={styles.buttonIcon} />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
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
    paddingHorizontal: 10,
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
  dropdownIcon: {
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 230,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 10,

  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
});

export default ViewMarks;
