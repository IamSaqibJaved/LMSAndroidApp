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

  const renderItem = ({ item }) => {
    const isExpanded = expandedStudent === item.id;
    const feeStatus = feeStatusData[item.id];



    return (
      <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
        <View style={styles.studentItem}>
          <View>
            <Text style={styles.regNoText}>{item.regNo}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.detailText}>Date of Birth: {item.dateOfBirth?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Date of Admission: {item.dateOfAdmission?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Gender: {item.gender}</Text>
                <Text style={styles.detailText}>Father's Name: {item.fatherDetails?.name}</Text>
                <Text style={styles.detailText}>Caste: {item.fatherDetails?.caste}</Text>
                <Text style={styles.detailText}>Occupation: {item.fatherDetails?.occupation}</Text>
                <Text style={styles.detailText}>Residence: {item.fatherDetails?.residence}</Text>
                <TouchableOpacity style={styles.actionButtonFullRow}>
                  <Text style={styles.buttonText}>Result</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButtonFullRow}
                  onPress={() => feeStatus ? navigation.navigate('EditFee', { studentId: item.id, feeStatusId: feeStatus.id}) : navigation.navigate('AddFee', { studentId: item.id, regNo: item.regNo, name: item.name})}
                >
                  <Text style={styles.buttonText}>{feeStatus ? 'Fee Status' : 'Add Fee Status'}</Text>
                  {feeStatus && (
                    <>
                    <Text style={styles.detailText}>ID: {feeStatus.id}</Text>
                      <Text style={styles.detailText}>Amount Due: {feeStatus.amountDue}</Text>
                      <Text style={styles.detailText}>Date Due: {feeStatus.datePaid?.toDate().toLocaleDateString()}</Text>
                      <Text style={styles.detailText}>Amount Paid: {feeStatus.amountPaid}</Text>
                      <Text style={styles.detailText}>Date Paid: {feeStatus.datePaid?.toDate().toLocaleDateString()}</Text>
                      <Text style={styles.detailText}>Payable Amount: {feeStatus.amountDue > feeStatus.amountPaid ? feeStatus.amountDue - feeStatus.amountPaid : 0}</Text>
                      <Text style={styles.detailText}>Fee Status: {feeStatus.datePaid.toDate() > feeStatus.dueDate.toDate() ? 'Late Fee' : ''}</Text>
                      <Text style={styles.detailText}>Remarks: {feeStatus.remarks}</Text>
                      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditFee', { studentId: item.id, feeStatusId: feeStatus.id })}>
                        <Icon name="pencil" size={20} color="black" />
                      </TouchableOpacity>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Icon name="pencil" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Icon name="trash-can-outline" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
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
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  nameText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  expandedContent: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginVertical: 2,
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
    elevation: 4, // For Android shadow
  },
  actionButtonFullRow: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default AdminStudentsScreen;