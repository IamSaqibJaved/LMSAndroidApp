import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentMarksScreen = () => {
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await firestore()
          .collection('students')
          .orderBy('classOfAdmission')
          .get();
          
        const sortedStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(sortedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const fetchMarks = async (studentId) => {
    try {
      const marksSnapshot = await firestore()
        .collection('students')
        .doc(studentId)
        .collection('result')
        .doc('2024')
        .get();
      if (marksSnapshot.exists) {
        setMarks(marksSnapshot.data());
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const handleStudentPress = async (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
      return;
    }
    setExpandedStudent(studentId);
    await fetchMarks(studentId);
  };

  const handleSaveMarks = async (studentId, term, subject, newMarks) => {
    try {
      await firestore()
        .collection('students')
        .doc(studentId)
        .collection('result')
        .doc('2024')
        .update({
          [`${term}.${subject}`]: parseInt(newMarks, 10)
        });
      Alert.alert('Success', 'Marks updated successfully!');
    } catch (error) {
      console.error('Error updating marks:', error);
      Alert.alert('Error', 'Failed to update marks');
    }
  };

  const renderMarks = (term) => {
    return Object.keys(marks[term]).map(subject => (
      <View key={subject} style={styles.marksContainer}>
        <Text style={styles.subject}>{subject}</Text>
        <TextInput
          style={styles.input}
          defaultValue={marks[term][subject]?.toString()}
          onEndEditing={(e) => handleSaveMarks(expandedStudent, term, subject, e.nativeEvent.text)}
          keyboardType='numeric'
        />
      </View>
    ));
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
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity style={styles.studentCard} onPress={() => handleStudentPress(item.id)}>
            <Text style={styles.studentName}>{item.name} - {item.classOfAdmission}</Text>
            <Icon name={expandedStudent === item.id ? "expand-less" : "expand-more"} size={20} color="#000" />
          </TouchableOpacity>
          {expandedStudent === item.id && (
            <View style={styles.marksDetails}>
              <Text style={styles.termHeader}>First Term</Text>
              {renderMarks('firstterm')}
              <Text style={styles.termHeader}>Mid Term</Text>
              {renderMarks('midterm')}
              <Text style={styles.termHeader}>Final Term</Text>
              {renderMarks('finalterm')}
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentCard: {
    backgroundColor: '#d3f7d3',
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  marksDetails: {
    paddingHorizontal: 20,
  },
  termHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 10,
    color: 'black',
  },
  marksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subject: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    color: 'black',
    flex: 1,
  },
});

export default StudentMarksScreen;
