import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const EditFeeScreen = ({ navigation, route }) => {
  const { studentId, feeStatusId } = route.params;
    
  const [amountDue, setAmountDue] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(null);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
    console.log(studentId +" dsc" + feeStatusId)
  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        // Fetch student data
        const studentDoc = await firestore()
          .collection('students')
          .doc(studentId)
          .get();

        if (!studentDoc.exists) {
          throw new Error('Student does not exist');
        }

        const studentData = studentDoc.data();
        setRegNo(studentData.regNo);
        setName(studentData.name);

        // Fetch fee status
        const feeStatusDoc = await firestore()
          .collection('students')
          .doc(studentId)
          .collection('feeStatus')
          .doc(feeStatusId)
          .get();

        if (!feeStatusDoc.exists) {
          throw new Error('Fee status does not exist');
        }

        const feeStatusData = feeStatusDoc.data();
        setAmountDue(feeStatusData.amountDue.toString());
        setAmountPaid(feeStatusData.amountPaid.toString());
        setPaymentDate(feeStatusData.datePaid.toDate());
        setDueDate(feeStatusData.dueDate.toDate());
        setRemarks(feeStatusData.remarks || '');
      } catch (error) {
        Alert.alert('Error', `Failed to fetch fee status: ${error.message}`);
      }
    };

    fetchFeeStatus();
  }, [studentId, feeStatusId]);

  const handlePaymentDateChange = (event, selectedDate) => {
    setShowPaymentDatePicker(Platform.OS === 'ios');
    setPaymentDate(selectedDate || paymentDate);
  };

  const handleDueDateChange = (event, selectedDate) => {
    setShowDueDatePicker(Platform.OS === 'ios');
    setDueDate(selectedDate || dueDate);
  };

  const formatDate = (date) => {
    if (!date) return '';
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const payableAmount = amountDue && amountPaid ? Math.max(0, amountDue - amountPaid) : '';
  const feeStatus = paymentDate && dueDate ? (paymentDate > dueDate ? 'Late Fee' : 'Clear') : '';

  const handleSubmit = async () => {
    if (!amountDue || !amountPaid || !paymentDate || !dueDate) {
      Alert.alert('Error', 'All fields except remarks are required');
      return;
    }

    try {
      await firestore()
        .collection('students')
        .doc(studentId)
        .collection('feeStatus')
        .doc(feeStatusId)
        .update({
          amountDue,
          amountPaid,
          datePaid: paymentDate,
          dueDate,
          remarks,
        });

      Alert.alert('Success', 'Fee status updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update fee status');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Reg#"
        placeholderTextColor="grey"
        value={regNo}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="grey"
        value={name}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount due"
        placeholderTextColor="grey"
        value={amountDue}
        onChangeText={setAmountDue}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Due date"
          placeholderTextColor="grey"
          value={dueDate ? formatDate(dueDate) : ''}
          editable={false}
        />
      </TouchableOpacity>
      {showDueDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDueDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Amount paid"
        placeholderTextColor="grey"
        value={amountPaid}
        onChangeText={setAmountPaid}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowPaymentDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Payment date"
          placeholderTextColor="grey"
          value={paymentDate ? formatDate(paymentDate) : ''}
          editable={false}
        />
      </TouchableOpacity>
      {showPaymentDatePicker && (
        <DateTimePicker
          value={paymentDate || new Date()}
          mode="date"
          display="default"
          onChange={handlePaymentDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Payable amount"
        placeholderTextColor="grey"
        value={payableAmount.toString()}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Fee status"
        placeholderTextColor="grey"
        value={feeStatus}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Remarks (optional)"
        placeholderTextColor="grey"
        value={remarks}
        onChangeText={setRemarks}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
    color: 'black',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  pickerContainer: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#d6f7e7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4, // For Android shadow
  },
  submitButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});

export default EditFeeScreen;
