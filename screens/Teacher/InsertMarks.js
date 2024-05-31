import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const terms = ['Select Term', 'First Term', 'Mid Term', 'Final Term'];

const InsertMarks = ({ route, navigation }) => {
  const { teacherId, studentId, term, subject } = route.params;
  const [selectedTerm, setSelectedTerm] = useState(term || terms[0]);
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [selectedStudent, setSelectedStudent] = useState(studentId || '');
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassAndSubjects = async () => {
      try {
        const classesSnapshot = await firestore().collection('classes').where('tid', '==', teacherId).get();
        if (!classesSnapshot.empty) {
          const classData = classesSnapshot.docs[0].data();
          const className = classData.className;
          setSubjects(classData.subjects);
          setSelectedSubject('');  // Reset the selected subject

          const studentsSnapshot = await firestore().collection('students').where('classOfAdmission', '==', className).get();
          const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsList);
          setSelectedStudent('');  // Reset the selected student
        }

        // If editing, fetch the existing marks
        if (studentId && term && subject) {
          const resultSnapshot = await firestore().collection('students').doc(studentId).collection('result').doc('2024').get();
          if (resultSnapshot.exists) {
            const resultData = resultSnapshot.data();
            const existingMarks = resultData[term.toLowerCase().replace(' ', '')]?.[subject] || '';
            setMarks(existingMarks.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching class and subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassAndSubjects();
  }, [teacherId, studentId, term, subject]);

  useEffect(() => {
    updateMaxMarks(selectedTerm, selectedSubject);
  }, [selectedTerm, selectedSubject]);

  const updateMaxMarks = (term, subject) => {
    let calculatedMaxMarks = 50;
    if (term === 'Final Term') {
      calculatedMaxMarks = subject.includes('Computer (Part 1)') ? 70 : subject.includes('Computer (Part 2)') ? 30 : 100;
    } else {
      calculatedMaxMarks = subject.includes('Computer (Part 1)') ? 35 : subject.includes('Computer (Part 2)') ? 15 : 50;
    }
    setMaxMarks(calculatedMaxMarks);
  };

  const handleTermChange = (itemValue) => {
    setSelectedTerm(itemValue);
    updateMaxMarks(itemValue, selectedSubject);
  };

  const handleSubjectChange = (itemValue) => {
    setSelectedSubject(itemValue);
    updateMaxMarks(selectedTerm, itemValue);
  };

  const handleInsertMarks = async () => {
    const marksValue = parseInt(marks, 10);

    if ((marksValue <= maxMarks) && (marksValue >= 0)) {
      try {
        const studentRef = firestore().collection('students').doc(selectedStudent);
        const year = '2024';

        const resultRef = studentRef.collection('result').doc(year);
        const resultDoc = await resultRef.get();

        if (resultDoc.exists) {
          const resultData = resultDoc.data();
          const termField = selectedTerm.toLowerCase().replace(' ', '');
          const subjectField = resultData[termField]?.[selectedSubject];

          if (subjectField === null || subjectField === undefined) {
            await resultRef.update({
              [`${termField}.${selectedSubject}`]: marksValue,
            });

            Alert.alert('Success', 'Marks inserted successfully!');
            navigation.goBack();
          } else {
            Alert.alert('Error', 'Marks already exist for this subject and term');
          }
        } else {
          await resultRef.set({
            class: studentRef.classOfAdmission,
            firstterm: {},
            midterm: {},
            finalterm: {},
          });
          await resultRef.update({
            [`${termField}.${selectedSubject}`]: marksValue,
          });

          Alert.alert('Success', 'Marks inserted successfully!');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error inserting marks:', error);
        Alert.alert('Error', 'Failed to insert marks');
      }
    } else {
      Alert.alert('Error', `Enter valid marks (0-${maxMarks})`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
          onValueChange={handleSubjectChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Subject" value="" />
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
          <Picker.Item label="Select Student" value="" />
          {students.map((student) => (
            <Picker.Item key={student.id} label={student.name} value={student.id} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <View style={styles.marksContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter Marks"
          placeholderTextColor="#a1a1a1"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'grey',
  },
});

export default InsertMarks;
