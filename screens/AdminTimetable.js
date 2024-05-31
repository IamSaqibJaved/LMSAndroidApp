import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TimetableScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const documentSnapshot = await firestore().collection('timetable').doc('current').get();
      if (documentSnapshot.exists) {
        setImageUrl(documentSnapshot.data().imageUrl);
      }
      setLoading(false);
    } catch (error) {
      console.log('Failed to fetch image URL:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchImage();
    }, [])
  );

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        await uploadImage(uri);
      }
    });
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const reference = storage().ref(`timetable/${fileName}`);
    const task = reference.putFile(uri);

    task.on('state_changed', (taskSnapshot) => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });

    try {
      await task;
      const url = await reference.getDownloadURL();
      await firestore().collection('timetable').doc('current').set({ imageUrl: url });
      setImageUrl(url);
      setUploading(false);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.log('Error uploading image:', error);
      setUploading(false);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleRemoveImage = async () => {
    try {
      await firestore().collection('timetable').doc('current').delete();
      setImageUri(null);
      setImageUrl(null);
      Alert.alert('Success', 'Image removed successfully');
    } catch (error) {
      console.log('Error removing image:', error);
      Alert.alert('Error', 'Failed to remove image');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TIME TABLE</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <Image
                source={require('../images/timetable.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
              
            )}
          </View>
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="grey" />
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          ) : (
            <>

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
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle:{
    width: 80,
    height:80,
    borderRadius: 70,
    backgroundColor: '#d6f7e7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -200,
    bottom: 23, 
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
  logo: {
    height: 300,
    width: 300,
    marginLeft: 10,
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
    backgroundColor: '#d6f7e7',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#d6f7e7',
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
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    paddingLeft:10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
});

export default TimetableScreen;
