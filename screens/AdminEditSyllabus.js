// AdminEditSyllabus.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const EditSyllabusScreen = () => {
  const route = useRoute();
  const { className } = route.params;
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchSyllabusImage = async () => {
      try {
        const doc = await firestore().collection('syllabus').doc(className).get();
        if (doc.exists && doc.data().syllabus) {
          setImageUri(doc.data().syllabus);
        }
      } catch (error) {
        console.error('Error fetching syllabus image:', error);
      }
    };

    fetchSyllabusImage();
  }, [className]);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        const imagePath = `syllabus/${className}/${image.fileName}`;
        const reference = storage().ref(imagePath);

        try {
          await reference.putFile(image.uri);
          const url = await reference.getDownloadURL();
          setImageUri(url);

          await firestore().collection('syllabus').doc(className).set({ class: className, syllabus: url });
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    });
  };

  const handleRemoveImage = async () => {
    try {
      const imagePath = `syllabus/${className}/${imageUri.split('%2F').pop().split('?')[0]}`;
      const reference = storage().ref(imagePath);
      await reference.delete();

      await firestore().collection('syllabus').doc(className).update({ syllabus: '' });
      setImageUri(null);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SYLLABUS</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Upload new image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRemoveImage}>
        <Text style={styles.buttonText}>Remove image</Text>
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  placeholder: {
    width: 300,
    height: 300,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#d3f7d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4, // For Android shadow
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default EditSyllabusScreen;
