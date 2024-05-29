import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const students = [
  { id: 'FA21-BCS-074', name: 'Muhammad Uzair', marks: '50/50' },
  { id: 'FA21-BCS-082', name: 'Saqib Javed', marks: '50/50' },
  { id: 'FA21-BCS-014', name: 'Arshia Azmat', marks: '50/50' },
  { id: 'FA21-BCS-086', name: 'Sidra Naeem', marks: '50/50' },
];

const StudentListScreen = () => {
  const handleEdit = (id) => {
    Alert.alert('Edit', `Edit student with ID: ${id}`);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', `Delete student with ID: ${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.cardContent}>
        <Text style={styles.studentId}>{item.id}</Text>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <View style={styles.marksContainer}>
        <Text style={styles.marks}>{item.marks}</Text>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Icon name="edit" size={20} color="#000" marginRight={10}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="delete" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>STUDENTS</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 80,
  },
  studentCard: {
    backgroundColor: '#d3f7d3',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  studentId: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  studentName: {
    fontSize: 16,
    marginVertical: 4,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marks: {
    fontSize: 16,
    marginRight: 10,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  
});

export default StudentListScreen;
