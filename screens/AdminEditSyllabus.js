import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import app from './firebaseConfig'; // Your Firebase configuration

const firestore = getFirestore(app);

const editSyllabusScreen = ({ route, navigation }) => {
  const { classId } = route.params;
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      const docRef = doc(firestore, 'syllabus', classId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setImage(docSnap.data().syllabus);
      } else {
        setImage(null);
      }
    };
    fetchSyllabus();
  }, [classId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = result.assets[0].uri;
      setImage(source);
      const docRef = doc(firestore, 'syllabus', classId);
      await updateDoc(docRef, { syllabus: source });
    }
  };

  const removeImage = async () => {
    setImage(null);
    const docRef = doc(firestore, 'syllabus', classId);
    await updateDoc(docRef, { syllabus: deleteField() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SYLLABUS</Text>
      <View style={styles.imageContainer}>
        <Image
          source={image ? { uri: image } : require('./assets/placeholder.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Upload new image" onPress={pickImage} />
        <Button title="Remove image" onPress={removeImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageContainer: {
    width: '80%',
    height: 200,
    backgroundColor: '#ddd',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default editSyllabusScreen;
