import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AdminStudentFeesScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [feeStatusData, setFeeStatusData] = useState({});

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('students')
      .onSnapshot(querySnapshot => {
        const studentsList = [];
        const feeStatusData = {}; // Temporary object to store fee status data

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
                };
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

  const handleEdit = (student, feeStatusId) => {
    navigation.navigate('EditFee', { studentId: student.id, feeStatusId });
  };

  const handleAddFee = (student) => {
    navigation.navigate('AddFee', { studentId: student.id, regNo: student.regNo, name: student.name });
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
            {feeStatus ? (
              <>
                {feeStatus.amountDue > feeStatus.amountPaid && (
                  <View style={[styles.tag, styles.payableTag]}>
                    <Text style={styles.tagText}>Payable Amount</Text>
                  </View>
                )}
                {feeStatus.datePaid.toDate() > feeStatus.dueDate.toDate() && (
                  <View style={[styles.tag, styles.lateFeeTag]}>
                    <Text style={styles.tagText}>Late Fee</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={[styles.tag, styles.noFeeStatusTag]}>
                <Text style={styles.tagText}>No Fee Status</Text>
              </View>
            )}
            {isExpanded && feeStatus && (
              <View style={styles.expandedContent}>
                <Text style={styles.detailText}>Amount Due: {feeStatus.amountDue}</Text>
                <Text style={styles.detailText}>Date Due: {feeStatus.dueDate?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Amount Paid: {feeStatus.amountPaid}</Text>
                <Text style={styles.detailText}>Date Paid: {feeStatus.datePaid?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Payable Amount: {feeStatus.amountDue > feeStatus.amountPaid ? feeStatus.amountDue - feeStatus.amountPaid : 0}</Text>
                <Text style={styles.detailText}>Fee Status: {feeStatus.datePaid.toDate() > feeStatus.dueDate.toDate() ? 'Late Fee' : 'Clear'}</Text>
                <Text style={styles.detailText}>Remarks: {feeStatus.remarks}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item, feeStatus.id)}>
                  <Icon name="pencil" size={20} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => feeStatus ? handleEdit(item, feeStatus.id) : handleAddFee(item)}>
              <Icon name={feeStatus ? "pencil" : "plus"} size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>STUDENT FEES</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
  tag: {
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  payableTag: {
    backgroundColor: 'orange',
  },
  lateFeeTag: {
    backgroundColor: 'red',
  },
  noFeeStatusTag: {
    backgroundColor: 'grey',
  },
  tagText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
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

export default AdminStudentFeesScreen;
