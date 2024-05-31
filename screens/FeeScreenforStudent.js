import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';

const FeeScreenforStudent = () => {
  const [feeStatusData, setFeeStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { studentId } = route.params;

  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        const feeStatusQuerySnapshot = await firestore()
          .collection('students')
          .doc(studentId)
          .collection('feeStatus')
          .get();

        if (!feeStatusQuerySnapshot.empty) {
          const feeStatusList = [];
          feeStatusQuerySnapshot.forEach(doc => {
            feeStatusList.push({ id: doc.id, ...doc.data() });
          });
          setFeeStatusData(feeStatusList);
        } else {
          console.error('No fee status found for the student.');
          Alert.alert('Error', 'No fee status found for the student.');
        }
      } catch (error) {
        console.error('Error fetching fee status:', error);
        Alert.alert('Error', 'Error fetching fee status.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStatus();
  }, [studentId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fee Status</Text>
      {feeStatusData ? (
        feeStatusData.map(feeStatus => (
          <View key={feeStatus.id} style={styles.card}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{feeStatus.id}</Text>
            <Text style={styles.label}>Amount Due:</Text>
            <Text style={styles.value}>{feeStatus.amountDue}</Text>
            <Text style={styles.label}>Date Due:</Text>
            <Text style={styles.value}>{feeStatus.dueDate.toDate().toLocaleDateString()}</Text>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text style={styles.value}>{feeStatus.amountPaid}</Text>
            <Text style={styles.label}>Date Paid:</Text>
            <Text style={styles.value}>{feeStatus.datePaid.toDate().toLocaleDateString()}</Text>
            <Text style={styles.label}>Payable Amount:</Text>
            <Text style={styles.value}>
              {feeStatus.amountDue - feeStatus.amountPaid > 0
                ? feeStatus.amountDue - feeStatus.amountPaid
                : 0}
            </Text>
            <Text style={styles.label}>Fee Status:</Text>
            <Text style={styles.value}>
              {feeStatus.datePaid.toDate() > feeStatus.dueDate.toDate()
                ? 'Late Fee'
                : 'Clear'}
            </Text>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{feeStatus.remarks}</Text>
          </View>
        ))
      ) : (
        <Text>No Fee Status available</Text>
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
    marginVertical: 20,
    fontFamily: 'IMFellEnglish-Regular',
    color: 'black',
  },
  card: {
    backgroundColor: '#d3f7d3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
});

export default FeeScreenforStudent;
