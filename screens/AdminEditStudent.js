import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const EditStudentScreen = ({ route, navigation }) => {
  const { student } = route.params;

  const [gender, setGender] = useState(student.gender);
  const [dateOfAdmission, setDateOfAdmission] = useState(student.dateOfAdmission?.toDate());
  const [showDateOfAdmissionPicker, setShowDateOfAdmissionPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth?.toDate());
  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);

  const [regNo, setRegNo] = useState(""+student.regNo);
  
  const [name, setName] = useState(student.name);
  const [classOfAdmission, setClassOfAdmission] = useState(student.classOfAdmission);
  const [fatherName, setFatherName] = useState(student.fatherDetails?.name);
  const [caste, setCaste] = useState(student.fatherDetails?.caste);
  const [occupation, setOccupation] = useState(student.fatherDetails?.occupation);
  const [residence, setResidence] = useState(student.fatherDetails?.residence);
  const [remarks, setRemarks] = useState(student.remarks);

  const handleDateOfAdmissionChange = (event, selectedDate) => {
    setShowDateOfAdmissionPicker(false);
    setDateOfAdmission(selectedDate || dateOfAdmission);
  };

  const handleDateOfBirthChange = (event, selectedDate) => {
    setShowDateOfBirthPicker(false);
    setDateOfBirth(selectedDate || dateOfBirth);
  };

  const formatDate = (date) => {
    if (!date) return '';
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!regNo || !dateOfAdmission || !name || !dateOfBirth || !classOfAdmission || !gender || !fatherName || !caste || !occupation || !residence) {
      Alert.alert("Error", "All fields except Remarks are required");
      return;
    }

    try {
      // Update student data in Firestore
      await firestore().collection('students').doc(student.id).update({
        regNo,
        dateOfAdmission: firestore.Timestamp.fromDate(dateOfAdmission),
        name,
        dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth),
        classOfAdmission,
        gender,
        fatherDetails: {
          name: fatherName,
          caste,
          occupation,
          residence,
        },
        remarks
      });

      Alert.alert("Success", "Student updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>EDIT STUDENT</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Student Details</Text>
          <TextInput style={styles.input} placeholder="Reg#" placeholderTextColor="grey" value={regNo} onChangeText={setRegNo} keyboardType="numeric" />
          <TouchableOpacity onPress={() => setShowDateOfAdmissionPicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Date Of Admission"
              placeholderTextColor="grey"
              value={dateOfAdmission ? formatDate(dateOfAdmission) : ''}
              editable={false}
            />
          </TouchableOpacity>
          {showDateOfAdmissionPicker && (
            <DateTimePicker
              value={dateOfAdmission || new Date()}
              mode="date"
              display="default"
              onChange={handleDateOfAdmissionChange}
            />
          )}
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="grey" value={name} onChangeText={setName} />
          <TouchableOpacity onPress={() => setShowDateOfBirthPicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Date Of Birth"
              placeholderTextColor="grey"
              value={dateOfBirth ? formatDate(dateOfBirth) : ''}
              editable={false}
            />
          </TouchableOpacity>
          {showDateOfBirthPicker && (
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display="default"
              onChange={handleDateOfBirthChange}
            />
          )}
          <TextInput style={styles.input} placeholder="Class of Admission" placeholderTextColor="grey" value={classOfAdmission} onChangeText={setClassOfAdmission} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" color="grey" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Father Details</Text>
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="grey" value={fatherName} onChangeText={setFatherName} />
          <TextInput style={styles.input} placeholder="Caste" placeholderTextColor="grey" value={caste} onChangeText={setCaste} />
          <TextInput style={styles.input} placeholder="Occupation" placeholderTextColor="grey" value={occupation} onChangeText={setOccupation} />
          <TextInput style={styles.input} placeholder="Residence" placeholderTextColor="grey" value={residence} onChangeText={setResidence} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Remarks</Text>
          <TextInput style={styles.input} placeholder="Remarks" placeholderTextColor="grey" value={remarks} onChangeText={setRemarks} multiline numberOfLines={4} />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'IMFellEnglish-Regular',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  pickerContainer: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EditStudentScreen;
