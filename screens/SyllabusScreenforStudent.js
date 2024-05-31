import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';

const SyllabusScreenForStudent = () => {
  const [syllabusUri, setSyllabusUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { studentId } = route.params;

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const studentDoc = await firestore().collection('students').doc(studentId).get();
        if (studentDoc.exists) {
          const studentClass = studentDoc.data().classOfAdmission; // considering admission class
          
          const syllabusQuerySnapshot = await firestore()
            .collection('syllabus')
            .where('class', '==', studentClass.toLowerCase())
            .limit(1)
            .get();

          if (!syllabusQuerySnapshot.empty) {
            const syllabusDoc = syllabusQuerySnapshot.docs[0];
            const syllabusData = syllabusDoc.data();
            setSyllabusUri(syllabusData.syllabus); // assuming 'syllabus' field contains the image URI
          } else {
            console.error('No syllabus document found for the class.');
            Alert.alert('Error', 'No syllabus document found for the class.');
          }
        } else {
          console.error('Student document not found.');
          Alert.alert('Error', 'Student document not found.');
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
        Alert.alert('Error', 'Error fetching syllabus.');
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [studentId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Syllabus</Text>
      {syllabusUri ? (
        <Image source={{ uri: syllabusUri }} style={styles.image} />
      ) : (
        <Text>No Syllabus available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'IMFellEnglish-Regular',
    color: 'black',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default SyllabusScreenForStudent;
