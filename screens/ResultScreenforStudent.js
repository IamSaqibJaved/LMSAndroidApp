import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install react-native-vector-icons
import firestore from '@react-native-firebase/firestore';

const ResultScreenforStudent = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchStudentYears = async () => {
      try {
        const resultCollection = await firestore().collection('students').doc(studentId).collection('result').get();
        if (!resultCollection.empty) {
          const years = resultCollection.docs.map(doc => doc.id);
          setYears(years);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch student data');
      }
    };

    fetchStudentYears();
  }, [studentId]);

  useEffect(() => {
    if (selectedYear) {
      navigation.navigate('ResultDisplay', { studentId, year: selectedYear });
    }
  }, [selectedYear]);

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../images/exam.jpg')} style={styles.image} />
      </View>

      <Text style={styles.label}>Choose Year</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Select Year" value="" />
          {years.map((year, index) => (
            <Picker.Item label={year} value={year} key={index} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 230,
    height: 230,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#d6f7e7',
    backgroundColor: '#d6f7e7',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    color: '#000',
    height: 50,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    color: '#000',
  },
});

export default ResultScreenforStudent;
