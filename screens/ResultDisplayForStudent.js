import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const StudentResultDisplay = ({ route }) => {
  const { studentId, year } = route.params;
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const resultDoc = await firestore().collection('students').doc(studentId)
          .collection('result').doc(year).get();

        if (resultDoc.exists) {
          setResultData(resultDoc.data());
        } else {
          console.error('No result document found for the year.');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [studentId, year]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!resultData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Result</Text>
        <Text>No result available for the year {year}</Text>
      </View>
    );
  }

  const renderResultTable = (term, termData) => (
    <View key={term}>
      <Text style={styles.termHeader}>{term}</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Marks</Text>
        </View>
        {Object.entries(termData).map(([subject, marks]) => (
          <View style={styles.row} key={subject}>
            <Text style={styles.cell}>{subject}</Text>
            <Text style={styles.cell}>{marks}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Result for Year {year}</Text>
      {['firstterm', 'midterm', 'finalterm'].map(term => (
        resultData[term] ? renderResultTable(term, resultData[term]) : null
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  termHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});

export default StudentResultDisplay;
