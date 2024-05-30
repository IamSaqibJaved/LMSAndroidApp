import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
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
          const studentClass = studentDoc.data().class;
          const syllabusDoc = await firestore().collection('syllabus').doc(studentClass).get();
          if (syllabusDoc.exists) {
            setSyllabusUri(syllabusDoc.data().imageUri);
          } else {
            console.error('No syllabus document found for the class.');
          }
        } else {
          console.error('Student document not found.');
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
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
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default SyllabusScreenForStudent;
