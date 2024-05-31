import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ViewStudentMarks = ({ route, navigation }) => {
  const { term, subject, teacherId } = route.params;
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
            const marks = resultData[term.toLowerCase().replace(' ', '')]?.[subject] ?? 'Null';
            let maxMarks;
            if (term === 'Final Term') {
              if (subject === 'Computer (Part 1)') {
                maxMarks = 70;
              } else if (subject === 'Computer (Part 2)') {
                maxMarks = 30;
              } else {
                maxMarks = 100;
              }
            } else {
              if (subject === 'Computer (Part 1)') {
                maxMarks = 35;
              } else if (subject === 'Computer (Part 2)') {
                maxMarks = 15;
              } else {
                maxMarks = 50;
              }
            }
            studentsList.push({
              id: studentData.regNo,
              name: studentData.name,
              studentId: doc.id,
              marks: `${marks}/${maxMarks}`,
            });
          }
        }
        setStudents(studentsList);
        setFilteredStudents(studentsList); // Initialize filtered students
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredStudents(students);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filteredList = students.filter((student) =>
        student.name.toLowerCase().includes(lowercasedQuery) ||
        student.id.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredStudents(filteredList);
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
          <Icon name="edit" size={20} color="#3d9f76" marginRight={10} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.studentId)}>
          <Icon name="delete" size={20} color="#3d9f76" />
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
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#3d9f76" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={'grey'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredStudents}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    // padding: 5,
    marginBottom: 5,
    marginTop: -70,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  listContainer: {
    paddingBottom: 80,
  },
  studentCard: {
    backgroundColor: '#d6f7e7',
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
    // marginRight: 10,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    marginRight: 30,
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
