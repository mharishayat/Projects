import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const AddStudentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleAdd = async () => {
    if (!name.trim() || !age.trim()) {
      Alert.alert('Validation Error', 'Please enter both name and age');
      return;
    }

    if (isNaN(age) || Number(age) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid age');
      return;
    }

    try {
      // 1. Add to students
      const studentResponse = await fetch('http://192.168.236.145:3000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          age: Number(age),
        }),
      });

      if (!studentResponse.ok) throw new Error('Failed to add student');

      const newStudent = await studentResponse.json();

      // 2. Add to attendance
      const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
      const attendanceResponse = await fetch('http://192.168.236.145:3000/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: newStudent.id,
          date: today,
          status: 'present',
        }),
      });

      if (!attendanceResponse.ok) throw new Error('Failed to add to attendance');

      Alert.alert('Success', 'Student and attendance added');
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter student name"
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter student age"
        keyboardType="numeric"
      />
      <Button title="Add Student" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default AddStudentScreen;
