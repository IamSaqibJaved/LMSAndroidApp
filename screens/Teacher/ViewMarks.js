import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import DrawerLayout from 'react-native-drawer-layout';
import auth from '@react-native-firebase/auth';

const terms = ['First Term', 'Mid Term', 'Final Term'];

const ViewMarks = ({ route }) => {
  const { teacherId } = route.params;
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigation = useNavigation();
  const drawerRef = useRef(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const classSnapshot = await firestore().collection('classes').where('teacher', '==', teacherId).get();
        if (!classSnapshot.empty) {
          const classData = classSnapshot.docs[0].data();
          setSubjects(classData.subjects);
          setSelectedSubject(classData.subjects[0]);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch subjects');
      }
    };

    fetchSubjects();
  }, [teacherId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.drawerButton} onPress={() => drawerRef.current.openDrawer()}>
          <Icon name="menu" size={10} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
      navigation.navigate('login'); // Navigate to the login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const renderDrawerContent = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>Teacher Info</Text>
      <Text style={styles.drawerText}>Name: John Doe</Text> {/* Replace with actual data */}
      <Text style={styles.drawerText}>Email: johndoe@gmail.com</Text> {/* Replace with actual data */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition={DrawerLayout.positions.Right}
      renderNavigationView={renderDrawerContent}
    >
      <View style={styles.container}>
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
    </DrawerLayout>
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
    borderColor: '#d3f7d3',
    backgroundColor: '#d3f7d3',
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
  drawerButton: {
    marginRight: 10,
    backgroundColor: '#d3f7d3',
    borderRadius: 50,
    padding: 10,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  drawerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#d3f7d3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default ViewMarks;
