import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const AddFeeScreen = ({ navigation, route }) => {
  const { studentId, regNo, name } = route.params;
    
  const [amountDue, setAmountDue] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(null);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [remarks, setRemarks] = useState('');

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
        .add({
          amountDue,
          amountPaid,
          datePaid: paymentDate,
          dueDate,
          remarks,
        });

      Alert.alert('Success', 'Fee status added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add fee status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>FEE</Text>
      <TextInput
        style={styles.input}
        placeholder="Reg#"
        placeholderTextColor="grey"
        value={regNo+""}
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
  },
  input: {
    height: 40,
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
    backgroundColor: '#d3f7d3',
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

export default AddFeeScreen;
