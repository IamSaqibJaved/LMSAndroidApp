import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TimetableScreenForStudent = () => {
  const [timetableUri, setTimetableUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const timetableDoc = await firestore().collection('timetable').doc('current').get();
        if (timetableDoc.exists) {
          setTimetableUri(timetableDoc.data().imageUrl);
        } else {
          console.error('No timetable document found.');
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timetable</Text>
      {timetableUri ? (
        <Image source={{ uri: timetableUri }} style={styles.image} />
      ) : (
        <Text>No Timetable available</Text>
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

export default TimetableScreenForStudent;
