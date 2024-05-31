import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,ActivityIndicator, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const generateRandomTeachers = (numTeachers = 15) => {
  const teachers = [];
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Linda Davis', 'Michael Wilson', 'Karen Taylor', 'James Moore', 'Emily Anderson', 'Jessica Thomas', 'Paul Jackson', 'Laura White', 'Steven Harris', 'Mary Martin', 'David Thompson'];
  const domains = ['example.com', 'school.edu', 'mail.com'];
  const password = '123456';

  for (let i = 0; i < numTeachers; i++) {
    const name = names[i % names.length];
    const email = `${name.toLowerCase().replace(' ', '.')}@${domains[i % domains.length]}`;
    auth().createUserWithEmailAndPassword(email, password);
    teachers.push({
      name,
      email,
    });
  }

  return teachers;
};

const AdminTeacherScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherSnapshot = await firestore().collection('teachers').get();

        if (teacherSnapshot.empty) {
          const newTeachers = generateRandomTeachers();
          const batch = firestore().batch();

          newTeachers.forEach((teacher) => {
            const docRef = firestore().collection('teachers').doc();
            batch.set(docRef, teacher);
          });

          await batch.commit();
          setTeachers(newTeachers.map(({ password, ...rest }) => rest));
        } else {
          const fetchedTeachers = teacherSnapshot.docs.map(doc => {
            const { password, ...rest } = doc.data();
            return rest;
          });
          setTeachers(fetchedTeachers);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch or generate teacher data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="grey" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teachers</Text>
      <FlatList
        data={teachers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.teacherItem}>
            <Text style={styles.teacherName}>{item.name}</Text>
            <Text style={styles.teacherEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'IMFellEnglish-Regular',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
  teacherItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  teacherName: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  teacherEmail: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'grey',
  },
});

export default AdminTeacherScreen;
