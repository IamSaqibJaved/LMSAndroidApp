// AdminSyllabus.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const syllabus = [
  { id: 'nursery', name: 'Nursery' },
  { id: 'prep', name: 'Prep' },
  { id: 'class 1', name: 'Class 1' },
  { id: 'class 2', name: 'Class 2' },
  { id: 'class 3', name: 'Class 3' },
  { id: 'class 4', name: 'Class 4' },
  { id: 'class 5', name: 'Class 5' },
  { id: 'class 6', name: 'Class 6' },
  { id: 'class 7', name: 'Class 7' },
  { id: 'class 8', name: 'Class 8' },
];

const SyllabusScreen = () => {
  const navigation = useNavigation();

  const handleSyllabusClick = (id) => {
    navigation.navigate('EditSyllabus', { className: id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>SYLLABUS</Text>
      <View style={styles.syllabusContainer}>
        {syllabus.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.syllabusItem}
            onPress={() => handleSyllabusClick(item.id)}
          >
            <Text style={styles.syllabusText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  syllabusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -45,
  },
  syllabusItem: {
    width: '45%',
    height: 100,
    backgroundColor: '#d6f7e7',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  syllabusText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
});
export default SyllabusScreen;
