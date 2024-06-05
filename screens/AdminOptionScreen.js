import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const options = [
  { name: 'Class', icon: 'school-outline', screen: "AdminClass" },
  { name: 'Timetable', icon: 'calendar-outline', screen: "Timetable" },
  { name: 'Syllabus', icon: 'book-outline', screen: "Syllabus" },
  { name: 'Student', icon: 'account-group', screen: "AdminStudent" },
  { name: 'Fee', icon: 'cash', screen: "Fee" },
  { name: 'Students Report', icon: 'book-open-page-variant', screen: "ReportStudents" },
  { name: 'Results Report', icon: 'book-open', screen: "ReportResults" },
  { name: 'Teacher', icon: 'account', screen: "AdminTeacherScreen" }
];
const userType= 'Admin';
const AdminOptionScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handlePress = (option) => {
    navigation.navigate(option.screen);
  };

  const handleLogout = async () => {
    try {
      // await auth().signOut();
      Alert.alert('Success', 'Logged out successfully');
      navigation.replace('Login', {userType}); // Navigate to the login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
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
            <Icon name={option.icon} size={50} color="#3d9f76" />
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
    backgroundColor: '#d6f7e7',
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
    letterSpacing: 1,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
<<<<<<< Updated upstream
  },
  headerButton: {
    marginRight: 10,
    padding: 10,
=======
>>>>>>> Stashed changes
  },
});

export default AdminOptionScreen;
