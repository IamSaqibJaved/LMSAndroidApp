import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ViewStudentMarks = ({ route, navigation }) => {
  const { term, subject, teacherId } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const classSnapshot = await firestore().collection('classes').where('teacher', '==', teacherId).get();
      if (!classSnapshot.empty) {
        const className = classSnapshot.docs[0].data().className;
        const studentsSnapshot = await firestore().collection('students').where('classOfAdmission', '==', className).get();
        const studentsList = [];

        for (const doc of studentsSnapshot.docs) {
          const studentData = doc.data();
          const resultSnapshot = await firestore().collection('students').doc(doc.id).collection('result').doc('2024').get();
          if (resultSnapshot.exists) {
            const resultData = resultSnapshot.data();
            const marks = resultData[term.toLowerCase().replace(' ', '')]?.[subject] ?? 'N/A';
            studentsList.push({
              id: studentData.regNo,
              name: studentData.name,
              studentId: doc.id,
              marks: `${marks}/${term === 'Final Term' ? 100 : subject.includes('Computer (Part 1)') ? term === 'Final Term' ? 70 : 35 : subject.includes('Computer (Part 2)') ? term === 'Final Term' ? 30 : 15 : 50}`,
            });
          }
        }
        setStudents(studentsList);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchStudents();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEdit = (studentId) => {
    navigation.navigate('edit-student-marks', {
      studentId,
      term,
      subject,
      teacherId,
    });
  };

  const handleDelete = async (studentId) => {
    try {
      await firestore().collection('students').doc(studentId).collection('result').doc('2024').update({
        [`${term.toLowerCase().replace(' ', '')}.${subject}`]: null,
      });
      Alert.alert('Success', 'Marks deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting marks:', error);
      Alert.alert('Error', 'Failed to delete marks');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.cardContent}>
        <Text style={styles.studentId}>{item.id}</Text>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <View style={styles.marksContainer}>
        <Text style={styles.marks}>{item.marks}</Text>
        <TouchableOpacity onPress={() => handleEdit(item.studentId)}>
          <Icon name="edit" size={20} color="#000" marginRight={10} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.studentId)}>
          <Icon name="delete" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <Text style={styles.header}>STUDENTS</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.studentId}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  listContainer: {
    paddingBottom: 80,
  },
  studentCard: {
    backgroundColor: '#d3f7d3',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  studentId: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  studentName: {
    fontSize: 16,
    marginVertical: 4,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marks: {
    fontSize: 16,
    marginRight: 10,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
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

export default ViewStudentMarks;
