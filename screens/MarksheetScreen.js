import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const MarksheetScreen = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [editingMarks, setEditingMarks] = useState({});
  const [subjects, setSubjects] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://192.168.236.145:3000/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch students');
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch('http://192.168.236.145:3000/marks');
      const data = await response.json();
      setMarks(data);

      const uniqueSubjects = Array.from(new Set(data.map((m) => m.subject))).sort();
      setSubjects(uniqueSubjects);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch marks');
    }
  };

  // Re-fetch students and marks every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
      fetchMarks();
    }, [])
  );

  const getMark = (studentId, subject) => {
    const markObj = marks.find(
      (m) => m.studentId === studentId && m.subject === subject
    );
    return markObj ? markObj.marks.toString() : '0';
  };

  const getKey = (studentId, subject) => `${studentId}_${subject}`;

  const handleMarkChange = (studentId, subject, value) => {
    const key = getKey(studentId, subject);
    setEditingMarks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveMarks = async (studentId, subject) => {
    const key = getKey(studentId, subject);
    const markToUpdate = editingMarks[key];

    if (markToUpdate === undefined) {
      return;
    }

    if (markToUpdate.trim() === '') {
      Alert.alert('Validation', 'Marks cannot be empty');
      return;
    }

    const marksNum = Number(markToUpdate);
    if (isNaN(marksNum) || marksNum < 0) {
      Alert.alert('Validation', 'Marks must be a valid positive number');
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.236.145:3000/marks?studentId=${studentId}&subject=${encodeURIComponent(subject)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        const postResponse = await fetch(`http://192.168.236.145:3000/marks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, subject, marks: marksNum }),
        });
        if (!postResponse.ok) throw new Error('Failed to create mark record');
        const newMark = await postResponse.json();
        setMarks((prev) => [...prev, newMark]);
      } else {
        const markRecord = data[0];
        await fetch(`http://192.168.236.145:3000/marks/${markRecord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ marks: marksNum }),
        });

        setMarks((prev) =>
          prev.map((item) =>
            item.studentId === studentId && item.subject === subject
              ? { ...item, marks: marksNum }
              : item
          )
        );
      }

      setEditingMarks((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      Alert.alert('Success', 'Marks updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update marks');
    }
  };

  const calculateGPA = (studentId) => {
    const studentMarks = marks.filter((m) => m.studentId === studentId);
    if (studentMarks.length === 0) return '0.00';

    const total = studentMarks.reduce((sum, m) => sum + Number(m.marks), 0);
    const gpa = total / studentMarks.length;
    return gpa.toFixed(2);
  };

  const renderHeader = () => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.headerCell, styles.studentName]}>Student Name</Text>
      {subjects.map((subject) => (
        <Text key={subject} style={[styles.cell, styles.headerCell]}>
          {subject}
        </Text>
      ))}
      <Text style={[styles.cell, styles.headerCell]}>GPA</Text>
    </View>
  );

  const renderRow = ({ item: student }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.studentName]}>{student.name}</Text>
      {subjects.map((subject) => {
        const key = getKey(student.id, subject);
        const isEditing = editingMarks.hasOwnProperty(key);
        return (
          <View key={subject} style={styles.cell}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={isEditing ? editingMarks[key] : getMark(student.id, subject)}
              onChangeText={(value) => handleMarkChange(student.id, subject, value)}
              onBlur={() => saveMarks(student.id, subject)}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
        );
      })}
      <Text style={[styles.cell, { textAlign: 'center', fontWeight: 'bold' }]}>
        {calculateGPA(student.id)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marksheet</Text>
      <View style={styles.table}>{renderHeader()}</View>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        ListEmptyComponent={<Text style={styles.emptyText}>No students found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  table: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  headerCell: { fontWeight: 'bold', backgroundColor: '#f7f7f7', textAlign: 'center' },
  studentName: { flex: 1.5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 5,
    height: 40,
    textAlign: 'center',
    fontSize: 15,
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
});

export default MarksheetScreen;
