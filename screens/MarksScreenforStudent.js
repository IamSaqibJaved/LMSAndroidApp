import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install react-native-vector-icons
import firestore from '@react-native-firebase/firestore';

const classSubjects = {
  Nursery: ['English', 'Urdu', 'Math', 'Nazra-e-Quran'],
  Prep: ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'],
  'Class 1': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'],
  'Class 2': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 1)', 'Computer (Part 2)'],
  'Class 3': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 1)', 'Computer (Part 2)'],
  'Class 4': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)'],
  'Class 5': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)'],
  'Class 6': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
  'Class 7': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
  'Class 8': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
};

const exams = ['First Term', 'Midterm', 'Final'];

const MarksScreenforStudent = ({ route }) => {
  const { studentId } = route.params;
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState(null);
  const [studentClass, setStudentClass] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchStudentClass = async () => {
      try {
        const studentDoc = await firestore().collection('students').doc(studentId).get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          setStudentClass(studentData.classOfAdmission);
          setSubjects(classSubjects[studentData.classOfAdmission] || []);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch student data');
      }
    };

    fetchStudentClass();
  }, [studentId]);

  useEffect(() => {
    const fetchMarks = async () => {
      if (selectedSubject && selectedExam) {
        try {
          const year = new Date().getFullYear().toString();
          const resultDoc = await firestore().collection('students').doc(studentId)
            .collection('result').doc(year).get();

          if (resultDoc.exists) {
            const resultData = resultDoc.data();
            const termData = resultData[selectedExam.toLowerCase().replace(' ', '')];
            if (termData) {
              setMarks(termData[selectedSubject]);
            }
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch marks');
        }
      }
    };

    fetchMarks();
  }, [selectedSubject, selectedExam, studentId]);

  const getMaxMarks = (subject, exam) => {
    if (exam === 'Final') {
      if (subject.includes('Computer (Part 1)')) return 70;
      if (subject.includes('Computer (Part 2)')) return 30;
      return 100;
    } else {
      if (subject.includes('Computer (Part 1)')) return 35;
      if (subject.includes('Computer (Part 2)')) return 15;
      return 50;
    }
  };

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
          <Picker.Item label="Select Subject" value="" />
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
          <Picker.Item label="Select Exam" value="" />
          {exams.map((exam, index) => (
            <Picker.Item label={exam} value={exam} key={index} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <Text style={styles.label}>Marks</Text>
      <TextInput
        style={styles.marksInput}
        value={marks !== null ? `${marks} / ${getMaxMarks(selectedSubject, selectedExam)}` : ''}
        editable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    // marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    // fontWeight: 'bold',
  },
  pickerContainer: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#d6f7e7',
    backgroundColor: '#d6f7e7',
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
  marksInput: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
});

export default MarksScreenforStudent;
