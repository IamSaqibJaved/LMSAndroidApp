import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AdminScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([
    {
      name: 'Nursery',
      subjects: [
        { name: 'Math', teacher: 'Teacher A', room: 'Room 1', date: '2024-05-25', time: '09:00 AM' },
        { name: 'English', teacher: 'Teacher B', room: 'Room 2', date: '2024-05-25', time: '10:00 AM' }
      ]
    },
    {
      name: 'KG',
      subjects: [
        { name: 'Science', teacher: 'Teacher C', room: 'Room 3', date: '2024-05-26', time: '09:00 AM' },
        { name: 'Art', teacher: 'Teacher D', room: 'Room 4', date: '2024-05-26', time: '10:00 AM' }
      ]
    }
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleEdit = (item) => {
    // Handle edit logic here
  };

  const handleDelete = (item) => {
    // Handle delete logic here
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const renderItem = ({ item, index }) => (
    <View>
      <TouchableOpacity onPress={() => toggleDropdown(index)}>
        <View style={styles.classItem}>
          <Text style={styles.classText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      {openDropdown === index && (
        <View style={styles.submenuContainer}>
          <FlatList
            data={item.subjects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.submenuItem}>
                <View style={styles.submenuDateTime}>
                  <Text style={styles.submenuDateTimeText}>{item.date}</Text>
                  <Text style={styles.submenuDateTimeText}>{item.time}</Text>
                </View>
                <View style={styles.submenuInfo}>
                  <Text style={styles.submenuTitle}>{`Subject: ${item.name}`}</Text>
                  <Text style={styles.submenuText}>{`Taught by: ${item.teacher}`}</Text>
                </View>
                <View style={styles.submenuBottomRow}>
                  <Text style={styles.submenuText}>{`Room #: ${item.room}`}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Icon name="edit" size={20} color="black" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)}>
                      <Icon name="trash" size={20} color="black" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AssignClass')}>
        <Icon name="plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 80, // Add space for the sticky button
  },
  classItem: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4, // For Android shadow
  },
  classText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  submenuContainer: {
    borderRadius: 10,
    marginVertical: 5,
  },
  submenuItem: {
    flexDirection: 'column',
    marginBottom: 12, // Add margin between subjects
    borderWidth: 1,
    borderColor: '#000', // black border color
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#d3f7d3',
  },
  submenuTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginBottom: 10,
  },
  submenuText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  submenuDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  submenuDateTimeText: {
    fontSize: 12,
    color: 'black',
  },
  submenuInfo: {
    marginBottom: 5,
  },
  submenuBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default AdminScreen;
