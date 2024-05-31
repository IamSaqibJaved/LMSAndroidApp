import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8', 'Room 9', 'Room 10', 'Room 11', 'Room 12'];

const classSubjects = {
  Nursery: ['English', 'Urdu', 'Math', 'Nazra-e-Quran'],
  Prep: ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'],
  'Class 1': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'],
  'Class 2': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 1)'],
  'Class 3': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 2)'],
  'Class 4': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer (Part 1)'],
  'Class 5': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer (Part 2)'],
  'Class 6': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer (Part 1)', 'Quran'],
  'Class 7': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer (Part 2)', 'Quran'],
  'Class 8': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer (Part 2)', 'Quran'],
};

const EditClassScreen = ({ route, navigation }) => {
  const { classId } = route.params;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(rooms);
  const [loading, setLoading] = useState(true);

  const fetchClassDetails = async () => {
    try {
      const classDoc = await firestore().collection('classes').doc(classId).get();
      if (classDoc.exists) {
        const classData = classDoc.data();
        setSelectedTeacher(classData.teacher);
        setSelectedRoom(classData.room);
      } else {
        Alert.alert('Error', 'Class not found');
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
      Alert.alert('Error', 'Failed to fetch class details.');
    }
  };

  const fetchTeachersAndAssignments = async () => {
    try {
      const teacherSnapshot = await firestore().collection('teachers').get();
      const teacherList = teacherSnapshot.docs.map(doc => doc.data().name);
      setTeachers(teacherList);

      const classSnapshot = await firestore().collection('classes').get();
      const assignedTeachers = [];
      const assignedRooms = [];

      classSnapshot.forEach(doc => {
        const classData = doc.data();
        if (classData.className !== classId) {
          assignedTeachers.push(classData.teacher);
          assignedRooms.push(classData.room);
        }
      });

      setAvailableTeachers(teacherList.filter(teacher => !assignedTeachers.includes(teacher)));
      setAvailableRooms(rooms.filter(room => !assignedRooms.includes(room)));

      if (availableTeachers.length > 0) setSelectedTeacher(availableTeachers[0]);
      if (availableRooms.length > 0) setSelectedRoom(availableRooms[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await fetchClassDetails();
        await fetchTeachersAndAssignments();
        setLoading(false);
      };

      fetchData();
    }, [])
  );

  const handleUpdateClass = async () => {
    try {
      const subjects = classSubjects[classId];

      await firestore().collection('classes').doc(classId).update({
        teacher: selectedTeacher,
        room: selectedRoom,
        subjects: subjects,
      });

      Alert.alert('Success', 'Class updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating class:', error);
      Alert.alert('Error', 'Failed to update class.');
    }
  };

  const renderPicker = (selectedValue, onValueChange, items) => (
    <TouchableOpacity style={styles.pickerContainer} activeOpacity={1}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={styles.picker}
        dropdownIconColor="transparent"
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Select Teacher</Text>
          {renderPicker(selectedTeacher, setSelectedTeacher, availableTeachers)}

          <Text style={styles.label}>Select Room</Text>
          {renderPicker(selectedRoom, setSelectedRoom, availableRooms)}

          <TouchableOpacity style={styles.button} onPress={handleUpdateClass}>
            <Text style={styles.buttonText}>Update Class</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    color: 'black',
  },
  picker: {
    flex: 1,
    color: 'black',
  },
  button: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});

export default EditClassScreen;
