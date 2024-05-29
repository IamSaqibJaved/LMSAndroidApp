import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebaseConfig'; // Your Firebase configuration

const firestore = getFirestore(app);

const syllabusScreen = ({ navigation }) => {
  const [syllabusData, setSyllabusData] = useState([]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      const syllabusCollection = collection(firestore, 'syllabus');
      const syllabusSnapshot = await getDocs(syllabusCollection);
      const syllabusList = syllabusSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSyllabusData(syllabusList);
    };
    fetchSyllabus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SYLLABUS</Text>
      <FlatList
        data={syllabusData}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.classBox} onPress={() => navigation.navigate('EditSyllabus', { classId: item.id })}>
            <Image
              source={item.syllabus ? { uri: item.syllabus } : require('./assets/placeholder.png')}
              style={styles.image}
            />
            <Text style={styles.classText}>{item.class}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  grid: {
    alignItems: 'center',
  },
  classBox: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 10,
    width: 140,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  classText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default syllabusScreen;
