import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const terms = ['First Term', 'Mid Term', 'Final Term'];
const userType= 'Teacher';

const ViewMarks = ({ route }) => {
  const { teacherId } = route.params;
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSubjectsAndTeacherInfo = async () => {
      try {
        const classSnapshot = await firestore().collection('classes').where('teacher', '==', teacherId).get();
        if (!classSnapshot.empty) {
          const classData = classSnapshot.docs[0].data();
          setSubjects(classData.subjects);
          setSelectedSubject(classData.subjects[0]);
        }

        const teacherDoc = await firestore().collection('teachers').doc(teacherId).get();
        if (teacherDoc.exists) {
          const teacherData = teacherDoc.data();
          setTeacherName(teacherData.name);
          setTeacherEmail(teacherData.email);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch subjects or teacher info');
      }
    };

    fetchSubjectsAndTeacherInfo();
  }, [teacherId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: handleLogout
            }
          ],
          { cancelable: false }
        );
        return true; // Prevent default behavior of going back
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const handleViewMarks = () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    navigation.navigate('view-student-marks', {
      term: selectedTerm,
      subject: selectedSubject,
      teacherId,
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Success', 'Logged out successfully');
      navigation.replace('Login', {userType}); // Navigate to the login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <View style={styles.container}>
      <Image
            source={require('./teacher2.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedTerm}
          onValueChange={(itemValue) => setSelectedTerm(itemValue)}
          style={styles.picker}
        >
          {terms.map((term, index) => (
            <Picker.Item key={index} label={term} value={term} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {subjects.map((subject, index) => (
            <Picker.Item key={index} label={subject} value={subject} style={styles.pickerLabel} />
          ))}
        </Picker>
        <Icon name="arrow-drop-down" size={30} style={styles.pickerIcon} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewMarks}>
        <Text style={styles.buttonText}>View Marks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownContainer: {
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
    color: 'black',
    height: 50,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    color: '#000',
  },
  pickerLabel: {
    fontFamily: 'Poppins-SemiBold',
  },
  button: {
    backgroundColor: '#d6f7e7',
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
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  headerButton: {
    marginRight: 10,
    padding: 10,
  },
  logo: {
    height: 200,
    width: 200,
    marginLeft: 20,
    marginTop: 50,
    marginBottom: 20,
  },
});

export default ViewMarks;
