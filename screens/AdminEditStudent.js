import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditStudentScreen = ({ route, navigation }) => {
  const { student } = route.params;

  const [gender, setGender] = useState(student.gender);
  const [dateOfAdmission, setDateOfAdmission] = useState(student.dateOfAdmission?.toDate());
  const [showDateOfAdmissionPicker, setShowDateOfAdmissionPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth?.toDate());
  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);

  const [regNo, setRegNo] = useState("" + student.regNo);

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
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Reg#"
              placeholderTextColor="grey"
              value={regNo}
              onChangeText={setRegNo}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity onPress={() => setShowDateOfAdmissionPicker(true)}>
            <View style={styles.inputContainer}>
              <Icon name="calendar" size={20} color="grey" />
              <TextInput
                style={styles.input}
                placeholder="Date Of Admission"
                placeholderTextColor="grey"
                value={dateOfAdmission ? formatDate(dateOfAdmission) : ''}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDateOfAdmissionPicker && (
            <DateTimePicker
              value={dateOfAdmission || new Date()}
              mode="date"
              display="default"
              onChange={handleDateOfAdmissionChange}
            />
          )}
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="grey"
              value={name}
              onChangeText={setName}
            />
          </View>
          <TouchableOpacity onPress={() => setShowDateOfBirthPicker(true)}>
            <View style={styles.inputContainer}>
              <Icon name="calendar" size={20} color="grey" />
              <TextInput
                style={styles.input}
                placeholder="Date Of Birth"
                placeholderTextColor="grey"
                value={dateOfBirth ? formatDate(dateOfBirth) : ''}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDateOfBirthPicker && (
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display="default"
              onChange={handleDateOfBirthChange}
            />
          )}
          <View style={styles.inputContainer}>
            <Icon name="school" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Class of Admission"
              placeholderTextColor="grey"
              value={classOfAdmission}
              onChangeText={setClassOfAdmission}
            />
          </View>
          <View style={styles.pickerContainer}>
            <Icon name="gender-male-female" size={20} color="grey" />
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
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="grey"
              value={fatherName}
              onChangeText={setFatherName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="account-group" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Caste"
              placeholderTextColor="grey"
              value={caste}
              onChangeText={setCaste}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="briefcase" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              placeholderTextColor="grey"
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Residence"
              placeholderTextColor="grey"
              value={residence}
              onChangeText={setResidence}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Remarks</Text>
          <View style={styles.inputContainer}>
            <Icon name="note" size={20} color="grey" />
            <TextInput
              style={styles.input}
              placeholder="Remarks"
              placeholderTextColor="grey"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={4}
            />
          </View>
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
    color: '#333',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    paddingLeft: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    flex: 1,
    height: 50,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EditStudentScreen;
