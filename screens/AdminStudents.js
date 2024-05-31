import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AdminStudentsScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [feeStatusData, setFeeStatusData] = useState({});
  const [showPersonalInfo, setShowPersonalInfo] = useState({});
  // const [showResult, setShowResult] = useState({});
  const [showFeeStatus, setShowFeeStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const studentsList = [];
      const feeStatusData = {};
      const querySnapshot = await firestore().collection('students').get();
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
      setFilteredStudents(studentsList);
      setFeeStatusData(feeStatusData);
      setLoading(false);
    } catch (error) {
      console.log('Failed to fetch students:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleToggleExpand = (id) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const handleEdit = (student) => {
    navigation.navigate('EditStudent', { student });
  };

  const handleEditFee = (fee) => {
    navigation.navigate('EditFee', { fee });
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
    } else if (section === 'feeStatus') {
      setShowFeeStatus(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleToggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedStudent === item.id;
    const isPersonalInfoVisible = showPersonalInfo[item.id];
    //const isResultVisible = showResult[item.id];
    const isFeeStatusVisible = showFeeStatus[item.id];

    return (
      <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
        <View style={styles.studentItem}>
          <View>
            <Text style={styles.regNoText}>{item.regNo}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.classText}>{item.classOfAdmission}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item, 'student')}>
              <Icon name="pencil" size={20} color="#3d9f76" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item, 'student')}>
              <Icon name="trash-can-outline" size={20} color="#3d9f76" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButtonFullRow} onPress={() => toggleVisibility(item.id, 'personalInfo')}>
                <Text style={styles.buttonText}>Personal Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonFullRow} onPress={() => toggleVisibility(item.id, 'feeStatus')}>
                <Text style={styles.buttonText}>Fee Status</Text>
              </TouchableOpacity>
            </View>
            {isPersonalInfoVisible && (
              <View >
                <View style={styles.headericon}>
                <Text style={styles.sectionHeader}>Personal Info</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEdit(item, 'feeStatus')}>
                    <Icon name="pencil" size={20} color="#3d9f76" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, 'feeStatus')}>
                    <Icon name="trash-can-outline" size={20} color="#3d9f76" style={styles.icon} />
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
            {isFeeStatusVisible && (
              <View>
                <View style={styles.headericon}>
                <Text style={styles.sectionHeader}>Fee Status</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditFee(item, 'feeStatus')}>
                    <Icon name="pencil" size={20} color="#3d9f76" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item, 'feeStatus')}>
                    <Icon name="trash-can-outline" size={20} color="#3d9f76" style={styles.icon} />
                  </TouchableOpacity>
                </View>
                </View>
                {/* <Text style={styles.detailText}>ID: {feeStatusData[item.id]?.id}</Text> */}
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
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#3d9f76" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={'black'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
        <Icon name="plus" size={30} color= "#3d9f76" />
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
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'grey',
    borderColor: "#abafaf",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    color: 'black',
  },
  filterIcon: {
    marginLeft: 15,
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
  loadingIndicator: {
    marginTop: 20,
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
    marginTop: 10,
  },
  classText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  expandedContent: {
    backgroundColor: '#d6f7e7',
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
    marginRight: 100,
    color: 'black',
    // marginLeft: 80,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: 'grey',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
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
    backgroundColor: '#d6f7e7',
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
