import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const AdminClassScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClassesAndTeachers = async () => {
    try {
      setLoading(true);

      // Fetch classes
      const classCollection = await firestore().collection('classes').get();
      const classList = classCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      classList.sort((a, b) => {
        const order = ['Nursery', 'Prep', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
        return order.indexOf(a.className) - order.indexOf(b.className);
      });

      // Fetch teachers
      const teacherCollection = await firestore().collection('teachers').get();
      const teacherMap = {};
      teacherCollection.forEach(doc => {
        teacherMap[doc.id] = doc.data().name;
      });

      setClasses(classList);
      setTeachers(teacherMap);
    } catch (error) {
      console.error('Error fetching classes or teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClassesAndTeachers();
    }, [])
  );

  const handleEdit = (item) => {
    navigation.navigate('EditClassScreen', { classId: item.id });
  };

  const handleDelete = async (item) => {
    try {
      await firestore().collection('classes').doc(item.id).delete();
      Alert.alert('Success', 'Class deleted successfully');
      setClasses(classes.filter(cls => cls.id !== item.id));
    } catch (error) {
      console.error('Error deleting class:', error);
      Alert.alert('Error', 'Failed to delete class');
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const renderItem = ({ item, index }) => (
    <View>
      <TouchableOpacity onPress={() => toggleDropdown(index)}>
        <View style={styles.classItem}>
          <Text style={styles.classText}>{item.className}</Text>
          <Text style={styles.subText}>{`Assigned to: ${teachers[item.teacher] || 'Fetching...'}`}</Text>
          <Text style={styles.subText}>{`Room #: ${item.room}`}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Icon name="pencil" size={20} color="#3d9f76" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Icon name="trash" size={20} color="#3d9f76" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      {openDropdown === index && (
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownText}>{`Subjects: ${item.subjects.join(', ')}`}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AssignClass')}>
        <Icon name="plus" size={24} color="#3d9f76" />
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
    paddingBottom: 80,
  },
  classItem: {
    backgroundColor: '#d6f7e7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    paddingBottom: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  classText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -60,
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
  dropdownContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 5,
    borderColor: "#d6f7e7",
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: 'grey',
    fontFamily: 'Poppins-Regular',
  },
});

export default AdminClassScreen;
