import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import firestore from '@react-native-firebase/firestore';

const ViewResults = ({ navigation }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const studentsQuerySnapshot = await firestore().collection('students').get();
      if (studentsQuerySnapshot.empty) {
        Alert.alert('Not Found', 'No students found');
        setResults({});
      } else {
        const studentsData = studentsQuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const groupedStudents = {};

        // Group students by class and limit to 10 per class
        for (const student of studentsData) {
          const studentClass = student.classOfAdmission;
          if (!groupedStudents[studentClass]) {
            groupedStudents[studentClass] = [];
          }
          if (groupedStudents[studentClass].length < 10) {
            groupedStudents[studentClass].push(student);
          }
        }

        const allResults = {};
        for (const [className, students] of Object.entries(groupedStudents)) {
          allResults[className] = { firstterm: [], midterm: [], finalterm: [] };

          for (const student of students) {
            const resultDoc = await firestore().collection('students').doc(student.id).collection('result').doc('2024').get();
            if (resultDoc.exists) {
              const resultData = resultDoc.data();
              allResults[className].firstterm.push({
                regNo: student.regNo,
                studentName: student.name,
                ...resultData.firstterm,
              });
              allResults[className].midterm.push({
                regNo: student.regNo,
                studentName: student.name,
                ...resultData.midterm,
              });
              allResults[className].finalterm.push({
                regNo: student.regNo,
                studentName: student.name,
                ...resultData.finalterm,
              });
            }
          }
        }

        setResults(allResults);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

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
              .tableHeader { background-color: #d3d3d3; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1 class="listHeader">Result sheet report for all classes - 2024</h1>
            ${Object.entries(results).map(([className, terms]) => `
              <div>
                <h2>${className}</h2>
                ${['firstterm', 'midterm', 'finalterm'].map(term => `
                  <h3>${term.replace('term', ' term')}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Reg no</th>
                        <th>Student name</th>
                        ${Object.keys(terms[term][0] || {}).filter(key => key !== 'regNo' && key !== 'studentName').map(subject => `<th>${subject}</th>`).join('')}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${terms[term].map((studentResult, index) => `
                        <tr>
                          <td>${studentResult.regNo}</td>
                          <td>${studentResult.studentName}</td>
                          ${Object.keys(studentResult).filter(key => key !== 'regNo' && key !== 'studentName').map(subject => `<td>${studentResult[subject]}</td>`).join('')}
                          <td>${Object.keys(studentResult).filter(key => key !== 'regNo' && key !== 'studentName').reduce((sum, key) => sum + studentResult[key], 0)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                `).join('')}
              </div>
            `).join('')}
          </body>
        </html>
      `;

      let options = {
        html: htmlContent,
        fileName: 'ResultReport2024',
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
        <Text style={styles.listHeader}>Result sheet report for all classes - 2024</Text>
        <ScrollView horizontal={true}>
          <View style={styles.table}>
            {Object.entries(results).map(([className, terms]) => (
              <View key={className}>
                <Text style={styles.classHeader}>{className}</Text>
                {['firstterm', 'midterm', 'finalterm'].map(term => (
                  <View key={term}>
                    <Text style={styles.termHeader}>{term.replace('term', ' term')}</Text>
                    <View style={styles.row}>
                      <Text style={styles.header}>Reg no</Text>
                      <Text style={styles.header}>Student name</Text>
                      {Object.keys(terms[term][0] || {}).filter(key => key !== 'regNo' && key !== 'studentName').map(subject => <Text key={subject} style={styles.header}>{subject}</Text>)}
                      <Text style={styles.header}>Total</Text>
                    </View>
                    {terms[term].map((studentResult, index) => (
                      <View key={index} style={styles.row}>
                        <Text style={styles.data}>{studentResult.regNo}</Text>
                        <Text style={styles.data}>{studentResult.studentName}</Text>
                        {Object.keys(studentResult).filter(key => key !== 'regNo' && key !== 'studentName').map((subject, idx) => <Text key={idx} style={styles.data}>{studentResult[subject]}</Text>)}
                        <Text style={styles.data}>{Object.keys(studentResult).filter(key => key !== 'regNo' && key !== 'studentName').reduce((sum, key) => sum + studentResult[key], 0)}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
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
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  classHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
  },
  termHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
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
    textAlign: 'center',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ViewResults