import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AdminStudentsScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [feeStatusData, setFeeStatusData] = useState({});
  const [showPersonalInfo, setShowPersonalInfo] = useState({});
  const [showResult, setShowResult] = useState({});
  const [showFeeStatus, setShowFeeStatus] = useState({});

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('students')
      .onSnapshot(querySnapshot => {
        const studentsList = [];
        const feeStatusData = {};
        querySnapshot.forEach(documentSnapshot => {
          const studentData = documentSnapshot.data();
          studentsList.push({
            ...studentData,
            id: documentSnapshot.id,
          });

          // Fetch fee status for each student
          documentSnapshot.ref.collection('feeStatus').get().then(feeSnapshot => {
            if (!feeSnapshot.empty) {
              feeSnapshot.forEach(doc => {
                const feeData = doc.data();
                feeStatusData[documentSnapshot.id] = {
                  ...feeData,
                  id: doc.id, // Save feeStatusId
                }
              });
            }
          });
        });
        setStudents(studentsList);
        setFeeStatusData(feeStatusData);
      });

    return () => unsubscribe();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const handleEdit = (student) => {
    navigation.navigate('EditStudent', { student });
  };

  const handleDelete = (student) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete student record?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteStudent(student.id),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const deleteStudent = async (studentId) => {
    try {
      await firestore().collection('students').doc(studentId).delete();
      Alert.alert("Success", "Student record deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete student record");
    }
  };

  const handleAddStudent = () => {
    navigation.navigate('AddStudent');
  };

  const toggleVisibility = (id, section) => {
    if (section === 'personalInfo') {
      setShowPersonalInfo(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    } else if (section === 'result') {
      setShowResult(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    } else if (section === 'feeStatus') {
      setShowFeeStatus(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedStudent === item.id;
    const isPersonalInfoVisible = showPersonalInfo[item.id];
    const isResultVisible = showResult[item.id];
    const isFeeStatusVisible = showFeeStatus[item.id];

    return (
      <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
        <View style={styles.studentItem}>
          <View>
            <Text style={styles.regNoText}>{item.regNo}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item, 'student')}>
              <Icon name="pencil" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item, 'student')}>
              <Icon name="trash-can-outline" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButtonFullRow} onPress={() => toggleVisibility(item.id, 'personalInfo')}>
                <Text style={styles.buttonText}>Personal Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonFullRow} onPress={() => toggleVisibility(item.id, 'result')}>
                <Text style={styles.buttonText}>Result</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonFullRow} onPress={() => toggleVisibility(item.id, 'feeStatus')}>
                <Text style={styles.buttonText}>Fee Status</Text>
              </TouchableOpacity>
            </View>
            {isPersonalInfoVisible && (
              <View >
                <View style={styles.headericon}>
                <Text style={styles.sectionHeader}>Personal Information</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEdit(item, 'feeStatus')}>
                    <Icon name="pencil" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, 'feeStatus')}>
                    <Icon name="trash-can-outline" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                </View>
                </View>
                <Text style={styles.detailText}>Date of Birth: {item.dateOfBirth?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Date of Admission: {item.dateOfAdmission?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Gender: {item.gender}</Text>
                <Text style={styles.detailText}>Father's Name: {item.fatherDetails?.name}</Text>
                <Text style={styles.detailText}>Caste: {item.fatherDetails?.caste}</Text>
                <Text style={styles.detailText}>Occupation: {item.fatherDetails?.occupation}</Text>
                <Text style={styles.detailText}>Residence: {item.fatherDetails?.residence}</Text>
              </View>
            )}
            {isResultVisible && (
              <View style={styles.headericon}>
                <Text style={styles.sectionHeader}>Result</Text>
                {/* Render result details here */}
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEdit(item, 'result')}>
                    <Icon name="pencil" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, 'result')}>
                    <Icon name="trash-can-outline" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {isFeeStatusVisible && (
              <View>
                <View style={styles.headericon}>
                <Text style={styles.sectionHeader}>Fee Status</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEdit(item, 'feeStatus')}>
                    <Icon name="pencil" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, 'feeStatus')}>
                    <Icon name="trash-can-outline" size={20} color="black" style={styles.icon} />
                  </TouchableOpacity>
                </View>
                </View>
                <Text style={styles.detailText}>ID: {feeStatusData[item.id]?.id}</Text>
                <Text style={styles.detailText}>Amount Due: {feeStatusData[item.id]?.amountDue}</Text>
                <Text style={styles.detailText}>Date Due: {feeStatusData[item.id]?.datePaid.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Amount Paid: {feeStatusData[item.id]?.amountPaid}</Text>
                <Text style={styles.detailText}>Date Paid: {feeStatusData[item.id]?.datePaid?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Payable Amount: {feeStatusData[item.id]?.amountDue > feeStatusData[item.id]?.amountPaid ? feeStatusData[item.id]?.amountDue - feeStatusData[item.id]?.amountPaid : 0}</Text>
                <Text style={styles.detailText}>Fee Status: {feeStatusData[item.id]?.datePaid.toDate() > feeStatusData[item.id]?.dueDate.toDate() ? 'Late Fee' : ''}</Text>
                <Text style={styles.detailText}>Remarks: {feeStatusData[item.id]?.remarks}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>STUDENTS</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
        <Icon name="plus" size={30} color="black" />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'IMFellEnglish-Regular',
    color: '#000',
  },
  listContainer: {
    paddingBottom: 80, // Add space for the sticky button
  },
  studentItem: {
    backgroundColor: '#d3f7d3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regNoText: {
    fontSize: 16,
    color: 'black',
  },
  nameText: {
    fontSize: 14,
    color: 'black',
    marginTop: -20,
    marginLeft: 40,
  },
  expandedContent: {
    backgroundColor: '#d3f7d3',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  headericon:{
    flexDirection: 'row',
    marginRight: 60,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 70,
    color: 'black',
    // marginLeft: 80,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginVertical: 8,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d3f7d3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
    
  },
  buttonRow: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionButtonFullRow: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 50,
    width: '70%',
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default AdminStudentsScreen;
