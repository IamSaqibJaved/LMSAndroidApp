import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const subjects = ['Math', 'English', 'Science', 'Art'];
const teachers = ['Teacher A', 'Teacher B', 'Teacher C', 'Teacher D'];
const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

const AssignClass = () => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [subjectDropdownVisible, setSubjectDropdownVisible] = useState(false);
  const [teacherDropdownVisible, setTeacherDropdownVisible] = useState(false);
  const [roomDropdownVisible, setRoomDropdownVisible] = useState(false);
  const [dayDropdownVisible, setDayDropdownVisible] = useState(false);
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false);

  const handleAssignClass = () => {
    const newClass = {
      subject: selectedSubject,
      teacher: selectedTeacher,
      room: selectedRoom,
      day: selectedDay,
      time: selectedTime,
    };

    // Check if the same room is already assigned at the same time on the same day
    const isConflict = assignedClasses.some(
      (cls) =>
        cls.room === selectedRoom && cls.day === selectedDay && cls.time === selectedTime
    );

    if (isConflict) {
      alert('This room is already assigned at the selected time on the selected day.');
      return;
    }

    setAssignedClasses([...assignedClasses, newClass]);
    alert('Class assigned successfully!');
  };

  const renderPicker = (selectedValue, onValueChange, items, isVisible, setVisible) => (
    <TouchableOpacity
      style={styles.pickerContainer}
      onPress={() => setVisible(!isVisible)}
      activeOpacity={1}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setVisible(false);
          onValueChange(itemValue);
        }}
        style={styles.picker}
        dropdownIconColor="transparent"
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
      {/* <Icon name="chevron-down" size={20} color="black" style={styles.pickerIcon} /> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Subject</Text>
      {renderPicker(selectedSubject, setSelectedSubject, subjects, subjectDropdownVisible, setSubjectDropdownVisible)}

      <Text style={styles.label}>Select Teacher</Text>
      {renderPicker(selectedTeacher, setSelectedTeacher, teachers, teacherDropdownVisible, setTeacherDropdownVisible)}

      <Text style={styles.label}>Select Room</Text>
      {renderPicker(selectedRoom, setSelectedRoom, rooms, roomDropdownVisible, setRoomDropdownVisible)}

      <Text style={styles.label}>Select Day</Text>
      {renderPicker(selectedDay, setSelectedDay, days, dayDropdownVisible, setDayDropdownVisible)}

      <Text style={styles.label}>Select Time</Text>
      {renderPicker(selectedTime, setSelectedTime, times, timeDropdownVisible, setTimeDropdownVisible)}

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
  pickerIcon: {
    marginLeft: 10,
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
});

export default AssignClass;
