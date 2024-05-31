import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';

const options = [
  { name: 'Marks',icon: 'chart-line', screen:"Marks" },
  { name: 'Timetable', icon: 'calendar-outline', screen:"TimetableStudent" },
  { name: 'Syllabus', icon: 'book-outline', screen:"SyllabusStudent" },
  // { name: 'Student', icon: 'account-group', screen:"Student" },
  { name: 'Fee', icon: 'cash', screen:"StudentFee" },
  { name: 'Result', icon: 'file-document-edit-outline' , screen:"Result"},
];

const StudentOptionScreen = ({ navigation }) => {

  const route = useRoute();
  const { studentId } = route.params;
  Alert.alert(studentId);

  const handlePress = (option) => {
    navigation.navigate(option.screen, {studentId});
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handlePress(option)}
          >
            <Icon name={option.icon} size={50} color="#000" />
            <Text style={styles.optionText}>{option.name}</Text>
          </TouchableOpacity>
        ))}
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
    padding: 16,
    borderColor: "#000",
  },
 
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: "3%",
    marginTop: 33,
  },
  option: {
    backgroundColor: '#d3f7d3',
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    margin: '2.5%',
    borderRadius: 15,
  },
  optionText: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
});

export default StudentOptionScreen;
