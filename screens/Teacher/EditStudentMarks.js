import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const EditStudentMarks = ({ route, navigation }) => {
  const { studentId, term, subject } = route.params;
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentDoc = await firestore().collection('students').doc(studentId).get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          setStudent(studentData);

          const resultDoc = await firestore().collection('students').doc(studentId).collection('result').doc('2024').get();
          if (resultDoc.exists) {
            const resultData = resultDoc.data();
            const termMarks = resultData[term.toLowerCase().replace(' ', '')]?.[subject] ?? '';
            setMarks(termMarks.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        Alert.alert('Error', 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, term, subject]);

  const handleSaveMarks = async () => {
    const marksValue = parseInt(marks, 10);
    const maxMarks = term === 'Final Term' ? 100 : subject.includes('Computer (Part 1)') ? term === 'Final Term' ? 70 : 35 : subject.includes('Computer (Part 2)') ? term === 'Final Term' ? 30 : 15 : 50;

    if (marksValue <= maxMarks && marksValue >= 0) {
      try {
        const studentRef = firestore().collection('students').doc(studentId);
        const year = '2024';

        const resultRef = studentRef.collection('result').doc(year);
        await resultRef.update({
          [`${term.toLowerCase().replace(' ', '')}.${subject}`]: marksValue,
        });

        Alert.alert('Success', 'Marks updated successfully!');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating marks:', error);
        Alert.alert('Error', 'Failed to update marks');
      }
    } else {
      Alert.alert('Error', `Enter valid marks (0-${maxMarks})`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {student && (
        <>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="black" style={styles.icon} />
            <TextInput style={styles.input} value={student.name} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="confirmation-number" size={20} color="black" style={styles.icon} />
            <TextInput style={styles.input} value={student.regNo} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="book" size={20} color="black" style={styles.icon} />
            <TextInput style={styles.input} value={subject} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="calendar-today" size={20} color="black" style={styles.icon} />
            <TextInput style={styles.input} value={term} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="edit" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={marks}
              onChangeText={setMarks}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSaveMarks}>
            <Text style={styles.buttonText}>Save Marks</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  button: {
    backgroundColor: '#d6f7e7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
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
});

export default EditStudentMarks;
