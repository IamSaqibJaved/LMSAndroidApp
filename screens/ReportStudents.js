import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import firestore from '@react-native-firebase/firestore';

const ViewStudent = ({ navigation }) => {
  const [studentsByClass, setStudentsByClass] = useState({});
  const [ageReport, setAgeReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateAge = (dateOfBirth) => {
    const dob = dateOfBirth.toDate();
    const today = new Date();
    const diff = Math.abs(today - dob);
    const ageYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const ageMonths = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { years: ageYears, months: ageMonths };
  };

  const generateAgeReport = (students) => {
    const ageMap = new Map();

    students.forEach(student => {
      const age = calculateAge(student.dateOfBirth);
      const key = `${age.years} years ${age.months} months`;

      if (ageMap.has(key)) {
        const count = ageMap.get(key);
        ageMap.set(key, {
          count: count.count + 1,
          boys: count.boys + (student.gender.toLowerCase() === 'male' ? 1 : 0),
          girls: count.girls + (student.gender.toLowerCase() === 'female' ? 1 : 0)
        });
      } else {
        ageMap.set(key, {
          count: 1,
          boys: student.gender.toLowerCase() === 'male' ? 1 : 0,
          girls: student.gender.toLowerCase() === 'female' ? 1 : 0
        });
      }
    });

    return ageMap;
  };

  const fetchStudentsByClass = async () => {
    try {
      const studentsQuerySnapshot = await firestore().collection('students').get();

      if (studentsQuerySnapshot.empty) {
        Alert.alert('Not Found', 'No students found');
        setStudentsByClass({});
      } else {
        const studentsData = studentsQuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const groupedStudents = {};
        studentsData.forEach(student => {
          if (!groupedStudents[student.classOfAdmission]) {
            groupedStudents[student.classOfAdmission] = [];
          }
          groupedStudents[student.classOfAdmission].push(student);
        });

        setStudentsByClass(groupedStudents);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsByClass();
  }, []);

  useEffect(() => {
    if (studentsByClass) {
      const allStudents = Object.values(studentsByClass).flat();
      const report = generateAgeReport(allStudents);
      setAgeReport(report);
    }
  }, [studentsByClass]);

  const createPDF = async () => {
    try {
      let htmlContent = `
        <html>
          <head>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: center; }
              th { background-color: #f2f2f2; }
              .listHeader { font-size: 16px; font-weight: bold; margin-bottom: 10px; text-align: center; }
            </style>
          </head>
          <body>
            <h1 class="listHeader">Student Age Record Report for All Classes</h1>
            <table>
              <thead>
                <tr>
                  <th>Registration No</th>
                  <th>Student Name</th>
                  <th>Father Name</th>
                  <th>Date of Birth</th>
                  <th>Age (Years & Months)</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(studentsByClass).map(([classKey, students]) => 
                  students.map(student => `
                    <tr>
                      <td>${student.regNo}</td>
                      <td>${student.name}</td>
                      <td>${student.fatherDetails.name}</td>
                      <td>${new Date(student.dateOfBirth.seconds * 1000).toDateString()}</td>
                      <td>${calculateAge(student.dateOfBirth).years} years ${calculateAge(student.dateOfBirth).months} months</td>
                    </tr>
                  `).join('')
                ).join('')}
              </tbody>
            </table>
            <h1 class="listHeader">Age Distribution</h1>
            <table>
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Number</th>
                  <th>Boys</th>
                  <th>Girls</th>
                </tr>
              </thead>
              <tbody>
                ${ageReport ? Array.from(ageReport.entries()).map(([key, value]) => `
                  <tr>
                    <td>${key}</td>
                    <td>${value.count}</td>
                    <td>${value.boys}</td>
                    <td>${value.girls}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
          </body>
        </html>
      `;

      let options = {
        html: htmlContent,
        fileName: 'StudentReport',
        directory: 'Documents',
      };
      let file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', 'PDF generated at ' + file.filePath);

    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tableContainer}>
        <Text style={styles.listHeader}>Student Age Record Report for All Classes</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.header}>Class</Text>
            <Text style={styles.header}>Registration No</Text>
            <Text style={styles.header}>Student Name</Text>
            <Text style={styles.header}>Father Name</Text>
            <Text style={styles.header}>Date of Birth</Text>
            <Text style={styles.header}>Age (Years & Months)</Text>
          </View>
          {Object.entries(studentsByClass).map(([classKey, students]) => (
            <React.Fragment key={classKey}>
              <View style={styles.row}>
                <Text style={styles.classHeader} colSpan={6}>{classKey}</Text>
              </View>
              {students.map((student, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.data}>{student.classOfAdmission}</Text>
                  <Text style={styles.data}>{student.regNo}</Text>
                  <Text style={styles.data}>{student.name}</Text>
                  <Text style={styles.data}>{student.fatherDetails.name}</Text>
                  <Text style={styles.data}>{new Date(student.dateOfBirth.seconds * 1000).toDateString()}</Text>
                  <Text style={styles.data}>{calculateAge(student.dateOfBirth).years} years {calculateAge(student.dateOfBirth).months} months</Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Age Report */}
      <View style={styles.tableContainer}>
        <Text style={styles.listHeader}>Age Distribution</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.header}>Age</Text>
            <Text style={styles.header}>Number</Text>
            <Text style={styles.header}>Boys</Text>
            <Text style={styles.header}>Girls</Text>
          </View>
          {ageReport && Array.from(ageReport.entries()).map(([key, value], index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.data}>{key}</Text>
              <Text style={styles.data}>{value.count}</Text>
              <Text style={styles.data}>{value.boys}</Text>
              <Text style={styles.data}>{value.girls}</Text>
            </View>
          ))}
        </View>
      </View>
      <Button title="Generate PDF" onPress={createPDF} />
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
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    color: 'black',
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  classHeader: {
    flex: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  data: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  listHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default ViewStudent;
