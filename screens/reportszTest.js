import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const classes = ['Nursery', 'Prep', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
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
  

const generateTermData = (className) => {
    const subjects = classSubjects[className] || [];
    const termData = {};
    subjects.forEach(subject => {
        termData[subject] = null; // Initialize marks to null
    });
    return termData;
};

const AddStudentsScreen = ({ navigation }) => {
    const [gender, setGender] = useState('');
    const [dateOfAdmission, setDateOfAdmission] = useState(null);
    const [showDateOfAdmissionPicker, setShowDateOfAdmissionPicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);

    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const [classOfAdmission, setClassOfAdmission] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [caste, setCaste] = useState('');
    const [occupation, setOccupation] = useState('');
    const [residence, setResidence] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remarks, setRemarks] = useState('');

    const handleDateOfAdmissionChange = (event, selectedDate) => {
        setShowDateOfAdmissionPicker(Platform.OS === 'ios');
        setDateOfAdmission(selectedDate || dateOfAdmission);
    };

    const handleDateOfBirthChange = (event, selectedDate) => {
        setShowDateOfBirthPicker(Platform.OS === 'ios');
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
        if (!regNo || !dateOfAdmission || !name || !dateOfBirth || !classOfAdmission || !gender || !fatherName || !caste || !occupation || !residence || !email || !password) {
            Alert.alert("Error", "All fields except Remarks are required");
            return;
        }
    
        const regNumber = parseInt(regNo, 10);
        if (isNaN(regNumber) || regNumber < 0 || regNumber > 1000) {
            Alert.alert("Error", "Registration number must be a number between 0 and 1000");
            return;
        }
    
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
    
            const newStudentRef = firestore().collection('students').doc();
            await newStudentRef.set({
                regNo: regNumber,
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
                email: email,
                remarks
            });
    
            const year = dateOfAdmission.getFullYear().toString();
            const initialResultData = {
                class: classOfAdmission,
                'firstterm': generateTermData(classOfAdmission),
                'midterm': generateTermData(classOfAdmission),
                'finalterm': generateTermData(classOfAdmission),
            };
    
            await newStudentRef.collection('result').doc(year).set(initialResultData);
    
            Alert.alert("Success", "Student added successfully");
            navigation.goBack();
        } catch (error) {
            console.error("Error adding student: ", error);
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>STUDENTS</Text>
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
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={classOfAdmission}
                            onValueChange={(itemValue) => setClassOfAdmission(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Class of Admission" value="" color="grey" />
                            {classes.map((className, index) => (
                                <Picker.Item key={index} label={className} value={className} />
                            ))}
                        </Picker>
                    </View>
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
                    <Text style={styles.sectionHeader}>Account Details</Text>
                    <TextInput style={styles.input} placeholder="Email" placeholderTextColor="grey" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="grey" value={password} onChangeText={setPassword} />
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
        backgroundColor: '#ffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'IMFellEnglish-Regular',
    },
    scrollContainer: {
        paddingBottom: 10,
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
        height: 50,
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
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
    left:90,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default AddStudentsScreen;