import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const options = [
  { name: 'Class',icon: 'school-outline', screen:"Class" },
  { name: 'Timetable', icon: 'calendar-outline', screen:"Timetable" },
  { name: 'Syllabus', icon: 'book-outline', screen:"Syllabus" },
  { name: 'Student', icon: 'account-group', screen:"AdminStudent" },
  { name: 'Fee', icon: 'cash', screen:"Fee" },
  { name: 'Report', icon: 'book-open-page-variant' , screen:"Report"},
  { name: 'Teacher', icon: 'account' , screen:"Teacher"}
];

const AdminOptionScreen = ({ navigation }) => {
  const handlePress = (option) => {
    navigation.navigate(option.screen);
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

export default AdminOptionScreen;
