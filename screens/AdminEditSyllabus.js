import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

const EditSyllabusScreen = () => {
  const route = useRoute();
  const { className } = route.params;
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchSyllabusImage = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection('syllabus')
        .where('class', '==', className)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const syllabusData = doc.data();
        if (syllabusData.syllabus) {
          setImageUri(syllabusData.syllabus);
        }
      }
    } catch (error) {
      console.error('Error fetching syllabus image:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSyllabusImage();
    }, [className])
  );

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
        
        setUploading(true);

        try {
          await reference.putFile(image.uri);
          const url = await reference.getDownloadURL();
          setImageUri(url);

          const querySnapshot = await firestore()
            .collection('syllabus')
            .where('class', '==', className)
            .limit(1)
            .get();

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await doc.ref.update({ syllabus: url });
          } else {
            await firestore().collection('syllabus').add({
              class: className,
              syllabus: url
            });
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const handleRemoveImage = async () => {
    try {
      const imagePath = `syllabus/${className}/${imageUri.split('%2F').pop().split('?')[0]}`;
      const reference = storage().ref(imagePath);
      await reference.delete();

      const querySnapshot = await firestore()
        .collection('syllabus')
        .where('class', '==', className)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await doc.ref.update({ syllabus: '' });
      }

      setImageUri(null);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SYLLABUS</Text>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
<<<<<<< Updated upstream
          imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Image
              source={require('../images/syllabus1.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          )
        )}
      </View>
      <TouchableOpacity style={styles.homeButton} onPress={handleImagePick}>
        <View style={styles.circle}>
          <Icon name="cloud-upload" size={40} color="#3ca475" />
        </View>
        <Text style={styles.homeButtonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={handleRemoveImage}>
        <View style={styles.circle}>
          <Icon name="delete" size={40} color="#3ca475" />
        </View>
        <Text style={styles.homeButtonText}>Delete Image</Text>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}
=======
          <Image
            source={require('../images/syllabus1.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>
      <TouchableOpacity style={styles.homeButton}onPress={handleImagePick}>
              <View style={styles.circle}>
                <Icon name="cloud-upload" size={40} color="#3ca475" />
              </View>
                <Text style={styles.homeButtonText}>Upload Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeButton} onPress={handleRemoveImage}>
              <View style={styles.circle}>
                <Icon name="delete" size={40} color="#3ca475" />
              </View>
                <Text style={styles.homeButtonText}>Delete Image</Text>
              </TouchableOpacity>
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  circle: {
    width: 80,
    height: 80,
=======
  circle:{
    width: 80,
    height:80,
>>>>>>> Stashed changes
    borderRadius: 70,
    backgroundColor: '#d6f7e7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -200,
<<<<<<< Updated upstream
    bottom: 23,
=======
    bottom: 23, 
>>>>>>> Stashed changes
    zIndex: 1,
  },
  homeButton: {
    backgroundColor: '#d6f7e7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 30,
    marginLeft: 50,
  },
  homeButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginTop: -80,
    marginLeft: 30,
  },
  logo: {
    height: 250,
    width: 250,
    marginLeft: 10,
  },
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
  uploadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadingText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});

export default EditSyllabusScreen;
