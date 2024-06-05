import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AdminStudentFeesScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [feeStatusData, setFeeStatusData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStudentsAndFees = async () => {
    setLoading(true);
    try {
      const studentsList = [];
      const feeStatusData = {};

      const querySnapshot = await firestore().collection('students').get();

      for (const documentSnapshot of querySnapshot.docs) {
        const studentData = documentSnapshot.data();
        studentsList.push({
          ...studentData,
          id: documentSnapshot.id,
        });

        // Fetch fee status for each student
        const feeSnapshot = await documentSnapshot.ref.collection('feeStatus').get();
        if (!feeSnapshot.empty) {
          feeSnapshot.forEach(doc => {
            const feeData = doc.data();
            feeStatusData[documentSnapshot.id] = {
              ...feeData,
              id: doc.id, // Save feeStatusId
            };
          });
        }
      }

      setStudents(studentsList);
      setFeeStatusData(feeStatusData);
    } catch (error) {
      console.error('Failed to fetch students or fees:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentsAndFees();
    }, [])
  );

  const handleToggleExpand = (id) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id ? { ...student, expanded: !student.expanded } : student
      )
    );
  };

  const handleEdit = (student, feeStatusId) => {
    navigation.navigate('EditFee', { studentId: student.id, feeStatusId });
  };

  const handleAddFee = (student) => {
    navigation.navigate('AddFee', { studentId: student.id, regNo: student.regNo, name: student.name });
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.expanded;
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
                    <Text style={styles.tagText}>Payable Fee</Text>
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
                <Text style={styles.detailHeader}>Payable Amount</Text>
                <Text style={styles.detailText}>{feeStatus.amountDue > feeStatus.amountPaid ? feeStatus.amountDue - feeStatus.amountPaid : 0}</Text>
                <Text style={styles.detailHeader}>Fee Status</Text>
                <Text style={styles.detailText}>{feeStatus.datePaid.toDate() > feeStatus.dueDate.toDate() ? 'Late Fee' : 'Clear'}</Text>
                <Text style={styles.detailHeader}>Amount Due</Text>
                <Text style={styles.detailText}>{feeStatus.amountDue}</Text>
                <Text style={styles.detailHeader}>Date Due</Text>
                <Text style={styles.detailText}>{feeStatus.dueDate?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailHeader}>Amount Paid</Text>
                <Text style={styles.detailText}>{feeStatus.amountPaid}</Text>
                <Text style={styles.detailHeader}>Date Paid</Text>
                <Text style={styles.detailText}>{feeStatus.datePaid?.toDate().toLocaleDateString()}</Text>
                <Text style={styles.detailHeader}>Remarks</Text>
                <Text style={styles.detailText}>{feeStatus.remarks}</Text>
              </View>
            )}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => feeStatus ? handleEdit(item, feeStatus.id) : handleAddFee(item)}>
<<<<<<< Updated upstream
              <Icon name={feeStatus ? "pencil" : "plus"} size={20} color="#3d9f76" style={styles.icon} />
=======
              <Icon name={feeStatus ? "pencil" : "plus"} size={25} color="#3d9f76" style={styles.icon} />
>>>>>>> Stashed changes
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="grey" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    color: 'black',
    marginVertical: 20,
    fontFamily: 'IMFellEnglish-Regular',
  },
  listContainer: {
    paddingBottom: 80, // Add space for the sticky button
  },
  studentItem: {
    backgroundColor: '#d6f7e7',
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
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  detailHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  tag: {
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
   
  },
  payableTag: {
    backgroundColor: 'red',
  },
  lateFeeTag: {
    backgroundColor: 'orange',
  },
  noFeeStatusTag: {
    backgroundColor: '#3d9f76',
<<<<<<< Updated upstream
=======
    paddingLeft: 20,
>>>>>>> Stashed changes
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
  loadingIndicator: {
    marginTop: 20,
  },
});

export default AdminStudentFeesScreen;
