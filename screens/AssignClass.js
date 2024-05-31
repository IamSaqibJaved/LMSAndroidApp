import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const classes = ['Nursery', 'Prep', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8', 'Room 9', 'Room 10', 'Room 11', 'Room 12'];

const classSubjects = {
  Nursery: ['English', 'Urdu', 'Math', 'Nazra-e-Quran'],
  Prep: ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'],
  'Class 1': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'],
  'Class 2': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 1)', 'Computer (Part 2)'],
  'Class 3': ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer (Part 1)', 'Computer (Part 2)'],
  'Class 4': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)'],
  'Class 5': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)'],
  'Class 6': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
  'Class 7': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
  'Class 8': ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat','Computer (Part 1)', 'Computer (Part 2)', 'Quran'],
};

const AssignClass = () => {
  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [selectedTeacher, setSelectedTeacher] = useState('Select Teacher');
  const [selectedRoom, setSelectedRoom] = useState('Select Room');
  const [teachers, setTeachers] = useState([]);
  const [availableClasses, setAvailableClasses] = useState(classes);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(rooms);

  const fetchTeachersAndAssignments = async () => {
    try {
      // Fetch all teachers
      const teacherSnapshot = await firestore().collection('teachers').get();
      const teacherList = teacherSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setTeachers(teacherList);
      console.log('Fetched teachers:', teacherList);

      // Fetch existing class assignments
      const classSnapshot = await firestore().collection('classes').get();
      const assignedClasses = [];
      const assignedTeachers = [];
      const assignedRooms = [];

      classSnapshot.forEach(doc => {
        const classData = doc.data();
        assignedClasses.push(classData.className);
        assignedTeachers.push(classData.teacher);
        assignedRooms.push(classData.room);
      });

      // Filter out assigned classes, teachers, and rooms
      setAvailableClasses(classes.filter(classItem => !assignedClasses.includes(classItem)));
      setAvailableTeachers(teacherList.filter(teacher => !assignedTeachers.includes(teacher.id)).map(teacher => teacher.name));
      setAvailableRooms(rooms.filter(room => !assignedRooms.includes(room)));

      // Set default selected values
      if (availableClasses.length > 0 && selectedClass === 'Select Class') setSelectedClass(availableClasses[0]);
      if (availableTeachers.length > 0 && selectedTeacher === 'Select Teacher') setSelectedTeacher(availableTeachers[0]);
      if (availableRooms.length > 0 && selectedRoom === 'Select Room') setSelectedRoom(availableRooms[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchTeachersAndAssignments();
  }, []);

  const handleAssignClass = async () => {
    try {
      const classRef = firestore().collection('classes').doc(selectedClass);
      const classDoc = await classRef.get();

      if (classDoc.exists) {
        Alert.alert('Error', 'This class already has an assigned teacher and room.');
        return;
      }

      // Fetch teacher ID based on the selected teacher name
      const teacherSnapshot = await firestore().collection('teachers').where('name', '==', selectedTeacher).get();
      if (teacherSnapshot.empty) {
        Alert.alert('Error', 'Selected teacher does not exist.');
        return;
      }

      const teacherId = teacherSnapshot.docs[0].id;
      const subjects = classSubjects[selectedClass];

      await classRef.set({
        className: selectedClass,
        teacher: teacherId,
        room: selectedRoom,
        subjects: subjects,
      });

      Alert.alert('Success', 'Class assigned successfully!');
      fetchTeachersAndAssignments();  // Re-fetch data after assignment
    } catch (error) {
      console.error('Error assigning class:', error);
      Alert.alert('Error', 'Failed to assign class.');
    }
  };

  const renderPicker = (selectedValue, onValueChange, items, placeholder) => (
    <TouchableOpacity
      style={styles.pickerContainer}
      activeOpacity={1}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={styles.picker}
        dropdownIconColor="transparent"
      >
        <Picker.Item label={placeholder} value={placeholder} />
        {items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Class</Text>
      {renderPicker(selectedClass, setSelectedClass, availableClasses, 'Select Class')}

      <Text style={styles.label}>Select Teacher</Text>
      {renderPicker(selectedTeacher, setSelectedTeacher, availableTeachers, 'Select Teacher')}

      <Text style={styles.label}>Select Room</Text>
      {renderPicker(selectedRoom, setSelectedRoom, availableRooms, 'Select Room')}

      <TouchableOpacity style={styles.button} onPress={handleAssignClass}>
        <Text style={styles.buttonText}>Assign Class</Text>
      </TouchableOpacity>
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
    backgroundColor: '#d6f7e7',
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
});

export default AssignClass;
